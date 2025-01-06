import { DB, State } from '../utils/config.js';
import { createNotification, getStatusText } from '../utils/helpers.js';
import { getCurrentUser } from './auth.js';

export function initializeApplicantDashboard() {
    // Inicializar navegación del dashboard
    document.querySelectorAll('.sidebar a[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.closest('a').dataset.section;
            showDashboardSection(section);
        });
    });
}

export function loadSolicitanteData() {
    loadNuevasOfertas();
    loadOfertasAplicadas();
    loadInvitaciones();
}

function loadNuevasOfertas() {
    const grid = document.getElementById('nuevasOfertasGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const currentUser = getCurrentUser();
    
    // Obtener IDs de trabajos ya aplicados
    const appliedJobIds = DB.applications
        .filter(a => a.candidateEmail === currentUser.email)
        .map(a => a.jobId);

    // Mostrar trabajos no aplicados
    DB.jobs
        .filter(job => !appliedJobIds.includes(job.id))
        .forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card';
            card.innerHTML = `
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                <p><strong>Ubicación:</strong> ${job.location}</p>
                <p><strong>Salario:</strong> ${job.salary}</p>
                <p><strong>Fecha:</strong> ${job.date}</p>
                <div class="job-tags">
                    ${(job.tags || []).map(tag => `
                        <span class="job-tag">${tag}</span>
                    `).join('')}
                </div>
                <button onclick="handleJobApplication('${job.id}')">Postular</button>
            `;
            grid.appendChild(card);
        });
}

function loadOfertasAplicadas() {
    const grid = document.getElementById('ofertasAplicadasGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const currentUser = getCurrentUser();
    
    // Obtener postulaciones del usuario
    const userApplications = DB.applications.filter(a => a.candidateEmail === currentUser.email);

    userApplications.forEach(application => {
        const job = DB.jobs.find(j => j.id === application.jobId);
        if (job) {
            const card = document.createElement('div');
            card.className = 'job-card';
            card.innerHTML = `
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                <p><strong>Estado:</strong> ${getStatusText(application.status)}</p>
                <p><strong>Fecha de postulación:</strong> ${application.date}</p>
                <div class="job-tags">
                    ${(job.tags || []).map(tag => `
                        <span class="job-tag">${tag}</span>
                    `).join('')}
                </div>
            `;
            grid.appendChild(card);
        }
    });
}

function loadInvitaciones() {
    const grid = document.getElementById('invitacionesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const currentUser = getCurrentUser();
    
    // Obtener invitaciones del usuario
    const userInvitations = DB.invitations.filter(i => i.candidateEmail === currentUser.email);

    userInvitations.forEach(invitation => {
        const job = DB.jobs.find(j => j.id === invitation.jobId);
        if (job) {
            const card = document.createElement('div');
            card.className = 'invitation-card';
            card.innerHTML = `
                <h3>${job.title}</h3>
                <p>${job.description}</p>
                <p><strong>Fecha de invitación:</strong> ${invitation.date}</p>
                <div class="job-tags">
                    ${(job.tags || []).map(tag => `
                        <span class="job-tag">${tag}</span>
                    `).join('')}
                </div>
                <div class="invitation-actions">
                    <button onclick="handleInvitation('${invitation.id}', 'accept')">Aceptar</button>
                    <button onclick="handleInvitation('${invitation.id}', 'reject')">Rechazar</button>
                </div>
            `;
            grid.appendChild(card);
        }
    });
}

export function handleJobApplication(jobId) {
    const currentUser = getCurrentUser();
    const application = {
        id: Date.now().toString(),
        jobId: jobId,
        candidateEmail: currentUser.email,
        candidateName: currentUser.name,
        date: new Date().toLocaleDateString(),
        status: 'pending'
    };

    DB.applications.push(application);
    createNotification(currentUser.email, 'Postulación enviada exitosamente');
    loadNuevasOfertas();
    loadOfertasAplicadas();
}

export function handleInvitation(invitationId, action) {
    const invitation = DB.invitations.find(i => i.id === invitationId);
    if (invitation) {
        if (action === 'accept') {
            handleJobApplication(invitation.jobId);
            const job = DB.jobs.find(j => j.id === invitation.jobId);
            createNotification(job.employerId, `${getCurrentUser().name} ha aceptado tu invitación`);
        } else {
            const job = DB.jobs.find(j => j.id === invitation.jobId);
            createNotification(job.employerId, `${getCurrentUser().name} ha declinado tu invitación`);
        }
        // Remover la invitación
        DB.invitations = DB.invitations.filter(i => i.id !== invitationId);
        loadInvitaciones();
    }
}

function showDashboardSection(section) {
    const dashboard = document.querySelector('.dashboard:not([style*="display: none"])');
    dashboard.querySelectorAll('.dashboard-section').forEach(s => {
        s.style.display = 'none';
    });
    document.getElementById(section).style.display = 'block';
}
// Funciones de filtrado y búsqueda
function initializeJobFilters() {
    const searchInput = document.getElementById('searchJobs');
    const tagFilter = document.getElementById('tagFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            filterAndDisplayJobs();
        });
    }

    if (tagFilter) {
        tagFilter.addEventListener('change', () => {
            filterAndDisplayJobs();
        });
    }
}

