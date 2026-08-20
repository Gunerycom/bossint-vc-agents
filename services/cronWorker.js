const fs = require('fs');
const path = require('path');
const subscriberStore = require('./subscriberStore');
const emailService = require('./emailService');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STATE_FILE = path.join(DATA_DIR, 'agent_state.json');

const BOSSINT_API_HOST = process.env.BOSSINT_API_HOST || 'https://lab.bossint.ai';
const BOSSINT_API_KEY = process.env.BOSSINT_API_KEY || '';
const AGENT_04_ID = process.env.AGENT_04_ID || '48e1324f-e880-4592-b630-f1c01f076ade';

const TRACKED_AGENTS = [
  {
    id: 'c9ce09dc-833b-4ca6-b514-8bc896c47735',
    name: 'US AI Funding Rounds (Last 24h)'
  },
  {
    id: '167023b0-3a2c-44b5-9c16-39788d6cd4b7',
    name: 'Weekly AI Investment Digest'
  },
  {
    id: '1950ae01-3390-4a3f-a6c0-21a9f3aa91e9',
    name: 'MENA Investment Radar'
  },
  {
    id: process.env.AGENT_04_ID || '48e1324f-e880-4592-b630-f1c01f076ade',
    name: 'Top 10 VC Leaders: Weekly Surveillance'
  }
];

/**
 * Ensures state file exists
 */
function ensureStateStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STATE_FILE)) {
    fs.writeFileSync(STATE_FILE, JSON.stringify({}, null, 2), 'utf8');
  }
}

/**
 * Reads agent state from disk
 */
function readState() {
  ensureStateStorage();
  try {
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    return JSON.parse(raw) || {};
  } catch (err) {
    return {};
  }
}

/**
 * Writes agent state to disk
 */
function writeState(state) {
  ensureStateStorage();
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    console.error('[CronWorker] Error saving agent state:', err.message);
  }
}

/**
 * Normalizes and extracts deals and reports from an agent API payload (/latest schema)
 */
function extractDealsFromPayload(data) {
  if (!data) return [];
  const dataWrapper = data.data || data;
  const items = Array.isArray(dataWrapper.data) ? dataWrapper.data : (Array.isArray(dataWrapper) ? dataWrapper : []);

  // Structured report
  if (items.length > 0 && (items[0].summary || items[0].key_findings || items[0].weekly_highlights)) {
    const reportObj = items[0];
    const deals = [];
    if (reportObj.notable_deals || reportObj.weekly_highlights) {
      const text = reportObj.notable_deals || reportObj.weekly_highlights;
      const lines = text.split('\n');
      for (const l of lines) {
        const clean = l.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').trim();
        if (clean && clean.includes(':') && !clean.startsWith('#')) {
          const parts = clean.split(':');
          deals.push({
            title: parts[0].trim(),
            category: 'MENA Deal',
            amount: '',
            timestamp: 'This Week',
            lead: parts.slice(1).join(':').trim(),
            source_link: ''
          });
        }
      }
    }
    return deals;
  }

  // VC Leaders
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
    return [...active, ...inactive];
  }

  // Funding rounds / AI deals
  if (items.length > 0 && (items[0].company || items[0].investment_value)) {
    return items.map(d => ({
      title: d.company ? (d.investment_value ? `${d.company} — ${d.investment_value}` : d.company) : (d.title || 'Deal'),
      category: d.company || 'AI Deal',
      amount: d.investment_value || '',
      timestamp: d.date || 'Recent',
      lead: d.lead_investors || '',
      other_investors: d.other_investors || '',
      source_link: d.source_link || ''
    }));
  }

  return items;
}

/**
 * Extracts rich report narrative/sections (e.g. MENA Investment Radar) from API payload
 */
function extractReportFromPayload(data) {
  if (!data) return null;
  const dataWrapper = data.data || data;
  const items = Array.isArray(dataWrapper.data) ? dataWrapper.data : (Array.isArray(dataWrapper) ? dataWrapper : []);
  if (items.length > 0 && (items[0].summary || items[0].key_findings || items[0].weekly_highlights)) {
    return items[0];
  }
  return null;
}

