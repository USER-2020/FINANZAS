import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva('relative w-full rounded-lg border p-4 text-sm', {
    variants: {
        variant: {
            default: 'border-white/10 bg-white/5 text-foreground',
            destructive: 'border-destructive/40 bg-destructive/10 text-red-100',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>>(
    ({ className, variant, ...props }, ref) => <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />,
);
Alert.displayName = 'Alert';

const AlertTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className={cn('mb-1 font-medium leading-none tracking-normal', className)} {...props} />
);

const AlertDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <div className={cn('text-sm text-muted-foreground', className)} {...props} />
);

export { Alert, AlertTitle, AlertDescription };
