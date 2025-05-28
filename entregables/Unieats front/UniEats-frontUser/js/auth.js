document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya está autenticado
    if (localStorage.getItem('currentUser') && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'pedidos.html';
    }
    
    // Manejar formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Autenticar usuario
            const user = db.authenticateUser(username, password);
            
            if (user) {
                // Guardar usuario en localStorage (simulando sesión)
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Redirigir a página de pedidos
                window.location.href = 'pedidos.html';
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        });
    }
    
    // Manejar botón de recuperar contraseña
    const forgotPassword = document.getElementById('forgotPassword');
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Por ahora esta funcionalidad no está disponible. Por favor contacte al administrador.');
        });
    }
    
    // Manejar cierre de sesión
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentOrder');
        window.location.href = 'index.html';
    });
}

    // Cerrar sesión si estamos en la página de agradecimiento
    if (window.location.pathname.endsWith('gracias.html')) {
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', function() {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('currentOrder');
                window.location.href = 'index.html';
            });
        }
    }
});