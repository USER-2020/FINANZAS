import { useMemo } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/Components/ui/button';
import { Calendar } from '@/Components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { cn } from '@/lib/utils';
import { formatDateTimeInput, parseDateTimeInput } from '@/lib/format';

type DateTimePickerProps = {
    value: string | Date | null | undefined;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
};

export function DateTimePicker({ value, onChange, placeholder = 'Seleccionar fecha', disabled = false, className }: DateTimePickerProps) {
    const selectedDate = useMemo(() => parseDateTimeInput(value), [value]);
    const buttonLabel = selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: es }) : placeholder;

    function handleDateSelect(date: Date | undefined) {
        if (!date) {
            onChange('');
            return;
        }

        onChange(formatDateTimeInput(date));
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className={cn('w-full justify-between font-normal', !selectedDate && 'text-white/50', className)}
                >
                    <span className="truncate">{buttonLabel}</span>
                    <CalendarIcon className="h-4 w-4 shrink-0 opacity-70" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
                <div className="space-y-4">
                    <Calendar mode="single" selected={selectedDate ?? undefined} onSelect={handleDateSelect} />
                </div>
            </PopoverContent>
        </Popover>
    );
}
