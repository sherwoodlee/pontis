const logContainer = document.getElementById('log-container');
const approveSend = document.getElementById('approve-send');
const makeWarmer = document.getElementById('make-warmer');
const scheduleFollowup = document.getElementById('schedule-followup');
const draftBubble = document.getElementById('draft-bubble');
const conversation = document.getElementById('conversation');
const approvalBadge = document.getElementById('approval-badge');
const threadStatus = document.getElementById('thread-status');
const suggestionText = document.getElementById('suggestion-text');
const toneValue = document.getElementById('tone-value');
const nextTouch = document.getElementById('next-touch');
const inboxCount = document.getElementById('inbox-count');
const ruleText = document.getElementById('rule-text');
const modeButtons = document.querySelectorAll('.mode-btn');
const messageQueue = document.getElementById('message-queue');
const webQueue = document.getElementById('web-queue');
const messengerWorkspace = document.getElementById('messenger-workspace');
const webWorkspace = document.getElementById('web-workspace');
const messageReview = document.getElementById('message-review');
const webReview = document.getElementById('web-review');
const queueTitle = document.getElementById('queue-title');
const queueSubtitle = document.getElementById('queue-subtitle');
const safetyTitle = document.getElementById('safety-title');
const safetyCopy = document.getElementById('safety-copy');
const reviewTab = document.getElementById('review-tab');
const teachWebStep = document.getElementById('teach-web-step');
const approveWebStep = document.getElementById('approve-web-step');
const returnToMessage = document.getElementById('return-to-message');
const portalButton = document.getElementById('portal-button');
const webStatus = document.getElementById('web-status');
const webBadge = document.getElementById('web-badge');
const webSuggestion = document.getElementById('web-suggestion');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let messageCountText = '3 review';
let messageCountClass = 'badge-danger';

function addLog(text, type = 'info') {
  const el = document.createElement('div');
  el.className = 'rounded-md border border-white/[0.07] bg-white/[0.035] p-3 opacity-0 translate-y-2 transition-all duration-300';

  let label = 'Observed';
  let labelClass = 'text-blue-300';
  if (type === 'success') {
    label = 'Done';
    labelClass = 'text-accent-emerald-light';
  }
  if (type === 'wait') {
    label = 'Paused';
    labelClass = 'text-amber-300';
  }
  if (type === 'agent') {
    label = 'Pontis';
    labelClass = 'text-primary-indigo-light';
  }

  el.innerHTML = `
    <div class="mb-1 text-[10px] font-semibold uppercase tracking-wider ${labelClass}">${label}</div>
    <div class="text-slate-300">${text}</div>
  `;
  logContainer.appendChild(el);

  setTimeout(() => {
    el.classList.remove('opacity-0', 'translate-y-2');
    logContainer.scrollTop = logContainer.scrollHeight;
  }, 20);
}

function setDraft(text, footer = 'Draft waiting for approval') {
  draftBubble.innerHTML = `
    <div class="message-bubble message-draft">
      ${text}
      <div class="mt-2 text-right text-[11px] text-indigo-500">${footer}</div>
    </div>
  `;
}

function markApproved() {
  draftBubble.innerHTML = `
    <div class="message-bubble message-business">
      Hi Elena, thanks for asking. I can ask our manager to review a special weekday option for your event. The standard package already includes setup, delivery, and the full service window, and I’ll follow up with a clear answer today.
      <div class="mt-2 text-right text-[11px] text-indigo-100">Approved and sent · just now</div>
    </div>
  `;
  approvalBadge.textContent = 'Sent';
  approvalBadge.className = 'badge-success';
  threadStatus.textContent = 'Message sent';
  threadStatus.className = 'badge-success';
  approveSend.textContent = 'Sent';
  approveSend.disabled = true;
  approveSend.classList.add('opacity-70', 'cursor-default');
  messageCountText = '2 review';
  messageCountClass = 'badge-warning';
  inboxCount.textContent = messageCountText;
  inboxCount.className = messageCountClass;
  ruleText.textContent = 'Approved discount-related messages are logged with the reason and follow-up reminder.';
  conversation.scrollTop = conversation.scrollHeight;
}

