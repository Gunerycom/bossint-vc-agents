const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

/**
 * Ensures the data directory and subscribers JSON file exist
 */
function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

/**
 * Generates a URL-safe random token
 */
function generateToken() {
  return crypto.randomBytes(18).toString('hex');
}

/**
 * Loads all subscribers from disk
 * @returns {Array} Array of subscriber objects
 */
function readSubscribers() {
  ensureStorage();
  try {
    const raw = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
    const list = JSON.parse(raw) || [];
    
    // Ensure all subscribers have tokens for backwards compatibility
    let modified = false;
    list.forEach(s => {
      if (!s.unsubscribeToken) {
        s.unsubscribeToken = generateToken();
        modified = true;
      }
      if (s.emailsSentCount === undefined) {
        s.emailsSentCount = 0;
        modified = true;
      }
    });

    if (modified) {
      writeSubscribers(list);
    }
    return list;
  } catch (err) {
    console.error('[SubscriberStore] Error reading subscribers file:', err.message);
    return [];
  }
}

/**
 * Saves all subscribers to disk safely
 * @param {Array} subscribers 
 */
function writeSubscribers(subscribers) {
  ensureStorage();
  try {
    const tempPath = `${SUBSCRIBERS_FILE}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(subscribers, null, 2), 'utf8');
    fs.renameSync(tempPath, SUBSCRIBERS_FILE);
  } catch (err) {
    console.error('[SubscriberStore] Error writing subscribers file:', err.message);
  }
}

/**
 * Adds or updates a subscriber.
 * If the email address has already been verified in the past for ANY agent,
 * the new subscription is immediately marked active and verified (no re-verification needed).
 * @param {string} email 
 * @param {string} agentId 
 * @param {string} agentName 
 * @param {string} frequency 
 * @returns {Object} { isNew: boolean, isVerified: boolean, subscriber: Object, verifyToken: string }
 */
function addSubscriber(email, agentId = 'all', agentName = 'VC Intelligence Feed', frequency = 'all') {
  const normalizedEmail = email.trim().toLowerCase();
  const subscribers = readSubscribers();

  // Check if this email is already verified globally in our system
  const isGloballyVerified = subscribers.some(
    s => s.email.toLowerCase() === normalizedEmail && s.verified === true && s.status === 'active'
  );

  const existingIndex = subscribers.findIndex(
    s => s.email.toLowerCase() === normalizedEmail && (s.agentId === agentId || agentId === 'all')
  );

  const now = new Date().toISOString();

  if (existingIndex !== -1) {
    const sub = subscribers[existingIndex];
    const isAlreadyVerified = isGloballyVerified || (sub.verified === true && sub.status === 'active');

    if (!sub.verifyToken) sub.verifyToken = generateToken();
    if (!sub.unsubscribeToken) sub.unsubscribeToken = generateToken();
    sub.agentName = agentName || sub.agentName;
    sub.frequency = frequency || sub.frequency || 'all';
    sub.status = isAlreadyVerified ? 'active' : 'pending_verification';
    sub.verified = isAlreadyVerified;
    if (isAlreadyVerified && !sub.verifiedAt) sub.verifiedAt = now;
    sub.lastConfirmedAt = now;

    writeSubscribers(subscribers);
    return {
      isNew: false,
      isVerified: isAlreadyVerified,
      subscriber: sub,
      verifyToken: sub.verifyToken
    };
  }

  const verifyToken = generateToken();
  const unsubscribeToken = generateToken();

  const newSub = {
    id: `sub_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
    email: normalizedEmail,
    agentId: agentId || 'all',
    agentName: agentName || 'VC Intelligence Feed',
    status: isGloballyVerified ? 'active' : 'pending_verification',
    verified: isGloballyVerified,
    frequency: frequency || 'all',
    verifyToken,
    unsubscribeToken,
    subscribedAt: now,
    verifiedAt: isGloballyVerified ? now : null,
    lastConfirmedAt: now,
    lastEmailedAt: null,
    emailsSentCount: 0
  };

  subscribers.push(newSub);
  writeSubscribers(subscribers);
  return {
    isNew: true,
    isVerified: isGloballyVerified,
    subscriber: newSub,
    verifyToken: isGloballyVerified ? '' : verifyToken
  };
}

