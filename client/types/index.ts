export interface Product {
    id: string;
    name: string;
    sku: string;
    category: string;
    price: number;
    stockQuantity: number;
    description?: string;
    imageUrl?: string;
    active: boolean;
    createdAt: Date;
    sales?: number[];
    satisfaction?: 'happy' | 'neutral' | 'unhappy';
}

export interface Order {
    id: string;
    products: Array<{
        productId: string;
        productName: string;
        quantity: number;
        price: number;
    }>;
    clientName: string;
    deliveryAddress: string;
    paymentStatus: 'paid' | 'pending' | 'refunded';
    deliveryStatus: 'pending' | 'shipped' | 'delivered' | 'canceled';
    expectedDeliveryDate: Date;
    totalAmount: number;
    createdAt: Date;
    deliveryProgress: number;
    customerFeedback?: 'happy' | 'neutral' | 'unhappy';
}

export const CATEGORIES = [
    'Electronics',
    'Furniture',
    'Clothing',
    'Books',
    'Food',
    'Toys',
    'Sports',
    'Other',
] as const;

export const PAYMENT_STATUS = ['paid', 'pending', 'refunded'] as const;
export const DELIVERY_STATUS = ['pending', 'shipped', 'delivered', 'canceled'] as const;