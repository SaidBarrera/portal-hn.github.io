// js/main-employer-dashboard.js
import { initializeJobsManagement } from './modules/jobs-management.js';
import { setupTagsInput } from './modules/tags.js';
import { exportJobs } from './modules/export.js';
import { handleJobActions } from '../modules/jobs-actions.js';
import * as jobsAdditional from './modules/jobs-management-additional.js';
import { showToast, showNotification } from '../utils/notifications.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeJobsManagement();
    handleJobActions();
});

class EmployerDashboard {
    constructor() {
        this.initializeModules();
        this.setupEventListeners();
    }

    initializeModules() {
        // Inicializar gestión de empleos
        initializeJobsManagement();

        // Inicializar sistema de tags
        setupTagsInput('benefitsTags');
        setupTagsInput('requirementsTags');

        // Hacer funciones disponibles globalmente
        this.exposeGlobalFunctions();
    }

    setupEventListeners() {
        // Escuchadores para el menú lateral
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });

        // Escuchadores para filtros
        const searchInput = document.getElementById('jobSearch');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearch.bind(this));
        }

        // Escuchadores para modales
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.querySelector('.close-modal')?.addEventListener('click', 
                () => this.closeModal(modal));
        });
    }

    exposeGlobalFunctions() {
        window.editJob = jobsAdditional.editJob;
        window.deleteJob = jobsAdditional.deleteJob;
        window.toggleJobStatus = jobsAdditional.toggleJobStatus;
        window.exportJobs = exportJobs;
    }

    handleNavigation(e) {
        e.preventDefault();
        const section = e.currentTarget.getAttribute('href').substring(1);
        this.showSection(section);
    }

    handleSearch(e) {
        // Implementar lógica de búsqueda
    }

    showSection(sectionId) {
        // Ocultar todas las secciones
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.style.display = 'none';
        });

        // Mostrar la sección seleccionada
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.style.display = 'block';
        }
    }

    closeModal(modal) {
        modal.style.display = 'none';
    }
}

// Inicializar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new EmployerDashboard();
});