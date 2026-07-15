import { Upload } from 'lucide-react';
import { Input } from '@/Components/ui/input';

export function FileUploader(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/10 p-6 text-center hover:bg-white/5">
            <Upload className="mb-2 h-6 w-6 text-[#D4AF37]" />
            <span className="text-sm text-muted-foreground">Seleccionar archivo</span>
            <Input type="file" className="sr-only" {...props} />
        </label>
    );
}
