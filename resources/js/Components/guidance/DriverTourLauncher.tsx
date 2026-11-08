import { useCallback, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { availableDriverSteps, currentDriverTourKey, driverTourVersion } from '@/lib/driverTours';
import { PageProps } from '@/types';

function startDriverTour(tourKey: string) {
    const steps = availableDriverSteps(tourKey);

    if (!steps.length) return;

    const driverObj = driver({
        showProgress: true,
        allowClose: true,
        overlayColor: 'rgba(2, 6, 23, 0.78)',
        nextBtnText: 'Siguiente',
        prevBtnText: 'Anterior',
        doneBtnText: 'Listo',
        progressText: '{{current}} de {{total}}',
        steps,
        onDestroyed: (_element, _step, { reason }) => {
            if (reason === 'done') {
                router.post(`/driver-tours/${tourKey}/complete`, { version: driverTourVersion }, { preserveScroll: true, preserveState: true });
            }
        },
    });

    driverObj.drive();
}

export function DriverTourLauncher() {
    const { auth, tourCompletions = [] } = usePage<PageProps>().props;
    const currentTourKey = currentDriverTourKey();
    const completionId = `${currentTourKey}:${driverTourVersion}`;
    const hasCompletedCurrentTour = tourCompletions.some((completion) => `${completion.tour_key}:${completion.version}` === completionId);
    const launch = useCallback(() => startDriverTour(currentTourKey), [currentTourKey]);

    useEffect(() => {
        if (hasCompletedCurrentTour) return;

        const timer = window.setTimeout(launch, 700);
        return () => window.clearTimeout(timer);
    }, [hasCompletedCurrentTour, launch, auth.user.id]);

    return (
        <Button type="button" variant="ghost" size="icon" onClick={launch} aria-label="Ver guía de este módulo" title="Ver guía de este módulo">
            <HelpCircle className="h-4 w-4" />
        </Button>
    );
}
