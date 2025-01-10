// Datos de ejemplo (en una aplicación real, vendrían de una API)
let jobs = [
    {
        id: '1',
        title: 'Desarrollador Full Stack',
        description: 'Buscamos desarrollador full stack con experiencia en React y Node.js',
        location: 'Remoto',
        type: 'full-time',
        salaryMin: 50000,
        salaryMax: 70000,
        status: 'active',
        views: 245,
        applications: 12,
        createdAt: '2024-01-15',
        benefits: ['Seguro médico', 'Home office', 'Capacitación'],
        requirements: ['3+ años de experiencia', 'React', 'Node.js']
    }
    // Más empleos...
];

// Estado de la aplicación
const state = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    filters: {
        search: '',
        status: 'all',
        date: 'all'
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initializeJobsManagement();
});

function initializeJobsManagement() {
    // Inicializar eventos
    setupEventListeners();
    // Cargar datos iniciales
    loadJobs();
    // Inicializar modal
    setupJobModal();
}

function setupEventListeners() {
    // Búsqueda
    document.getElementById('jobSearch')?.addEventListener('input', (e) => {
        state.filters.search = e.target.value;
        state.currentPage = 1;
        loadJobs();
    });

    // Filtros
    document.getElementById('statusFilter')?.addEventListener('change', (e) => {
        state.filters.status = e.target.value;
        state.currentPage = 1;
        loadJobs();
    });

    document.getElementById('dateFilter')?.addEventListener('change', (e) => {
        state.filters.date = e.target.value;
        state.currentPage = 1;
        loadJobs();
    });

    // Paginación
    document.getElementById('prevPage')?.addEventListener('click', () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            loadJobs();
        }
    });

    document.getElementById('nextPage')?.addEventListener('click', () => {
        const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
        if (state.currentPage < totalPages) {
            state.currentPage++;
            loadJobs();
        }
    });

    // Botón nuevo empleo
    document.getElementById('newJobBtn')?.addEventListener('click', () => {
        openJobModal();
    });

    // Exportar
    document.getElementById('exportJobsBtn')?.addEventListener('click', exportJobs);
}

function loadJobs() {
    // Aplicar filtros
    let filteredJobs = filterJobs(jobs);
    state.totalItems = filteredJobs.length;

    // Aplicar paginación
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const endIndex = startIndex + state.itemsPerPage;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    // Renderizar tabla
    renderJobsTable(paginatedJobs);
    // Actualizar paginación
    updatePagination();
}

function filterJobs(jobs) {
    return jobs.filter(job => {
        // Filtro de búsqueda
        const searchMatch = job.title.toLowerCase().includes(state.filters.search.toLowerCase()) ||
                          job.description.toLowerCase().includes(state.filters.search.toLowerCase());

        // Filtro de estado
        const statusMatch = state.filters.status === 'all' || job.status === state.filters.status;

        // Filtro de fecha
        const dateMatch = filterByDate(job.createdAt, state.filters.date);

        return searchMatch && statusMatch && dateMatch;
    });
}

function filterByDate(dateStr, filter) {
    const jobDate = new Date(dateStr);
    const today = new Date();

    switch (filter) {
        case 'today':
            return isSameDay(jobDate, today);
        case 'week':
            return isThisWeek(jobDate);
        case 'month':
            return isThisMonth(jobDate);
        default:
            return true;
    }
}

function renderJobsTable(jobs) {
    const tbody = document.getElementById('jobsTableBody');
    if (!tbody) return;

    tbody.innerHTML = jobs.map(job => `
        <tr>
            <td>
                <div class="job-title">
                    <h4>${job.title}</h4>
                    <span class="text-muted">${job.location}</span>
                </div>
            </td>
            <td>${formatDate(job.createdAt)}</td>
            <td>
                <div class="applications-count">
                    ${job.applications}
                    <span class="text-muted">postulaciones</span>
                </div>
            </td>
            <td>
                <span class="status-badge status-${job.status}">
                    ${getStatusText(job.status)}
                </span>
            </td>
            <td>${job.views}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="editJob('${job.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="toggleJobStatus('${job.id}')">
                        ${job.status === 'active' ? 
                            '<i class="fas fa-pause"></i>' : 
                            '<i class="fas fa-play"></i>'}
                    </button>
                    <button class="btn-icon text-danger" onclick="deleteJob('${job.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Modal de Empleo
function setupJobModal() {
    const modal = document.getElementById('jobModal');
    const form = document.getElementById('jobForm');
    const closeBtn = modal.querySelector('.close-modal');

    // Cerrar modal
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    // Click fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    // Submit del formulario
    form.addEventListener('submit', handleJobSubmit);

    // Setup de tags
    setupTagsInput('benefitsTags');
    setupTagsInput('requirementsTags');
}

function openJobModal(jobId = null) {
    const modal = document.getElementById('jobModal');
    const form = document.getElementById('jobForm');
    const title = modal.querySelector('.modal-header h3');

    // Limpiar form
    form.reset();
    clearTags('benefitsTags');
    clearTags('requirementsTags');

    if (jobId) {
        // Modo edición
        title.textContent = 'Editar Empleo';
        const job = jobs.find(j => j.id === jobId);
        if (job) {
            fillJobForm(job);
        }
    } else {
        // Modo nuevo empleo
        title.textContent = 'Publicar Nuevo Empleo';
    }

    modal.classList.add('show');
}

function fillJobForm(job) {
    const form = document.getElementById('jobForm');
    
    // Llenar campos básicos
    form.elements.title.value = job.title;
    form.elements.description.value = job.description;
    form.elements.location.value = job.location;
    form.elements.type.value = job.type;
    form.elements.salaryMin.value = job.salaryMin;
    form.elements.salaryMax.value = job.salaryMax;

    // Llenar tags
    job.benefits.forEach(benefit => addTag('benefitsTags', benefit));
    job.requirements.forEach(req => addTag('requirementsTags', req));
}

// Funciones de utilidad
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('es-ES', options);
}

function getStatusText(status) {
    const statusMap = {
        active: 'Activo',
        paused: 'Pausado',
        closed: 'Cerrado'
    };
    return statusMap[status] || status;
}

function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
}

function isThisWeek(date) {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(today.setDate(today.getDate() + 6));
    return date >= weekStart && date <= weekEnd;
}

function isThisMonth(date) {
    const today = new Date();
    return date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

// Exportar funciones necesarias
export {
    initializeJobsManagement,
    editJob,
    deleteJob,
    toggleJobStatus
};