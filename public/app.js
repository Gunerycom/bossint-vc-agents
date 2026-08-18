/**
 * VC & Investors Intel Agents - Client Application
 * Handles dynamic API proxy fetching, data parsing, feed rendering,
 * and email subscribe flows.
 */

// Core Agent Configurations
const AGENTS = [
  {
    index: '01',
    id: 'c9ce09dc-833b-4ca6-b514-8bc896c47735',
    name: 'US AI Funding Rounds (Last 24h)',
    statusElId: 'status-c9ce09dc-833b-4ca6-b514-8bc896c47735',
    feedElId: 'feed-c9ce09dc-833b-4ca6-b514-8bc896c47735'
  },
  {
    index: '02',
    id: '167023b0-3a2c-44b5-9c16-39788d6cd4b7',
    name: 'Weekly AI Investment Digest',
    statusElId: 'status-167023b0-3a2c-44b5-9c16-39788d6cd4b7',
    feedElId: 'feed-167023b0-3a2c-44b5-9c16-39788d6cd4b7'
  },
  {
    index: '03',
    id: '1950ae01-3390-4a3f-a6c0-21a9f3aa91e9',
    name: 'MENA Investment Radar',
    statusElId: 'status-1950ae01-3390-4a3f-a6c0-21a9f3aa91e9',
    feedElId: 'feed-1950ae01-3390-4a3f-a6c0-21a9f3aa91e9'
  },
  {
    index: '04',
    id: 'dynamic-agent-04',
    name: 'Top 10 VC Leaders: Weekly Surveillance',
    statusElId: 'status-agent-04',
    feedElId: 'feed-agent-04'
  }
];

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Fetch server configuration (e.g. Agent 04 UUID)
  await initConfiguration();

  // 2. Fetch intelligence signals for each agent
  AGENTS.forEach(agent => {
    fetchAgentSignals(agent);
  });

  // 3. Attach email subscribe handlers
  initSubscribeForms();

  // 4. Initialize Subscribe All Agents Modal
  initFullStackModal();
});

/**
 * Loads dynamic configurations such as the Agent 04 UUID
 */
