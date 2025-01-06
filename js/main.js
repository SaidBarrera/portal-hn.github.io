import { CONFIG } from './utils/config.js';
import { handleLogin, logout } from './modules/auth.js';
import { initializeTagSystem } from './modules/tags.js';
import { 
    initializeEmployerDashboard, 
    handleNewJob, 
    handleCandidateAction,
    viewCandidateProfile 
} from './modules/employer.js';
import { 
    initializeApplicantDashboard,
    handleJobApplication,
    handleInvitation 
} from './modules/applicant.js';

// Hacer las funciones disponibles globalmente
window.handleLogin = handleLogin;
window.logout = logout;
window.handleNewJob = handleNewJob;
window.handleCandidateAction = handleCandidateAction;
window.viewCandidateProfile = viewCandidateProfile;
window.handleJobApplication = handleJobApplication;
window.handleInvitation = handleInvitation;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Configurar listeners de autenticación
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.querySelectorAll('.logout').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    });

    // Inicializar sistema de tags
    initializeTagSystem();

    // Inicializar dashboards
    initializeEmployerDashboard();
    initializeApplicantDashboard();

    // Configurar actualización en tiempo real
    setInterval(() => {
        const empleadorDashboard = document.getElementById('empleadorDashboard');
        const solicitanteDashboard = document.getElementById('solicitanteDashboard');

        if (empleadorDashboard.style.display === 'flex') {
            // Actualizar dashboard empleador
            loadEmpleadorData();
        } else if (solicitanteDashboard.style.display === 'flex') {
            // Actualizar dashboard solicitante
            loadSolicitanteData();
        }
    }, CONFIG.updateInterval);
});