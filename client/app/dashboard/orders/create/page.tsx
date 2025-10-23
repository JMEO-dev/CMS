"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { addOrder, mockProducts } from '@/lib/mockData';
import { PAYMENT_STATUS, DELIVERY_STATUS } from '@/types';
import { useEffect, useState } from 'react';

const orderSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    clientName: z.string().min(1, 'Client name is required'),
    deliveryAddress: z.string().min(1, 'Delivery address is required'),
    paymentStatus: z.enum(['paid', 'pending', 'refunded']),
    deliveryStatus: z.enum(['pending', 'shipped', 'delivered', 'canceled']),
    expectedDeliveryDate: z.string().min(1, 'Expected delivery date is required'),
});

type OrderFormValues = z.infer<typeof orderSchema>;

export default function OrderCreate() {
    const router = useRouter();
    const [totalAmount, setTotalAmount] = useState(0);

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            productId: '',
            quantity: 1,
            clientName: '',
            deliveryAddress: '',
            paymentStatus: 'pending',
            deliveryStatus: 'pending',
            expectedDeliveryDate: '',
        },
    });

    const watchProductId = form.watch('productId');
    const watchQuantity = form.watch('quantity');

    useEffect(() => {
        if (watchProductId && watchQuantity) {
            const product = mockProducts.find((p) => p.id === watchProductId);
            if (product) {
                setTotalAmount(product.price * watchQuantity);
            }
        } else {
            setTotalAmount(0);
        }
    }, [watchProductId, watchQuantity]);

    const onSubmit = (data: OrderFormValues) => {
        const product = mockProducts.find((p) => p.id === data.productId);
        if (!product) return;

        const deliveryProgress =
            data.deliveryStatus === 'delivered' ? 100 :
                data.deliveryStatus === 'shipped' ? 65 :
                    data.deliveryStatus === 'pending' ? 0 : 0;

        addOrder({
            products: [
                {
                    productId: product.id,
                    productName: product.name,
                    quantity: data.quantity,
                    price: product.price,
                },
            ],
            clientName: data.clientName,
            deliveryAddress: data.deliveryAddress,
            paymentStatus: data.paymentStatus,
            deliveryStatus: data.deliveryStatus,
            expectedDeliveryDate: new Date(data.expectedDeliveryDate),
            totalAmount,
            deliveryProgress,
            customerFeedback: 'neutral',
        });

        toast.success('Order created successfully!');
        router.push('/dashboard/orders');
    };

    return (
        <div className="max-w-6xl">
            <div className="mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/dashboard/orders')}
                    className="mb-4"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                </Button>
                <h1 className="text-3xl font-bold">Create New Order</h1>
                <p className="text-muted-foreground mt-2">Process a new customer order</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Order Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Order Details</CardTitle>
                                    <CardDescription>Product selection and quantity</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="productId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product *</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a product" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {mockProducts.map((product) => (
                                                            <SelectItem key={product.id} value={product.id}>
                                                                {product.name} - ${product.price.toFixed(2)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="quantity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quantity *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="1"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Client Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Client Information</CardTitle>
                                    <CardDescription>Customer details and delivery address</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="clientName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Client Name *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter client name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="deliveryAddress"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Delivery Address *</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter delivery address"
                                                        className="resize-none"
                                                        rows={3}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            {/* Status & Delivery */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Status & Delivery</CardTitle>
                                    <CardDescription>Payment and delivery information</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="paymentStatus"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Payment Status *</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {PAYMENT_STATUS.map((status) => (
                                                                <SelectItem key={status} value={status}>
                                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="deliveryStatus"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Delivery Status *</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select status" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {DELIVERY_STATUS.map((status) => (
                                                                <SelectItem key={status} value={status}>
                                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="expectedDeliveryDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Expected Delivery Date *</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <div className="flex gap-3">
                                <Button type="submit" className="bg-gradient-primary">
                                    Create Order
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.push('/dashboard/orders')}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-20">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                            <CardDescription>Live order overview</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                                <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                                    <Package className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground">Total Amount</p>
                                    <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
                                </div>
                            </div>

                            {watchProductId && (
                                <div className="space-y-2 p-4 border rounded-lg">
                                    <p className="text-sm font-medium">Selected Product</p>
                                    <p className="text-sm text-muted-foreground">
                                        {mockProducts.find((p) => p.id === watchProductId)?.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Quantity: {watchQuantity}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}