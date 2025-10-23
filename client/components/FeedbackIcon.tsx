import { Smile, Meh, Frown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackIconProps {
    feedback: 'happy' | 'neutral' | 'unhappy';
    className?: string;
}

export default function FeedbackIcon({ feedback, className }: FeedbackIconProps) {
    const icons = {
        happy: { Icon: Smile, color: 'text-success' },
        neutral: { Icon: Meh, color: 'text-warning' },
        unhappy: { Icon: Frown, color: 'text-destructive' },
    };

    const { Icon, color } = icons[feedback];

    return <Icon className={cn('h-5 w-5', color, className)} />;
}