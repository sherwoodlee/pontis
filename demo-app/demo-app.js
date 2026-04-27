// demo-app.js

const logContainer = document.getElementById('log-container');
const interventionOverlay = document.getElementById('intervention-overlay');
const btnIntervene = document.getElementById('btn-intervene');
const mdLineTarget = document.getElementById('md-line-target');
const syncStatus = document.getElementById('sync-status');
const targetButton = document.getElementById('target-button');

function addLog(text, type = 'info') {
  const el = document.createElement('div');
  el.className = 'flex gap-3 opacity-0 translate-y-2 transition-all duration-300';
  
  let icon = '<span class="text-blue-400 font-bold">INFO</span>';
  if (type === 'error') icon = '<span class="text-red-400 font-bold">FAIL</span>';
  if (type === 'success') icon = '<span class="text-green-400 font-bold">PASS</span>';
  if (type === 'warn') icon = '<span class="text-yellow-400 font-bold">WAIT</span>';
  if (type === 'agent') icon = '<span class="text-primary-indigo-light font-bold pl-1 border-l-2 border-primary-indigo-light">AI  </span>';

  let textColor = 'text-slate-300';
  if (type === 'error') textColor = 'text-red-400';
  if (type === 'success') textColor = 'text-green-400';
  if (type === 'agent') textColor = 'text-white italic';

  el.innerHTML = `
    <span class="shrink-0 w-12 text-right">${icon}</span>
    <span class="${textColor} flex-grow">${text}</span>
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
  addLog('Pontis Execution Engine v2.1.0 started.');
  addLog('Loading SOP: crm_sync_sop.md');
  
  await sleep(1000);
  addLog('I will now execute the CRM Quarterly Sync SOP.', 'agent');
  addLog('Navigating to https://internal.crm.corp/dashboard...', 'info');
  await sleep(800);
  addLog('Navigation successful.', 'success');
  
  await sleep(1000);
  addLog('Entering credentials...', 'info');
  
  await sleep(800);
  addLog('Looking for [data-test="btn-submit"]...', 'info');
  
  await sleep(1500);
  addLog('Element not found. Checking DOM for alternatives...', 'agent');
  addLog('Retry 1/3...', 'warn');
  
  await sleep(1000);
  addLog('Retry 2/3...', 'warn');

  await sleep(500);
  // Visually change the button in the UI to simulate the "change"
  targetButton.innerHTML = `<button class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-md font-semibold shadow-md transition-colors">Submit Form Data</button>`;
  
  await sleep(500);
  addLog('Execution halted. UI structure has changed drastically.', 'error');
  addLog('I cannot proceed safely. Requesting Human Intervention.', 'agent');
  
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

  addLog('Human took control. Screen recording active...', 'info');
  
  await sleep(1000);
  
  // Simulate human clicking the new button
  targetButton.firstElementChild.classList.add('ring-4', 'ring-accent-emerald/50', 'scale-95');
  addLog('Human clicked Element: <button class="bg-indigo-600...">Submit Form Data</button>', 'success');
  
  setTimeout(() => {
     targetButton.firstElementChild.classList.remove('ring-4', 'ring-accent-emerald/50', 'scale-95');
  }, 300);

  await sleep(1200);
  addLog('I observed the human click the new "Submit Form Data" button.', 'agent');
  addLog('Compiling new DOM path and updating Markdown SOP...', 'agent');

  // Trigger Markdown Diff Animation
  mdLineTarget.classList.add('bg-red-500/20', 'text-red-400'); // Show delete
  syncStatus.textContent = 'Syncing...';
  syncStatus.className = 'text-[10px] text-yellow-500 animate-pulse font-bold px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20';

  await sleep(1000);
  // Change to insert
  mdLineTarget.classList.remove('bg-red-500/20', 'text-red-400');
  mdLineTarget.classList.add('bg-accent-emerald/20', 'text-accent-emerald-light');
  mdLineTarget.innerHTML = `<span class="text-slate-500">- 4. Click button \`[data-test="btn-submit"]\`</span><br>+ 4. Click button <span class="font-bold text-white">"Submit Form Data" (Text match)</span>`;

  await sleep(1500);
  mdLineTarget.classList.remove('bg-accent-emerald/20');
  
  syncStatus.textContent = 'Healed across network';
  syncStatus.className = 'text-[10px] text-accent-emerald-light font-bold px-2 py-0.5 rounded bg-accent-emerald/10 border border-accent-emerald/20';
  
  addLog('SOP updated successfully and pushed to central Git repository.', 'success');
  addLog('Resuming automated execution...', 'agent');

});

// Start demo on load
window.addEventListener('load', runDemo);
