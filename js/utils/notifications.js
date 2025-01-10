// Sistema de notificaciones
export function showToast(message, type = 'info') {
    const toast = createToastElement(message, type);
    const container = getOrCreateToastContainer();
    
    container.appendChild(toast);
    animateToast(toast);
}

function createToastElement(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = getToastIcon(type);
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="toast-content">
            <p>${message}</p>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    return toast;
}

function getOrCreateToastContainer() {
    let container = document.querySelector('.toast-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    return container;
}

function animateToast(toast) {
    // Entrada
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Auto-eliminar después de 3 segundos
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    return icons[type] || icons.info;
}

// Notificaciones más complejas
export function showNotification(title, message, type = 'info', actions = []) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    notification.innerHTML = `
        <div class="notification-header">
            <h3>${title}</h3>
            <button class="notification-close">×</button>
        </div>
        <div class="notification-body">
            <p>${message}</p>
        </div>
        ${actions.length ? createActionButtons(actions) : ''}
    `;
    
    const container = getOrCreateNotificationContainer();
    container.appendChild(notification);
    
    setupNotificationEvents(notification);
}

function createActionButtons(actions) {
    return `
        <div class="notification-actions">
            ${actions.map(action => `
                <button class="btn ${action.class || ''}" 
                        onclick="${action.handler}">
                    ${action.text}
                </button>
            `).join('')}
        </div>
    `;
}

function getOrCreateNotificationContainer() {
    let container = document.querySelector('.notifications-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'notifications-container';
        document.body.appendChild(container);
    }
    
    return container;
}

function setupNotificationEvents(notification) {
    // Cerrar notificación
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.add('hiding');
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // Animación de entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
}