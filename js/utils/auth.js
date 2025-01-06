// Funciones de utilidad para autenticación
export function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        redirectToLogin();
        return null;
    }
    return JSON.parse(user);
}

export function logout() {
    // Limpiar datos de usuario
    localStorage.removeItem('user');
    
    // Limpiar cualquier otro dato de la sesión
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirigir al login
    redirectToLogin();
}

export function redirectToLogin() {
    window.location.href = '/pages/login.html';
}

export function getUserProfile() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}