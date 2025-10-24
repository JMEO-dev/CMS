import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: string;
    type?: 'payment' | 'delivery' | 'stock' | 'active';
}

export default function StatusBadge({ status, type = 'active' }: StatusBadgeProps) {
    const getVariant = () => {
        if (type === 'payment') {
            if (status === 'paid') return 'default';
            if (status === 'pending') return 'secondary';
            if (status === 'refunded') return 'destructive';
        }

        if (type === 'delivery') {
            if (status === 'delivered') return 'default';
            if (status === 'shipped') return 'secondary';
            if (status === 'pending') return 'outline';
            if (status === 'canceled') return 'destructive';
        }

        if (type === 'stock') {
            const stockNum = Number(status);
            if (stockNum > 50) return 'default';
            if (stockNum >= 10) return 'secondary';
            return 'destructive';
        }

        if (type === 'active') {
            return status === 'true' ? 'default' : 'secondary';
        }

        return 'default';
    };

    const getClassName = () => {
        if (type === 'payment') {
            if (status === 'paid') return 'bg-success text-success-foreground';
            if (status === 'pending') return 'bg-warning text-warning-foreground';
            if (status === 'refunded') return 'bg-destructive text-destructive-foreground';
        }

        if (type === 'delivery') {
            if (status === 'delivered') return 'bg-success text-success-foreground';
            if (status === 'pending') return 'bg-warning text-warning-foreground';
            if (status === 'shipped') return 'bg-primary text-primary-foreground';
            if (status === 'canceled') return 'bg-destructive text-destructive-foreground';
        }

        if (type === 'stock') {
            const stockNum = Number(status);
            if (stockNum > 50) return 'bg-success text-success-foreground';
            if (stockNum >= 10) return 'bg-warning text-warning-foreground';
            return 'bg-destructive text-destructive-foreground';
        }

        if (type === 'active') {
            return status === 'true'
                ? 'bg-success text-success-foreground'
                : 'bg-muted text-muted-foreground';
        }

        return '';
    };

    return (
        <Badge variant={getVariant()} className={cn('font-medium', getClassName())}>
            {type === 'active' ? (status === 'true' ? 'Active' : 'Inactive') : status}
        </Badge>
    );
}