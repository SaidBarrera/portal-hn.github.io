import { DB, State } from '../utils/config.js';
import { clearTags } from './tags.js';

export function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;

    const user = DB.users.find(u => 
        u.email === email && 
        u.password === password && 
        u.type === userType
    );

    if (user) {
        State.currentUser = user;
        showDashboard(user);
    } else {
        alert('Credenciales inválidas');
    }
}

function showDashboard(user) {
    document.getElementById('loginContainer').style.display = 'none';
    if (user.type === 'empleador') {
        document.getElementById('empleadorDashboard').style.display = 'flex';
        document.getElementById('empleadorName').textContent = user.name;
        // Cargar datos del empleador
    } else {
        document.getElementById('solicitanteDashboard').style.display = 'flex';
        document.getElementById('solicitanteName').textContent = user.name;
        // Cargar datos del solicitante
    }
}

export function logout() {
    document.getElementById('empleadorDashboard').style.display = 'none';
    document.getElementById('solicitanteDashboard').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'flex';
    document.getElementById('loginForm').reset();
    clearTags();
    State.currentUser = null;
}

export function getCurrentUser() {
    return State.currentUser;
}