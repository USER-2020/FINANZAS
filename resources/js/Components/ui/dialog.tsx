import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay ref={ref} className={cn('fixed inset-0 z-50 bg-black/80 backdrop-blur-sm', className)} {...props} />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
    const [dragOffset, setDragOffset] = React.useState(0);
    const [expanded, setExpanded] = React.useState(false);
    const dragStartY = React.useRef<number | null>(null);
    const closeButtonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        if (dragStartY.current === null) return;

        const handlePointerMove = (event: PointerEvent) => {
            const delta = event.clientY - (dragStartY.current ?? event.clientY);
            setDragOffset(Math.max(-window.innerHeight, delta));
        };
        const handlePointerUp = () => {
            const offset = dragOffset;
            dragStartY.current = null;
            if (offset > 120) closeButtonRef.current?.click();
            else if (offset < -80) setExpanded(true);
            setDragOffset(0);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp, { once: true });
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };
    }, [dragOffset]);

    const startDragging = (event: React.PointerEvent<HTMLSpanElement>) => {
        if (window.matchMedia('(min-width: 640px)').matches) return;
        event.preventDefault();
        dragStartY.current = event.clientY;
    };

    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={ref}
                data-sheet-expanded={expanded ? 'true' : undefined}
                className={cn(
                    'responsive-dialog-content fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-hidden rounded-lg border border-white/10 bg-[#0D0A0A] p-6 shadow-2xl outline-none',
                    className,
                )}
                style={dragOffset ? { transform: `translateY(${dragOffset}px)` } : undefined}
                {...props}
            >
                <span
                    aria-label="Desliza para expandir o cerrar"
                    role="button"
                    tabIndex={0}
                    onPointerDown={startDragging}
                    onKeyDown={(event) => {
                        if (event.key === 'ArrowUp') setExpanded(true);
                        if (event.key === 'Escape') closeButtonRef.current?.click();
                    }}
                    className="dialog-sheet-handle absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 cursor-grab rounded-full bg-white/20 active:cursor-grabbing"
                />
                {children}
                <DialogPrimitive.Close ref={closeButtonRef} className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100">
                    <X className="h-4 w-4" />
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPortal>
    );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('dialog-sheet-header flex shrink-0 flex-col space-y-1.5 text-left', className)} {...props} />
);
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('dialog-sheet-footer flex shrink-0 flex-col-reverse gap-2 border-t border-white/[0.06] pt-4 sm:flex-row sm:justify-end', className)} {...props} />
);
const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('dialog-sheet-body min-h-0 flex-1 overflow-y-auto overscroll-contain', className)} {...props} />
);
const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => <DialogPrimitive.Title ref={ref} className={cn('text-lg font-semibold', className)} {...props} />);
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => <DialogPrimitive.Description ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />);
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export { Dialog, DialogPortal, DialogOverlay, DialogTrigger, DialogClose, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogDescription };
