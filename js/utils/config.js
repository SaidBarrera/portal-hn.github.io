// Configuración de la aplicación
export const CONFIG = {
    itemsPerPage: 10,
    updateInterval: 5000, // 5 segundos
    toastDuration: 3000  // 3 segundos
};

// Base de datos simulada
export const DB = {
    users: [
        { email: 'empleador@test.com', password: '123456', type: 'empleador', name: 'Juan Empleador' },
        { email: 'solicitante@test.com', password: '123456', type: 'solicitante', name: 'Ana Solicitante' }
    ],
    jobs: [],
    applications: [],
    invitations: []
};

// Estado global de la aplicación
export const State = {
    currentPage: 1,
    selectedTags: new Set(),
    filteredApplications: [],
    currentUser: null
};