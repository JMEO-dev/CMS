"use client"
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Package, MapPin, CreditCard, Truck, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import StatusBadge from '@/components/StatusBadge';
import FeedbackIcon from '@/components/FeedbackIcon';
import { mockOrders } from '@/lib/mockData';
import { format } from 'date-fns';
import jsPDF from 'jspdf';

export default function OrderDetail() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const order = mockOrders.find(o => o.id === id);

    if (!order) {
        return (
            <div className="container p-6 mx-auto">
                <div className="text-center">
                    <h2 className="mb-4 text-2xl font-bold">Order not found</h2>
                    <Button onClick={() => router.push('/dashboard/orders')}>
                        Back to Orders
                    </Button>
                </div>
            </div>
        );
    }

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text('Order Invoice', 20, 20);

        // Order info
        doc.setFontSize(12);
        doc.text(`Order ID: ${order.id}`, 20, 35);
        doc.text(`Date: ${format(order.createdAt, 'MMM dd, yyyy')}`, 20, 42);
        doc.text(`Status: ${order.deliveryStatus}`, 20, 49);

        // Customer info
        doc.setFontSize(14);
        doc.text('Customer Details', 20, 65);
        doc.setFontSize(11);
        doc.text(`Name: ${order.clientName}`, 20, 75);
        doc.text(`Address: ${order.deliveryAddress}`, 20, 82);

        // Products
        doc.setFontSize(14);
        doc.text('Products', 20, 100);
        doc.setFontSize(11);

        let yPos = 110;
        order.products.forEach((product, index) => {
            doc.text(`${index + 1}. ${product.productName}`, 25, yPos);
            doc.text(`Quantity: ${product.quantity}`, 30, yPos + 7);
            doc.text(`Price: $${product.price.toFixed(2)}`, 30, yPos + 14);
            doc.text(`Subtotal: $${(product.quantity * product.price).toFixed(2)}`, 30, yPos + 21);
            yPos += 30;
        });

        // Total
        doc.setFontSize(14);
        doc.text(`Total Amount: $${order.totalAmount.toFixed(2)}`, 20, yPos + 10);

        // Payment info
        doc.setFontSize(12);
        doc.text(`Payment Status: ${order.paymentStatus}`, 20, yPos + 25);
        doc.text(`Expected Delivery: ${format(order.expectedDeliveryDate, 'MMM dd, yyyy')}`, 20, yPos + 32);

        // Save PDF
        doc.save(`Order-${order.id}.pdf`);
    };

    return (
        <div className="container p-6 mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/dashboard/orders')}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Order Details</h1>
                        <p className="text-muted-foreground">Order ID: {order.id}</p>
                    </div>
                </div>
                <Button onClick={handleDownloadPDF} className="gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Content */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Order Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="w-5 h-5" />
                                Order Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">Delivery Status</p>
                                    <StatusBadge status={order.deliveryStatus} type="delivery" />
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-sm font-medium">Payment Status</p>
                                    <StatusBadge status={order.paymentStatus} type="payment" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Delivery Progress</span>
                                    <span className="font-medium">{order.deliveryProgress}%</span>
                                </div>
                                <Progress value={order.deliveryProgress} />
                            </div>
                            {order.customerFeedback && (
                                <div className="flex items-center gap-2 pt-2">
                                    <span className="text-sm font-medium">Customer Feedback:</span>
                                    <FeedbackIcon feedback={order.customerFeedback} />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.products.map((product, index) => (
                                    <div key={index}>
                                        {index > 0 && <Separator className="my-4" />}
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <p className="font-medium">{product.productName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantity: {product.quantity}
                                                </p>
                                            </div>
                                            <div className="space-y-1 text-right">
                                                <p className="font-medium">
                                                    ${(product.quantity * product.price).toFixed(2)}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    ${product.price.toFixed(2)} each
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Separator className="my-4" />
                                <div className="flex items-center justify-between text-lg font-bold">
                                    <span>Total Amount</span>
                                    <span>${order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Customer Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="mb-1 text-sm text-muted-foreground">Client Name</p>
                                <p className="font-medium">{order.clientName}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="mb-1 text-sm text-muted-foreground">Delivery Address</p>
                                <p className="font-medium">{order.deliveryAddress}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Order Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="mb-1 text-sm text-muted-foreground">Order Date</p>
                                <p className="font-medium">{format(order.createdAt, 'MMM dd, yyyy')}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="mb-1 text-sm text-muted-foreground">Expected Delivery</p>
                                <p className="font-medium">{format(order.expectedDeliveryDate, 'MMM dd, yyyy')}</p>
                            </div>
                            <Separator />
                            <div>
                                <p className="mb-1 text-sm text-muted-foreground">Payment Method</p>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    <p className="font-medium">Credit Card</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
