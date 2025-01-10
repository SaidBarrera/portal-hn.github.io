// Estado global de la aplicación
const state = {
    currentSection: 'overview',
    jobs: [],
    currentPage: 1,
    itemsPerPage: 10,
    filters: {
        search: '',
        status: 'all'
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
});

function initializeDashboard() {
    // Verificar autenticación
    checkAuth();
    
    // Configurar navegación
    setupNavigation();
    
    // Configurar modales
    setupModals();
    
    // Configurar eventos
    setupEventListeners();
    
    // Cargar datos iniciales
    loadInitialData();
}

// Autenticación
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = '../auth/login.html';
        return;
    }

    // Cargar datos del usuario
    const userData = JSON.parse(user);
    updateUserInfo(userData);
}

function updateUserInfo(user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('companyName').textContent = user.companyName || 'Mi Empresa';
}

// Navegación
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.currentTarget.dataset.section;
            changeSection(section);
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

function changeSection(sectionId) {
    // Actualizar estado
    state.currentSection = sectionId;

    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === sectionId) {
            link.classList.add('active');
        }
    });

    // Mostrar sección correspondiente
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId)?.classList.add('active');

    // Cargar datos específicos de la sección
    loadSectionData(sectionId);
}

// Carga de datos
function loadInitialData() {
    // Simular carga de datos
    state.jobs = [
        {
            id: '1',
            title: 'Desarrollador Frontend',
            description: 'Experiencia en React y TypeScript',
            location: 'Remoto',
            type: 'full-time',
            status: 'active',
            applications: 12,
            views: 245,
            createdAt: '2024-01-15'
        },
        // Más empleos de ejemplo...
    ];

    // Cargar datos iniciales según la sección actual
    loadSectionData(state.currentSection);
}

function loadSectionData(section) {
    switch(section) {
        case 'overview':
            loadOverviewData();
            break;
        case 'jobs':
            loadJobsData();
            break;
        case 'candidates':
            loadCandidatesData();
            break;
        // Agregar más casos según sea necesario
    }
}

// Gestión de empleos
function loadJobsData() {
    const filteredJobs = filterJobs();
    renderJobsTable(filteredJobs);
    updatePagination(filteredJobs.length);
}

function filterJobs() {
    return state.jobs.filter(job => {
        const searchMatch = job.title.toLowerCase()
            .includes(state.filters.search.toLowerCase());
        const statusMatch = state.filters.status === 'all' || 
            job.status === state.filters.status;
        return searchMatch && statusMatch;
    });
}

function renderJobsTable(jobs) {
    const tbody = document.getElementById('jobsTableBody');
    if (!tbody) return;

    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    const paginatedJobs = jobs.slice(start, end);

    tbody.innerHTML = paginatedJobs.map(job => `
        <tr>
            <td>
                <div class="job-info">
                    <div class="job-title">${job.title}</div>
                    <div class="job-meta">${job.location} • ${job.type}</div>
                </div>
            </td>
            <td>${formatDate(job.createdAt)}</td>
            <td>
                <span class="status-badge ${job.status}">
                    ${getStatusText(job.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="editJob('${job.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="toggleJobStatus('${job.id}')">
                        <i class="fas fa-${job.status === 'active' ? 'pause' : 'play'}"></i>
                    </button>
                    <button class="btn-icon" onclick="deleteJob('${job.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Modales
function setupModals() {
    // Modal de nuevo empleo
    const modal = document.getElementById('jobModal');
    const openModalBtn = document.getElementById('newJobBtn');
    const closeModalBtn = modal.querySelector('.close-modal');
    const form = document.getElementById('jobForm');

    openModalBtn.addEventListener('click', () => openModal('jobModal'));
    closeModalBtn.addEventListener('click', () => closeModal('jobModal'));
    form.addEventListener('submit', handleJobSubmit);

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Event Handlers
function handleJobSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const jobData = {
        id: Date.now().toString(),
        title: formData.get('title'),
        description: formData.get('description'),
        location: formData.get('location'),
        type: formData.get('type'),
        status: 'active',
        applications: 0,
        views: 0,
        createdAt: new Date().toISOString()
    };

    // Agregar nuevo empleo
    state.jobs.unshift(jobData);
    
    // Cerrar modal y actualizar vista
    closeModal('jobModal');
    e.target.reset();
    loadJobsData();
    showToast('Empleo publicado exitosamente', 'success');
}

function handleLogout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('user');
        window.location.href = '../auth/login.html';
    }
}

// Utilidades
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getStatusText(status) {
    const statusMap = {
        active: 'Activo',
        paused: 'Pausado',
        closed: 'Cerrado'
    };
    return statusMap[status] || status;
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

    const container = document.getElementById('toastContainer');
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'times-circle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

// Exportar funciones globales
window.editJob = function(id) {
    const job = state.jobs.find(j => j.id === id);
    if (!job) return;
    // Implementar edición
    console.log('Editar empleo:', job);
};

window.toggleJobStatus = function(id) {
    const job = state.jobs.find(j => j.id === id);
    if (!job) return;
    job.status = job.status === 'active' ? 'paused' : 'active';
    loadJobsData();
    showToast(`Empleo ${job.status === 'active' ? 'activado' : 'pausado'}`, 'success');
};

window.deleteJob = function(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este empleo?')) return;
    
    const index = state.jobs.findIndex(j => j.id === id);
    if (index !== -1) {
        state.jobs.splice(index, 1);
        loadJobsData();
        showToast('Empleo eliminado exitosamente', 'success');
    }
};