/**
 * Checks a single agent endpoint for updates and dispatches emails if new
 * @param {Object} agent { id, name }
 * @param {boolean} forceDispatch Whether to send email regardless of previous state (for testing)
 * @returns {Promise<Object>}
 */
async function checkAgentUpdates(agent, forceDispatch = false) {
  const url = `${BOSSINT_API_HOST}/api/agents/${agent.id}/latest`;
  const headers = { 'Accept': 'application/json', 'User-Agent': 'Bossint-Cron/1.0' };
  if (BOSSINT_API_KEY) {
    headers['Authorization'] = `Bearer ${BOSSINT_API_KEY}`;
  }

  try {
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
    if (!response.ok) {
      return { agentId: agent.id, updated: false, reason: `HTTP ${response.status}` };
    }

    const json = await response.json();
    const currentState = readState();
    const prevState = currentState[agent.id] || null;

    const currentRunAt = json.data?.generated_at || json.last_run_at || 'unknown';
    const deals = extractDealsFromPayload(json);
    const report = extractReportFromPayload(json);
    const fingerprint = `${currentRunAt}_deals_${deals.length}_${deals[0]?.title || ''}`;

    const isFirstTime = !prevState;
    const hasChanged = !prevState || prevState.fingerprint !== fingerprint;

    // Update state record
    currentState[agent.id] = {
      agentName: agent.name,
      last_run_at: currentRunAt,
      last_checked_at: new Date().toISOString(),
      fingerprint,
      dealsCount: deals.length
    };
    writeState(currentState);

    if (hasChanged || forceDispatch) {
      if (isFirstTime && !forceDispatch) {
        console.log(`[Cron] Initial state saved for "${agent.name}" (${deals.length} deals). Dispatches will begin on next delta.`);
        return { agentId: agent.id, updated: true, initial: true, dealsCount: deals.length };
      }

      console.log(`[Cron] New telemetry detected for "${agent.name}". Preparing email dispatch for ${deals.length} deals.`);
      
      const subs = subscriberStore.getActiveSubscribersForAgent(agent.id);
      if (subs.length > 0) {
        await emailService.sendAgentUpdateEmail(subs, {
          agentName: agent.name,
          deals,
          report,
          metadata: json.data?.metadata || json.metadata || null,
          headline: report?.headline || (json.narrative?.headline) || '',
          timestamp: currentRunAt
        });
      }

      return {
        agentId: agent.id,
        updated: true,
        dispatched: subs.length,
        dealsCount: deals.length
      };
    }

    return { agentId: agent.id, updated: false, reason: 'No new data' };
  } catch (err) {
    console.error(`[Cron] Error checking agent "${agent.name}" (${agent.id}):`, err.message);
    return { agentId: agent.id, updated: false, error: err.message };
  }
}

/**
 * Runs a full check across all tracked agents
 * @param {boolean} forceDispatch 
 */
async function runFullCheck(forceDispatch = false) {
  console.log(`\n--- [CronWorker] Starting Intel Update Check (${new Date().toISOString()}) ---`);
  const results = [];
  for (const agent of TRACKED_AGENTS) {
    const res = await checkAgentUpdates(agent, forceDispatch);
    results.push(res);
  }
  console.log(`--- [CronWorker] Check completed. Processed ${results.length} agents. ---\n`);
  return results;
}

/**
 * Initializes the periodic cron/interval worker
 */
let workerInterval = null;

function startCronWorker() {
  const intervalMinutes = parseInt(process.env.POLL_INTERVAL_MINUTES, 10) || 60;
  const intervalMs = Math.max(intervalMinutes, 5) * 60 * 1000;

  console.log(`[CronWorker] Scheduler initialized. Checking endpoints every ${intervalMinutes} minute(s).`);

  // Run initial background check 10 seconds after server start
  setTimeout(() => {
    runFullCheck(false).catch(err => console.error('[CronWorker] Startup check error:', err));
  }, 10000);

  // Periodic interval
  if (workerInterval) clearInterval(workerInterval);
  workerInterval = setInterval(() => {
    runFullCheck(false).catch(err => console.error('[CronWorker] Periodic check error:', err));
  }, intervalMs);
}

module.exports = {
  startCronWorker,
  runFullCheck,
  checkAgentUpdates,
  extractDealsFromPayload,
  extractReportFromPayload,
  TRACKED_AGENTS
};
