import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { router } from '@inertiajs/react';

type Flash = {
    success?: string | null;
    error?: string | null;
    status?: string | null;
};

type FlashProps = {
    flash?: Flash;
};

function showFlash(flash?: Flash) {
    if (flash?.success) {
        toast.success(flash.success);
    }

    if (flash?.error) {
        toast.error(flash.error);
    }

    if (flash?.status) {
        toast(flash.status);
    }
}

export function FlashToaster({ initialFlash }: { initialFlash?: Flash }) {
    useEffect(() => {
        showFlash(initialFlash);
    }, []);

    useEffect(() => {
        const unsubscribe = router.on('success', (event) => {
            showFlash((event.detail.page.props as unknown as FlashProps).flash);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4200,
                style: {
                    background: '#0D0A0A',
                    border: '1px solid rgba(255,255,255,0.10)',
                    color: '#FFFFFF',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
                },
                success: {
                    iconTheme: {
                        primary: '#D4AF37',
                        secondary: '#050505',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#C1002B',
                        secondary: '#FFFFFF',
                    },
                },
            }}
        />
    );
}
