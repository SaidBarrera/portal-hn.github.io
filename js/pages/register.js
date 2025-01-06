// Configuración de validaciones
const PASSWORD_REQUIREMENTS = {
    length: { regex: /.{8,}/, description: 'Al menos 8 caracteres' },
    uppercase: { regex: /[A-Z]/, description: 'Una letra mayúscula' },
    lowercase: { regex: /[a-z]/, description: 'Una letra minúscula' },
    number: { regex: /[0-9]/, description: 'Un número' }
};

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const userTypeSelector = document.getElementById('userTypeSelector');
    const userTypeInput = document.getElementById('userType');
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const employerFields = document.getElementById('employerFields');
    const applicantFields = document.getElementById('applicantFields');

    // Event Listeners
    setupUserTypeSelection();
    setupPasswordValidation();
    setupFormValidation();
    setupPasswordToggle();
});

function setupUserTypeSelection() {
    const buttons = document.querySelectorAll('.user-type-btn');
    const userTypeInput = document.getElementById('userType');
    const employerFields = document.getElementById('employerFields');
    const applicantFields = document.getElementById('applicantFields');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update hidden input
            const userType = btn.dataset.type;
            userTypeInput.value = userType;

            // Show/hide relevant fields
            if (userType === 'employer') {
                employerFields.style.display = 'block';
                applicantFields.style.display = 'none';
            } else {
                employerFields.style.display = 'none';
                applicantFields.style.display = 'block';
            }
        });
    });
}

function setupPasswordValidation() {
    const passwordInput = document.getElementById('password');
    const strengthMeter = document.querySelector('.strength-meter-fill');
    const requirements = document.querySelectorAll('.password-requirements li');

    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        let strength = 0;
        let reqCount = 0;

        // Check each requirement
        requirements.forEach(req => {
            const requirement = req.dataset.requirement;
            const regex = PASSWORD_REQUIREMENTS[requirement].regex;
            const isValid = regex.test(password);

            if (isValid) {
                req.classList.add('valid');
                reqCount++;
            } else {
                req.classList.remove('valid');
            }
        });

        // Update strength meter
        strength = (reqCount / Object.keys(PASSWORD_REQUIREMENTS).length) * 100;
        strengthMeter.style.width = `${strength}%`;

        if (strength <= 25) {
            strengthMeter.className = 'strength-meter-fill weak';
        } else if (strength <= 75) {
            strengthMeter.className = 'strength-meter-fill medium';
        } else {
            strengthMeter.className = 'strength-meter-fill strong';
        }
    });
}

function setupPasswordToggle() {
    const toggleBtns = document.querySelectorAll('.password-toggle');

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const input = e.currentTarget.parentNode.querySelector('input');
            const icon = e.currentTarget.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'far fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'far fa-eye';
            }
        });
    });
}

function setupFormValidation() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Aquí iría la llamada a la API para registrar al usuario
            // Por ahora, simularemos un registro exitoso
            showToast('Procesando registro...', 'info');

            // Simular delay de procesamiento
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Registro exitoso
            showToast('¡Registro exitoso!', 'success');

            // Redirigir al dashboard correspondiente
            setTimeout(() => {
                const dashboardUrl = data.userType === 'employer' 
                    ? '/pages/dashboard/employer.html'
                    : '/pages/dashboard/applicant.html';
                window.location.href = dashboardUrl;
            }, 1000);

        } catch (error) {
            showToast('Error en el registro: ' + error.message, 'error');
        }
    });
}

function validateForm() {
    const form = document.getElementById('registerForm');
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validar contraseñas
    if (password !== confirmPassword) {
        showToast('Las contraseñas no coinciden', 'error');
        return false;
    }

  // Validar requisitos de contraseña
  for (const [requirement, { regex }] of Object.entries(PASSWORD_REQUIREMENTS)) {
    if (!regex.test(password)) {
        showToast(`La contraseña debe contener ${PASSWORD_REQUIREMENTS[requirement].description}`, 'error');
        return false;
    }
}

// Validar campos específicos según el tipo de usuario
const userType = document.getElementById('userType').value;
if (userType === 'employer') {
    const companyName = document.getElementById('companyName').value;
    const companySize = document.getElementById('companySize').value;
    const industry = document.getElementById('industry').value;

    if (!companyName || !companySize || !industry) {
        showToast('Por favor completa todos los campos de la empresa', 'error');
        return false;
    }
} else {
    const profession = document.getElementById('profession').value;
    const experience = document.getElementById('experience').value;

    if (!profession || !experience) {
        showToast('Por favor completa todos los campos del perfil profesional', 'error');
        return false;
    }
}

return true;
}

function showToast(message, type = 'info') {
const toast = document.createElement('div');
toast.className = `toast toast-${type}`;
toast.textContent = message;

const container = document.querySelector('.toast-container');
container.appendChild(toast);

// Remover después de 3 segundos
setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
}, 3000);
}

// Funciones auxiliares para manejo de datos
function saveUserData(userData) {
localStorage.setItem('user', JSON.stringify({
    ...userData,
    id: Date.now().toString(), // Simulando un ID de usuario
    createdAt: new Date().toISOString()
}));
}

// Funciones para validación de campos en tiempo real
function setupRealTimeValidation() {
const form = document.getElementById('registerForm');
const inputs = form.querySelectorAll('input, select');

inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
            validateField(input);
        }
    });
});
}

function validateField(input) {
const value = input.value.trim();
let isValid = true;
let errorMessage = '';

switch (input.id) {
    case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        errorMessage = 'Ingresa un correo electrónico válido';
        break;

    case 'firstName':
    case 'lastName':
        isValid = value.length >= 2;
        errorMessage = 'Debe contener al menos 2 caracteres';
        break;

    case 'companyName':
        if (document.getElementById('userType').value === 'employer') {
            isValid = value.length >= 3;
            errorMessage = 'Ingresa el nombre de la empresa';
        }
        break;

    case 'profession':
        if (document.getElementById('userType').value === 'applicant') {
            isValid = value.length >= 3;
            errorMessage = 'Ingresa tu profesión';
        }
        break;
}

if (!isValid && value !== '') {
    input.classList.add('invalid');
    showFieldError(input, errorMessage);
} else {
    input.classList.remove('invalid');
    hideFieldError(input);
}

return isValid;
}

function showFieldError(input, message) {
let errorDiv = input.parentElement.querySelector('.field-error');
if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    input.parentElement.appendChild(errorDiv);
}
errorDiv.textContent = message;
}

function hideFieldError(input) {
const errorDiv = input.parentElement.querySelector('.field-error');
if (errorDiv) {
    errorDiv.remove();
}
}

// Función para manejar el flujo de registro
async function handleRegistration(formData) {
try {
    // Aquí iría la llamada a la API
    // Simulamos una llamada al backend
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simular respuesta exitosa
    const userData = {
        ...Object.fromEntries(formData.entries()),
        profileComplete: false,
        emailVerified: false
    };

    // Guardar datos del usuario
    saveUserData(userData);

    // Mostrar mensaje de éxito
    showToast('Registro exitoso', 'success');

    // Redirigir al usuario
    setTimeout(() => {
        const redirectUrl = userData.userType === 'employer'
            ? '/pages/dashboard/employer.html'
            : '/pages/dashboard/applicant.html';
        window.location.href = redirectUrl;
    }, 1500);

} catch (error) {
    showToast('Error en el registro: ' + error.message, 'error');
    throw error;
}
}

// Inicializar todas las validaciones y event listeners
setupRealTimeValidation();