async function initConfiguration() {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const config = await res.json();
      if (config.agent04Id) {
        const agent04 = AGENTS.find(a => a.index === '04');
        if (agent04) {
          agent04.id = config.agent04Id;
          const card04 = document.getElementById('card-agent-04');
          if (card04) card04.setAttribute('data-agent-id', config.agent04Id);
          const form04 = document.getElementById('form-agent-04');
          if (form04) form04.setAttribute('data-agent-id', config.agent04Id);
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch server config, using defaults:', err);
  }
}

/**
 * Fetches live/proxy data for a specific agent
 */
async function fetchAgentSignals(agent) {
  const feedEl = document.getElementById(agent.feedElId);
  const statusEl = document.getElementById(agent.statusElId);

  try {
    const response = await fetch(`/api/proxy/agent/${agent.id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    const items = extractSignals(payload);

    if (items && items.length > 0) {
      renderFeedItems(feedEl, items.slice(0, 3));
      if (statusEl) {
        statusEl.textContent = payload.source === 'live' ? 'LIVE' : 'ACTIVE';
        statusEl.classList.add('connected');
      }
    } else {
      renderEmptyState(feedEl);
      if (statusEl) {
        statusEl.textContent = 'NO SIGNALS';
      }
    }
  } catch (error) {
    console.error(`Failed to fetch signals for ${agent.name}:`, error);
    renderErrorState(feedEl);
    if (statusEl) {
      statusEl.textContent = 'OFFLINE';
    }
  }
}

/**
 * Extracts and normalizes signals from various potential API schemas
 */
function extractSignals(payload) {
  if (!payload) return [];

  const data = payload.data || payload;
  const items = [];
  const defaultTime = data.last_run_ago || 'Recent';

  // 1. Check latest_change_set (Structured Deals & Snapshots)
  if (data.latest_change_set) {
    const lcs = data.latest_change_set;

    // Check new items in change set
    if (Array.isArray(lcs.new)) {
      for (const entry of lcs.new) {
        const r = entry.record || entry;
        const parsed = normalizeRecord(r, defaultTime);
        if (Array.isArray(parsed)) {
          items.push(...parsed);
        } else if (parsed) {
          items.push(parsed);
        }
      }
    }

    // Check changed / updated items in change set
    if (Array.isArray(lcs.changed)) {
      for (const entry of lcs.changed) {
        const r = entry.after || entry.record || entry;
        const parsed = normalizeRecord(r, defaultTime);
        if (parsed && !Array.isArray(parsed)) {
          parsed.isUpdated = true;
          items.push(parsed);
        }
      }
    }
  }

  // 2. Direct items array fallback
  if (items.length === 0 && Array.isArray(data.items)) {
    return data.items.map(it => ({
      title: it.title || 'Market intelligence update',
      timestamp: formatShortTime(it.timestamp || it.date, defaultTime),
      category: it.category || it.stage || 'Round',
      amount: formatAmount(it.amount || it.investment_value || ''),
      lead: it.lead || it.lead_investors || '',
      source_link: it.source_link || ''
    }));
  }

  // 2b. Agent 04 VC leader schema: data.data[] with { name, period, activity_summary }
  const rawLeaders = (data.data && Array.isArray(data.data.data)) ? data.data.data : (Array.isArray(data.data) && data.data[0]?.name) ? data.data : null;
  if (items.length === 0 && rawLeaders) {
    const active = [];
    const inactive = [];

    for (const l of rawLeaders) {
      if (!l.name || !l.activity_summary) continue;
      const isNoActivity = l.activity_summary.toLowerCase().startsWith('no significant activity');
      const item = {
        title: l.activity_summary,
        timestamp: l.period ? l.period.split(',')[0] : defaultTime,
        category: l.name,
        amount: '',
        lead: l.activity_summary,
        source_link: ''
      };
      if (isNoActivity) {
        inactive.push(item);
      } else {
        active.push(item);
      }
    }
    items.push(...active, ...inactive);
  }

  // 3. Narrative highlights fallback
  if (items.length === 0 && data.narrative?.highlights) {
    for (const h of data.narrative.highlights) {
      items.push({
        title: h,
        timestamp: defaultTime,
        category: 'Highlight',
        amount: '',
        lead: '',
        source_link: ''
      });
    }
  }

  return items;
}

/**
 * Parses individual records into unified deal structures
 */
function normalizeRecord(r, defaultTime) {
  if (!r) return null;

  // Schema A: Company funding record
  if (r.company) {
    const parts = [];
    if (r.investment_value) parts.push(r.investment_value);
    if (r.stage) parts.push(r.stage);

    const titleSuffix = parts.length > 0 ? ` raises ${parts.join(' ')}` : ' funding round announced';
    const amountVal = formatAmount(r.investment_value || '');

    return {
      title: `${r.company}${titleSuffix}`.trim(),
      timestamp: formatShortTime(r.date, defaultTime),
      category: r.stage || 'Funding',
      amount: amountVal,
      lead: r.lead_investors || '',
      source_link: r.source_link || ''
    };
  }

  // Schema B: Notable deals or weekly highlights markdown list
  if (r.notable_deals || r.weekly_highlights) {
    const text = r.notable_deals || r.weekly_highlights;
    const lines = text.split('\n');
    const parsedList = [];

    for (const l of lines) {
      const clean = l.replace(/^[-*•]\s*/, '').replace(/\*\*/g, '').trim();
      if (!clean || clean.startsWith('#') || !clean.includes(':')) continue;

      const [header, ...rest] = clean.split(':');
      const body = rest.join(':').trim();

      parsedList.push({
        title: `${header.trim()}: ${body.slice(0, 100)}`,
        timestamp: formatShortTime(r.date || r.time, defaultTime),
        category: 'Deal Intel',
        amount: '',
        lead: '',
        source_link: ''
      });
    }

    if (parsedList.length > 0) return parsedList;
  }

  return null;
}

/**
 * Formats dollar amounts cleanly
 */
function formatAmount(str) {
  if (!str) return '';
  str = String(str).trim();

  if (/\$[0-9.]+\s*billion/i.test(str)) {
    const num = str.match(/\$([0-9.]+)/)?.[1];
    return `$${parseFloat(num)}B`;
  }
  if (/\$[0-9.]+\s*million/i.test(str)) {
    const num = str.match(/\$([0-9.]+)/)?.[1];
    return `$${parseFloat(num)}M`;
  }
  if (/^Over\s+\$[0-9.]+\s*billion/i.test(str)) {
    const num = str.match(/\$([0-9.]+)/)?.[1];
    return `>$${num}B`;
  }

  const shortMatch = str.match(/\$[0-9.]+[MBK]/i);
  if (shortMatch) return shortMatch[0];

  return str.length > 18 ? str.slice(0, 18) + '…' : str;
}

/**
 * Normalizes relative or date strings
 */
function formatShortTime(dateStr, defaultTime) {
  if (!dateStr && !defaultTime) return 'Recent';
  const val = dateStr || defaultTime;

  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const parts = val.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[parseInt(parts[1], 10) - 1] || parts[1];
    const day = parseInt(parts[2], 10);
    return `${month} ${day}`;
  }

  return String(val);
}

/**
 * Renders parsed signals into clean ticker items
 */
function renderFeedItems(container, items) {
  if (!container) return;

  const html = items.map(item => {
    const title = item.title || 'Market intelligence update';
    const timestamp = item.timestamp || 'Recent';
    const tag = item.category || 'Signal';
    const metric = item.amount || '';

    return `
      <div class="feed-item">
        <div class="feed-item-header">
          <span class="feed-tag">${escapeHtml(tag)}</span>
          <span class="feed-time">${escapeHtml(timestamp)}</span>
        </div>
        <p class="feed-title">${escapeHtml(title)}</p>
        ${metric ? `<span class="feed-highlight">${escapeHtml(metric)}</span>` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

/**
 * Renders empty state
 */
function renderEmptyState(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="feed-empty">
      No new signals detected in current window.
    </div>
  `;
}

/**
 * Renders error state
 */
function renderErrorState(container) {
  if (!container) return;
  container.innerHTML = `
    <div class="feed-error">
      Intelligence feed calibrating.
    </div>
  `;
}

/**
 * Initializes email subscribe forms with client validation and inline success flow
 */
function initSubscribeForms() {
  const forms = document.querySelectorAll('.subscribe-form');

  forms.forEach(form => {
    const input = form.querySelector('.subscribe-input');
    const button = form.querySelector('.subscribe-btn');
    const status = form.querySelector('.subscribe-status');
    const agentId = form.getAttribute('data-agent-id') || 'general';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = input.value.trim();

      // Client-side validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        status.textContent = 'Please enter a valid work email address.';
        status.className = 'subscribe-status error';
        input.focus();
        return;
      }

      // Loading state
      button.disabled = true;
      const originalText = button.innerHTML;
      button.innerHTML = '<span class="btn-text">Dispatching...</span>';
      status.textContent = '';
      status.className = 'subscribe-status';

      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, agentId })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Success State
          status.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            ${escapeHtml(result.message || "You're in — welcome briefing incoming")}
          `;
          status.className = 'subscribe-status success';
          input.value = '';
          button.innerHTML = '<span class="btn-text">Subscribed</span>';

          // Show verify email popup
          const agentName = result.agentName || 'VC Intelligence Feed';
          showVerifyEmailPopup(email, agentName);

          // Reset button text after 4 seconds
          setTimeout(() => {
            button.disabled = false;
            button.innerHTML = originalText;
          }, 4000);
        } else {
          status.textContent = result.message || 'Subscription failed. Please try again.';
          status.className = 'subscribe-status error';
          button.disabled = false;
          button.innerHTML = originalText;
        }
      } catch (err) {
        status.textContent = 'Network error. Please try again.';
        status.className = 'subscribe-status error';
        button.disabled = false;
        button.innerHTML = originalText;
      }
    });
  });
}

