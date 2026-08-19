const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const BOSSINT_API_HOST = process.env.BOSSINT_API_HOST || 'https://lab.bossint.ai';
const BOSSINT_API_KEY = process.env.BOSSINT_API_KEY || '';
const AGENT_04_ID = process.env.AGENT_04_ID || '48e1324f-e880-4592-b630-f1c01f076ade';

const subscriberStore = require('./services/subscriberStore');
const emailService = require('./services/emailService');
const emailTemplates = require('./services/emailTemplates');
const cronWorker = require('./services/cronWorker');

// Middlewares
app.use(cors());
app.use(express.json());

// Enforce noindex, nofollow and fresh API caching on all HTTP responses
app.use((req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// Realistic fallback intelligence signals for each agent when in offline/demo mode
const FALLBACK_SIGNALS = {
  'c9ce09dc-833b-4ca6-b514-8bc896c47735': {
    agent_name: 'US AI Funding Rounds (Last 24h)',
    items: [
      {
        title: 'inKind secures $414M Debt Financing led by Citi & Cross River',
        timestamp: 'Today',
        category: 'Debt Financing',
        amount: '$414M',
        lead: 'Citi, Cross River',
        source_link: 'https://x.com/investingvc/status/2089140988950274559'
      },
      {
        title: 'Corma raises $60M Seed to build defensive cybersecurity foundation model',
        timestamp: 'Today',
        category: 'Seed Round',
        amount: '$60.0M',
        lead: 'Stealth Syndicate',
        source_link: 'https://creati.ai/ai-news/2026-08-17/corma-reportedly-raises-60-million-seed-to-build-defensive-cybersecurity-foundation-model/'
      },
      {
        title: 'OpenRouter acquired by Stripe for over $7B in major AI infra consolidation',
        timestamp: 'Yesterday',
        category: 'Acquisition',
        amount: '$7.0B+',
        lead: 'Stripe',
        source_link: 'https://x.com/Blockcastcc/status/2089177861123141860'
      },
      {
        title: 'Canopy Network closes $8.5M Seed round to scale decentralized AI compute',
        timestamp: 'Today',
        category: 'Seed Round',
        amount: '$8.5M',
        lead: 'Decentralized Tech',
        source_link: 'https://x.com/fixal3/status/2089168116249153584'
      }
    ]
  },
  '167023b0-3a2c-44b5-9c16-39788d6cd4b7': {
    agent_name: 'Weekly AI Investment Digest',
    items: [
      {
        title: 'Databricks closes $5B Series at $190B valuation led by Coatue, Blackstone, MGX & T. Rowe Price',
        timestamp: 'Aug 13',
        category: 'Growth Round',
        amount: '$5.0B',
        lead: 'Coatue / Blackstone',
        source_link: 'https://techstartups.com/2026/08/13/venture-capital-startup-funding-roundup-august-13-2026-blackstone-coatue-founders-fund-sequoia-capital-thiel-capital-more/'
      },
      {
        title: 'Kling AI secures $3B independent funding at $18B valuation led by Alibaba & Tencent',
        timestamp: 'Aug 12',
        category: 'Video AI',
        amount: '$3.0B',
        lead: 'Alibaba / Tencent',
        source_link: 'https://www.ai-market-watch.com/news/kling-ai-secures-3-billion-in-independent-funding-a-record-for-video-generation--orr2a7'
      },
      {
        title: 'Form Energy raises $750M in new growth financing for long-duration grid storage',
        timestamp: 'Aug 12',
        category: 'CleanTech',
        amount: '$750M',
        lead: 'Tier-1 Syndicate',
        source_link: 'https://techstartups.com/2026/08/12/venture-capital-startup-funding-roundup-august-12-2026-coatue-franklin-templeton-janus-henderson-sequoia-capital-t-rowe-price-more/'
      },
      {
        title: 'Lovable raises $400M Series C at $1.33B valuation to accelerate full-stack AI development',
        timestamp: 'Aug 11',
        category: 'Series C',
        amount: '$400M',
        lead: 'Growth Syndicate'
      }
    ]
  },
  '1950ae01-3390-4a3f-a6c0-21a9f3aa91e9': {
    agent_name: 'MENA Investment Radar',
    items: [
      {
        title: 'Yuno secures $45M Series B for AI payments led by GlobalPayTechVentures & a16z',
        timestamp: 'Aug 17',
        category: 'Qatar',
        amount: '$45.0M',
        lead: 'GlobalPayTechVentures / a16z'
      },
      {
        title: 'Majestic Mind Games secures $1.45M round led by Merak Capital and Impact46',
        timestamp: 'Aug 15',
        category: 'Saudi Arabia',
        amount: '$1.45M',
        lead: 'Merak Capital / Impact46'
      },
      {
        title: 'Arab Therapy closes $2M Pre-Series A led by Manara Ventures & Value Makers Studio',
        timestamp: 'Aug 14',
        category: 'Jordan',
        amount: '$2.0M',
        lead: 'Manara Ventures'
      },
      {
        title: 'Cobi raises $1M Pre-Seed led by Lunara Partners with Plug and Play',
        timestamp: 'Aug 12',
        category: 'UAE',
        amount: '$1.0M',
        lead: 'Lunara Partners'
      }
    ]
  }
};

// Top 10 VC Leaders Fallback (matches real Agent 04 /latest schema)
const VC_LEADERS_FALLBACK = {
  agent_name: 'Top 10 VC Leaders: Weekly Surveillance',
  items: [
    {
      title: 'Teamed up with Keith Rabois for the first time since PayPal on WithCoverage\'s $42M Series B led by Sequoia and Khosla.',
      timestamp: 'Aug 10-16, 2026',
      category: 'Roelof Botha',
      amount: '',
      lead: 'Teamed up with Keith Rabois for the first time since PayPal on WithCoverage\'s $42M Series B led by Sequoia and Khosla.'
    },
    {
      title: 'Involved in a bitter proxy fight between AI industry factions; named among billionaires bankrolling the California Forever megacity project.',
      timestamp: 'Aug 11-17, 2026',
      category: 'Marc Andreessen',
      amount: '',
      lead: 'Involved in a bitter proxy fight between AI industry factions; named among billionaires bankrolling the California Forever megacity project.'
    },
    {
      title: 'Khosla Ventures co-led WithCoverage\'s $42M Series B alongside Sequoia.',
      timestamp: 'Aug 12, 2026',
      category: 'Vinod Khosla',
      amount: '',
      lead: 'Khosla Ventures co-led WithCoverage\'s $42M Series B alongside Sequoia.'
    },
    {
      title: 'Reported to be connected to a venture investor who introduced UFO whistleblower David Grusch; ranked at ~$31B net worth.',
      timestamp: 'Aug 11-17, 2026',
      category: 'Peter Thiel',
      amount: '',
      lead: 'Reported to be connected to a venture investor who introduced UFO whistleblower David Grusch; ranked at ~$31B net worth.'
    }
  ]
};

const AGENT_NAMES = {
  'c9ce09dc-833b-4ca6-b514-8bc896c47735': 'US AI Funding Rounds (Last 24h)',
  '167023b0-3a2c-44b5-9c16-39788d6cd4b7': 'Weekly AI Investment Digest',
  '1950ae01-3390-4a3f-a6c0-21a9f3aa91e9': 'MENA Investment Radar',
  'defense-contracts-24h': 'Global Defense Contracts & Tenders (Last 24h)',
  'dual-use-investments': 'Dual-Use & Defense Tech Investment Radar',
  'nato-allied-intel': 'NATO & European Defense Tech Supply Chain',
  'defense-founders-surveillance': 'Top 10 Defense Tech Leaders: Weekly Surveillance',
  'defense-all': 'Full Defense & Aerospace Intelligence Stack'
};
// Always register Agent 04 by its dynamic env ID
if (AGENT_04_ID) {
  AGENT_NAMES[AGENT_04_ID] = 'Top 10 VC Leaders: Weekly Surveillance';
  FALLBACK_SIGNALS[AGENT_04_ID] = VC_LEADERS_FALLBACK;
}
FALLBACK_SIGNALS['48e1324f-e880-4592-b630-f1c01f076ade'] = VC_LEADERS_FALLBACK;

/**
 * Builds the correct Bossint API URL for an agent.
 * All agents use the /latest endpoint suffix to retrieve full harvested data.
 */
function buildAgentApiUrl(agentId) {
  return `${BOSSINT_API_HOST}/api/agents/${agentId}/latest`;
}

/**
 * Normalizes live harvested API payload from /latest endpoint into structured feed items & reports
 */
function normalizeHarnessedAgentData(raw) {
  if (!raw) return { deals: [], report: null, metadata: null };
  const dataWrapper = raw.data || raw;
  const items = Array.isArray(dataWrapper.data) ? dataWrapper.data : (Array.isArray(dataWrapper) ? dataWrapper : []);
  const metadata = dataWrapper.metadata || raw.metadata || null;

  // Case 1: Structured Multi-Section Report (e.g. MENA Investment Radar)
  if (items.length > 0 && (items[0].summary || items[0].key_findings || items[0].weekly_highlights)) {
    const reportObj = items[0];
    const deals = [];
    if (reportObj.notable_deals || reportObj.weekly_highlights) {
      const text = reportObj.notable_deals || reportObj.weekly_highlights;
      const lines = text.split('\n');
      for (const l of lines) {
        const clean = l.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').trim();
        if (!clean || clean.startsWith('#') || !clean.includes(':')) continue;
        const idx = clean.indexOf(':');
        const header = clean.substring(0, idx).trim();
        const body = clean.substring(idx + 1).trim();
        const amountMatch = body.match(/\$[\d,.]+[MBK]?|\d+[MBK]?\s*(?:million|billion)/i);
        const amountVal = amountMatch ? amountMatch[0] : '';
        deals.push({
          title: `${header}: ${body}`,
          category: header,
          amount: amountVal,
          timestamp: 'Aug 10-17',
          lead: body,
          source_link: ''
        });
      }
    }
    const res = deals;
    res.deals = deals;
    res.report = reportObj;
    res.metadata = metadata;
    res.narrative = reportObj.summary ? { headline: reportObj.headline, summary: reportObj.summary } : null;
    return res;
  }

  // Case 2: Top 10 VC Leaders (Agent 04)
  if (items.length > 0 && items[0].name && items[0].activity_summary) {
    const active = [];
    const inactive = [];
    for (const l of items) {
      if (!l.name) continue;
      const isNoActivity = (l.activity_summary || '').toLowerCase().startsWith('no significant activity');
      const item = {
        title: l.activity_summary,
        timestamp: l.period || 'This Week',
        category: l.name,
        amount: '',
        lead: l.activity_summary,
        source_link: ''
      };
      if (isNoActivity) inactive.push(item);
      else active.push(item);
    }
    const res = [...active, ...inactive];
    res.deals = res;
    res.report = null;
    res.metadata = metadata;
    return res;
  }

  // Case 3: Funding Rounds / AI Deals (Agent 1 & Agent 2)
  if (items.length > 0 && (items[0].company || items[0].investment_value)) {
    const deals = items.map(d => ({
      title: d.company ? (d.investment_value ? `${d.company} — ${d.investment_value}` : d.company) : (d.title || 'Deal'),
      category: d.company || 'AI Deal',
      amount: d.investment_value || '',
      timestamp: d.date || 'Recent',
      lead: d.lead_investors || '',
      other_investors: d.other_investors || '',
      source_link: d.source_link || ''
    }));
    const res = deals;
    res.deals = deals;
    res.report = null;
    res.metadata = metadata;
    return res;
  }

  const res = items;
  res.deals = items;
  res.report = null;
  res.metadata = metadata;
  return res;
}

/**
 * Helper to fetch top active deals/signals for an agent (with fallback support)
 */
async function getDealsForAgent(agentId) {
  if (agentId === 'all') {
    const allAgents = [
      { id: 'c9ce09dc-833b-4ca6-b514-8bc896c47735', name: 'US AI Funding Rounds (Last 24h)' },
      { id: '167023b0-3a2c-44b5-9c16-39788d6cd4b7', name: 'Weekly AI Investment Digest' },
      { id: '1950ae01-3390-4a3f-a6c0-21a9f3aa91e9', name: 'MENA Investment Radar' },
      { id: AGENT_04_ID, name: 'Top 10 VC Leaders: Weekly Surveillance' }
    ];
    const agentStacks = [];
    const sampleDeals = [];

    for (const ag of allAgents) {
      const payload = await getDealsForAgent(ag.id);
      const deals = Array.isArray(payload) ? payload : (payload?.deals || []);
      agentStacks.push({
        agentId: ag.id,
        agentName: ag.name,
        deals,
        report: payload?.report || null,
        narrative: payload?.narrative || null,
        metadata: payload?.metadata || null
      });
      if (deals.length > 0) sampleDeals.push(...deals);
    }

    const res = sampleDeals.length > 0 ? sampleDeals : VC_LEADERS_FALLBACK.items;
    res.agentStacks = agentStacks;
    return res;
  }

  try {
    const url = buildAgentApiUrl(agentId);
    const headers = { 'Accept': 'application/json', 'User-Agent': 'Bossint-Server/1.0' };
    if (BOSSINT_API_KEY) headers['Authorization'] = `Bearer ${BOSSINT_API_KEY}`;

    const response = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
    if (response.ok) {
      const data = await response.json();
      return normalizeHarnessedAgentData(data);
    }
  } catch (err) {
    console.error(`[API] Error fetching live data for ${agentId}:`, err.message);
  }

  const fallback = FALLBACK_SIGNALS[agentId] || VC_LEADERS_FALLBACK;
  return fallback?.items || [];
}

// GET /api/config
app.get('/api/config', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.json({
    agent04Id: AGENT_04_ID,
    apiHost: BOSSINT_API_HOST,
    hasApiKey: Boolean(BOSSINT_API_KEY),
    resendConfigured: Boolean(process.env.RESEND_API_KEY)
  });
});

// GET /api/proxy/agent/:agentId
app.get('/api/proxy/agent/:agentId', async (req, res) => {
  const { agentId } = req.params;
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');

  try {
    const url = buildAgentApiUrl(agentId);
    const headers = {
      'Accept': 'application/json',
      'User-Agent': 'Bossint-VC-Landing/1.0'
    };
    if (BOSSINT_API_KEY) {
      headers['Authorization'] = `Bearer ${BOSSINT_API_KEY}`;
    }

    const response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(6000)
    });

    if (response.ok) {
      const data = await response.json();
      const unwrapped = data?.data?.data || data?.data || data?.items || data;
      const hasItems = Array.isArray(unwrapped) ? unwrapped.length > 0 : Boolean(unwrapped);

      if (hasItems) {
        return res.json({
          success: true,
          source: 'live',
          agentId,
          data
        });
      }
    }
  } catch (err) {
    // Silence network warning and gracefully use fallback
  }

  let fallback = FALLBACK_SIGNALS[agentId];
  if (!fallback) {
    fallback = VC_LEADERS_FALLBACK;
  }

  res.json({
    success: true,
    source: 'simulated',
    agentId,
    data: fallback
  });
});

