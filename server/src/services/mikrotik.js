// RouterOS 7 REST adapter. Never expose these credentials to browser code.
function routerConfig() {
  const base = process.env.MIKROTIK_BASE_URL;
  const username = process.env.MIKROTIK_USERNAME;
  const password = process.env.MIKROTIK_PASSWORD;
  if (!base || !username || !password) throw new Error('MIKROTIK_NOT_CONFIGURED');
  return { base: base.replace(/\\/$/, ''), username, password };
}
async function rosRequest(path, options = {}) {
  const { base, username, password } = routerConfig();
  const headers = { Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`, 'Content-Type': 'application/json', ...(options.headers || {}) };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${base}/rest/${path.replace(/^\\//, '')}`, { ...options, headers, signal: controller.signal });
    const body = await response.text();
    if (!response.ok) throw new Error(`ROUTEROS_HTTP_${response.status}: ${body.slice(0, 300)}`);
    return body ? JSON.parse(body) : null;
  } finally { clearTimeout(timeout); }
}
async function testConnection() { return rosRequest('system/resource'); }
async function setHotspotUserDisabled(username, disabled) {
  const rows = await rosRequest(`ip/hotspot/user?name=${encodeURIComponent(username)}`);
  const row = Array.isArray(rows) ? rows[0] : null;
  if (!row || !row['.id']) throw new Error('HOTSPOT_USER_NOT_FOUND');
  return rosRequest(`ip/hotspot/user/${encodeURIComponent(row['.id'])}`, { method: 'PATCH', body: JSON.stringify({ disabled: disabled ? 'true' : 'false' }) });
}
async function setPppSecretDisabled(username, disabled) {
  const rows = await rosRequest(`ppp/secret?name=${encodeURIComponent(username)}`);
  const row = Array.isArray(rows) ? rows[0] : null;
  if (!row || !row['.id']) throw new Error('PPPOE_SECRET_NOT_FOUND');
  return rosRequest(`ppp/secret/${encodeURIComponent(row['.id'])}`, { method: 'PATCH', body: JSON.stringify({ disabled: disabled ? 'true' : 'false' }) });
}
module.exports = { testConnection, setHotspotUserDisabled, setPppSecretDisabled };