/**
 * Initializes Subscribe All Agents Modal
 */
function initFullStackModal() {
  const fullstackModal = document.getElementById('fullstack-modal');
  const openFullstackBtn = document.getElementById('open-fullstack-modal-btn');
  const closeFullstackBtn = document.getElementById('close-fullstack-modal-btn');
  const fullstackForm = document.getElementById('fullstack-subscribe-form');
  const fullstackInput = document.getElementById('fullstack-email-input');
  const fullstackStatus = document.getElementById('fullstack-subscribe-status');
  const fullstackSubmit = document.getElementById('fullstack-submit-btn');

  // Open Modal
  if (openFullstackBtn && fullstackModal) {
    openFullstackBtn.addEventListener('click', () => {
      if (fullstackStatus) {
        fullstackStatus.textContent = '';
        fullstackStatus.className = 'subscribe-status';
      }
      if (fullstackInput) {
        fullstackInput.value = '';
        fullstackInput.focus();
      }
      fullstackModal.classList.add('active');
    });
  }

  // Close Modal
  if (closeFullstackBtn && fullstackModal) {
    closeFullstackBtn.addEventListener('click', () => {
      fullstackModal.classList.remove('active');
    });
  }

  // Form Submission
  if (fullstackForm) {
    fullstackForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = fullstackInput.value.trim();
      if (!email) return;

      fullstackSubmit.disabled = true;
      fullstackSubmit.innerHTML = '<span class="btn-text">Subscribing All...</span>';
      fullstackStatus.textContent = '';

      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, agentId: 'all' })
        });
        const json = await res.json();

        if (res.ok && json.success) {
          fullstackStatus.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Subscribed to all agents!
          `;
          fullstackStatus.className = 'subscribe-status success';
          fullstackInput.value = '';
          fullstackSubmit.innerHTML = '<span class="btn-text">Subscribed</span>';

          // Close fullstack modal and show verify popup
          setTimeout(() => {
            fullstackModal.classList.remove('active');
            fullstackSubmit.disabled = false;
            fullstackSubmit.innerHTML = '<span class="btn-text">Subscribe to All</span>';
            showVerifyEmailPopup(email, 'Full VC Intelligence Stack');
          }, 800);
        } else {
          fullstackStatus.textContent = json.message || 'Subscription error.';
          fullstackStatus.className = 'subscribe-status error';
          fullstackSubmit.disabled = false;
          fullstackSubmit.innerHTML = '<span class="btn-text">Subscribe to All</span>';
        }
      } catch (err) {
        fullstackStatus.textContent = 'Network error. Please try again.';
        fullstackStatus.className = 'subscribe-status error';
        fullstackSubmit.disabled = false;
        fullstackSubmit.innerHTML = '<span class="btn-text">Subscribe All</span>';
      }
    });
  }

  // Backdrop click & Escape key close
  if (fullstackModal) {
    fullstackModal.addEventListener('click', (e) => {
      if (e.target === fullstackModal) {
        fullstackModal.classList.remove('active');
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && fullstackModal.classList.contains('active')) {
        fullstackModal.classList.remove('active');
      }
    });
  }
}

/**
 * Shows the "Check Your Inbox" verify email popup after successful subscription
 */
function showVerifyEmailPopup(email, agentName) {
  const modal = document.getElementById('verify-email-modal');
  const emailDisplay = document.getElementById('verify-email-address');
  const agentDisplay = document.getElementById('verify-agent-name');
  const dismissBtn = document.getElementById('verify-dismiss-btn');

  if (!modal) return;

  if (emailDisplay) emailDisplay.textContent = email;
  if (agentDisplay) agentDisplay.textContent = agentName;

  modal.classList.add('active');

  // Dismiss handlers
  const dismiss = () => modal.classList.remove('active');

  if (dismissBtn) {
    dismissBtn.onclick = dismiss;
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) dismiss();
  }, { once: true });

  const escHandler = (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      dismiss();
      window.removeEventListener('keydown', escHandler);
    }
  };
  window.addEventListener('keydown', escHandler);
}

/**
 * Escapes HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
