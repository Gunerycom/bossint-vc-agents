require('dotenv').config();
const { Resend } = require('resend');
const emailTemplates = require('./emailTemplates');
const subscriberStore = require('./subscriberStore');

/**
 * Initializes the Resend client using the environment variable
 */
function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !apiKey.startsWith('re_')) {
    return null;
  }
  return new Resend(apiKey);
}

function getFromAddress() {
  return process.env.RESEND_FROM_EMAIL || 'Bossint AI <agent@notify.bossint.ai>';
}

function getBaseUrl() {
  const url = process.env.APP_URL || 'http://localhost:3000';
  return url.replace(/\/+$/, '');
}

function buildUnsubscribeUrl(token) {
  const base = getBaseUrl();
  return `${base}/unsubscribe?token=${encodeURIComponent(token || 'general')}`;
}

/**
 * Sends a Welcome / Confirmation Email with live deal data upon subscribing
 * @param {string} toEmail 
 * @param {string} agentName 
 * @param {Array} deals Array of deal objects
 * @param {string} token Unsubscribe token
 * @returns {Promise<Object>}
 */
async function sendWelcomeEmail(toEmail, agentName = 'VC & Investors Intel Agents', deals = [], token = '') {
  const resend = getResendClient();
  const from = getFromAddress();
  const unsubscribeUrl = buildUnsubscribeUrl(token);

  const dealsList = Array.isArray(deals) ? deals : (deals?.deals || []);
  const report = deals?.report || null;
  const narrative = deals?.narrative || null;
  const metadata = deals?.metadata || null;

  const html = emailTemplates.renderWelcomeEmail({
    agentName,
    deals: dealsList,
    report,
    narrative,
    metadata,
    unsubscribeUrl
  });

  if (!resend) {
    console.log(`[EmailService - DRY RUN] (No RESEND_API_KEY set) Would send Welcome Email to: ${toEmail} for agent: "${agentName}" with ${dealsList.length} deals.`);
    return { success: true, simulated: true, to: toEmail };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [toEmail],
      subject: agentName,
      html
    });

    if (error) {
      console.error(`[EmailService] Resend API rejected welcome email to ${toEmail}:`, error);
      return { success: false, error: error.message || error };
    }

    subscriberStore.recordEmailSent(toEmail);
    console.log(`[EmailService] Welcome email delivered to ${toEmail}. Resend ID:`, data?.id || JSON.stringify(data));
    return { success: true, data };
  } catch (err) {
    console.error(`[EmailService] Exception sending welcome email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a Full Stack Welcome Email when subscribing to all 4 feeds
 * @param {string} toEmail 
 * @param {Array|Object} sampleDeals 
 * @param {string} token 
 * @returns {Promise<Object>}
 */
async function sendFullStackWelcomeEmail(toEmail, sampleDeals = [], token = '') {
  const resend = getResendClient();
  const from = getFromAddress();
  const unsubscribeUrl = buildUnsubscribeUrl(token);

  const dealsList = Array.isArray(sampleDeals) ? sampleDeals : (sampleDeals?.deals || []);
  const agentStacks = sampleDeals?.agentStacks || null;

  const html = emailTemplates.renderFullStackWelcomeEmail({
    sampleDeals: dealsList,
    agentStacks,
    unsubscribeUrl
  });

  if (!resend) {
    console.log(`[EmailService - DRY RUN] Would send Full Stack Welcome Email to: ${toEmail}`);
    return { success: true, simulated: true, to: toEmail };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [toEmail],
      subject: `Full VC Intelligence Stack`,
      html
    });

    if (error) {
      console.error(`[EmailService] Resend API rejected full stack welcome email to ${toEmail}:`, error);
      return { success: false, error: error.message || error };
    }

    subscriberStore.recordEmailSent(toEmail);
    console.log(`[EmailService] Full Stack Welcome email delivered to ${toEmail}. Resend ID:`, data?.id || JSON.stringify(data));
    return { success: true, data };
  } catch (err) {
    console.error(`[EmailService] Exception sending full stack welcome email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Sends an Intelligence Update Email with parsed deal items to a list of subscribers
 * @param {Array<Object>} recipients Array of subscriber objects: [{ email, unsubscribeToken }]
 * @param {Object} updatePayload { agentName, timestamp, deals, headline }
 * @returns {Promise<Object>}
 */
async function sendAgentUpdateEmail(recipients, updatePayload) {
  if (!recipients || recipients.length === 0) {
    return { success: true, message: 'No active subscribers for this agent.' };
  }

  const resend = getResendClient();
  const from = getFromAddress();
  const { agentName, deals = [], report = null, headline = '', timestamp = 'Today' } = updatePayload;

  if (!resend) {
    console.log(`[EmailService - DRY RUN] Would send Intel Alert for "${agentName}" with ${deals.length} deals to ${recipients.length} recipients.`);
    return { success: true, simulated: true, recipientsCount: recipients.length };
  }

  const results = [];
  for (const recipient of recipients) {
    const email = typeof recipient === 'string' ? recipient : recipient.email;
    const token = typeof recipient === 'object' ? recipient.unsubscribeToken : '';
    const unsubscribeUrl = buildUnsubscribeUrl(token);

    const html = emailTemplates.renderAgentUpdateEmail({
      agentName,
      deals,
      report,
      headline,
      timestamp,
      unsubscribeUrl
    });

    try {
      const { data, error } = await resend.emails.send({
        from,
        to: [email],
        subject: agentName,
        html
      });

      if (error) {
        console.error(`[EmailService] Failed sending alert to ${email}:`, error);
        results.push({ email, success: false, error: error.message || error });
      } else {
        subscriberStore.recordEmailSent(email);
        results.push({ email, success: true, id: data?.id });
      }
    } catch (err) {
      console.error(`[EmailService] Failed sending alert to ${email}:`, err.message);
      results.push({ email, success: false, error: err.message });
    }
  }

  console.log(`[EmailService] Dispatched intel alert for "${agentName}" to ${recipients.length} subscribers.`);
  return { success: true, results };
}

/**
 * Sends a Double Opt-In Verification Email via Resend
 * @param {string} toEmail 
 * @param {string} agentName 
 * @param {string} verifyToken 
 * @param {string} unsubscribeToken 
 * @returns {Promise<Object>}
 */
async function sendVerificationEmail(toEmail, agentName = 'VC Intelligence Feed', verifyToken = '', unsubscribeToken = '') {
  const resend = getResendClient();
  const from = getFromAddress();
  const base = getBaseUrl();
  const verifyUrl = `${base}/verify?token=${encodeURIComponent(verifyToken)}`;
  const unsubscribeUrl = buildUnsubscribeUrl(unsubscribeToken);

  const html = emailTemplates.renderVerificationEmail({
    agentName,
    verifyUrl,
    unsubscribeUrl
  });

  if (!resend) {
    console.log(`[EmailService - DRY RUN] (No RESEND_API_KEY set) Would send Verification Email to: ${toEmail} for agent: "${agentName}" with link: ${verifyUrl}`);
    return { success: true, simulated: true, to: toEmail, verifyUrl };
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [toEmail],
      subject: `Verify your email: ${agentName}`,
      html
    });

    if (error) {
      console.error(`[EmailService] Resend API rejected verification email to ${toEmail}:`, error);
      return { success: false, error: error.message || error };
    }

    console.log(`[EmailService] Verification email dispatched to ${toEmail}. Resend ID:`, data?.id || JSON.stringify(data));
    return { success: true, data };
  } catch (err) {
    console.error(`[EmailService] Exception sending verification email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendFullStackWelcomeEmail,
  sendAgentUpdateEmail,
  getResendClient,
  getFromAddress,
  getBaseUrl
};
