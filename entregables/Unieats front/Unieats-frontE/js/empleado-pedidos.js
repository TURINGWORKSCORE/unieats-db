// empleado/js/empleado-pedidos.js

/**
 * Carga y muestra los pedidos pendientes para la cafetería actual
 */
function cargarPedidosPendientes() {
    const empleado = JSON.parse(localStorage.getItem('currentEmpleado'));
    const cafeId = parseInt(localStorage.getItem('currentCafeteria'));
    
    if (!empleado || !cafeId) {
        window.location.href = 'seleccion.html';
        return;
    }
    
    // Obtener pedidos pendientes y en progreso
    const pedidosPendientes = empleadoDB.getPedidosByCafe(cafeId, 'PENDING');
    const pedidosEnProgreso = empleadoDB.getPedidosByCafe(cafeId, 'IN_PROGRESS');
    const todosPedidos = [...pedidosPendientes, ...pedidosEnProgreso]
        .sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
    
    const container = document.getElementById('pedidosContainer');
    
    if (todosPedidos.length === 0) {
        container.innerHTML = '<p class="no-pedidos">No hay pedidos pendientes</p>';
    } else {
        container.innerHTML = ''; // Limpiar contenedor
        
        todosPedidos.forEach(pedido => {
            const pedidoCard = crearCardPedido(pedido);
            container.appendChild(pedidoCard);
        });
    }
}

/**
 * Crea un elemento HTML para mostrar un pedido
 * @param {Object} pedido - Objeto con la información del pedido
 * @returns {HTMLElement} - Elemento HTML del pedido
 */
function crearCardPedido(pedido) {
    const pedidoCard = document.createElement('div');
    pedidoCard.className = 'pedido-card';
    pedidoCard.dataset.orderId = pedido.orderId;
    
    // Determinar clase de estado
    const estadoClass = pedido.status === 'PENDING' ? 'pendiente' : 'en-progreso';
    
    pedidoCard.innerHTML = `
        <div class="pedido-header">
            <h3>Pedido #${pedido.orderId}</h3>
            <span class="estado ${estadoClass}">
                ${pedido.status === 'PENDING' ? 'Pendiente' : 'En Progreso'}
            </span>
        </div>
        <div class="pedido-items">
            ${generarItemsPedido(pedido.items)}
        </div>
        <div class="pedido-total">
            <strong>Total: $${pedido.total.toLocaleString()}</strong>
        </div>
        <div class="pedido-footer">
            <small>${formatearFecha(pedido.orderDate)}</small>
        </div>
        <div class="acciones-pedido">
            ${generarBotonesAccion(pedido.status, pedido.orderId)}
        </div>
    `;
    
    return pedidoCard;
}

/**
 * Genera el HTML para los items de un pedido
 * @param {Array} items - Array de items del pedido
 * @returns {string} - HTML de los items
 */
function generarItemsPedido(items) {
    return items.map(item => `
        <div class="pedido-item">
            <div class="item-info">
                <span class="item-nombre">${item.name}</span>
                <span class="item-id">ID: ${item.productId}</span>
            </div>
            <div class="item-cantidad">
                ${item.quantity} x $${item.price.toLocaleString()}
            </div>
        </div>
    `).join('');
}

/**
 * Genera los botones de acción según el estado del pedido
 * @param {string} status - Estado actual del pedido
 * @param {number} orderId - ID del pedido
 * @returns {string} - HTML de los botones
 */
function generarBotonesAccion(status, orderId) {
    if (status === 'PENDING') {
        return `
            <button class="btn-accion btn-iniciar" data-order="${orderId}">Iniciar Preparación</button>
            <button class="btn-accion btn-rechazar" data-order="${orderId}">Rechazar Pedido</button>
        `;
    } else {
        return `
            <button class="btn-accion btn-listo" data-order="${orderId}">Marcar como Listo</button>
            <button class="btn-accion btn-finalizar" data-order="${orderId}">Finalizar Pedido</button>
        `;
    }
}

/**
 * Formatea una fecha para mostrarla de manera legible
 * @param {string} fechaStr - Cadena de fecha
 * @returns {string} - Fecha formateada
 */
function formatearFecha(fechaStr) {
    const opciones = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(fechaStr).toLocaleDateString('es-ES', opciones);
}

