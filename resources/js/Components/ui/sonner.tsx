import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            toastOptions={{
                classNames: {
                    toast: 'border border-white/10 bg-[#0D0A0A] text-white',
                    description: 'text-[#B7B7B7]',
                    actionButton: 'bg-[#8B0018] text-white',
                    cancelButton: 'bg-white/10 text-white',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
