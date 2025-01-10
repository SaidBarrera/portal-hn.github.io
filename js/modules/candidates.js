// Estado de los candidatos
const candidatesState = {
    candidates: [],
    currentPage: 1,
    itemsPerPage: 10,
    filters: {
        search: '',
        job: 'all',
        status: 'all'
    }
};

// Inicialización
export function initializeCandidates() {
    loadCandidates();
    setupCandidatesEventListeners();
}

function setupCandidatesEventListeners() {
    // Búsqueda
    document.getElementById('candidateSearch')?.addEventListener('input', 
        debounce((e) => {
            candidatesState.filters.search = e.target.value;
            candidatesState.currentPage = 1;
            refreshCandidatesTable();
        }, 300));

    // Filtros
    document.getElementById('jobFilter')?.addEventListener('change', (e) => {
        candidatesState.filters.job = e.target.value;
        candidatesState.currentPage = 1;
        refreshCandidatesTable();
    });

    document.getElementById('statusFilter')?.addEventListener('change', (e) => {
        candidatesState.filters.status = e.target.value;
        candidatesState.currentPage = 1;
        refreshCandidatesTable();
    });

    // Paginación
    setupCandidatesPagination();
}

// Carga de datos
function loadCandidates() {
    // Simular carga de datos
    candidatesState.candidates = [
        {
            id: '1',
            name: 'Juan Pérez',
            email: 'juan@example.com',
            jobId: '1',
            jobTitle: 'Desarrollador Frontend',
            status: 'reviewing',
            matchScore: 85,
            experience: '5 años',
            skills: ['JavaScript', 'React', 'Node.js'],
            appliedDate: '2024-01-15'
        },
        // Más candidatos...
    ];

    refreshCandidatesTable();
}

function refreshCandidatesTable() {
    const filteredCandidates = filterCandidates();
    renderCandidatesTable(filteredCandidates);
    updateCandidatesPagination(filteredCandidates.length);
}

function filterCandidates() {
    return candidatesState.candidates.filter(candidate => {
        const searchMatch = 
            candidate.name.toLowerCase().includes(candidatesState.filters.search.toLowerCase()) ||
            candidate.email.toLowerCase().includes(candidatesState.filters.search.toLowerCase());

        const jobMatch = 
            candidatesState.filters.job === 'all' || 
            candidate.jobId === candidatesState.filters.job;

        const statusMatch = 
            candidatesState.filters.status === 'all' || 
            candidate.status === candidatesState.filters.status;

        return searchMatch && jobMatch && statusMatch;
    });
}

