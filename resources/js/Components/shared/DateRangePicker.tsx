import { CalendarIcon } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Calendar } from '@/Components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';

export function DateRangePicker() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <CalendarIcon className="h-4 w-4" />
                    Rango de fechas
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="range" numberOfMonths={2} />
            </PopoverContent>
        </Popover>
    );
}
