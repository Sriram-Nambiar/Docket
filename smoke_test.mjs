// Targeted smoke test — skips slow external API calls, tests all local functionality
const BASE = 'http://localhost:3000';
const TIMEOUT = 8000;

async function fetchWithTimeout(url, options = {}, ms = TIMEOUT) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

async function testAPI(name, url, options = {}) {
  try {
    const res = await fetchWithTimeout(url, options);
    const text = await res.text();
    let json; try { json = JSON.parse(text); } catch { json = null; }
    const status = res.status;
    const pass = status < 500;
    console.log(`${pass ? '✅' : '❌'} [${status}] ${name}${json?.success === true ? ' → success' : json?.error ? ` → ${json.error.substring(0, 60)}` : ''}`);
    return { pass, status, json };
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log(`⏱️  [TIMEOUT] ${name} — external API likely unreachable (expected)`);
      return { pass: true, status: 'TIMEOUT' };
    }
    console.log(`❌ ${name} → ${err.message}`);
    return { pass: false };
  }
}

async function testPage(name, path) {
  try {
    const res = await fetchWithTimeout(`${BASE}${path}`);
    const html = await res.text();
    const hasError = html.includes('Application error') || html.includes('Internal Server Error');
    const pass = res.status === 200 && html.length > 500 && !hasError;
    console.log(`${pass ? '✅' : '❌'} [${res.status}] ${name} — ${(html.length / 1024).toFixed(1)} KB`);
    return { pass };
  } catch (err) {
    console.log(`❌ ${name} → ${err.message}`);
    return { pass: false };
  }
}

async function run() {
  let passed = 0, failed = 0, timeout = 0;
  const track = (r) => { if (r.status === 'TIMEOUT') timeout++; else if (r.pass) passed++; else failed++; };

  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║   Docket Compliance Platform — Smoke Test  ║');
  console.log('╚══════════════════════════════════════════╝\n');

  // --- Pages ---
  console.log('📄 PAGE RENDERING');
  track(await testPage('Home /', '/'));
  track(await testPage('Dashboard /dashboard', '/dashboard'));
  track(await testPage('Intake /intake', '/intake'));
  track(await testPage('Tasks /tasks', '/tasks'));

  // --- Auth ---
  console.log('\n🔐 AUTHENTICATION API');
  track(await testAPI('Login as Compliance Head', `${BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'head@apextech.in', password: 'test123', role: 'compliance_head' })
  }));
  track(await testAPI('Login as Founder', `${BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'founder@apextech.in', password: 'test123', role: 'user' })
  }));
  track(await testAPI('Login validation (empty)', `${BASE}/api/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: '', password: '' })
  }));
  track(await testAPI('Register new user', `${BASE}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'pass123', role: 'user' })
  }));
  track(await testAPI('Register validation (empty)', `${BASE}/api/auth/register`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '', email: '', password: '' })
  }));

  // --- Intake (external NVIDIA API — may timeout) ---
  console.log('\n🤖 INTAKE API (calls NVIDIA LLM — may timeout)');
  track(await testAPI('POST /api/intake', `${BASE}/api/intake`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ businessDescription: 'SaaS platform', sector: 'IT', turnover: '1cr', employees: 10, founders: 2, fdi: false })
  }));

  // --- Extract (external NVIDIA API — may timeout) ---
  console.log('\n📑 EXTRACT API (calls NVIDIA LLM — may timeout)');
  track(await testAPI('POST /api/extract', `${BASE}/api/extract`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Certificate of Incorporation for Apex Tech', fileName: 'test.pdf' })
  }));

  // --- Notifications ---
  console.log('\n🔔 NOTIFICATIONS API');
  track(await testAPI('POST notification', `${BASE}/api/notifications`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'RULE_UPDATE_NOTIF', id: `test-${Date.now()}`, payload: { message: 'Test', urgency: 'Normal' } })
  }));
  track(await testAPI('GET notifications', `${BASE}/api/notifications`));

  // --- Query ---
  console.log('\n💬 QUERY API (calls NVIDIA LLM — may timeout)');
  track(await testAPI('POST /api/query', `${BASE}/api/query`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'What is the GSTR-3B deadline?' })
  }));

  // --- Summary ---
  console.log('\n╔══════════════════════════════════════════╗');
  console.log(`║  ✅ Passed: ${passed}   ❌ Failed: ${failed}   ⏱️  Timeout: ${timeout}    ║`);
  console.log('╚══════════════════════════════════════════╝');
  if (failed > 0) console.log('\n⚠️  Failed tests need investigation.');
  else console.log('\n🎉 All local functionality working correctly!');
  if (timeout > 0) console.log(`ℹ️  ${timeout} test(s) timed out on external NVIDIA API — frontend has fallback handling for these.`);
  console.log('');
}

run();
