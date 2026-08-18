/**
 * Bossint AI - Institutional Email Template Engine
 * Premium Fintech Minimal Aesthetic | 100% Responsive Table Markup
 * Direct API Data Ingestion — No cuts, no slicing, pure intelligence output
 * Compatible with Apple Mail, Gmail, Outlook, iOS, and Android
 */

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const LOGO_SVG_BASE64 = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMTAxLjkyIDE2Ny44MyIgd2lkdGg9IjEzMCIgaGVpZ2h0PSIyMCI+PGc+PHBhdGggZmlsbD0iIzFFNEVEOCIgZD0ibTMzOS4zOCwxMDguNDVjMCwzNS4zOC0yNC41LDU4LTU2LjExLDU4LTE1LjA3LDAtMjcuMjItNC44Mi0zNS4zOC0xNC42NnYxMi45OGgtMzEuMlY5LjQyaDMyLjY2djU0LjY0YzguMzctOS4yMSwxOS44OS0xMy42MSwzMy45Mi0xMy42MSwzMS42MiwwLDU2LjExLDIyLjYxLDU2LjExLDU4Wm0tMzMuMDgsMGMwLTE5LjQ3LTEyLjM1LTMxLjItMjguNjgtMzEuMnMtMjguNjgsMTEuNzItMjguNjgsMzEuMiwxMi4zNSwzMS4yLDI4LjY4LDMxLjIsMjguNjgtMTEuNzIsMjguNjgtMzEuMloiPjwvcGF0aD48cGF0aCBmaWxsPSIjMUU0RUQ4IiBkPSJtMzM2LjAzLDEwOC40NWMwLTMzLjkyLDI2LjE3LTU4LDYxLjk3LTU4czYxLjc2LDI0LjA4LDYxLjc2LDU4LTI1Ljk2LDU4LTYxLjc2LDU4LTYxLjk3LTI0LjA4LTYxLjk3LTU4Wm05MC42NiwwYzAtMTkuNDctMTIuMzUtMzEuMi0yOC42OC0zMS4ycy0yOC44OSwxMS43Mi0yOC44OSwzMS4yLDEyLjU2LDMxLjIsMjguODksMzEuMiwyOC42OC0xMS43MiwyOC42OC0zMS4yWiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMxRTRFRDgiIGQ9Im00NTMuOTEsMTU0LjMxbDEwLjg5LTIzLjQ1YzEwLjA1LDYuNDksMjUuMzMsMTAuODksMzkuMTUsMTAuODksMTUuMDcsMCwyMC43My0zLjk4LDIwLjczLTEwLjI2LDAtMTguNDMtNjguMDQuNDItNjguMDQtNDQuNiwwLTIxLjM2LDE5LjI2LTM2LjQzLDUyLjEzLTM2LjQzLDE1LjQ5LDAsMzIuNjYsMy41Niw0My4zNCw5Ljg0bC0xMC44OSwyMy4yNGMtMTEuMS02LjI4LTIyLjE5LTguMzctMzIuNDUtOC4zNy0xNC42NiwwLTIwLjk0LDQuNjEtMjAuOTQsMTAuNDcsMCwxOS4yNiw2OC4wNC42Myw2OC4wNCw0NS4wMSwwLDIwLjk0LTE5LjQ3LDM1LjgtNTMuMTgsMzUuOC0xOS4wNSwwLTM4LjMxLTUuMjMtNDguNzgtMTIuMTRaIj48L3BhdGg+PHBhdGggZmlsbD0iIzFFNEVEOCIgZD0ibTU0OC4zNCwxNTQuMzFsMTAuODktMjMuNDVjMTAuMDUsNi40OSwyNS4zMywxMC44OSwzOS4xNSwxMC44OSwxNS4wNywwLDIwLjczLTMuOTgsMjAuNzMtMTAuMjYsMC0xOC40My02OC4wNC40Mi02OC4wNC00NC42LDAtMjEuMzYsMTkuMjYtMzYuNDMsNTIuMTMtMzYuNDMsMTUuNDksMCwzMi42NiwzLjU2LDQzLjM0LDkuODRsLTEwLjg5LDIzLjI0Yy0xMS4xLTYuMjgtMjIuMTktOC4zNy0zMi40NS04LjM3LTE0LjY2LDAtMjAuOTQsNC42MS0yMC45NCwxMC40NywwLDE5LjI2LDY4LjA0LjYzLDY4LjA0LDQ1LjAxLDAsMjAuOTQtMTkuNDcsMzUuOC01My4xOCwzNS44LTE5LjA1LDAtMzguMzEtNS4yMy00OC43OC0xMi4xNFoiPjwvcGF0aD48cGF0aCBmaWxsPSIjMUU0RUQ4IiBkPSJtNjQ5LjY3LDE4LjIyYzAtMTAuMjYsOC4xNy0xOC4yMiwyMC4zMS0xOC4yMnMyMC4zMSw3LjU0LDIwLjMxLDE3LjU5YzAsMTAuODktOC4xNywxOC44NC0yMC4zMSwxOC44NHMtMjAuMzEtNy45Ni0yMC4zMS0xOC4yMVptMy45OCwzMy45MmgzMi42NnYxMTIuNjRoLTMyLjY2VjUyLjEzWiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMxRTRFRDgiIGQ9Im04MTUuMDgsMTAwLjI5djY0LjQ5aC0zMi42NnYtNTkuNDZjMC0xOC4yMi04LjM3LTI2LjU5LTIyLjgyLTI2LjU5LTE1LjcsMC0yNy4wMSw5LjYzLTI3LjAxLDMwLjM2djU1LjY5aC0zMi42NlY1Mi4xM2gzMS4ydjEzLjE5YzguNzktOS42MywyMS45OC0xNC44NywzNy4yNy0xNC44NywyNi41OSwwLDQ2LjY5LDE1LjQ5LDQ2LjY5LDQ5LjgzWiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMxRTRFRDgiIGQ9Im05MDAuNSwxNTkuMzNjLTYuNyw0LjgyLTE2LjU0LDcuMTItMjYuNTksNy4xMi0yNi41OSwwLTQyLjA4LTEzLjYxLTQyLjA4LTQwLjQxdi00Ni4yN2gtMTcuMzh2LTI1LjEyaDE3LjM4di0yNy40M2gzMi42NnYyNy40M2gyOC4wNnYyNS4xMmgtMjguMDZ2NDUuODVjMCw5LjYzLDUuMjMsMTQuODcsMTQuMDMsMTQuODcsNC44MiwwLDkuNjMtMS40NywxMy4xOS00LjE5bDguNzksMjMuMDNaIj48L3BhdGg+PHBhdGggZmlsbD0iIzFFNEVEOCIgZD0ibTkwNC42OSwxNDUuOTNjMC0xMi4xNCw5LTIwLjEsMjAuMzEtMjAuMXMyMC4zMSw3Ljk2LDIwLjMxLDIwLjEtOSwyMC41Mi0yMC4zMSwyMC41Mi0yMC4zMS04LjU4LTIwLjMxLTIwLjUyWiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMxRTRFRDgiIGQ9Im0xMDUyLjUxLDEwMC41djY0LjI4aC0zMC41N3YtMTQuMDNjLTYuMDcsMTAuMjYtMTcuOCwxNS43LTM0LjM0LDE1LjctMjYuMzgsMC00Mi4wOC0xNC42Ni00Mi4wOC0zNC4xM3MxNC4wMy0zMy43MSw0OC4zNi0zMy43MWgyNS45NmMwLTE0LjAzLTguMzgtMjIuMTktMjUuOTYtMjIuMTktMTEuOTMsMC0yNC4yOSwzLjk4LTMyLjQ1LDEwLjQ3bC0xMS43Mi0yMi44MmMxMi4zNS04Ljc5LDMwLjU3LTEzLjYxLDQ4LjU3LTEzLjYxLDM0LjM0LDAsNTQuMjMsMTUuOTEsNTQuMjMsNTAuMDRabS0zMi42NiwyOC42OHYtMTEuNTJoLTIyLjRjLTE1LjI4LDAtMjAuMSw1LjY1LTIwLjEsMTMuMTksMCw4LjE3LDYuOTEsMTMuNjEsMTguNDMsMTMuNjEsMTAuODksMCwyMC4zMS01LjAyLDI0LjA4LTE1LjI4WiI+PC9wYXRoPjxwYXRoIGZpbGw9IiMxRTRFRDgiIGQ9Im0xMDYxLjMsMTguMjJjMC0xMC4yNiw4LjE2LTE4LjIyLDIwLjMxLTE4LjIyczIwLjMxLDcuNTQsMjAuMzEsMTcuNTljMCwxMC44OS04LjE2LDE4Ljg0LTIwLjMxLDE4Ljg0cy0yMC4zMS03Ljk2LTIwLjMxLTE4LjIxWm0zLjk4LDMzLjkyaDMyLjY2djExMi42NGgtMzIuNjZWNTIuMTNaIj48L3BhdGg+PC9nPjxnPjxyZWN0IGZpbGw9IiNGNTlFMEIiIHk9IjguMTQiIHdpZHRoPSI0NS42MiIgaGVpZ2h0PSI0NS42MiI+PC9yZWN0PjxyZWN0IGZpbGw9IiM5M0M1RkQiIHg9IjU3LjAzIiB5PSI4LjE0IiB3aWR0aD0iNDUuNjIiIGhlaWdodD0iNDUuNjIiPjwvcmVjdD48cmVjdCBmaWxsPSIjOTNDNUZEIiB5PSI2NS4xNyIgd2lkdGg9IjQ1LjYyIiBoZWlnaHQ9IjQ1LjYyIj48L3JlY3Q+PGc+PHJlY3QgZmlsbD0iIzFFNEVEOCIgeD0iMTE0LjQ0IiB5PSI5LjQ4IiB3aWR0aD0iNDUuMjQiIGhlaWdodD0iNDUuMjQiPjwvcmVjdD48cmVjdCBmaWxsPSIjMUU0RUQ4IiB4PSI1Ny44OSIgeT0iNjYuMDMiIHdpZHRoPSI0NS4yNCIgaGVpZ2h0PSI0NS4yNCI+PC9yZWN0PjxyZWN0IGZpbGw9IiMxRTRFRDgiIHg9IjExNC40NCIgeT0iNjYuMDMiIHdpZHRoPSI0NS4yNCIgaGVpZ2h0PSI0NS4yNCI+PC9yZWN0PjxyZWN0IGZpbGw9IiMxRTRFRDgiIHg9IjEuMzQiIHk9IjEyMi41OSIgd2lkdGg9IjQ1LjI0IiBoZWlnaHQ9IjQ1LjI0Ij48L3JlY3Q+PHJlY3QgZmlsbD0iIzFFNEVEOCIgeD0iNTcuODkiIHk9IjEyMi41OSIgd2lkdGg9IjQ1LjI0IiBoZWlnaHQ9IjQ1LjI0Ij48L3JlY3Q+PHJlY3QgZmlsbD0iIzFFNEVEOCIgeD0iMTE0LjQ0IiB5PSIxMjIuNTkiIHdpZHRoPSI0NS4yNCIgaGVpZ2h0PSI0NS4yNCI+PC9yZWN0PjwvZz48L2c+PC9zdmc+`;

function getEmailHeader(pillText = 'INTELLIGENCE DISPATCH', pillColor = '#1E4ED8', pillBg = '#EFF6FF', pillBorder = '#DBEAFE') {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border-bottom: 1px solid #E5E1D6;">
      <tr>
        <td style="padding: 20px 32px 18px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="middle" align="left">
                <a href="https://bossint.ai" target="_blank" style="text-decoration: none; display: inline-block; vertical-align: middle;">
                  <img src="${LOGO_SVG_BASE64}" alt="Bossint AI" width="130" height="20" style="display: block; width: 130px; height: auto; max-height: 22px; border: 0; outline: none; text-decoration: none;" />
                </a>
              </td>
              <td valign="middle" align="right">
                <span style="display: inline-block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 700; color: ${pillColor}; background-color: ${pillBg}; border: 1px solid ${pillBorder}; padding: 4px 9px; border-radius: 999px; letter-spacing: 0.06em; text-transform: uppercase;">
                  ${escapeHtml(pillText)}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

function getEmailFooter(unsubscribeUrl = '#', emailDate = '') {
  const dateStr = emailDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F8F7F3; border-top: 1px solid #E5E1D6;">
      <tr>
        <td style="padding: 24px 32px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; line-height: 1.6; color: #8A94A6; text-align: center;">
          <p style="margin: 0 0 4px 0; color: #334155; font-weight: 600; font-size: 12px;">
            Bossint AI • Know everything, before everyone.
          </p>
          <p style="margin: 0 0 10px 0; color: #64748B;">
            Autonomous AI agents that research, monitor, think and report continuously.
          </p>
          <p style="margin: 0; font-size: 11px; color: #94A3B8;">
            Bossint AI - ${escapeHtml(dateStr)} - <a href="${escapeHtml(unsubscribeUrl)}" style="color: #64748B; text-decoration: underline;">Unsubscribe</a>
          </p>
        </td>
      </tr>
    </table>
  `;
}

