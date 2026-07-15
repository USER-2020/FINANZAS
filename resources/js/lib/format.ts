import { format, isValid, parseISO } from 'date-fns';

export function formatCOP(value: number | string | null | undefined) {
    const amount = Number(value ?? 0);

    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(amount);
}

const numberFormatter = new Intl.NumberFormat('es-CO');

export function formatNumericInput(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') {
        return '';
    }

    const rawValue = String(value).replace(/\s+/g, '');
    const hasTrailingSeparator = /[.,]$/.test(rawValue);
    const cleanedValue = rawValue.replace(/[.,]$/, '');
    const [integerPart = '', fractionalPart = ''] = cleanedValue.split('.');

    if (!integerPart && !fractionalPart) {
        return hasTrailingSeparator ? '0,' : '';
    }

    const formattedInteger = numberFormatter.format(Number(integerPart || '0'));

    if (hasTrailingSeparator) {
        return `${formattedInteger},`;
    }

    if (fractionalPart) {
        return `${formattedInteger},${fractionalPart}`;
    }

    return formattedInteger;
}

export function parseNumericInput(value: string | number | null | undefined) {
    if (value === null || value === undefined || value === '') {
        return '';
    }

    const rawValue = String(value).replace(/\s+/g, '');
    const separators = [...rawValue.matchAll(/[.,]/g)];

    if (separators.length === 0) {
        return rawValue.replace(/\D/g, '');
    }

    const lastSeparator = separators[separators.length - 1];
    const separatorIndex = lastSeparator.index ?? rawValue.length - 1;
    const integerPart = rawValue.slice(0, separatorIndex).replace(/\D/g, '');
    const fractionalPart = rawValue.slice(separatorIndex + 1).replace(/\D/g, '');

    if (rawValue.endsWith('.') || rawValue.endsWith(',')) {
        return `${integerPart}.`;
    }

    if (separators.length === 1) {
        if (fractionalPart.length > 0 && fractionalPart.length <= 2) {
            return `${integerPart}.${fractionalPart}`;
        }

        return `${integerPart}${fractionalPart}`;
    }

    if (fractionalPart.length > 0 && fractionalPart.length <= 2) {
        return `${integerPart}.${fractionalPart}`;
    }

    return `${integerPart}${fractionalPart}`;
}

export function parseDateTimeInput(value: string | Date | null | undefined) {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return isValid(value) ? value : null;
    }

    const localMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?)?/);

    if (localMatch) {
        const [, year, month, day, hours = '0', minutes = '0', seconds = '0'] = localMatch;
        const localDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), Number(seconds));

        if (isValid(localDate)) {
            return localDate;
        }
    }

    const normalizedValue = value.replace(' ', 'T');
    const parsedValue = parseISO(normalizedValue);

    if (isValid(parsedValue)) {
        return parsedValue;
    }

    const fallbackValue = new Date(value);

    return isValid(fallbackValue) ? fallbackValue : null;
}

export function formatDateTimeInput(value: string | Date | null | undefined) {
    const date = parseDateTimeInput(value);

    if (!date) {
        return '';
    }

    return format(date, 'yyyy-MM-dd HH:mm:ss');
}

export function formatDate(value: string | Date | null | undefined) {
    if (!value) {
        return '-';
    }

    const rawValue = typeof value === 'string' ? value : value.toISOString();
    const date = parseDateTimeInput(value);

    if (!date) {
        return String(value);
    }

    const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0;

    return new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        ...(hasTime ? { hour: 'numeric', minute: '2-digit' } : {}),
    }).format(date);
}
