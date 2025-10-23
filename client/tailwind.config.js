// tailwind.config.js
module.exports = {
    theme: {
        extend: {
            colors: {
                success: 'hsl(var(--success))',
                warning: 'hsl(var(--warning))',
                destructive: 'hsl(var(--destructive))',
                primary: 'hsl(var(--primary))',
                muted: 'hsl(var(--muted))',
                'success-foreground': 'hsl(var(--success-foreground))',
                'warning-foreground': 'hsl(var(--warning-foreground))',
                'destructive-foreground': 'hsl(var(--destructive-foreground))',
                'primary-foreground': 'hsl(var(--primary-foreground))',
                'muted-foreground': 'hsl(var(--muted-foreground))',
            },
        },
    },
    content: [
        './app/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
    ],
    plugins: [],
};