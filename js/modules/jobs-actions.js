// Manejador de acciones para los empleos
import { jobsState, refreshJobsTable } from './jobs-management.js';
import { showToast } from '../utils/notifications.js';

export function handleJobActions() {
    // Editar empleo
    window.editJob = function(jobId) {
        const job = jobsState.jobs.find(j => j.id === jobId);
        if (!job) return;

        const modal = document.getElementById('jobModal');
        const form = document.getElementById('jobForm');
        
        // Llenar el formulario con los datos del empleo
        fillJobForm(form, job);
        
        // Mostrar modal
        modal.classList.add('show');
    }

    // Eliminar empleo
    window.deleteJob = function(jobId) {
        if (!confirm('¿Estás seguro de que deseas eliminar este empleo?')) {
            return;
        }

        const index = jobsState.jobs.findIndex(j => j.id === jobId);
        if (index !== -1) {
            jobsState.jobs.splice(index, 1);
            refreshJobsTable();
            showToast('Empleo eliminado exitosamente', 'success');
        }
    }

    // Cambiar estado del empleo
    window.toggleJobStatus = function(jobId) {
        const job = jobsState.jobs.find(j => j.id === jobId);
        if (!job) return;

        const statusMap = {
            active: 'paused',
            paused: 'active',
            closed: 'closed'
        };

        job.status = statusMap[job.status];
        refreshJobsTable();
        
        const statusText = job.status === 'active' ? 'activado' : 'pausado';
        showToast(`Empleo ${statusText} exitosamente`, 'success');
    }
}

// Función auxiliar para llenar el formulario de edición
function fillJobForm(form, job) {
    // Datos básicos
    form.title.value = job.title;
    form.location.value = job.location;
    form.type.value = job.type;
    form.description.value = job.description || '';

    // Salario
    if (job.salary) {
        form.salaryMin.value = job.salary.min || '';
        form.salaryMax.value = job.salary.max || '';
    }

    // Tags y requisitos si existen
    const benefitsContainer = document.getElementById('benefitsTags');
    const requirementsContainer = document.getElementById('requirementsTags');

    if (benefitsContainer && job.benefits) {
        clearTags(benefitsContainer);
        job.benefits.forEach(benefit => addTag(benefitsContainer, benefit));
    }

    if (requirementsContainer && job.requirements) {
        clearTags(requirementsContainer);
        job.requirements.forEach(req => addTag(requirementsContainer, req));
    }

    // Marcar como edición
    form.dataset.editId = job.id;
}

// Funciones para manejar los tags
function clearTags(container) {
    const tagsDiv = container.querySelector('.tags-container');
    if (tagsDiv) {
        tagsDiv.innerHTML = '';
    }
}

function addTag(container, text) {
    const tagsDiv = container.querySelector('.tags-container');
    if (!tagsDiv) return;

    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.innerHTML = `
        <span>${text}</span>
        <button type="button" onclick="this.parentElement.remove()">×</button>
    `;
    tagsDiv.appendChild(tag);
}

// Exportar funciones auxiliares
export {
    fillJobForm,
    clearTags,
    addTag
};