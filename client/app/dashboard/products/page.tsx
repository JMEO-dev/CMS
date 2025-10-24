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
    VisibilityState,
} from '@tanstack/react-table';
import { Plus, MoreHorizontal, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import FeedbackIcon from '@/components/FeedbackIcon';
import Sparkline from '@/components/Sparkline';
import { mockProducts } from '@/lib/mockData';
import { Product, CATEGORIES } from '@/types';

export default function ProductList() {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const columns: ColumnDef<Product>[] = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Product Name',
                cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
            },
            {
                accessorKey: 'sku',
                header: 'SKU',
                cell: ({ row }) => (
                    <code className="px-2 py-1 text-xs rounded bg-muted">{row.getValue('sku')}</code>
                ),
            },
            {
                accessorKey: 'category',
                header: 'Category',
                cell: ({ row }) => row.getValue('category'),
                filterFn: (row, id, value) => {
                    return value.includes(row.getValue(id));
                },
            },
            {
                accessorKey: 'price',
                header: 'Price',
                cell: ({ row }) => {
                    const price = parseFloat(row.getValue('price'));
                    return <div className="font-medium">${price.toFixed(2)}</div>;
                },
            },
            {
                accessorKey: 'stockQuantity',
                header: 'Stock',
                cell: ({ row }) => {
                    const stock = row.getValue('stockQuantity') as number;
                    return <StatusBadge status={String(stock)} type="stock" />;
                },
            },
            {
                accessorKey: 'active',
                header: 'Status',
                cell: ({ row }) => (
                    <StatusBadge status={String(row.getValue('active'))} type="active" />
                ),
            },
            {
                accessorKey: 'satisfaction',
                header: 'Satisfaction',
                cell: ({ row }) => {
                    const satisfaction = row.getValue('satisfaction') as 'happy' | 'neutral' | 'unhappy';
                    return satisfaction ? <FeedbackIcon feedback={satisfaction} /> : null;
                },
            },
            {
                accessorKey: 'sales',
                header: 'Sales Trend',
                cell: ({ row }) => {
                    const sales = row.getValue('sales') as number[];
                    return sales ? (
                        <div className="w-24 h-8">
                            <Sparkline data={sales} className="w-full h-full" />
                        </div>
                    ) : null;
                },
            },
            {
                id: 'actions',
                cell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-8 h-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: mockProducts,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="mt-2 text-muted-foreground">Manage your product inventory</p>
                </div>
                <Button variant="outline" onClick={() => router.push('/dashboard/products/create')} className="bg-gradient-primary text-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Product List</CardTitle>
                    <CardDescription>A comprehensive view of all your products</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 mb-4 md:flex-row">
                        <Input
                            placeholder="Search products..."
                            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                            onChange={(event) =>
                                table.getColumn('name')?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />

                        <Select
                            value={(table.getColumn('category')?.getFilterValue() as string) ?? 'all'}
                            onValueChange={(value) =>
                                table.getColumn('category')?.setFilterValue(value === 'all' ? '' : value)
                            }
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {CATEGORIES.map((category) => (
                                    <SelectItem key={category} value={category}>
                                        {category}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Columns <ChevronDown className="w-4 h-4 ml-2" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                                            data-state={row.getIsSelected() && 'selected'}
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
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center"
                                        >
                                            No products found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex items-center justify-between py-4 space-x-2">
                        <div className="text-sm text-muted-foreground">
                            {table.getFilteredSelectedRowModel().rows.length} of{' '}
                            {table.getFilteredRowModel().rows.length} row(s) selected.
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