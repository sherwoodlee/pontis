const conversations = [
  {
    id: 'conv_101',
    handle: '@juniper.studio',
    name: 'Maya Chen',
    avatar: 'MC',
    status: 'Needs reply',
    priority: 'High',
    unread: true,
    lastSeen: '2m ago',
    confidence: 91,
    summary:
      'Maya wants to book a product styling session next week and asked whether the bundle includes short-form edit deliverables.',
    facts: ['Interested in bundle', 'Prefers weekday mornings', 'Asked for turnaround time'],
    messages: [
      ['them', 'Hi! I saw the studio session bundle on your story. Is that still available next week?', '9:41 AM'],
      ['us', 'Yes, we still have a few openings next week. Are you looking for product photos, short videos, or both?', '9:44 AM'],
      ['them', 'Both ideally. Does the bundle include reels edits or only raw clips?', '9:48 AM'],
    ],
    draft:
      'Yes, the bundle includes edited short-form clips. For next week, we can include 12 edited photos, 3 short vertical edits, and the raw selects. If mornings are best, Tuesday or Thursday would be the cleanest fit.',
  },
  {
    id: 'conv_102',
    handle: '@northline.home',
    name: 'Andre Patel',
    avatar: 'AP',
    status: 'Waiting',
    priority: 'Medium',
    unread: false,
    lastSeen: '18m ago',
    confidence: 84,
    summary:
      'Andre is comparing two packages and needs clarification on shipping, installation timing, and whether the deposit is refundable.',
    facts: ['Budget-sensitive', 'Needs install before Jun 3', 'Asked about deposit'],
    messages: [
      ['them', 'Can you remind me what happens if the install date changes?', '8:58 AM'],
      ['us', 'We can move the install once without a fee as long as we have 48 hours notice.', '9:02 AM'],
      ['them', 'Got it. Is the deposit refundable if my condo board delays approval?', '9:15 AM'],
    ],
    draft:
      'If the condo board delays approval, we can either move the install date or keep the deposit as a credit toward the next available slot. I would not call it fully refundable, but we can protect the booking value for you.',
  },
  {
    id: 'conv_103',
    handle: '@luna.bakes',
    name: 'Sofia Reyes',
    avatar: 'SR',
    status: 'Resolved',
    priority: 'Low',
    unread: false,
    lastSeen: '1h ago',
    confidence: 96,
    summary:
      'Sofia confirmed pickup for the seasonal box and already received the updated allergen note.',
    facts: ['Pickup confirmed', 'Allergen note sent', 'No reply needed'],
    messages: [
      ['them', 'Perfect, thank you for updating the note.', '7:50 AM'],
      ['us', 'Of course. We will have it ready for pickup after 3 PM.', '7:54 AM'],
      ['them', 'Amazing, see you then.', '7:56 AM'],
    ],
    draft: 'No response needed. Conversation can stay resolved unless Sofia sends a new message.',
  },
];

let activeConversationId = conversations[0].id;

const selectors = {
  list: document.querySelector('[data-conversation-list]'),
  thread: document.querySelector('[data-thread]'),
  summary: document.querySelector('[data-summary]'),
  facts: document.querySelector('[data-facts]'),
  draft: document.querySelector('[data-draft]'),
  name: document.querySelector('[data-active-name]'),
  handle: document.querySelector('[data-active-handle]'),
  status: document.querySelector('[data-active-status]'),
  confidence: document.querySelector('[data-confidence]'),
  notify: document.querySelector('[data-notify]'),
};

function getActiveConversation() {
  return conversations.find((conversation) => conversation.id === activeConversationId);
}

function renderConversationList() {
  selectors.list.innerHTML = conversations
    .map(
      (conversation) => `
        <button class="conversation-item ${conversation.id === activeConversationId ? 'is-active' : ''}" data-conversation-id="${conversation.id}">
          <span class="avatar">${conversation.avatar}</span>
          <span class="conversation-meta">
            <span class="conversation-row">
              <strong>${conversation.name}</strong>
              <small>${conversation.lastSeen}</small>
            </span>
            <span class="conversation-row">
              <span>${conversation.handle}</span>
              ${conversation.unread ? '<span class="unread-dot" aria-label="Unread"></span>' : ''}
            </span>
            <span class="conversation-preview">${conversation.summary}</span>
          </span>
        </button>
      `,
    )
    .join('');
}

function renderThread() {
  const conversation = getActiveConversation();

  selectors.name.textContent = conversation.name;
  selectors.handle.textContent = conversation.handle;
  selectors.status.textContent = conversation.status;
  selectors.status.dataset.status = conversation.status.toLowerCase().replace(' ', '-');
  selectors.confidence.textContent = `${conversation.confidence}%`;
  selectors.summary.textContent = conversation.summary;
  selectors.facts.innerHTML = conversation.facts.map((fact) => `<li>${fact}</li>`).join('');
  selectors.draft.value = conversation.draft;

  selectors.thread.innerHTML = conversation.messages
    .map(
      ([direction, text, time]) => `
        <article class="message ${direction === 'us' ? 'from-us' : 'from-them'}">
          <p>${text}</p>
          <time>${time}</time>
        </article>
      `,
    )
    .join('');
}

function setActiveConversation(conversationId) {
  activeConversationId = conversationId;
  renderConversationList();
  renderThread();
}

selectors.list.addEventListener('click', (event) => {
  const item = event.target.closest('[data-conversation-id]');
  if (!item) return;
  setActiveConversation(item.dataset.conversationId);
});

selectors.draft.addEventListener('input', (event) => {
  getActiveConversation().draft = event.target.value;
});

document.querySelector('[data-send]').addEventListener('click', () => {
  const conversation = getActiveConversation();
  const value = selectors.draft.value.trim();
  if (!value) return;

  conversation.messages.push(['us', value, 'Now']);
  conversation.status = 'Waiting';
  conversation.unread = false;
  conversation.draft = '';
  renderConversationList();
  renderThread();
});

document.querySelector('[data-regenerate]').addEventListener('click', () => {
  const conversation = getActiveConversation();
  selectors.draft.value = `Thanks for the context. Based on the thread, I would reply with a concise answer, confirm the next step, and keep ${conversation.name.split(' ')[0]} moving without overpromising.`;
  conversation.draft = selectors.draft.value;
});

selectors.notify.addEventListener('click', async () => {
  if (!('Notification' in window)) {
    selectors.notify.textContent = 'Unsupported';
    return;
  }

  const permission = await Notification.requestPermission();
  selectors.notify.textContent = permission === 'granted' ? 'Notifications on' : 'Notifications off';

  if (permission === 'granted') {
    new Notification('Pontis message alert', {
      body: 'New Instagram conversation updates will appear here.',
    });
  }
});

renderConversationList();
renderThread();
