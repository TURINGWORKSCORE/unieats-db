document.addEventListener('DOMContentLoaded', function () {
    // Verificar si ya está autenticado
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && window.location.pathname.endsWith('index.html')) {
        const userData = JSON.parse(currentUser);
        if (userData.role === 'usuario') {
            window.location.href = '/front/usuario/menu.html';
        } else if (userData.role === 'empleado') {
            window.location.href = '/front/empleado/menu.html';
        }
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    // Guardar usuario en localStorage
                    localStorage.setItem('currentUser', JSON.stringify({
                        email: email,
                        role: data.role
                    }));

                    // Redirigir al menú correspondiente
                    if (data.role === 'usuario') {
                        window.location.href = '/front/usuario/menu.html';
                    } else {
                        window.location.href = '/front/empleado/menu.html';
                    }
                } else {
                    alert('Credenciales incorrectas');
                }
            })
            .catch(err => {
                console.error('Error de autenticación:', err);
                alert('Error en la conexión con el servidor.');
            });
        });
    }

    // Botón de recuperar contraseña
    const forgotPassword = document.getElementById('forgotPassword');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function (e) {
            e.preventDefault();
            alert('Por ahora esta funcionalidad no está disponible. Por favor contacte al administrador.');
        });
    }

    // Cierre de sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentOrder');
            window.location.href = 'index.html';
        });
    }

    if (window.location.pathname.endsWith('gracias.html')) {
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', function () {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('currentOrder');
                window.location.href = 'index.html';
            });
        }
    }
});