function formatMarkdownLines(text) {
  if (!text) return '';
  const lines = String(text).split('\n');
  return lines.map(line => {
    let l = line.trim();
    if (!l) return '';
    if (l.startsWith('### ')) {
      return `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 700; color: #1E4ED8; text-transform: uppercase; letter-spacing: 0.05em; margin: 16px 0 8px 0; border-bottom: 1px solid #E2DFD7; padding-bottom: 4px;">${escapeHtml(l.replace('### ', ''))}</div>`;
    }
    if (l.startsWith('- ') || l.startsWith('* ') || l.startsWith('• ')) {
      l = l.replace(/^[-*•]\s*/, '');
      l = l.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0F172A;">$1</strong>');
      return `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #334155; line-height: 1.55; margin-bottom: 8px; padding-left: 14px; position: relative;">
          <span style="position: absolute; left: 0; top: 0; color: #1E4ED8; font-weight: bold;">•</span>
          ${l}
        </div>
      `;
    }
    l = l.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0F172A;">$1</strong>');
    return `<p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; color: #475569; line-height: 1.55; margin: 0 0 10px 0;">${l}</p>`;
  }).filter(Boolean).join('');
}

function renderReportSection(title, content) {
  if (!content) return '';
  return `
    <div style="background-color: #FFFFFF; border: 1px solid #E2DFD7; border-radius: 8px; padding: 16px 18px; margin-bottom: 14px; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);">
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; color: #1E4ED8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; border-bottom: 1px solid #F1EFE9; padding-bottom: 6px;">
        ${escapeHtml(title)}
      </div>
      ${formatMarkdownLines(content)}
    </div>
  `;
}

