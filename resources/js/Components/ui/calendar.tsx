import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import 'react-day-picker/dist/style.css';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('p-3 text-sm', className)}
            classNames={{
                months: 'flex flex-col gap-4',
                month_caption: 'flex justify-center pt-1 font-medium',
                nav: 'flex items-center justify-between',
                button_previous: 'rounded-md p-1 hover:bg-white/10',
                button_next: 'rounded-md p-1 hover:bg-white/10',
                weekdays: 'grid grid-cols-7 text-muted-foreground',
                week: 'grid grid-cols-7',
                day: 'h-9 w-9 rounded-md hover:bg-white/10',
                selected: 'bg-primary text-white',
                today: 'text-accent',
                outside: 'text-muted-foreground opacity-50',
                ...classNames,
            }}
            {...props}
        />
    );
}

export { Calendar };