// POST /api/subscribe (Supports individual agent or 'all' agents)
app.post('/api/subscribe', async (req, res) => {
  const { email, agentId = 'all', frequency = 'all', isClientVerified = false } = req.body || {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const cookieHeader = req.headers.cookie || '';
  const hasVerifiedCookie = cookieHeader.includes(`bossint_verified_email=${encodeURIComponent(normalizedEmail)}`) || cookieHeader.includes(`bossint_verified_email=${normalizedEmail}`);
  const clientAlreadyVerified = Boolean(isClientVerified) || hasVerifiedCookie;

  const isAll = agentId === 'all' || agentId === 'full-stack';
  const targetAgentId = isAll ? 'all' : agentId;
  const agentName = isAll ? 'Full VC Intelligence Stack' : (AGENT_NAMES[agentId] || 'VC & Investors Intel Agents');

  // Persist subscriber to disk
  const subResult = subscriberStore.addSubscriber(email, targetAgentId, agentName, frequency, clientAlreadyVerified);
  const token = subResult.subscriber?.unsubscribeToken || '';
  const verifyToken = subResult.verifyToken || subResult.subscriber?.verifyToken || '';

  console.log(`[SUBSCRIBE] ${subResult.isNew ? 'New' : 'Updated'} subscriber: ${email} for "${agentName}" (${targetAgentId}) - Verified: ${subResult.isVerified}`);

  // If already verified, dispatch briefing immediately
  if (subResult.isVerified) {
    let emailResult = null;
    try {
      const livePayload = await getDealsForAgent(targetAgentId);
      if (isAll) {
        emailResult = await emailService.sendFullStackWelcomeEmail(email, livePayload, token);
      } else {
        emailResult = await emailService.sendWelcomeEmail(email, agentName, livePayload, token);
      }
    } catch (err) {
      console.error(`[SUBSCRIBE] Error dispatching briefing to ${email}:`, err.message);
    }

    res.setHeader('Set-Cookie', `bossint_verified_email=${encodeURIComponent(normalizedEmail)}; Path=/; Max-Age=31536000; SameSite=Lax`);

    return res.json({
      success: true,
      message: "Subscription active — intelligence briefing dispatched to your inbox",
      isNew: subResult.isNew,
      requiresVerification: false,
      email,
      agentId: targetAgentId,
      agentName,
      emailDispatched: emailResult?.success ?? true
    });
  }

  // Otherwise, send verification email first (Double Opt-In Flow)
  let verifyResult = null;
  try {
    verifyResult = await emailService.sendVerificationEmail(email, agentName, verifyToken, token);
  } catch (err) {
    console.error(`[SUBSCRIBE] Error dispatching verification email to ${email}:`, err.message);
  }

  return res.json({
    success: true,
    message: "Verification email sent. Please check your inbox to activate continuous intelligence dispatches.",
    isNew: subResult.isNew,
    requiresVerification: true,
    email,
    agentId: targetAgentId,
    agentName,
    emailDispatched: verifyResult?.success ?? false
  });
});

// GET /verify & GET /api/verify (Double Opt-In Email Verification Handler)
app.get('/verify', async (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send('Invalid or missing verification token.');
  }

  const result = subscriberStore.verifySubscriberByToken(token);
  if (!result.success) {
    return res.status(400).send('Invalid or expired verification token.');
  }

  const sub = result.subscriber;
  const email = sub.email;
  const agentId = sub.agentId || 'all';
  const agentName = sub.agentName || (agentId === 'all' ? 'Full VC Intelligence Stack' : (AGENT_NAMES[agentId] || 'VC & Investors Intel Agents'));
  const isAll = agentId === 'all' || agentId === 'full-stack';

  // Automatically dispatch initial intelligence briefing upon verification
  try {
    const livePayload = await getDealsForAgent(agentId);
    if (isAll) {
      await emailService.sendFullStackWelcomeEmail(email, livePayload, sub.unsubscribeToken);
    } else {
      await emailService.sendWelcomeEmail(email, agentName, livePayload, sub.unsubscribeToken);
    }
  } catch (err) {
    console.error(`[VERIFY] Error dispatching initial briefing to ${email}:`, err.message);
  }

  const html = emailTemplates.renderVerificationConfirmationHtml({
    email,
    agentName,
    dashboardUrl: '/vc'
  });

  res.setHeader('Set-Cookie', `bossint_verified_email=${encodeURIComponent(email.trim().toLowerCase())}; Path=/; Max-Age=31536000; SameSite=Lax`);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

app.get('/api/verify', async (req, res) => {
  const token = req.query.token;
  const result = subscriberStore.verifySubscriberByToken(token);
  if (!result.success) {
    return res.status(404).json({ success: false, message: result.message || 'Verification token not found.' });
  }
  res.json({ success: true, message: 'Email verified successfully.', subscriber: result.subscriber });
});

// GET /unsubscribe & GET /api/unsubscribe (1-Click Unsubscribe Handler)
app.get('/unsubscribe', (req, res) => {
  const token = req.query.token;
  if (!token) {
    return res.status(400).send('Invalid or missing unsubscribe token.');
  }

  const sub = subscriberStore.unsubscribeByToken(token);
  const email = sub ? sub.email : 'Your address';
  const agentName = sub ? sub.agentName : 'Bossint AI';

  const html = emailTemplates.renderUnsubscribeConfirmationHtml({
    email,
    agentName,
    resubscribeUrl: '/'
  });

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

app.get('/api/unsubscribe', (req, res) => {
  const token = req.query.token;
  const sub = subscriberStore.unsubscribeByToken(token);
  if (!sub) {
    return res.status(404).json({ success: false, message: 'Subscriber token not found.' });
  }
  res.json({ success: true, message: 'Unsubscribed successfully.', subscriber: sub });
});

// GET /api/email/preview/:templateType (Live in-browser preview sandbox with real agent data)
app.get('/api/email/preview/:templateType', async (req, res) => {
  const { templateType } = req.params;

  let html = '';
  if (templateType === 'verify') {
    html = emailTemplates.renderVerificationEmail({
      agentName: 'US AI Funding Rounds (Last 24h)',
      verifyUrl: '/verify?token=preview_verification_token',
      unsubscribeUrl: '/unsubscribe?token=preview_token_123'
    });
  } else if (templateType === 'welcome' || templateType === 'us-ai') {
    const liveDeals = await getDealsForAgent('c9ce09dc-833b-4ca6-b514-8bc896c47735');
    html = emailTemplates.renderWelcomeEmail({
      agentName: 'US AI Funding Rounds (Last 24h)',
      deals: liveDeals,
      unsubscribeUrl: '/unsubscribe?token=preview_token_123'
    });
  } else if (templateType === 'alert' || templateType === 'digest') {
    const liveDeals = await getDealsForAgent('167023b0-3a2c-44b5-9c16-39788d6cd4b7');
    html = emailTemplates.renderAgentUpdateEmail({
      agentName: 'Weekly AI Investment Digest',
      deals: liveDeals,
      headline: 'Autonomous surveillance detected new venture capital funding rounds:',
      timestamp: 'Recent',
      unsubscribeUrl: '/unsubscribe?token=preview_token_123'
    });
  } else if (templateType === 'mena') {
    const liveDeals = await getDealsForAgent('1950ae01-3390-4a3f-a6c0-21a9f3aa91e9');
    html = emailTemplates.renderWelcomeEmail({
      agentName: 'MENA Investment Radar',
      deals: liveDeals,
      unsubscribeUrl: '/unsubscribe?token=preview_token_123'
    });
  } else if (templateType === 'leaders' || templateType === 'agent04') {
    const liveDeals = await getDealsForAgent(AGENT_04_ID);
    html = emailTemplates.renderWelcomeEmail({
      agentName: 'Top 10 VC Leaders: Weekly Surveillance',
      deals: liveDeals,
      unsubscribeUrl: '/unsubscribe?token=preview_token_123'
    });
  } else if (templateType === 'fullstack') {
    const liveStack = await getDealsForAgent('all');
    html = emailTemplates.renderFullStackWelcomeEmail({
      sampleDeals: liveStack,
      agentStacks: liveStack.agentStacks || [],
      unsubscribeUrl: '/unsubscribe?token=preview_token_123'
    });
  } else if (templateType === 'unsubscribe') {
    html = emailTemplates.renderUnsubscribeConfirmationHtml({
      email: 'investor@sequoia.com',
      agentName: 'US AI Funding Rounds (Last 24h)',
      resubscribeUrl: '/'
    });
  } else {
    return res.status(404).send(`Template "${templateType}" not found. Available: verify, welcome, digest, mena, leaders, fullstack, unsubscribe`);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

// GET /api/admin/subscribers - Subscriber stats
app.get('/api/admin/subscribers', (req, res) => {
  res.json(subscriberStore.getStats());
});

// POST /api/admin/trigger-check - Manually trigger background update check
app.post('/api/admin/trigger-check', async (req, res) => {
  const force = req.body?.force === true;
  const results = await cronWorker.runFullCheck(force);
  res.json({ success: true, force, results });
});

// POST /api/admin/test-email - Test Resend delivery
app.post('/api/admin/test-email', async (req, res) => {
  const { email, agentName, type = 'welcome' } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: 'Please provide email in request body' });
  }

  const sampleDeals = FALLBACK_SIGNALS['c9ce09dc-833b-4ca6-b514-8bc896c47735'].items;
  let result;

  if (type === 'fullstack') {
    result = await emailService.sendFullStackWelcomeEmail(email, sampleDeals, 'test_token');
  } else {
    result = await emailService.sendWelcomeEmail(email, agentName || 'US AI Funding Rounds (Last 24h)', sampleDeals, 'test_token');
  }

  res.json(result);
});

// Explicit VC route & Root
app.get('/vc', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback to index.html for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`VC & Investors Intel Agents Server Online`);
    console.log(`Port: http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Agent 04 ID: ${AGENT_04_ID}`);
    console.log(`Resend API Key Configured: ${Boolean(process.env.RESEND_API_KEY)}`);
    console.log(`Email Preview Sandbox: http://localhost:${PORT}/api/email/preview/welcome`);
    console.log(`=========================================`);

    // Launch background update polling worker
    cronWorker.startCronWorker();
  });
}

module.exports = app;
