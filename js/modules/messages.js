// DOM Elements
const messageSearch = document.getElementById('messageSearch');
const conversationsList = document.getElementById('conversationsList');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const newMessageBtn = document.getElementById('newMessageBtn');
const newMessageModal = document.getElementById('newMessageModal');

// Sample data - Replace with actual data from your backend
const conversations = [
    {
        id: 1,
        name: 'Juan Pérez',
        avatar: '../../assets/images/default-avatar.png',
        lastMessage: 'Gracias por la oportunidad...',
        timestamp: '10:30',
        unread: true
    },
    // Add more conversations...
];

// Initialize messages section
function initializeMessages() {
    renderConversations();
    setupEventListeners();
}

// Render conversations list
function renderConversations() {
    conversationsList.innerHTML = conversations.map(conversation => `
        <div class="conversation-item ${conversation.unread ? 'unread' : ''}" data-id="${conversation.id}">
            <img src="${conversation.avatar}" alt="${conversation.name}" class="conversation-avatar">
            <div class="conversation-info">
                <div class="conversation-name">${conversation.name}</div>
                <div class="conversation-preview">${conversation.lastMessage}</div>
            </div>
            <div class="conversation-time">${conversation.timestamp}</div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Search conversations
    messageSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterConversations(searchTerm);
    });

    // Handle conversation selection
    conversationsList.addEventListener('click', (e) => {
        const conversationItem = e.target.closest('.conversation-item');
        if (conversationItem) {
            loadConversation(conversationItem.dataset.id);
        }
    });

    // Handle message input
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Auto-resize message input
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    });

    // New message modal
    newMessageBtn.addEventListener('click', () => {
        newMessageModal.style.display = 'block';
    });
}

// Filter conversations based on search term
function filterConversations(searchTerm) {
    const items = conversationsList.querySelectorAll('.conversation-item');
    items.forEach(item => {
        const name = item.querySelector('.conversation-name').textContent.toLowerCase();
        const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();
        const shouldShow = name.includes(searchTerm) || preview.includes(searchTerm);
        item.style.display = shouldShow ? 'flex' : 'none';
    });
}

// Load conversation messages
function loadConversation(conversationId) {
    // Here you would typically fetch messages from your backend
    // For now, we'll use sample messages
    const messages = [
        {
            id: 1,
            type: 'received',
            content: 'Hola, estoy interesado en la posición...',
            timestamp: '10:30'
        },
        {
            id: 2,
            type: 'sent',
            content: 'Gracias por tu interés. ¿Podrías contarme más sobre tu experiencia?',
            timestamp: '10:32'
        },
        // Add more messages...
    ];

    renderMessages(messages);
}

// Render messages in chat area
function renderMessages(messages) {
    chatMessages.innerHTML = messages.map(message => `
        <div class="message message-${message.type}">
            <div class="message-content">${message.content}</div>
            <div class="message-time">${message.timestamp}</div>
        </div>
    `).join('');
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message
function sendMessage() {
    const content = messageInput.value.trim();
    if (!content) return;

    // Here you would typically send the message to your backend
    // For now, we'll just add it to the UI
    const newMessage = {
        id: Date.now(),
        type: 'sent',
        content: content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const messages = [...document.querySelectorAll('.message')].map(el => ({
        id: el.dataset.id,
        type: el.classList.contains('message-sent') ? 'sent' : 'received',
        content: el.querySelector('.message-content').textContent,
        timestamp: el.querySelector('.message-time').textContent
    }));

    renderMessages([...messages, newMessage]);
    messageInput.value = '';
    messageInput.style.height = 'auto';
}

// Modal functionality
function initializeMessageModal() {
    const modal = document.getElementById('newMessageModal');
    const closeBtn = modal.querySelector('.close-modal');
    const form = document.getElementById('newMessageForm');

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        
        // Here you would typically send the message to your backend
        console.log('New message:', Object.fromEntries(formData));
        
        // Reset form and close modal
        form.reset();
        modal.style.display = 'none';

        // Show success notification
        showNotification('Mensaje enviado correctamente', 'success');
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    const container = document.getElementById('toastContainer');
    container.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        setTimeout(() => container.removeChild(toast), 300);
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeMessages();
    initializeMessageModal();
});

// Handle real-time messages (if using WebSocket)
function initializeWebSocket() {
    // Replace with your WebSocket server URL
    const ws = new WebSocket('ws://your-websocket-server');

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleNewMessage(message);
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    return ws;
}

// Handle new incoming message
function handleNewMessage(message) {
    const messages = [...document.querySelectorAll('.message')].map(el => ({
        id: el.dataset.id,
        type: el.classList.contains('message-sent') ? 'sent' : 'received',
        content: el.querySelector('.message-content').textContent,
        timestamp: el.querySelector('.message-time').textContent
    }));

    renderMessages([...messages, {
        id: message.id,
        type: 'received',
        content: message.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    // Update conversation preview
    updateConversationPreview(message.senderId, message.content);
}

// Update conversation preview in the list
function updateConversationPreview(conversationId, lastMessage) {
    const conversationItem = conversationsList.querySelector(`[data-id="${conversationId}"]`);
    if (conversationItem) {
        const preview = conversationItem.querySelector('.conversation-preview');
        preview.textContent = lastMessage;
        
        // Move conversation to top of list
        conversationsList.insertBefore(conversationItem, conversationsList.firstChild);
    }
}

// Handle file attachments
function initializeFileUpload() {
    const attachButton = document.querySelector('.chat-input-area .btn-icon');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*,.pdf,.doc,.docx';
    fileInput.style.display = 'none';

    attachButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', handleFileUpload);
}

// Handle file upload
function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
        // Here you would typically upload the file to your server
        // For now, we'll just show a preview
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const message = {
                    id: Date.now(),
                    type: 'sent',
                    content: `<img src="${e.target.result}" alt="Imagen adjunta" class="message-image">`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                handleNewMessage(message);
            };
            reader.readAsDataURL(file);
        } else {
            const message = {
                id: Date.now(),
                type: 'sent',
                content: `<div class="file-attachment">
                    <i class="fas fa-file"></i>
                    <span>${file.name}</span>
                </div>`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            handleNewMessage(message);
        }
    });
}

// Export functions
export {
    initializeMessages,
    handleNewMessage,
    showNotification
};