function renderDealItem(deal) {
  const title = deal.title || 'Market intelligence update';
  const tag = deal.category || deal.stage || 'Round';
  const amount = deal.amount || deal.investment_value || '';
  const time = deal.timestamp || deal.date || 'Today';
  const lead = deal.lead || deal.lead_investors || '';
  const other = deal.other_investors || '';
  const source = deal.source_link || '';

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FFFFFF; border: 1px solid #E2DFD7; border-radius: 8px; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);">
      <tr>
        <td style="padding: 14px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="middle" align="left">
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 700; color: #1E4ED8; background-color: #EFF6FF; border: 1px solid #DBEAFE; padding: 2px 7px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.04em; display: inline-block;">
                  ${escapeHtml(tag)}
                </span>
              </td>
              <td valign="middle" align="right">
                <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #8A94A6; font-weight: 500;">
                  ${escapeHtml(time)}
                </span>
              </td>
            </tr>
          </table>
          
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 600; color: #0F172A; line-height: 1.45; margin-top: 8px; margin-bottom: 6px;">
            ${escapeHtml(title)}
          </div>

          ${(lead || amount) ? `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 4px;">
              <tr>
                <td valign="middle" align="left">
                  ${(lead && lead !== title) ? `
                    <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #64748B;">
                      Lead: <strong style="color: #334155;">${escapeHtml(lead)}</strong>
                    </span>
                  ` : ''}
                </td>
                <td valign="middle" align="right">
                  ${amount ? `
                    <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; color: #059669; background-color: #ECFDF5; padding: 2px 6px; border-radius: 4px; border: 1px solid #A7F3D0; display: inline-block;">
                      ${escapeHtml(amount)}
                    </span>
                  ` : ''}
                </td>
              </tr>
            </table>
          ` : ''}

          ${other && other !== 'Not disclosed' ? `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #8A94A6; margin-top: 4px;">
              Other Investors: <span style="color: #64748B;">${escapeHtml(other)}</span>
            </div>
          ` : ''}

          ${source ? `
            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px dashed #F1EFE9; font-size: 10px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              <a href="${escapeHtml(source)}" target="_blank" style="color: #1E4ED8; text-decoration: none; font-weight: 600;">
                Source &rarr;
              </a>
            </div>
          ` : ''}
        </td>
      </tr>
    </table>
  `;
}

/**
 * Renders full data payload for any agent (multi-section reports, full deal rosters, or leader profiles)
 */
function renderAgentDataContent(agentName, payload) {
  const deals = Array.isArray(payload) ? payload : (payload?.deals || []);
  const report = payload?.report || null;
  const narrative = payload?.narrative || null;
  const metadata = payload?.metadata || null;

  let bodyHtml = '';

  // 1. Multi-Section Institutional Report (e.g. MENA Investment Radar)
  if (report) {
    if (report.summary) {
      bodyHtml += renderReportSection('Executive Summary', report.summary);
    }
    if (report.key_findings) {
      bodyHtml += renderReportSection('Key Findings', report.key_findings);
    }
    if (report.weekly_highlights) {
      bodyHtml += renderReportSection('Weekly Highlights', report.weekly_highlights);
    }
    if (report.notable_deals) {
      bodyHtml += renderReportSection('Notable Deals', report.notable_deals);
    }
    if (report.regional_breakdown) {
      bodyHtml += renderReportSection('Regional Breakdown', report.regional_breakdown);
    }
    if (report.funding_trends) {
      bodyHtml += renderReportSection('Funding Trends', report.funding_trends);
    }
    if (report.outlook) {
      bodyHtml += renderReportSection('Market Outlook', report.outlook);
    }
  }

  // 2. Narrative summary (e.g. US AI Funding / AI Digest)
  if (narrative && !report) {
    if (narrative.headline || narrative.summary) {
      bodyHtml += renderReportSection('Surveillance Briefing', `${narrative.headline ? `**${narrative.headline}**\n\n` : ''}${narrative.summary || ''}`);
    }
  }

  // 3. Deals / Leader items roster (ALL items rendered with NO SLICING)
  if (deals && deals.length > 0) {
    const dealsHtml = deals.map(renderDealItem).join('');
    bodyHtml += `
      <div style="margin-top: 16px; margin-bottom: 8px;">
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; color: #1E4ED8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">
          Agent Findings (${deals.length} Total)
        </div>
        <div style="background-color: #F9F8F5; border: 1px solid #E8E5DD; border-radius: 10px; padding: 12px 12px 2px 12px; margin-bottom: 14px;">
          ${dealsHtml}
        </div>
      </div>
    `;
  }

  // 4. Metadata notes (e.g. crawler notes, sources count)
  if (metadata?.note) {
    bodyHtml += `
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 10px 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; color: #64748B; margin-top: 10px;">
        <strong>Pipeline Note:</strong> ${escapeHtml(metadata.note)}
      </div>
    `;
  }

  if (!bodyHtml) {
    bodyHtml = `
      <div style="background-color: #F8F7F3; border: 1px solid #E5E1D6; border-radius: 8px; padding: 16px; text-align: center; color: #64748B; font-size: 13px;">
        Agent surveillance active. Live market dispatches will be delivered directly as filings occur.
      </div>
    `;
  }

  return bodyHtml;
}

/**
 * 1. SINGLE AGENT INTELLIGENCE BRIEFING EMAIL
 */
function renderWelcomeEmail({ agentName = 'VC & Investors Intel Feed', deals = [], report = null, narrative = null, metadata = null, unsubscribeUrl = '#' }) {
  const payload = {
    deals: Array.isArray(deals) ? deals : (deals?.deals || []),
    report: report || deals?.report || null,
    narrative: narrative || deals?.narrative || null,
    metadata: metadata || deals?.metadata || null
  };

  const contentHtml = renderAgentDataContent(agentName, payload);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(agentName)} | Bossint AI</title>
  <style>
    body { margin: 0; padding: 0; background-color: #EAE7DF; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .content-padding { padding: 20px 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #EAE7DF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <center>
    <table role="presentation" class="email-container" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #D8D4C8; overflow: hidden; box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);">
      
      <!-- Header -->
      <tr>
        <td>
          ${getEmailHeader('FEED ACTIVE', '#059669', '#ECFDF5', '#A7F3D0')}
        </td>
      </tr>

      <!-- Main Content -->
      <tr>
        <td class="content-padding" style="padding: 28px 32px 24px 32px; background-color: #FFFFFF;">
          <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0; line-height: 1.25;">
            ${escapeHtml(agentName)}
          </h1>

          ${contentHtml}
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td>
          ${getEmailFooter(unsubscribeUrl)}
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
  `;
}

