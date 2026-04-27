// demo-web.js

document.addEventListener('DOMContentLoaded', () => {
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabs = document.querySelectorAll('.tab-content');
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');

  const titles = {
    'monitoring': 'Monitoring',
    'builder': 'Agent Builder',
    'workflow': 'Workflow Orchestrator',
    'metrics': 'Metrics & Evaluations'
  };

  const subtitles = {
    'monitoring': 'Live fleet posture, SOP health, and intervention queue',
    'builder': 'Convert governed browser steps into readable markdown skills',
    'workflow': 'Compose local agents into controlled cross-system processes',
    'metrics': 'Track reliability, healing rate, and automation ROI'
  };

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Reset all buttons
      navBtns.forEach(b => b.classList.remove('active'));
      
      // Activate clicked button
      btn.classList.add('active');

      const targetId = btn.getAttribute('data-tab');
      
      // Fade out all tabs, show target
      tabs.forEach(tab => tab.classList.add('hidden'));
      document.getElementById(`tab-${targetId}`).classList.remove('hidden');

      // Update header
      pageTitle.textContent = titles[targetId];
      pageSubtitle.textContent = subtitles[targetId];
    });
  });
});