/**
 * Verifies a subscriber email by their verification token.
 * Automatically marks ALL subscriptions associated with this email address as verified.
 * @param {string} token 
 * @returns {Object} { success: boolean, subscriber?: Object, message?: string }
 */
function verifySubscriberByToken(token) {
  if (!token) return { success: false, message: 'Missing verification token' };
  const subscribers = readSubscribers();
  const sub = subscribers.find(s => s.verifyToken === token);

  if (!sub) {
    return { success: false, message: 'Invalid or expired verification token' };
  }

  const now = new Date().toISOString();
  const targetEmail = sub.email.toLowerCase();

  // Mark all entries for this email address as verified
  subscribers.forEach(s => {
    if (s.email.toLowerCase() === targetEmail) {
      s.status = 'active';
      s.verified = true;
      s.verifiedAt = now;
      s.lastConfirmedAt = now;
    }
  });

  writeSubscribers(subscribers);
  return { success: true, subscriber: sub };
}

/**
 * Unsubscribes a user by their unique token
 * @param {string} token 
 * @returns {Object|null} The unsubscribed subscriber or null
 */
function unsubscribeByToken(token) {
  if (!token) return null;
  const subscribers = readSubscribers();
  const index = subscribers.findIndex(s => s.unsubscribeToken === token);

  if (index === -1) return null;

  subscribers[index].status = 'unsubscribed';
  subscribers[index].unsubscribedAt = new Date().toISOString();
  writeSubscribers(subscribers);
  return subscribers[index];
}

/**
 * Retrieves a subscriber by their unique token
 * @param {string} token 
 */
function getSubscriberByToken(token) {
  if (!token) return null;
  const subscribers = readSubscribers();
  return subscribers.find(s => s.unsubscribeToken === token || s.verifyToken === token) || null;
}

/**
 * Increments the email count and updates lastEmailedAt for an email
 */
function recordEmailSent(email) {
  const normalizedEmail = String(email).trim().toLowerCase();
  const subscribers = readSubscribers();
  let modified = false;

  subscribers.forEach(s => {
    if (s.email.toLowerCase() === normalizedEmail) {
      s.emailsSentCount = (s.emailsSentCount || 0) + 1;
      s.lastEmailedAt = new Date().toISOString();
      modified = true;
    }
  });

  if (modified) {
    writeSubscribers(subscribers);
  }
}

/**
 * Retrieves all active subscriber objects for a specific agent
 * @param {string} agentId 
 * @returns {Array<Object>} Array of subscriber objects
 */
function getActiveSubscribersForAgent(agentId) {
  const subscribers = readSubscribers();
  const targetId = String(agentId).trim();

  const activeSubs = [];
  const seenEmails = new Set();

  for (const sub of subscribers) {
    if (sub.status === 'active') {
      if (sub.agentId === targetId || sub.agentId === 'all' || !sub.agentId) {
        if (!seenEmails.has(sub.email)) {
          seenEmails.add(sub.email);
          activeSubs.push(sub);
        }
      }
    }
  }

  return activeSubs;
}

/**
 * Returns total counts and summary
 */
function getStats() {
  const subscribers = readSubscribers();
  const active = subscribers.filter(s => s.status === 'active');
  const unsubscribed = subscribers.filter(s => s.status === 'unsubscribed');

  return {
    total: subscribers.length,
    active: active.length,
    unsubscribed: unsubscribed.length,
    byAgent: subscribers.reduce((acc, s) => {
      acc[s.agentId] = (acc[s.agentId] || 0) + 1;
      return acc;
    }, {})
  };
}

module.exports = {
  addSubscriber,
  verifySubscriberByToken,
  unsubscribeByToken,
  getSubscriberByToken,
  getActiveSubscribersForAgent,
  recordEmailSent,
  readSubscribers,
  getStats
};
