document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('currentUser')) {
        window.location.href = 'index.html';
        return;
    }
    
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder')) || { items: [], total: 0 };
    const orderDetails = document.getElementById('orderDetails');
    const orderTotalSpan = document.getElementById('orderTotal');
    const backButton = document.getElementById('backButton');
    const cancelButton = document.getElementById('cancelButton');
    const payButton = document.getElementById('payButton');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    
    // Mostrar detalles del pedido
    function displayOrderDetails() {
        if (currentOrder.items.length === 0) {
            orderDetails.innerHTML = '<p>No hay productos en tu pedido</p>';
            return;
        }
        
        const table = document.createElement('table');
        table.className = 'order-details-table';
        
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                ${currentOrder.items.map(item => `
                    <tr>
                        <td>${item.productName}</td>
                        <td>${item.quantity}</td>
                        <td>$${item.price.toLocaleString()}</td>
                        <td>$${item.subtotal.toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        
        orderDetails.innerHTML = '';
        orderDetails.appendChild(table);
        orderTotalSpan.textContent = currentOrder.total.toLocaleString();
    }
    
    // Cargar métodos de pago
    function loadPaymentMethods() {
        paymentMethodSelect.innerHTML = '<option value="">Seleccione un método</option>';
        db.getPaymentMethods().forEach(method => {
            const option = document.createElement('option');
            option.value = method.PAYMENT_METHOD_ID;
            option.textContent = method.METHOD_NAME;
            paymentMethodSelect.appendChild(option);
        });
    }
    
    // Botón Regresar
    backButton.addEventListener('click', () => {
        window.location.href = 'pedidos.html';
    });
    
    // Botón Cancelar
    cancelButton.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas cancelar este pedido? Se perderán todos los datos.')) {
            localStorage.removeItem('currentOrder');
            window.location.href = 'pedidos.html';
        }
    });
    
    // Botón Pagar
    payButton.addEventListener('click', () => {
        const paymentMethod = paymentMethodSelect.value;
        
        if (!paymentMethod) {
            alert('Por favor selecciona un método de pago');
            return;
        }
        
        const paymentResult = db.createOrder({
            ...currentOrder,
            paymentMethod: parseInt(paymentMethod),
            userId: JSON.parse(localStorage.getItem('currentUser')).USER_ID
        });
        
        if (paymentResult.success) {
            localStorage.removeItem('currentOrder');
            window.location.href = 'gracias.html';
        } else {
            alert('Hubo un error al procesar tu pago: ' + paymentResult.message);
        }
    });
    
    // Inicializar
    displayOrderDetails();
    loadPaymentMethods();
});