/**
 * 2. REAL-TIME INTEL SIGNAL ALERT EMAIL
 */
function renderAgentUpdateEmail({ agentName = 'VC Intel Agent', deals = [], report = null, narrative = null, headline = '', timestamp = 'Today', unsubscribeUrl = '#' }) {
  const payload = {
    deals: Array.isArray(deals) ? deals : (deals?.deals || []),
    report: report || deals?.report || null,
    narrative: narrative || deals?.narrative || null
  };

  const contentHtml = renderAgentDataContent(agentName, payload);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(agentName)}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #EAE7DF; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .content-padding { padding: 20px 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #EAE7DF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <center>
    <table role="presentation" class="email-container" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #D8D4C8; overflow: hidden; box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);">
      
      <!-- Header -->
      <tr>
        <td>
          ${getEmailHeader('LIVE INTEL ALERT', '#1E4ED8', '#EFF6FF', '#DBEAFE')}
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td class="content-padding" style="padding: 28px 32px 24px 32px; background-color: #FFFFFF;">
          <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0; line-height: 1.25;">
            ${escapeHtml(agentName)}
          </h1>

          ${contentHtml}

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #EAE7DF; padding-top: 14px; margin-top: 14px;">
            <tr>
              <td align="left" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #8A94A6;">
                Verified by Bossint AI Pipeline • ${escapeHtml(timestamp)}
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td>
          ${getEmailFooter(unsubscribeUrl)}
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
  `;
}

/**
 * 3. FULL-STACK INTEL WELCOME EMAIL (All 4 Agents Output)
 */
function renderFullStackWelcomeEmail({ sampleDeals = [], agentStacks = [], unsubscribeUrl = '#' }) {
  let stackHtml = '';

  if (agentStacks && agentStacks.length > 0) {
    stackHtml = agentStacks.map(stack => `
      <div style="margin-bottom: 24px; border-bottom: 2px solid #EAE7DF; padding-bottom: 18px;">
        <h2 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 700; color: #1E4ED8; margin: 0 0 12px 0;">
          ${escapeHtml(stack.agentName)}
        </h2>
        ${renderAgentDataContent(stack.agentName, stack)}
      </div>
    `).join('');
  } else if (sampleDeals && sampleDeals.length > 0) {
    stackHtml = `
      <div style="background-color: #F9F8F5; border: 1px solid #E8E5DD; border-radius: 10px; padding: 12px 12px 2px 12px; margin-bottom: 14px;">
        ${sampleDeals.map(renderDealItem).join('')}
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Full VC Intelligence Stack | Bossint AI</title>
  <style>
    body { margin: 0; padding: 0; background-color: #EAE7DF; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .content-padding { padding: 20px 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #EAE7DF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <center>
    <table role="presentation" class="email-container" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 620px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #D8D4C8; overflow: hidden; box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);">
      
      <!-- Header -->
      <tr>
        <td>
          ${getEmailHeader('FULL STACK ACTIVE', '#059669', '#ECFDF5', '#A7F3D0')}
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td class="content-padding" style="padding: 28px 32px 24px 32px; background-color: #FFFFFF;">
          <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0; line-height: 1.25;">
            Full VC Intelligence Stack
          </h1>

          ${stackHtml}
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td>
          ${getEmailFooter(unsubscribeUrl)}
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
  `;
}

/**
 * 4. CLEAN UNREGISTER / UNSUBSCRIBE CONFIRMATION PAGE
 */
function renderUnsubscribeConfirmationHtml({ email, agentName, resubscribeUrl = '/' }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unsubscribed | Bossint AI</title>
  <meta name="robots" content="noindex, nofollow">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #EAE7DF;
      color: #1E293B;
      margin: 0;
      padding: 40px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
    }
    .card {
      background: #FFFFFF;
      max-width: 480px;
      width: 100%;
      border-radius: 12px;
      border: 1px solid #D8D4C8;
      padding: 36px 32px;
      box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);
      text-align: center;
    }
    .brand {
      margin-bottom: 24px;
    }
    .icon-box {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #F1F5F9;
      color: #64748B;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 20px;
      font-weight: 700;
      color: #0F172A;
      margin: 0 0 10px 0;
    }
    p {
      font-size: 14px;
      color: #64748B;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }
    .email-chip {
      display: inline-block;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 4px 12px;
      border-radius: 6px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-block;
      background: #1E4ED8;
      color: #FFFFFF;
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
      padding: 10px 20px;
      border-radius: 6px;
      transition: background 0.2s ease;
    }
    .btn:hover {
      background: #173EB0;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">
      <a href="https://bossint.ai" target="_blank" style="text-decoration: none; display: inline-block;">
        <img src="${LOGO_SVG_BASE64}" alt="Bossint AI" width="140" height="22" style="display: block; margin: 0 auto; border: 0;" />
      </a>
    </div>
    <div class="icon-box">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18M6 6l12 12"/>
      </svg>
    </div>
    <h1>You have been unsubscribed</h1>
    <p>
      Your email address has been removed from <strong>${escapeHtml(agentName || 'all intelligence dispatches')}</strong>. You will no longer receive alerts from this agent.
    </p>
    <div class="email-chip">${escapeHtml(email)}</div>
    <div>
      <a href="${escapeHtml(resubscribeUrl)}" class="btn">Return to Bossint AI</a>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * 5. VERIFICATION EMAIL (DOUBLE OPT-IN)
 * Sent immediately when a user subscribes, requiring email confirmation before activating stream
 */
function renderVerificationEmail({ agentName = 'VC Intelligence Feed', verifyUrl = '#', unsubscribeUrl = '#' }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email: ${escapeHtml(agentName)} | Bossint AI</title>
  <style>
    body { margin: 0; padding: 0; background-color: #EAE7DF; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .content-padding { padding: 24px 18px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #EAE7DF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <center>
    <table role="presentation" class="email-container" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border-radius: 12px; border: 1px solid #D8D4C8; overflow: hidden; box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);">
      
      <!-- Header -->
      <tr>
        <td>
          ${getEmailHeader('VERIFY EMAIL', '#1E4ED8', '#EFF6FF', '#DBEAFE')}
        </td>
      </tr>

      <!-- Content -->
      <tr>
        <td class="content-padding" style="padding: 32px 32px 28px 32px; background-color: #FFFFFF;">
          <h1 style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 20px; font-weight: 700; color: #0F172A; margin: 0 0 12px 0; line-height: 1.3;">
            Verify Your Email Address
          </h1>

          <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
            Please verify your email address to activate continuous Bossint AI agent intel.
          </p>

          <!-- Primary CTA Button -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 24px 0;">
            <tr>
              <td align="center">
                <a href="${escapeHtml(verifyUrl)}" target="_blank" style="display: inline-block; background-color: #1E4ED8; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 700; text-decoration: none; padding: 13px 28px; border-radius: 8px; box-shadow: 0 2px 8px rgba(30, 78, 216, 0.25); text-align: center;">
                  Verify Email &amp; Activate Feed &rarr;
                </a>
              </td>
            </tr>
          </table>

          <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
            <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; line-height: 1.55; color: #64748B; margin: 0;">
              Once verified, your autonomous pipeline will immediately deliver your first intelligence briefing and stream live updates as new activity occurs.
            </p>
          </div>

          <p style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: #94A3B8; line-height: 1.5; margin: 0;">
            If you did not request this intelligence subscription, you can safely ignore this email.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td>
          ${getEmailFooter(unsubscribeUrl)}
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
  `;
}

