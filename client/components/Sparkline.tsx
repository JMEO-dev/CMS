interface SparklineProps {
    data: number[];
    className?: string;
}

export default function Sparkline({ data, className = '' }: SparklineProps) {
    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;



    let trendColor = 'var(--primary)';

    if (data.length > 1) {
        const firstHalf = data.slice(0, Math.floor(data.length / 2));
        const secondHalf = data.slice(Math.floor(data.length / 2));

        // Helper function to calculate median
        const calculateMedian = (arr: number[]) => {
            const sorted = [...arr].sort((a, b) => a - b);
            const mid = Math.floor(sorted.length / 2);
            return sorted.length % 2 !== 0
                ? sorted[mid]
                : (sorted[mid - 1] + sorted[mid]) / 2;
        };

        const medianFirstHalf = calculateMedian(firstHalf);
        const medianSecondHalf = calculateMedian(secondHalf);

        if (medianSecondHalf > medianFirstHalf) {
            trendColor = 'var(--success)';
        } else if (medianSecondHalf < medianFirstHalf) {
            trendColor = 'var(--destructive)';
        } else {
            trendColor = 'var(--warning)';
        }
    }

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg
            viewBox="0 0 100 100"
            className={`${className}`}
            preserveAspectRatio="none"
        >
            <polyline
                points={points}
                fill="none"
                stroke={trendColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}