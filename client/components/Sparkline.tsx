interface SparklineProps {
    data: number[];
    className?: string;
}

export default function Sparkline({ data, className = '' }: SparklineProps) {
    if (!data || data.length === 0) return null;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg
            viewBox="0 0 100 30"
            className={`${className}`}
            preserveAspectRatio="none"
        >
            <polyline
                points={points}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
            />
        </svg>
    );
}