// Datos de ejemplo (en una aplicación real, esto estaría en el backend)
const users = [
    {
        email: 'empleador@test.com',
        password: '123456',
        type: 'employer',
        name: 'Juan Empleador'
    },
    {
        email: 'solicitante@test.com',
        password: '123456',
        type: 'applicant',
        name: 'Ana Solicitante'
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const userTypeBtns = document.querySelectorAll('.user-type-btn');
    const userTypeInput = document.getElementById('userType');
    const loginForm = document.getElementById('loginForm');
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.querySelector('input[type="password"]');

    // Manejar selección de tipo de usuario
    userTypeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remover clase active de todos los botones
            userTypeBtns.forEach(b => b.classList.remove('active'));
            // Agregar clase active al botón clickeado
            btn.classList.add('active');
            // Actualizar el valor del input hidden
            userTypeInput.value = btn.dataset.type;
        });
    });

    // Toggle de contraseña
    passwordToggle?.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        passwordToggle.innerHTML = type === 'password' ? 
            '<i class="far fa-eye"></i>' : 
            '<i class="far fa-eye-slash"></i>';
    });

    // Manejar envío del formulario
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            userType: userTypeInput.value
        };

        try {
            // Simular autenticación
            const user = authenticateUser(formData);
            
            if (user) {
                // Guardar datos del usuario
                localStorage.setItem('user', JSON.stringify(user));
                
                // Mostrar mensaje de éxito
                showToast('Inicio de sesión exitoso', 'success');
                
                // Redireccionar según el tipo de usuario
                setTimeout(() => {
                    const dashboardUrl = user.type === 'employer' 
                        ? '/pages/dashboard/employer.html'
                        : '/pages/dashboard/applicant.html';
                    window.location.href = dashboardUrl;
                }, 1000);
            }
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
});

// Función para autenticar usuario
function authenticateUser({ email, password, userType }) {
    const user = users.find(u => 
        u.email === email && 
        u.password === password && 
        u.type === userType
    );

    if (!user) {
        throw new Error('Credenciales inválidas');
    }

    return user;
}

// Función para mostrar mensajes toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    const container = document.querySelector('.toast-container');
    container.appendChild(toast);

    // Remover el toast después de 3 segundos
    setTimeout(() => {
        toast.remove();
    }, 3000);
}