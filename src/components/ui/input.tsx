import * as React from 'react';

import { cn } from '@/lib/utils/utils';

const setInputSizes = (sizes: string) => {
    switch (sizes) {
        case 'small':
            return 'h-6 px-2 text-sm';
        case 'large':                               
            return 'h-12 px-4 text-lg';
        default:
            return 'h-8 px-2 text-base';
    }
};

function Input({ className, type, sizes, ...props }: React.ComponentProps<'input'> & { sizes: 'small' | 'medium' | 'large' }) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                setInputSizes(sizes),
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
            )}
            {...props}
        />
    );
};

export { Input };