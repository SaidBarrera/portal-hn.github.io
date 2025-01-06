import { checkAuth, logout, getUserProfile } from '../utils/auth.js';

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const user = checkAuth();
    if (!user || user.type !== 'employer') {
        // Si no es empleador, redirigir al login
        logout();
        return;
    }

    // Inicializar dashboard
    initializeDashboard(user);

    // Event listeners
    setupEventListeners();
});

function initializeDashboard(user) {
    // Actualizar información del usuario
    document.getElementById('userName').textContent = user.name;
    document.getElementById('companyName').textContent = user.company || 'Empresa';

    // Cargar datos iniciales
    loadDashboardData();
}

function setupEventListeners() {
    // Manejar cierre de sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Navegación del sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
}

function handleLogout(e) {
    e.preventDefault();
    
    // Mostrar confirmación
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        // Mostrar mensaje de despedida
        showToast('Cerrando sesión...', 'info');
        
        // Pequeño delay para mostrar el mensaje
        setTimeout(() => {
            logout();
        }, 1000);
    }
}

function handleNavigation(e) {
    e.preventDefault();
    const section = e.currentTarget.dataset.section;
    
    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    e.currentTarget.classList.add('active');

    // Mostrar sección correspondiente
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(section)?.classList.add('active');
}

function loadDashboardData() {
    // Aquí cargarías los datos del dashboard
    // Por ejemplo, estadísticas, postulaciones, etc.
}

// Función para mostrar notificaciones
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    const container = document.querySelector('.toast-container');
    container.appendChild(toast);

    // Remover después de 3 segundos
    setTimeout(() => {
        toast.remove();
    }, 3000);
}