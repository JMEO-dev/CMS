"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
} from '@tanstack/react-table';
import { Plus, Package, TrendingUp, Clock, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import StatusBadge from '@/components/StatusBadge';
import FeedbackIcon from '@/components/FeedbackIcon';
import { mockOrders } from '@/lib/mockData';
import { Order } from '@/types';

export default function OrderList() {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const stats = useMemo(() => {
        const total = mockOrders.length;
        const delivered = mockOrders.filter((o) => o.deliveryStatus === 'delivered').length;
        const pending = mockOrders.filter((o) => o.deliveryStatus === 'pending').length;
        const happyCustomers = mockOrders.filter((o) => o.customerFeedback === 'happy').length;

        return {
            total,
            deliveredPercent: (delivered / total) * 100,
            pending,
            satisfaction: (happyCustomers / total) * 100,
        };
    }, []);

    const columns: ColumnDef<Order>[] = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'Order ID',
                cell: ({ row }) => (
                    <code className="px-2 py-1 text-xs font-medium rounded bg-muted">
                        {row.getValue('id')}
                    </code>
                ),
            },
            {
                accessorKey: 'clientName',
                header: 'Client',
                cell: ({ row }) => {
                    const name = row.getValue('clientName') as string;
                    const initials = name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase();
                    return (
                        <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{name}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: 'paymentStatus',
                header: 'Payment',
                cell: ({ row }) => (
                    <StatusBadge
                        status={row.getValue('paymentStatus')}
                        type="payment"
                    />
                ),
            },
            {
                accessorKey: 'deliveryStatus',
                header: 'Delivery',
                cell: ({ row }) => (
                    <StatusBadge
                        status={row.getValue('deliveryStatus')}
                        type="delivery"
                    />
                ),
            },
            {
                accessorKey: 'totalAmount',
                header: 'Total',
                cell: ({ row }) => {
                    const amount = parseFloat(row.getValue('totalAmount'));
                    return <div className="font-semibold">${amount.toFixed(2)}</div>;
                },
            },
            {
                accessorKey: 'deliveryProgress',
                header: 'Progress',
                cell: ({ row }) => {
                    const progress = row.getValue('deliveryProgress') as number;
                    return (
                        <div className="w-24">
                            <Progress value={progress} className="h-2" />
                        </div>
                    );
                },
            },
            {
                accessorKey: 'customerFeedback',
                header: 'Feedback',
                cell: ({ row }) => {
                    const feedback = row.getValue('customerFeedback') as
                        | 'happy'
                        | 'neutral'
                        | 'unhappy';
                    return feedback ? <FeedbackIcon feedback={feedback} /> : null;
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data: mockOrders,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Orders</h1>
                    <p className="mt-2 text-muted-foreground">Track and manage customer orders</p>
                </div>
                <Button variant="outline" onClick={() => router.push('/dashboard/orders/create')} className="bg-gradient-primary text-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    New Order
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                        <p className="mt-1 text-xs text-muted-foreground">All time orders</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                        <TrendingUp className="w-4 h-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.deliveredPercent.toFixed(0)}%</div>
                        <p className="mt-1 text-xs text-muted-foreground">Successfully delivered</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="w-4 h-4 text-warning" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pending}</div>
                        <p className="mt-1 text-xs text-muted-foreground">Awaiting processing</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
                        <Smile className="w-4 h-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.satisfaction.toFixed(0)}%</div>
                        <p className="mt-1 text-xs text-muted-foreground">Happy customers</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Order List</CardTitle>
                    <CardDescription>Overview of all customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        <Input
                            placeholder="Search orders..."
                            value={(table.getColumn('clientName')?.getFilterValue() as string) ?? ''}
                            onChange={(event) =>
                                table.getColumn('clientName')?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    </div>

                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            className="cursor-pointer hover:bg-muted/50"
                                            onClick={() => router.push(`/dashboard/orders/${row.original.id}`)}

                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between py-4 space-x-2">
                        <div className="text-sm text-muted-foreground">
                            Showing {table.getRowModel().rows.length} of{' '}
                            {table.getFilteredRowModel().rows.length} order(s)
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}