function renderCandidatesTable(candidates) {
    const tbody = document.getElementById('candidatesTableBody');
    if (!tbody) return;

    const start = (candidatesState.currentPage - 1) * candidatesState.itemsPerPage;
    const end = start + candidatesState.itemsPerPage;
    const paginatedCandidates = candidates.slice(start, end);

    tbody.innerHTML = paginatedCandidates.map(candidate => `
        <tr>
            <td>
                <div class="candidate-info">
                    <div class="candidate-avatar">
                        <img src="/assets/images/default-avatar.png" alt="${candidate.name}">
                    </div>
                    <div class="candidate-details">
                        <div class="candidate-name">${candidate.name}</div>
                        <div class="candidate-email">${candidate.email}</div>
                    </div>
                </div>
            </td>
            <td>${candidate.jobTitle}</td>
            <td>
                <span class="candidate-status status-${candidate.status}">
                    ${getStatusText(candidate.status)}
                </span>
            </td>
            <td>${formatDate(candidate.appliedDate)}</td>
            <td>
                <div class="match-score">
                    <div class="match-bar">
                        <div class="match-fill" style="width: ${candidate.matchScore}%"></div>
                    </div>
                    <span>${candidate.matchScore}%</span>
                </div>
            </td>
            <td>
                <div class="candidate-actions">
                    <button class="action-btn" onclick="viewCandidate('${candidate.id}')" 
                            title="Ver perfil">
                        <i class="fas fa-user"></i>
                    </button>
                    <button class="action-btn" onclick="scheduleInterview('${candidate.id}')"
                            title="Agendar entrevista">
                        <i class="fas fa-calendar"></i>
                    </button>
                    <button class="action-btn" onclick="updateCandidateStatus('${candidate.id}')"
                            title="Cambiar estado">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Acciones de candidatos
export function viewCandidate(id) {
    const candidate = candidatesState.candidates.find(c => c.id === id);
    if (!candidate) return;

    openCandidateModal(candidate);
}

function openCandidateModal(candidate) {
    const modal = document.getElementById('candidateModal');
    const profileContainer = modal.querySelector('.candidate-profile');

    profileContainer.innerHTML = `
        <div class="profile-sidebar">
            <div class="profile-header">
                <div class="candidate-avatar large">
                    <img src="/assets/images/default-avatar.png" alt="${candidate.name}">
                </div>
                <h3>${candidate.name}</h3>
                <p>${candidate.email}</p>
            </div>
            <div class="profile-section">
                <h4>Detalles</h4>
                <ul class="profile-details">
                    <li>
                        <span class="detail-label">Experiencia</span>
                       <span class="detail-value">${candidate.experience}</span>
                    </li>
                    <li>
                        <span class="detail-label">Estado</span>
                        <span class="detail-value">
                            <span class="candidate-status status-${candidate.status}">
                                ${getStatusText(candidate.status)}
                            </span>
                        </span>
                    </li>
                    <li>
                        <span class="detail-label">Coincidencia</span>
                        <span class="detail-value">${candidate.matchScore}%</span>
                    </li>
                    <li>
                        <span class="detail-label">Aplicó el</span>
                        <span class="detail-value">${formatDate(candidate.appliedDate)}</span>
                    </li>
                </ul>
            </div>
            <div class="profile-section">
                <h4>Habilidades</h4>
                <div class="skills-list">
                    ${candidate.skills.map(skill => `
                        <span class="skill-tag">${skill}</span>
                    `).join('')}
                </div>
            </div>
        </div>
        <div class="profile-main">
            <div class="profile-section">
                <h4>Acciones Rápidas</h4>
                <div class="quick-actions">
                    <button class="btn btn-outline" onclick="downloadCV('${candidate.id}')">
                        <i class="fas fa-download"></i> Descargar CV
                    </button>
                    <button class="btn btn-primary" onclick="scheduleInterview('${candidate.id}')">
                        <i class="fas fa-calendar"></i> Agendar Entrevista
                    </button>
                </div>
            </div>
            <div class="profile-section">
                <h4>Historial de Actividad</h4>
                <div class="activity-timeline">
                    ${generateActivityTimeline(candidate)}
                </div>
            </div>
            <!-- Más secciones según necesidad -->
        </div>
    `;

    modal.classList.add('show');
}

function generateActivityTimeline(candidate) {
    // Simular historial de actividad
    const activities = [
        {
            type: 'application',
            date: candidate.appliedDate,
            description: 'Aplicó al puesto'
        },
        {
            type: 'status_change',
            date: '2024-01-16',
            description: 'Estado actualizado a "En revisión"'
        },
        // Más actividades...
    ];

    return activities.map(activity => `
        <div class="timeline-item">
            <div class="timeline-icon">
                <i class="fas ${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="timeline-content">
                <div class="timeline-date">${formatDate(activity.date)}</div>
                <div class="timeline-description">${activity.description}</div>
            </div>
        </div>
    `).join('');
}

export function scheduleInterview(id) {
    const candidate = candidatesState.candidates.find(c => c.id === id);
    if (!candidate) return;

    // Implementar lógica para agendar entrevista
    showInterviewModal(candidate);
}

export function updateCandidateStatus(id) {
    const candidate = candidatesState.candidates.find(c => c.id === id);
    if (!candidate) return;

    showStatusUpdateModal(candidate);
}

function showInterviewModal(candidate) {
    // Implementar modal de agenda
    console.log('Mostrar modal de agenda para:', candidate.name);
}

function showStatusUpdateModal(candidate) {
    // Implementar modal de actualización de estado
    console.log('Mostrar modal de actualización para:', candidate.name);
}

// Funciones de utilidad
function setupCandidatesPagination() {
    const prevButton = document.getElementById('candidatesPrevPage');
    const nextButton = document.getElementById('candidatesNextPage');

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (candidatesState.currentPage > 1) {
                candidatesState.currentPage--;
                refreshCandidatesTable();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            const totalPages = Math.ceil(
                filterCandidates().length / candidatesState.itemsPerPage
            );
            if (candidatesState.currentPage < totalPages) {
                candidatesState.currentPage++;
                refreshCandidatesTable();
            }
        });
    }
}

function updateCandidatesPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / candidatesState.itemsPerPage);
    const paginationInfo = document.getElementById('candidatesPaginationInfo');
    const prevButton = document.getElementById('candidatesPrevPage');
    const nextButton = document.getElementById('candidatesNextPage');

    if (paginationInfo) {
        const start = (candidatesState.currentPage - 1) * candidatesState.itemsPerPage + 1;
        const end = Math.min(start + candidatesState.itemsPerPage - 1, totalItems);
        paginationInfo.textContent = `Mostrando ${start}-${end} de ${totalItems} candidatos`;
    }

    if (prevButton) {
        prevButton.disabled = candidatesState.currentPage === 1;
    }

    if (nextButton) {
        nextButton.disabled = candidatesState.currentPage === totalPages;
    }
}

function getStatusText(status) {
    const statusMap = {
        pending: 'Pendiente',
        reviewing: 'En revisión',
        interviewed: 'Entrevistado',
        accepted: 'Aceptado',
        rejected: 'Rechazado'
    };
    return statusMap[status] || status;
}

function getActivityIcon(type) {
    const iconMap = {
        application: 'fa-file-alt',
        status_change: 'fa-exchange-alt',
        interview: 'fa-calendar-check',
        note: 'fa-sticky-note'
    };
    return iconMap[type] || 'fa-circle';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Exportar funciones necesarias
export {
    viewCandidate,
    scheduleInterview,
    updateCandidateStatus,
    refreshCandidatesTable
};