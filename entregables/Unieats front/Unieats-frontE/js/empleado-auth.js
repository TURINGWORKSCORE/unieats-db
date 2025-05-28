document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya está autenticado
    if (localStorage.getItem('currentEmpleado') && 
        !window.location.pathname.endsWith('index.html')) {
        window.location.href = 'seleccion.html';
    }

    // Manejar formulario de login
    const loginForm = document.getElementById('empleadoLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                alert('Por favor complete todos los campos');
                return;
            }

            const empleado = empleadoDB.authenticateEmpleado(email, password);
            
            if (empleado) {
                // Guardar solo datos necesarios en localStorage
                const empleadoSession = {
                    id: empleado.id,
                    nombre: empleado.nombre,
                    email: empleado.email,
                    cafeId: empleado.cafeId
                };
                
                localStorage.setItem('currentEmpleado', JSON.stringify(empleadoSession));
                window.location.href = 'seleccion.html';
            } else {
                alert('Credenciales incorrectas. Por favor intente nuevamente.');
                document.getElementById('password').value = '';
            }
        });
    }
});