function filterAndDisplayJobs() {
    const searchTerm = document.getElementById('searchJobs')?.value.toLowerCase() || '';
    const selectedTag = document.getElementById('tagFilter')?.value;
    
    const filteredJobs = DB.jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm) || 
                            job.description.toLowerCase().includes(searchTerm);
        const matchesTag = !selectedTag || job.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    displayFilteredJobs(filteredJobs);
}

function displayFilteredJobs(jobs) {
    const grid = document.getElementById('nuevasOfertasGrid');
    if (!grid) return;

    grid.innerHTML = '';
    const currentUser = getCurrentUser();
    const appliedJobIds = DB.applications
        .filter(a => a.candidateEmail === currentUser.email)
        .map(a => a.jobId);

    jobs
        .filter(job => !appliedJobIds.includes(job.id))
        .forEach(job => renderJobCard(job, grid));
}

function renderJobCard(job, container) {
    const card = document.createElement('div');
    card.className = 'job-card';
    
    // Calcular tiempo transcurrido
    const jobDate = new Date(job.date);
    const timeAgo = getTimeAgo(jobDate);
    
    card.innerHTML = `
        <div class="job-card-header">
            <h3>${job.title}</h3>
            <span class="time-ago">${timeAgo}</span>
        </div>
        <div class="job-card-company">
            <span class="company-name">${job.companyName || 'Empresa'}</span>
            <span class="location"><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
        </div>
        <div class="job-card-description">
            <p>${job.description}</p>
        </div>
        <div class="job-card-details">
            <span class="salary"><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>
            <span class="job-type"><i class="fas fa-briefcase"></i> ${job.type || 'Tiempo completo'}</span>
        </div>
        <div class="job-tags">
            ${(job.tags || []).map(tag => `
                <span class="job-tag">${tag}</span>
            `).join('')}
        </div>
        <div class="job-card-actions">
            <button class="apply-btn" onclick="handleJobApplication('${job.id}')">
                Postular
            </button>
            <button class="save-btn" onclick="saveJob('${job.id}')">
                <i class="far fa-bookmark"></i>
            </button>
        </div>
    `;
    
    container.appendChild(card);
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    const intervals = {
        año: 31536000,
        mes: 2592000,
        semana: 604800,
        día: 86400,
        hora: 3600,
        minuto: 60
    };
    
    for (let [unit, seconds] of Object.entries(intervals)) {
        const interval = Math.floor(diffInSeconds / seconds);
        
        if (interval >= 1) {
            return `Hace ${interval} ${unit}${interval > 1 ? 's' : ''}`;
        }
    }
    
    return 'Hace un momento';
}

function saveJob(jobId) {
    const currentUser = getCurrentUser();
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '{}');
    
    if (!savedJobs[currentUser.email]) {
        savedJobs[currentUser.email] = [];
    }
    
    if (!savedJobs[currentUser.email].includes(jobId)) {
        savedJobs[currentUser.email].push(jobId);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        createNotification(currentUser.email, 'Empleo guardado en favoritos');
    } else {
        savedJobs[currentUser.email] = savedJobs[currentUser.email].filter(id => id !== jobId);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        createNotification(currentUser.email, 'Empleo eliminado de favoritos');
    }
    
    // Actualizar vista
    filterAndDisplayJobs();
}

// Sistema de seguimiento de postulaciones
function updateApplicationStatus(applicationId, notes) {
    const application = DB.applications.find(a => a.id === applicationId);
    if (application) {
        application.notes = notes;
        application.lastUpdated = new Date().toISOString();
        
        // Actualizar vista de postulaciones
        loadOfertasAplicadas();
        
        createNotification(getCurrentUser().email, 
            'Notas de seguimiento actualizadas correctamente');
    }
}

// Exportar funciones adicionales
export {
    initializeJobFilters,
    filterAndDisplayJobs,
    saveJob,
    updateApplicationStatus
};