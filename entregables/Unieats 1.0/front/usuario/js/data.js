// Simulamos la base de datos con objetos JavaScript
const db = {
    // Roles
    roles: [
        { ROLE_ID: 1, ROLE_NAME: 'Estudiante' },
        { ROLE_ID: 2, ROLE_NAME: 'Profesor' },
        { ROLE_ID: 3, ROLE_NAME: 'Administrativo' },
        { ROLE_ID: 4, ROLE_NAME: 'Colaborador' }
    ],
    
    // Cafeterías
    cafes: [
        { CAFE_ID: 1, CAFE_NAME: 'Cafeteria Principal', CAFE_LOCATION: 'EAN Legacy, Piso 1', COMPANY_NAME: 'Cafeteria 1' },
        { CAFE_ID: 2, CAFE_NAME: 'Cafeteria 6 Piso', CAFE_LOCATION: 'EAN Legacy, Piso 6', COMPANY_NAME: 'Cafeteria2' },
        { CAFE_ID: 3, CAFE_NAME: 'Cafeteria 4 Piso', CAFE_LOCATION: 'EAN Legacy, Piso 4', COMPANY_NAME: 'Cafeteria 3' },
        { CAFE_ID: 4, CAFE_NAME: 'Cafeteria 4-2 Piso', CAFE_LOCATION: 'EAN Nogal, Piso 4', COMPANY_NAME: 'Cafeteria 4' }
    ],
    
    // Categorías
    categories: [
        { CATEGORY_ID: 1, CATEGORY_NAME: 'Bebidas calientes' },
        { CATEGORY_ID: 2, CATEGORY_NAME: 'Bebidas frías' },
        { CATEGORY_ID: 3, CATEGORY_NAME: 'Desayunos' },
        { CATEGORY_ID: 4, CATEGORY_NAME: 'Almuerzos' },
        { CATEGORY_ID: 5, CATEGORY_NAME: 'Comidas rápidas' },
        { CATEGORY_ID: 6, CATEGORY_NAME: 'Postres' },
        { CATEGORY_ID: 7, CATEGORY_NAME: 'Ensaladas' },
        { CATEGORY_ID: 8, CATEGORY_NAME: 'Combos' },
        { CATEGORY_ID: 9, CATEGORY_NAME: 'Productos saludables' },
        { CATEGORY_ID: 10, CATEGORY_NAME: 'Otros' }
    ],
    
    // Productos (solo algunos para ejemplo)
    products: [
        // Cafetería 1
        { PRODUCT_ID: 1001, CATEGORY_ID: 1, CAFE_ID: 1, PRODUCT_NAME: 'Café americano', P_DESCRIPTION: 'Café negro servido caliente sin azúcar.', PRICE: 3000, STOCK: 120 },
        { PRODUCT_ID: 1002, CATEGORY_ID: 1, CAFE_ID: 1, PRODUCT_NAME: 'Chocolate caliente', P_DESCRIPTION: 'Bebida espesa con cacao, leche y azúcar.', PRICE: 3500, STOCK: 80 },
        { PRODUCT_ID: 1003, CATEGORY_ID: 2, CAFE_ID: 1, PRODUCT_NAME: 'Avena Alpina con canela', P_DESCRIPTION: 'Avena fría saborizada con canela.', PRICE: 2500, STOCK: 100 },
        { PRODUCT_ID: 1006, CATEGORY_ID: 4, CAFE_ID: 1, PRODUCT_NAME: 'Arroz con pollo (buffet)', P_DESCRIPTION: 'Plato completo servido por el mesero.', PRICE: 10000, STOCK: 50 },
        { PRODUCT_ID: 1009, CATEGORY_ID: 5, CAFE_ID: 1, PRODUCT_NAME: 'Empanada de carne', P_DESCRIPTION: 'Empanada frita rellena con carne molida.', PRICE: 2000, STOCK: 180 },
        
        // Cafetería 2
        { PRODUCT_ID: 2001, CATEGORY_ID: 1, CAFE_ID: 2, PRODUCT_NAME: 'Café espresso', P_DESCRIPTION: 'Café concentrado en porción individual.', PRICE: 2800, STOCK: 80 },
        { PRODUCT_ID: 2004, CATEGORY_ID: 4, CAFE_ID: 2, PRODUCT_NAME: 'Lasaña de de carne', P_DESCRIPTION: 'Lasaña con pollo y queso gratinado.', PRICE: 10500, STOCK: 35 },
        { PRODUCT_ID: 2006, CATEGORY_ID: 5, CAFE_ID: 2, PRODUCT_NAME: 'Empanada de pollo', P_DESCRIPTION: 'Empanada de pollo.', PRICE: 2000, STOCK: 150 },
        
        // Cafetería 3
        { PRODUCT_ID: 3001, CATEGORY_ID: 1, CAFE_ID: 3, PRODUCT_NAME: 'Café con leche', P_DESCRIPTION: 'Café negro con leche caliente.', PRICE: 3200, STOCK: 90 },
        { PRODUCT_ID: 3005, CATEGORY_ID: 5, CAFE_ID: 3, PRODUCT_NAME: 'Empanada de pollo', P_DESCRIPTION: 'Empanada frita rellena con pollo.', PRICE: 2000, STOCK: 150 },
        
        // Cafetería 4
        { PRODUCT_ID: 4001, CATEGORY_ID: 1, CAFE_ID: 4, PRODUCT_NAME: 'Té negro', P_DESCRIPTION: 'Té caliente fuerte con cafeína.', PRICE: 2800, STOCK: 70 },
        { PRODUCT_ID: 4005, CATEGORY_ID: 5, CAFE_ID: 4, PRODUCT_NAME: 'Pastel de pollo', P_DESCRIPTION: 'Hojaldre relleno de pollo.', PRICE: 2500, STOCK: 130 }
    ],
    
    // Métodos de pago
    paymentMethods: [
        { PAYMENT_METHOD_ID: 1, METHOD_NAME: 'Efectivo' },
        { PAYMENT_METHOD_ID: 2, METHOD_NAME: 'Tarjeta de Crédito' },
        { PAYMENT_METHOD_ID: 3, METHOD_NAME: 'Tarjeta Débito' }
    ],
    
    // Usuarios (solo algunos para ejemplo)
    users: [
        { 
            USER_ID: 1, 
            FIRST_NAME: 'Luciana', 
            SECOND_NAME: 'Marcela', 
            LAST_NAME: 'Medina', 
            SECOND_LAST_NAME: 'Jiménez', 
            CC_NUMBER: '10000001', 
            INSTITUTIONAL_EMAIL: 'luciana.medina1@universidadean.edu.co', 
            ADDRESS: 'Calle 49 #24-22', 
            PASSWORD: '987654', 
            ROLE_ID: 2 
        },
        // Más usuarios pueden agregarse aquí
    ],
    
    // Funciones para simular consultas a la base de datos
    getCafes: function() {
        return this.cafes;
    },
    
    getCategoriesByCafe: function(cafeId) {
        // Obtener productos de esta cafetería
        const cafeProducts = this.products.filter(p => p.CAFE_ID == cafeId);
        
        // Obtener IDs de categorías únicas
        const categoryIds = [...new Set(cafeProducts.map(p => p.CATEGORY_ID))];
        
        // Obtener objetos completos de categorías
        return this.categories.filter(c => categoryIds.includes(c.CATEGORY_ID));
    },
    
    getProductsByCategoryAndCafe: function(categoryId, cafeId) {
        return this.products.filter(p => p.CATEGORY_ID == categoryId && p.CAFE_ID == cafeId);
    },
    
    getProductById: function(productId) {
        return this.products.find(p => p.PRODUCT_ID == productId);
    },
    
    getPaymentMethods: function() {
        return this.paymentMethods;
    },
    
    authenticateUser: function(username, password) {
        // En una implementación real, esto sería una consulta a la base de datos
        const user = this.users.find(u => 
            (u.INSTITUTIONAL_EMAIL === username || u.CC_NUMBER === username) && 
            u.PASSWORD === password
        );
        
        return user || null;
    },
    
    createUser: function(userData) {
        // En una implementación real, esto insertaría en la base de datos
        const newUserId = Math.max(...this.users.map(u => u.USER_ID)) + 1;
        
        const newUser = {
            USER_ID: newUserId,
            ...userData,
            CREATED_AT: new Date().toISOString(),
            UPDATED_AT: new Date().toISOString()
        };
        
        this.users.push(newUser);
        return newUser;
    },
    
    createOrder: function(orderData) {
        // Simular creación de orden
        return {
            success: true,
            orderId: Math.floor(Math.random() * 10000),
            message: 'Pedido creado exitosamente'
        };
    }
};

// Hacer la "base de datos" accesible globalmente (para este ejemplo)
window.db = db;