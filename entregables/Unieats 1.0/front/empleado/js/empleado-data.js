const empleadoDB = {
    empleados: [
        {
            id: 101,
            email: "camila.garcia0101@unieats.com",
            password: "987654",
            nombre: "Camila García",
            cafeId: 1,
            workstation: "Cajero"
        },
        {
            id: 901,
            email: "juan@unieats.com",
            password: "987654",
            nombre: "Juan",
            cafeId: 1,
            workstation: "Cajero"
        }
    ],          

    // Autenticar empleado (versión corregida)
    authenticateEmpleado: function(email, password) {
        const empleado = this.empleados.find(emp => 
            emp.email.toLowerCase() === email.toLowerCase() && 
            emp.password === password
        );
        return empleado ? {...empleado} : null; // Devolver copia del objeto
    },

    // Obtener cafetería por ID
    getCafeteriaById: function(id) {
        const cafeterias = [
            { id: 1, name: "Cafeteria Principal", location: "EAN Legacy, Piso 1" },
            { id: 2, name: "Cafeteria 6 Piso", location: "EAN Legacy, Piso 6" },
            { id: 3, name: "Cafeteria 4 Piso", location: "EAN Legacy, Piso 4" },
            { id: 4, name: "Cafeteria 4-2 Piso", location: "EAN Nogal, Piso 4" }
        ];
        return cafeterias.find(c => c.id === id);
    },

    // Obtener pedidos (datos de ejemplo)
    getPedidosByCafe: function(cafeId, status) {
        const pedidosEjemplo = [
            {
                orderId: 7,
                userId: 10,
                cafeId: 1,
                status: "PENDING",
                items: [
                    { productId: 3006, name: "Sándwich de atún con té", quantity: 2, price: 5000 },
                    { productId: 4003, name: "Limonada natural", quantity: 1, price: 2800 }
                ],
                total: 12800,
                orderDate: "2025-04-28T22:18:17"
            },
            {
                orderId: 12,
                userId: 57,
                cafeId: 1,
                status: "PENDING",
                items: [
                    { productId: 4006, name: "Brownie de chocolate", quantity: 3, price: 3200 },
                    { productId: 4005, name: "Pastel de pollo", quantity: 1, price: 2500 },
                    { productId: 3001, name: "Café con leche", quantity: 3, price: 3200 }
                ],
                total: 21700,
                orderDate: "2025-04-29T22:18:17"
            }
        ];
        
        return pedidosEjemplo.filter(pedido => 
            pedido.cafeId === cafeId && 
            (!status || pedido.status === status)
        );
    }
};