/**
 * Maneja el evento de marcar pedido como listo
 * @param {number} orderId - ID del pedido
 */
function manejarPedidoListo(orderId) {
    if (confirm('¿Marcar este pedido como listo para entrega?')) {
        // Simular envío de notificación al cliente
        console.log(`Notificación enviada al cliente sobre el pedido #${orderId}`);
        
        // En una implementación real, aquí iría una llamada AJAX al servidor
        alert(`El cliente ha sido notificado que su pedido #${orderId} está listo`);
    }
}

/**
 * Maneja el evento de finalizar un pedido
 * @param {number} orderId - ID del pedido
 */
function manejarFinalizarPedido(orderId) {
    if (confirm('¿Finalizar este pedido marcándolo como completado?')) {
        if (empleadoDB.updatePedidoStatus(orderId, 'COMPLETED')) {
            // Actualizar la vista
            const pedidoCard = document.querySelector(`.pedido-card[data-order-id="${orderId}"]`);
            if (pedidoCard) {
                pedidoCard.remove();
                actualizarContadorPedidos();
            }
            alert(`Pedido #${orderId} marcado como completado`);
        } else {
            alert('Error al actualizar el estado del pedido');
        }
    }
}

/**
 * Maneja el evento de iniciar preparación de un pedido
 * @param {number} orderId - ID del pedido
 */
function manejarIniciarPreparacion(orderId) {
    if (empleadoDB.updatePedidoStatus(orderId, 'IN_PROGRESS')) {
        // Recargar los pedidos para reflejar el cambio
        cargarPedidosPendientes();
        alert(`Preparación del pedido #${orderId} iniciada`);
    } else {
        alert('Error al actualizar el estado del pedido');
    }
}

/**
 * Maneja el evento de rechazar un pedido
 * @param {number} orderId - ID del pedido
 */
function manejarRechazarPedido(orderId) {
    const motivo = prompt('Ingrese el motivo del rechazo:');
    if (motivo) {
        if (empleadoDB.updatePedidoStatus(orderId, 'CANCELLED')) {
            // Enviar notificación al cliente (simulado)
            console.log(`Pedido #${orderId} rechazado. Motivo: ${motivo}`);
            
            // Actualizar la vista
            const pedidoCard = document.querySelector(`.pedido-card[data-order-id="${orderId}"]`);
            if (pedidoCard) {
                pedidoCard.remove();
                actualizarContadorPedidos();
            }
            alert(`Pedido #${orderId} ha sido rechazado. El cliente será notificado.`);
        } else {
            alert('Error al actualizar el estado del pedido');
        }
    }
}

/**
 * Actualiza el contador de pedidos pendientes
 */
function actualizarContadorPedidos() {
    const cafeId = parseInt(localStorage.getItem('currentCafeteria'));
    const pendientes = empleadoDB.getPedidosByCafe(cafeId, 'PENDING').length;
    const enProgreso = empleadoDB.getPedidosByCafe(cafeId, 'IN_PROGRESS').length;
    
    document.getElementById('contador-pedidos').textContent = `Pendientes: ${pendientes} | En progreso: ${enProgreso}`;
}

/**
 * Configura los event listeners para los botones de acción
 */
function configurarEventListeners() {
    // Delegación de eventos para los botones dinámicos
    document.addEventListener('click', function(e) {
        const target = e.target;
        const orderId = parseInt(target.dataset.order);
        
        if (!orderId) return;
        
        if (target.classList.contains('btn-listo')) {
            manejarPedidoListo(orderId);
        } else if (target.classList.contains('btn-finalizar')) {
            manejarFinalizarPedido(orderId);
        } else if (target.classList.contains('btn-iniciar')) {
            manejarIniciarPreparacion(orderId);
        } else if (target.classList.contains('btn-rechazar')) {
            manejarRechazarPedido(orderId);
        }
    });
    
    // Botón de historial
    document.getElementById('historialBtn').addEventListener('click', function() {
        window.location.href = 'historial.html';
    });
    
    // Botón de cerrar sesión
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('currentEmpleado');
        localStorage.removeItem('currentCafeteria');
        window.location.href = '../index.html';
    });
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    cargarPedidosPendientes();
    configurarEventListeners();
});