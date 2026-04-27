// demo.js

const logContainer = document.getElementById('log-container');
const interventionOverlay = document.getElementById('intervention-overlay');
const btnIntervene = document.getElementById('btn-intervene');
const mdLineTarget = document.getElementById('md-line-target');
const syncStatus = document.getElementById('sync-status');
const targetButton = document.getElementById('target-button');

function addLog(text, type = 'info') {
  const el = document.createElement('div');
  el.className = 'flex gap-3 opacity-0 translate-y-2 transition-all duration-300';
  
  const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });
  
  let icon = '<span class="text-slate-500">[INFO]</span>';
  if (type === 'error') icon = '<span class="text-red-400 font-bold">[FAIL]</span>';
  if (type === 'success') icon = '<span class="text-accent-emerald-light font-bold">[PASS]</span>';
  if (type === 'warn') icon = '<span class="text-yellow-400 font-bold">[WAIT]</span>';

  let textColor = 'text-slate-300';
  if (type === 'error') textColor = 'text-red-400';
  if (type === 'success') textColor = 'text-accent-emerald-light';

  el.innerHTML = `
    <span class="text-slate-600 shrink-0">${time}</span>
    <span class="shrink-0 w-16">${icon}</span>
    <span class="${textColor}">${text}</span>
  `;
  
  logContainer.appendChild(el);
  
  // Trigger reflow for animation
  setTimeout(() => {
    el.classList.remove('opacity-0', 'translate-y-2');
    logContainer.scrollTop = logContainer.scrollHeight;
  }, 10);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runDemo() {
  await sleep(1000);
  addLog('Initializing Agent Harness...');
  
  await sleep(800);
  addLog('Loading SOP: crm_sync_sop.md');
  
  await sleep(1200);
  addLog('Navigating to https://internal.crm.corp/dashboard', 'success');
  
  await sleep(1000);
  addLog('Entering credentials...');
  
  await sleep(800);
  addLog('Attempting to locate element [data-test="btn-submit"]');
  
  await sleep(1500);
  addLog('Element not found. Retrying (1/3)...', 'warn');
  
  await sleep(1000);
  addLog('Element not found. Retrying (2/3)...', 'warn');
  
  await sleep(1000);
  addLog('Element not found. Retrying (3/3)...', 'warn');

  await sleep(500);
  // Visually change the button in the UI to simulate the "change"
  targetButton.innerHTML = `<button class="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold shadow-sm">Submit Form Data</button>`;
  
  addLog('Execution halted. Requesting Human Intervention.', 'error');
  
  // Show intervention modal
  interventionOverlay.classList.remove('hidden');
  setTimeout(() => {
    interventionOverlay.classList.remove('opacity-0');
  }, 10);
}

// Handle Intervention Click
btnIntervene.addEventListener('click', async () => {
  interventionOverlay.classList.add('opacity-0');
  setTimeout(() => interventionOverlay.classList.add('hidden'), 300);

  addLog('Human took control. Observing actions...', 'info');
  
  await sleep(1000);
  
  // Simulate human clicking the new button
  targetButton.firstElementChild.classList.add('ring-4', 'ring-accent-emerald/50', 'scale-95');
  addLog('Human clicked Element: <button class="bg-indigo-600...">Submit Form Data</button>', 'success');
  
  setTimeout(() => {
     targetButton.firstElementChild.classList.remove('ring-4', 'ring-accent-emerald/50', 'scale-95');
  }, 300);

  await sleep(1200);
  addLog('Compiling new DOM path...', 'info');

  await sleep(1000);
  addLog('Applying fix to central Markdown SOP...', 'info');

  // Trigger Markdown Diff Animation
  mdLineTarget.classList.add('bg-red-500/20', 'text-red-300'); // Show delete
  syncStatus.textContent = 'Syncing...';
  syncStatus.className = 'text-xs text-yellow-500 animate-pulse font-bold';

  await sleep(1000);
  // Change to insert
  mdLineTarget.classList.remove('bg-red-500/20', 'text-red-300');
  mdLineTarget.classList.add('bg-accent-emerald/20', 'text-accent-emerald-light');
  mdLineTarget.innerHTML = `4. Click button <span class="font-bold underline text-white">"Submit Form Data" (Text match)</span>`;

  await sleep(1500);
  mdLineTarget.classList.remove('bg-accent-emerald/20', 'text-accent-emerald-light');
  
  syncStatus.textContent = 'Healed across network';
  syncStatus.className = 'text-xs text-accent-emerald-light font-bold';
  
  addLog('SOP updated successfully. Network healed.', 'success');
  addLog('Resuming automated execution...', 'info');

});

// Start demo on load
window.addEventListener('load', runDemo);
