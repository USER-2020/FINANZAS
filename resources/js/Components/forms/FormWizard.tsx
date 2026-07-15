import { ReactNode } from 'react';
import { Progress } from '@/Components/ui/progress';

export function FormWizard({ step, total, children }: { step: number; total: number; children: ReactNode }) {
    return (
        <div className="space-y-6">
            <Progress value={(step / total) * 100} />
            {children}
        </div>
    );
}
