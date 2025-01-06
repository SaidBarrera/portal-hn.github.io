import { checkAuth, logout, getUserProfile } from '../utils/auth.js';

document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const user = checkAuth();
    if (!user || user.type !== 'applicant') {
        // Si no es solicitante, redirigir al login
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
    document.getElementById('userTitle').textContent = user.title || 'Profesional';

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

    // Botón de actualizar CV
    const updateCVBtn = document.querySelector('.quick-actions .btn-primary');
    if (updateCVBtn) {
        updateCVBtn.addEventListener('click', handleCVUpdate);
    }
}

function handleLogout(e) {
    e.preventDefault();
    
    // Mostrar confirmación
    if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
        // Guardar cualquier cambio pendiente si es necesario
        saveCurrentProgress();
        
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

function saveCurrentProgress() {
    // Guardar cualquier progreso no guardado
    // Por ejemplo, borradores de postulaciones
    const drafts = localStorage.getItem('application-drafts');
    if (drafts) {
        // Aquí podrías enviar los borradores al servidor
        console.log('Guardando borradores...', drafts);
    }
}

function handleCVUpdate(e) {
    e.preventDefault();
    // Implementar lógica para actualizar CV
}

function loadDashboardData() {
    // Cargar datos del dashboard
    loadRecommendedJobs();
    loadApplicationStatus();
    updateProfileCompletion();
}

function loadRecommendedJobs() {
    // Cargar trabajos recomendados
}

function loadApplicationStatus() {
    // Cargar estado de postulaciones
}

function updateProfileCompletion() {
    // Actualizar barra de progreso del perfil
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