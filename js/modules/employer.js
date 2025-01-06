import { DB, State, CONFIG } from '../utils/config.js';
import { createNotification, getStatusText } from '../utils/helpers.js';
import { getCurrentUser } from './auth.js';

export function initializeEmployerDashboard() {
    // Inicializar navegación del dashboard
    document.querySelectorAll('.sidebar a[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.closest('a').dataset.section;
            showDashboardSection(section);
        });
    });

    // Inicializar formulario de nuevo empleo
    document.getElementById('newJobForm')?.addEventListener('submit', handleNewJob);

    // Inicializar filtros y búsqueda
    initializeFilters();
}

function initializeFilters() {
    document.getElementById('searchPostulados')?.addEventListener('input', () => {
        State.currentPage = 1;
        loadPostulados();
    });

    document.getElementById('filterStatus')?.addEventListener('change', () => {
        State.currentPage = 1;
        loadPostulados();
    });

    // Paginación
    document.getElementById('prevPage')?.addEventListener('click', () => {
        if (State.currentPage > 1) {
            State.currentPage--;
            loadPostulados();
        }
    });

    document.getElementById('nextPage')?.addEventListener('click', () => {
        const totalPages = Math.ceil(State.filteredApplications.length / CONFIG.itemsPerPage);
        if (State.currentPage < totalPages) {
            State.currentPage++;
            loadPostulados();
        }
    });
}

export function loadEmpleadorData() {
    loadPostulados();
    loadJobSelect();
}

function loadPostulados() {
    const grid = document.getElementById('postuladosGrid');
    const searchTerm = document.getElementById('searchPostulados')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('filterStatus')?.value || 'todos';
    
    // Filtrar aplicaciones
    State.filteredApplications = DB.applications.filter(application => {
        const job = DB.jobs.find(j => j.id === application.jobId);
        const matchesSearch = application.candidateName.toLowerCase().includes(searchTerm) ||
                            job?.title.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'todos' || application.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Paginación
    const start = (State.currentPage - 1) * CONFIG.itemsPerPage;
    const end = start + CONFIG.itemsPerPage;
    const totalPages = Math.ceil(State.filteredApplications.length / CONFIG.itemsPerPage);
    
    renderPostulados(State.filteredApplications.slice(start, end));
    updatePaginationControls(totalPages);
}

function renderPostulados(applications) {
    const grid = document.getElementById('postuladosGrid');
    grid.innerHTML = '';
    
    applications.forEach(application => {
        const job = DB.jobs.find(j => j.id === application.jobId);
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td>
                <div class="candidate-info">
                    <strong>${application.candidateName}</strong>
                    <span>${application.candidateEmail}</span>
                </div>
            </td>
            <td>${job?.title || 'N/A'}</td>
            <td>${application.experience || '2 años'}</td>
            <td>${application.date}</td>
            <td>
                <span class="status-badge ${application.status}">
                    ${getStatusText(application.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="view-btn" onclick="viewCandidateProfile('${application.id}')">
                        Ver Perfil
                    </button>
                    ${application.status === 'pending' ? `
                        <button class="accept-btn" onclick="handleCandidateAction('${application.id}', 'accept')">
                            Aceptar
                        </button>
                        <button class="reject-btn" onclick="handleCandidateAction('${application.id}', 'reject')">
                            Rechazar
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        
        grid.appendChild(tr);
    });
}

export function handleNewJob(e) {
    e.preventDefault();
    const form = e.target;
    const newJob = {
        id: Date.now().toString(),
        title: form.querySelector('input[placeholder="Título del puesto"]').value,
        description: form.querySelector('textarea').value,
        location: form.querySelector('input[placeholder="Ubicación"]').value,
        salary: form.querySelector('input[placeholder="Salario"]').value,
        date: new Date().toLocaleDateString(),
        employerId: getCurrentUser().email,
        tags: Array.from(State.selectedTags)
    };

    DB.jobs.push(newJob);
    form.reset();
    State.selectedTags.clear();
    document.getElementById('selectedTags').innerHTML = '';
    createNotification(getCurrentUser().email, 'Empleo publicado exitosamente');
    loadJobSelect();
}

export function handleCandidateAction(applicationId, action) {
    const application = DB.applications.find(a => a.id === applicationId);
    if (application) {
        application.status = action;
        if (action === 'accept') {
            createNotification(application.candidateEmail, 'Tu postulación ha sido aceptada');
        }
        loadPostulados();
    }
}

function loadJobSelect() {
    const select = document.getElementById('jobSelect');
    if (!select) return;
    
    select.innerHTML = '';
    DB.jobs
        .filter(job => job.employerId === getCurrentUser().email)
        .forEach(job => {
            const option = document.createElement('option');
            option.value = job.id;
            option.textContent = job.title;
            select.appendChild(option);
        });
}

function showDashboardSection(section) {
    const dashboard = document.querySelector('.dashboard:not([style*="display: none"])');
    dashboard.querySelectorAll('.dashboard-section').forEach(s => {
        s.style.display = 'none';
    });
    document.getElementById(section).style.display = 'block';
}

function updatePaginationControls(totalPages) {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');

    if (prevButton && nextButton && currentPageSpan) {
        prevButton.disabled = State.currentPage === 1;
        nextButton.disabled = State.currentPage === totalPages;
        currentPageSpan.textContent = `Página ${State.currentPage} de ${totalPages}`;
    }
}

export function viewCandidateProfile(applicationId) {
    const application = DB.applications.find(a => a.id === applicationId);
    if (application) {
        showModal(`
            <h2>Perfil de ${application.candidateName}</h2>
            <p><strong>Email:</strong> ${application.candidateEmail}</p>
            <p><strong>Experiencia:</strong> ${application.experience || '2 años'}</p>
            <p><strong>Estado de postulación:</strong> ${getStatusText(application.status)}</p>
            <p><strong>Fecha de postulación:</strong> ${application.date}</p>
        `);
    }
}

function showModal(content) {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    modalOverlay.innerHTML = `
        <div class="modal-container">
            <div class="modal-content">
                ${content}
                <button onclick="this.closest('.modal-overlay').remove()" class="modal-close">
                    Cerrar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
}