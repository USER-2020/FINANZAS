import { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/Components/ui/tabs';

export function ModuleTabs({ value, items, children }: { value: string; items: string[]; children: ReactNode }) {
    return (
        <Tabs defaultValue={value}>
            <TabsList>
                {items.map((item) => <TabsTrigger key={item} value={item}>{item}</TabsTrigger>)}
            </TabsList>
            {children}
        </Tabs>
    );
}
