document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    if (!localStorage.getItem('currentUser') && !window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
        return;
    }
    
    // Obtener elementos del DOM
    const cafeteriaSelect = document.getElementById('cafeteria');
    const orderItemsContainer = document.getElementById('orderItems');
    const addItemBtn = document.getElementById('addItemBtn');
    const orderForm = document.getElementById('orderForm');
    const orderSummary = document.getElementById('orderSummary');
    const totalAmountSpan = document.getElementById('totalAmount');
    
    // Variables para manejar el pedido
    let currentOrder = {
        items: [],
        cafeteriaId: null,
        total: 0
    };

    // Cargar cafeterías
    function loadCafeterias() {
        const cafes = db.getCafes();
        cafeteriaSelect.innerHTML = '<option value="">Seleccione una cafetería</option>';
        
        cafes.forEach(cafe => {
            const option = document.createElement('option');
            option.value = cafe.CAFE_ID;
            option.textContent = cafe.CAFE_NAME;
            cafeteriaSelect.appendChild(option);
        });
    }

    // Cargar categorías basadas en cafetería seleccionada
    function loadCategories(cafeId, selectElement) {
        const categories = db.getCategoriesByCafe(cafeId);
        
        selectElement.innerHTML = '<option value="">Seleccione una categoría</option>';
        selectElement.disabled = false;
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.CATEGORY_ID;
            option.textContent = category.CATEGORY_NAME;
            selectElement.appendChild(option);
        });
    }

    // Cargar productos basados en categoría seleccionada
    function loadProducts(categoryId, cafeId, selectElement, itemId) {
        const products = db.getProductsByCategoryAndCafe(categoryId, cafeId);
        
        selectElement.innerHTML = '<option value="">Seleccione un producto</option>';
        selectElement.disabled = false;
        
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.PRODUCT_ID;
            option.textContent = product.PRODUCT_NAME;
            selectElement.appendChild(option);
        });

        // Actualizar información del producto cuando se selecciona
        selectElement.addEventListener('change', function() {
            const productId = this.value;
            if (productId) {
                updateProductInfo(productId, itemId);
            }
        });
    }

    // Actualizar información del producto seleccionado
    function updateProductInfo(productId, itemId) {
        const product = db.getProductById(parseInt(productId));
        const itemElement = document.querySelector(`.order-item[data-item-id="${itemId}"]`);
        
        if (product && itemElement) {
            itemElement.querySelector('.product-description span').textContent = product.P_DESCRIPTION || 'Sin descripción';
            itemElement.querySelector('.product-stock span').textContent = product.STOCK;
            itemElement.querySelector('.product-price span').textContent = product.PRICE.toLocaleString();
            
            const quantityInput = itemElement.querySelector('input[type="number"]');
            quantityInput.max = product.STOCK;
            quantityInput.value = 1;
            
            updateOrderItem(itemId, product, 1);
        }
    }

    // Actualizar un ítem en la orden actual
    function updateOrderItem(itemId, product, quantity) {
        const existingItemIndex = currentOrder.items.findIndex(item => item.id === itemId);
        
        const itemData = {
            id: itemId,
            productId: product.PRODUCT_ID,
            productName: product.PRODUCT_NAME,
            price: product.PRICE,
            quantity: quantity,
            subtotal: product.PRICE * quantity
        };
        
        if (existingItemIndex >= 0) {
            currentOrder.items[existingItemIndex] = itemData;
        } else {
            currentOrder.items.push(itemData);
        }
        
        updateOrderTotal();
    }

    // Calcular total de la orden
    function updateOrderTotal() {
        currentOrder.total = currentOrder.items.reduce((sum, item) => sum + item.subtotal, 0);
        totalAmountSpan.textContent = currentOrder.total.toLocaleString();
        updateOrderSummary();
    }

    // Actualizar resumen de la orden
    function updateOrderSummary() {
        orderSummary.innerHTML = '';
        
        if (currentOrder.items.length === 0) {
            orderSummary.innerHTML = '<p>No hay productos en tu pedido</p>';
            return;
        }
        
        const table = document.createElement('table');
        table.className = 'order-summary-table';
        
        // Cabecera
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
            </tr>
        `;
        table.appendChild(thead);
        
        // Cuerpo
        const tbody = document.createElement('tbody');
        currentOrder.items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toLocaleString()}</td>
                <td>$${item.subtotal.toLocaleString()}</td>
            `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        
        orderSummary.appendChild(table);
    }

    // Configurar eventos para un ítem de pedido
    function setupOrderItemEventListeners(itemId, itemElement) {
        const categorySelect = itemElement.querySelector('.category-select');
        const productSelect = itemElement.querySelector('.product-select');
        const quantityInput = itemElement.querySelector('input[type="number"]');
        const removeBtn = itemElement.querySelector('.remove-item-btn');
        
        // Si ya hay cafetería seleccionada, cargar categorías
        if (currentOrder.cafeteriaId) {
            loadCategories(currentOrder.cafeteriaId, categorySelect);
        }
        
        // Cuando cambia la categoría
        categorySelect.addEventListener('change', function() {
            if (this.value && currentOrder.cafeteriaId) {
                loadProducts(this.value, currentOrder.cafeteriaId, productSelect, itemId);
            }
        });
        
        // Cuando cambia la cantidad
        quantityInput.addEventListener('change', function() {
            const productId = productSelect.value;
            if (productId) {
                const product = db.getProductById(parseInt(productId));
                updateOrderItem(itemId, product, parseInt(this.value));
            }
        });
        
        // Manejar botón de eliminar (solo para ítems adicionales)
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                currentOrder.items = currentOrder.items.filter(item => item.id !== itemId);
                itemElement.remove();
                updateOrderTotal();
            });
        }
    }

    // Crear un nuevo ítem de pedido (para botón "Añadir otro producto")
    function createNewOrderItem(itemId) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.dataset.itemId = itemId;
        
        itemDiv.innerHTML = `
            <div class="form-group">
                <label for="category${itemId}">Categoría:</label>
                <select id="category${itemId}" class="category-select" required disabled>
                    <option value="">Seleccione una categoría</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="product${itemId}">Producto:</label>
                <select id="product${itemId}" class="product-select" required disabled>
                    <option value="">Seleccione un producto</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="quantity${itemId}">Cantidad:</label>
                <input type="number" id="quantity${itemId}" min="1" value="1" required>
            </div>
            
            <div class="product-info">
                <p class="product-description">Descripción: <span></span></p>
                <p class="product-stock">Disponibles: <span></span></p>
                <p class="product-price">Precio unitario: $<span></span></p>
            </div>
            
            <button type="button" class="btn btn-danger remove-item-btn">Eliminar</button>
        `;
        
        orderItemsContainer.appendChild(itemDiv);
        setupOrderItemEventListeners(itemId, itemDiv);
    }

    // Evento cuando cambia la cafetería seleccionada
    cafeteriaSelect.addEventListener('change', function() {
        const cafeId = this.value;
        if (cafeId) {
            currentOrder.cafeteriaId = cafeId;
            
            // Habilitar categorías para todos los ítems
            document.querySelectorAll('.category-select').forEach(select => {
                loadCategories(cafeId, select);
            });
        }
    });

    // Evento para añadir nuevo ítem
    addItemBtn.addEventListener('click', function() {
        const itemId = Date.now(); // ID único basado en timestamp
        createNewOrderItem(itemId);
    });

    // Evento para enviar el pedido
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (currentOrder.items.length === 0) {
            alert('Debes agregar al menos un producto a tu pedido');
            return;
        }
        
        const invalidItems = currentOrder.items.some(item => item.quantity < 1);
        if (invalidItems) {
            alert('Por favor revisa las cantidades de los productos');
            return;
        }
        
        localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
        window.location.href = 'compra.html';
    });

    // Evento para ver pedidos en curso
    const currentOrdersBtn = document.getElementById('currentOrdersBtn');
    if (currentOrdersBtn) {
        currentOrdersBtn.addEventListener('click', function() {
            alert('Esta funcionalidad estará disponible en la siguiente versión');
        });
    }

    // Configurar el ítem inicial
    const initialItem = document.querySelector('.order-item');
    if (initialItem) {
        setupOrderItemEventListeners(initialItem.dataset.itemId, initialItem);
    }

    // Inicializar página
    loadCafeterias();
});