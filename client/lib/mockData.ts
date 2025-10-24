import { Product, Order } from '@/types';

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        sku: 'WBH-001',
        category: 'Electronics',
        price: 79.99,
        stockQuantity: 150,
        description: 'Premium wireless headphones with noise cancellation',
        active: true,
        createdAt: new Date('2025-01-15'),
        sales: [45, 52, 48, 60, 55, 62, 58],
        satisfaction: 'happy',
    },
    {
        id: '2',
        name: 'Ergonomic Office Chair',
        sku: 'EOC-002',
        category: 'Furniture',
        price: 299.99,
        stockQuantity: 45,
        description: 'Comfortable office chair with lumbar support',
        active: true,
        createdAt: new Date('2025-02-20'),
        sales: [12, 15, 18, 14, 16, 19, 17],
        satisfaction: 'happy',
    },
    {
        id: '3',
        name: 'Cotton T-Shirt Pack',
        sku: 'CTS-003',
        category: 'Clothing',
        price: 24.99,
        stockQuantity: 8,
        description: 'Pack of 3 premium cotton t-shirts',
        active: true,
        createdAt: new Date('2025-03-10'),
        sales: [85, 92, 88, 95, 90, 98, 93],
        satisfaction: 'neutral',
    },
    {
        id: '4',
        name: 'JavaScript Programming Guide',
        sku: 'JPG-004',
        category: 'Books',
        price: 39.99,
        stockQuantity: 200,
        description: 'Comprehensive guide to modern JavaScript',
        active: true,
        createdAt: new Date('2025-01-05'),
        sales: [25, 28, 30, 27, 32, 29, 31],
        satisfaction: 'happy',
    },
    {
        id: '5',
        name: 'Gaming Mouse',
        sku: 'GM-005',
        category: 'Electronics',
        price: 49.99,
        stockQuantity: 3,
        description: 'High-precision gaming mouse with RGB lighting',
        active: false,
        createdAt: new Date('2025-02-14'),
        sales: [38, 42, 45, 40, 48, 43, 46],
        satisfaction: 'unhappy',
    },
];

export const mockOrders: Order[] = [
    {
        id: 'ORD-001',
        products: [
            {
                productId: '1',
                productName: 'Wireless Bluetooth Headphones',
                quantity: 2,
                price: 79.99,
            },
        ],
        clientName: 'John Doe',
        deliveryAddress: '123 Main St, New York, NY 10001',
        paymentStatus: 'paid',
        deliveryStatus: 'delivered',
        expectedDeliveryDate: new Date('2025-10-20'),
        totalAmount: 159.98,
        createdAt: new Date('2025-10-15'),
        deliveryProgress: 100,
        customerFeedback: 'happy',
    },
    {
        id: 'ORD-002',
        products: [
            {
                productId: '2',
                productName: 'Ergonomic Office Chair',
                quantity: 1,
                price: 299.99,
            },
            {
                productId: '4',
                productName: 'JavaScript Programming Guide',
                quantity: 3,
                price: 39.99,
            },
        ],
        clientName: 'Jane Smith',
        deliveryAddress: '456 Oak Ave, Los Angeles, CA 90001',
        paymentStatus: 'paid',
        deliveryStatus: 'pending',
        expectedDeliveryDate: new Date('2025-10-25'),
        totalAmount: 419.96,
        createdAt: new Date('2025-10-18'),
        deliveryProgress: 65,
        customerFeedback: 'happy',
    },
    {
        id: 'ORD-003',
        products: [
            {
                productId: '3',
                productName: 'Cotton T-Shirt Pack',
                quantity: 5,
                price: 24.99,
            },
        ],
        clientName: 'Bob Johnson',
        deliveryAddress: '789 Pine Rd, Chicago, IL 60601',
        paymentStatus: 'pending',
        deliveryStatus: 'shipped',
        expectedDeliveryDate: new Date('2025-10-28'),
        totalAmount: 124.95,
        createdAt: new Date('2025-10-22'),
        deliveryProgress: 0,
        customerFeedback: 'neutral',
    },
    {
        id: 'ORD-004',
        products: [
            {
                productId: '5',
                productName: 'Gaming Mouse',
                quantity: 1,
                price: 49.99,
            },
        ],
        clientName: 'Alice Williams',
        deliveryAddress: '321 Elm St, Miami, FL 33101',
        paymentStatus: 'refunded',
        deliveryStatus: 'canceled',
        expectedDeliveryDate: new Date('2025-10-19'),
        totalAmount: 49.99,
        createdAt: new Date('2025-10-10'),
        deliveryProgress: 0,
        customerFeedback: 'unhappy',
    },
];

export const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
        ...product,
        id: String(mockProducts.length + 1),
        createdAt: new Date(),
        sales: Array(7).fill(0).map(() => Math.floor(Math.random() * 100)),
        satisfaction: ['happy', 'neutral', 'unhappy'][Math.floor(Math.random() * 3)] as any,
    };
    mockProducts.push(newProduct);
    return newProduct;
};

export const addOrder = (order: Omit<Order, 'id' | 'createdAt'>) => {
    const newOrder: Order = {
        ...order,
        id: `ORD-${String(mockOrders.length + 1).padStart(3, '0')}`,
        createdAt: new Date(),
    };
    mockOrders.push(newOrder);
    return newOrder;
};