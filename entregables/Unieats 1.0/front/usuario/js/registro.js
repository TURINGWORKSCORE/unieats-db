document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar contraseñas coincidan
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }
            
            // Obtener datos del formulario
            const userData = {
                FIRST_NAME: document.getElementById('firstName').value,
                SECOND_NAME: document.getElementById('secondName').value,
                LAST_NAME: document.getElementById('lastName').value,
                SECOND_LAST_NAME: document.getElementById('secondLastName').value,
                CC_NUMBER: document.getElementById('ccNumber').value,
                INSTITUTIONAL_EMAIL: document.getElementById('email').value,
                ADDRESS: document.getElementById('address').value,
                PASSWORD: password,
                ROLE_ID: parseInt(document.getElementById('role').value)
            };
            
            // Validar que el correo termine en dominio universitario
            if (!userData.INSTITUTIONAL_EMAIL.endsWith('@universidadean.edu.co')) {
                alert('Por favor ingresa un correo institucional válido');
                return;
            }
            
            // Crear usuario (en la "base de datos" simulada)
            try {
                const newUser = db.createUser(userData);
                alert('Registro exitoso! Ahora puedes iniciar sesión');
                window.location.href = 'index.html';
            } catch (error) {
                alert('Error al registrar usuario: ' + error.message);
            }
        });
    }
});