/**
 * 6. EMAIL VERIFICATION CONFIRMATION WEB PAGE
 */
function renderVerificationConfirmationHtml({ email, agentName, dashboardUrl = '/' }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verified | Bossint AI</title>
  <meta name="robots" content="noindex, nofollow">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #EAE7DF;
      color: #1E293B;
      margin: 0;
      padding: 40px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 80vh;
    }
    .card {
      background: #FFFFFF;
      max-width: 480px;
      width: 100%;
      border-radius: 12px;
      border: 1px solid #D8D4C8;
      padding: 36px 32px;
      box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08);
      text-align: center;
    }
    .brand {
      margin-bottom: 24px;
    }
    .icon-box {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: #ECFDF5;
      color: #059669;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      border: 1px solid #A7F3D0;
    }
    h1 {
      font-size: 20px;
      font-weight: 700;
      color: #0F172A;
      margin: 0 0 10px 0;
    }
    p {
      font-size: 14px;
      color: #64748B;
      line-height: 1.6;
      margin: 0 0 20px 0;
    }
    .email-chip {
      display: inline-block;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      padding: 4px 12px;
      border-radius: 6px;
      font-weight: 600;
      color: #334155;
      margin-bottom: 24px;
    }
    .btn {
      display: inline-block;
      background: #1E4ED8;
      color: #FFFFFF;
      text-decoration: none;
      font-weight: 600;
      font-size: 13px;
      padding: 10px 22px;
      border-radius: 6px;
      transition: background 0.2s ease;
    }
    .btn:hover {
      background: #173EB0;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">
      <a href="https://bossint.ai" target="_blank" style="text-decoration: none; display: inline-block;">
        <img src="${LOGO_SVG_BASE64}" alt="Bossint AI" width="140" height="22" style="display: block; margin: 0 auto; border: 0;" />
      </a>
    </div>
    <div class="icon-box">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
    <h1>Email Verified</h1>
    <p>
      Your subscription to <strong>${escapeHtml(agentName)}</strong> is active. Your first intelligence briefing is on its way.
    </p>
    <div class="email-chip">${escapeHtml(email)}</div>
    <div>
      <a href="${escapeHtml(dashboardUrl)}" class="btn">View Live Feed &rarr;</a>
    </div>
  </div>
</body>
</html>
  `;
}

module.exports = {
  renderWelcomeEmail,
  renderAgentUpdateEmail,
  renderFullStackWelcomeEmail,
  renderVerificationEmail,
  renderVerificationConfirmationHtml,
  renderUnsubscribeConfirmationHtml,
  renderDealItem,
  escapeHtml
};