function setMode(mode) {
  const isWeb = mode === 'web';

  modeButtons.forEach(button => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('bg-primary-indigo', active);
    button.classList.toggle('text-white', active);
    button.classList.toggle('text-slate-400', !active);
  });

  messageQueue.classList.toggle('hidden', isWeb);
  webQueue.classList.toggle('hidden', !isWeb);
  messengerWorkspace.classList.toggle('hidden', isWeb);
  messengerWorkspace.classList.toggle('flex', !isWeb);
  webWorkspace.classList.toggle('hidden', !isWeb);
  webWorkspace.classList.toggle('flex', isWeb);
  messageReview.classList.toggle('hidden', isWeb);
  webReview.classList.toggle('hidden', !isWeb);

  queueTitle.textContent = isWeb ? 'Local Web Work' : 'Unified Inbox';
  queueSubtitle.textContent = isWeb ? 'Portals, CRMs, forms, and quote tools' : 'Texts, email, web forms, CRM notes';
  inboxCount.textContent = isWeb ? '1 paused' : messageCountText;
  inboxCount.className = isWeb ? 'badge-warning' : messageCountClass;
  safetyTitle.textContent = isWeb ? 'Local browser control' : 'Human-safe sending';
  safetyCopy.textContent = isWeb
    ? 'Pontis can use authenticated browser sessions on this machine and pause before risky portal actions.'
    : 'Pontis can draft and organize. It pauses before discounts, promises, refunds, or sensitive details.';
  reviewTab.textContent = isWeb ? 'Web Review' : 'Pontis Review';

  addLog(isWeb ? 'Switched to secure browser work for the same Riverbend follow-up.' : 'Returned to the customer message thread.', 'agent');
}

function completeWebStep() {
  portalButton.innerHTML = '<button class="rounded-md bg-emerald-600 px-5 py-2.5 font-semibold text-white shadow-sm">Quote Updated</button>';
  webStatus.textContent = 'Portal updated';
  webStatus.className = 'badge-success';
  webBadge.textContent = 'Learned';
  webBadge.className = 'badge-success';
  webSuggestion.textContent = 'Pontis learned the updated portal step and can now finish this quote workflow safely next time.';
  approveWebStep.textContent = 'Step saved';
  approveWebStep.disabled = true;
  approveWebStep.classList.add('opacity-70', 'cursor-default');
  teachWebStep.textContent = 'Updated step learned';
  teachWebStep.disabled = true;
  teachWebStep.classList.add('opacity-70', 'cursor-default');
  ruleText.textContent = 'When a portal changes, Pontis asks for one human demonstration and stores the correction as a readable instruction.';
  addLog('Human showed Pontis the updated portal button: “Submit Quote Update.”', 'success');
  addLog('Browser task completed locally. Pontis can now return to the message with the approved quote status.', 'agent');
}

async function runDemo() {
  await sleep(700);
  addLog('New Riverbend Cafe SMS arrived from the business phone line.');

  await sleep(900);
  addLog('Pontis matched the customer to CRM notes, past order history, and preferred channel.', 'agent');

  await sleep(900);
  addLog('A reply was drafted, but discount language triggered the human-review rule.', 'wait');

  await sleep(900);
  addLog('Owner can approve, rewrite tone, or schedule a reminder without leaving the messenger desk.', 'agent');
}

modeButtons.forEach(button => {
  button.addEventListener('click', () => setMode(button.dataset.mode));
});

makeWarmer.addEventListener('click', () => {
  setDraft(
    'Hi Elena, thanks for asking. We loved working with Riverbend last time, and I know weekday events sometimes need a little flexibility. I can ask our manager to review the best option for your Thursday event, while keeping setup, delivery, and the full service window clear. I’ll follow up with a simple answer today.',
    'Warmer draft waiting for approval'
  );
  suggestionText.textContent = 'Tone adjusted. Pontis kept the policy boundary, added customer context, and still avoided promising a discount.';
  toneValue.textContent = 'Warmer';
  addLog('Draft rewritten with more warmth and customer context.', 'success');
});

approveSend.addEventListener('click', () => {
  markApproved();
  addLog('Message sent by SMS after owner approval.', 'success');
  addLog('Customer record updated with the discount-review reason.', 'agent');
});

scheduleFollowup.addEventListener('click', () => {
  nextTouch.textContent = 'Tomorrow';
  scheduleFollowup.textContent = 'Reminder scheduled';
  scheduleFollowup.disabled = true;
  scheduleFollowup.classList.add('opacity-70', 'cursor-default');
  addLog('Tomorrow reminder created if Elena does not reply.', 'success');
});

teachWebStep.addEventListener('click', completeWebStep);
approveWebStep.addEventListener('click', completeWebStep);
returnToMessage.addEventListener('click', () => setMode('messenger'));

window.addEventListener('load', runDemo);
