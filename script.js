// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('dataForm');
    const resultado = document.getElementById('resultado');
    
    // Función para mostrar mensajes
    function mostrarMensaje(mensaje, tipo) {
        resultado.textContent = mensaje;
        resultado.className = `resultado ${tipo}`;
        resultado.style.display = 'block';
        
        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            resultado.style.display = 'none';
        }, 5000);
    }
    
    // Función para validar email
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Función para validar teléfono (opcional)
    function validarTelefono(telefono) {
        if (!telefono) return true; // Es opcional
        const regex = /^[\d\s\-\+\(\)]+$/;
        return regex.test(telefono) && telefono.length >= 8;
    }
    
    // Función para limpiar el formulario
    function limpiarFormulario() {
        form.reset();
        // Limpiar estilos de validación
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '#e1e5e9';
            input.style.backgroundColor = '#fafafa';
        });
    }
    
    // Función para simular envío de datos
    function enviarDatos(datos) {
        // Simular una petición asíncrona
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simular éxito en el 90% de los casos
                if (Math.random() > 0.1) {
                    resolve({
                        success: true,
                        message: 'Datos enviados correctamente',
                        data: datos
                    });
                } else {
                    reject({
                        success: false,
                        message: 'Error al enviar los datos. Inténtalo de nuevo.'
                    });
                }
            }, 1500); // Simular delay de red
        });
    }
    
    // Función para procesar el formulario
    async function procesarFormulario(event) {
        event.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        const datos = {
            nombre: formData.get('nombre').trim(),
            email: formData.get('email').trim(),
            telefono: formData.get('telefono').trim(),
            mensaje: formData.get('mensaje').trim()
        };
        
        // Validaciones
        if (!datos.nombre) {
            mostrarMensaje('El nombre es obligatorio', 'error');
            document.getElementById('nombre').focus();
            return;
        }
        
        if (!datos.email) {
            mostrarMensaje('El email es obligatorio', 'error');
            document.getElementById('email').focus();
            return;
        }
        
        if (!validarEmail(datos.email)) {
            mostrarMensaje('Por favor, introduce un email válido', 'error');
            document.getElementById('email').focus();
            return;
        }
        
        if (!validarTelefono(datos.telefono)) {
            mostrarMensaje('Por favor, introduce un teléfono válido', 'error');
            document.getElementById('telefono').focus();
            return;
        }
        
        if (!datos.mensaje) {
            mostrarMensaje('El mensaje es obligatorio', 'error');
            document.getElementById('mensaje').focus();
            return;
        }
        
        // Deshabilitar el botón de envío
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        try {
            // Simular envío de datos
            const response = await enviarDatos(datos);
            
            if (response.success) {
                mostrarMensaje('¡Datos enviados correctamente! Te contactaremos pronto.', 'success');
                limpiarFormulario();
                
                // Mostrar datos en consola (para desarrollo)
                console.log('Datos enviados:', response.data);
            }
        } catch (error) {
            mostrarMensaje(error.message, 'error');
        } finally {
            // Rehabilitar el botón
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
    
    // Agregar evento de envío al formulario
    form.addEventListener('submit', procesarFormulario);
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#dc3545';
                this.style.backgroundColor = '#fff5f5';
            } else if (this.type === 'email' && this.value && !validarEmail(this.value)) {
                this.style.borderColor = '#dc3545';
                this.style.backgroundColor = '#fff5f5';
            } else if (this.type === 'tel' && this.value && !validarTelefono(this.value)) {
                this.style.borderColor = '#dc3545';
                this.style.backgroundColor = '#fff5f5';
            } else {
                this.style.borderColor = '#e1e5e9';
                this.style.backgroundColor = '#fafafa';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
            this.style.backgroundColor = 'white';
        });
    });
    
    // Mostrar mensaje de bienvenida
    console.log('Formulario de datos cargado correctamente');
});
