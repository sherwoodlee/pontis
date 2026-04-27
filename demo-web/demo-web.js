// demo-web.js

document.addEventListener('DOMContentLoaded', () => {
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabs = document.querySelectorAll('.tab-content');
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');
  const reviewFollowups = document.getElementById('review-followups');
  const approveMessage = document.getElementById('approve-message');
  const reviseMessage = document.getElementById('revise-message');
  const approvalState = document.getElementById('approval-state');
  const draftMessage = document.getElementById('draft-message');
  const nextAction = document.getElementById('next-action');

  const titles = {
    'monitoring': 'Follow-up Command Center',
    'builder': 'Assistant Builder',
    'workflow': 'Message Review Desk',
    'metrics': 'Business Impact'
  };

  const subtitles = {
    'monitoring': 'Live follow-up queue, message approvals, and customer next steps',
    'builder': 'Turn owner preferences into plain-language instructions Pontis can follow',
    'workflow': 'Approve sensitive customer messages before they go out',
    'metrics': 'Track response speed, saved time, and recovered revenue'
  };

  function showTab(targetId) {
    navBtns.forEach(b => b.classList.toggle('active', b.getAttribute('data-tab') === targetId));
    tabs.forEach(tab => tab.classList.add('hidden'));
    document.getElementById(`tab-${targetId}`).classList.remove('hidden');
    pageTitle.textContent = titles[targetId];
    pageSubtitle.textContent = subtitles[targetId];
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      showTab(btn.getAttribute('data-tab'));
    });
  });

  reviewFollowups?.addEventListener('click', () => showTab('workflow'));

  reviseMessage?.addEventListener('click', () => {
    draftMessage.textContent = 'Hi Elena, thank you for reaching out about the catering package. I know weekday events can have a little more flexibility, so I am asking our manager to review the best option for you. I will send a clear answer today, and either way we will make sure the setup, delivery, and service window are easy for your team.';
    approvalState.textContent = 'Revised';
    approvalState.className = 'badge-info';
    nextAction.textContent = 'Keep the message paused until you approve it, then update the customer record and set a no-reply reminder.';
  });

  approveMessage?.addEventListener('click', () => {
    approvalState.textContent = 'Approved';
    approvalState.className = 'badge-success';
    draftMessage.classList.add('border-accent-emerald/30', 'bg-accent-emerald/10');
    nextAction.textContent = 'Message approved. Pontis is sending it now, logging the decision, and creating a reminder for tomorrow.';
    approveMessage.textContent = 'Sent';
    approveMessage.setAttribute('disabled', 'true');
    approveMessage.classList.add('opacity-70', 'cursor-default');
  });
});
