import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { type CellContext, type ColumnDef } from '@tanstack/react-table';
import { Edit, Image, Plus, Trash2 } from 'lucide-react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import PhoneInput from 'react-phone-input-2';
import toast from 'react-hot-toast';
import { AppLayout } from '@/Components/layout/AppLayout';
import { DataTable } from '@/Components/data-table/DataTable';
import { MoneyDisplay } from '@/Components/shared/MoneyDisplay';
import { PageHeader } from '@/Components/shared/PageHeader';
import { StatusBadge } from '@/Components/shared/StatusBadge';
import { DateTimePicker } from '@/Components/shared/DateTimePicker';
import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Textarea } from '@/Components/ui/textarea';
import { formatDate, formatNumericInput, formatDateTimeInput, parseNumericInput } from '@/lib/format';
import { PageProps } from '@/types';

export type FieldOption = {
    label: string;
    value: string;
};

export type ResourceField = {
    name: string;
    label: string;
    type?: 'text' | 'number' | 'date' | 'textarea' | 'select' | 'multiselect' | 'switchlist' | 'file' | 'password' | 'phone';
    options?: FieldOption[];
    required?: boolean;
    requiredOnCreate?: boolean;
    accept?: string;
    previewKey?: string;
    hidden?: boolean;
    defaultValue?: any;
    initialValue?: (row: ResourceRow) => any;
    syncFrom?: string;
    syncTransform?: (value: string, currentValue?: string) => string;
};

export type ResourceColumn = {
    key: string;
    header: string;
    type?: 'money' | 'status' | 'date' | 'image';
    render?: (row: ResourceRow) => ReactNode;
};

export type ResourceRow = Record<string, any> & {
    id: number;
};

type ResourceIndexProps = PageProps<{
    title: string;
    description: string;
    items: ResourceRow[];
    fields: ResourceField[];
    columns: ResourceColumn[];
    storeUrl: string;
    resourceUrl: string;
    searchPlaceholder?: string;
    tableToolbar?: ReactNode;
    headerActions?: ReactNode;
    canCreate?: boolean;
    canDelete?: boolean;
}>;

function emptyData(fields: ResourceField[]) {
    return fields.reduce<Record<string, any>>((carry, field) => {
        if (field.defaultValue !== undefined) {
            carry[field.name] = field.defaultValue;
            return carry;
        }

        carry[field.name] = field.type === 'file' ? null : field.type === 'multiselect' ? [] : '';
        return carry;
    }, {});
}

function valueFor(row: ResourceRow, key: string) {
    return key.split('.').reduce<any>((value, part) => value?.[part], row);
}

function formValue(row: ResourceRow, field: ResourceField) {
    if (field.type === 'file') {
        return null;
    }

    if (field.initialValue) {
        return field.initialValue(row);
    }

    const value = row[field.name] ?? field.defaultValue ?? '';

    if (field.type === 'date' && typeof value === 'string') {
        return formatDateTimeInput(value);
    }

    if (field.type === 'number') {
        return parseNumericInput(value);
    }

    return value;
}

function validationToastMessage(formErrors: Record<string, string>, fields: ResourceField[]) {
    const [fieldName, message] = Object.entries(formErrors)[0] ?? [];

    if (!fieldName || !message) {
        return 'Revisa los campos marcados antes de guardar.';
    }

    const field = fields.find((item) => item.name === fieldName);

    return field ? `${field.label}: ${message}` : message;
}

function applyFieldDefaults(currentData: Record<string, any>, fields: ResourceField[]) {
    return fields.reduce<Record<string, any>>((carry, field) => {
        const value = carry[field.name];

        if ((value === '' || value === null || value === undefined) && field.defaultValue !== undefined) {
            carry[field.name] = field.defaultValue;
        }

        return carry;
    }, { ...currentData });
}

function syncedFieldValue(sourceValue: string, field: ResourceField, currentValue?: string) {
    return field.syncTransform ? field.syncTransform(sourceValue, currentValue) : sourceValue;
}

export default function ResourceIndex({
    auth,
    title,
    description,
    items,
    fields,
    columns,
    storeUrl,
    resourceUrl,
    searchPlaceholder = 'Buscar...',
    tableToolbar,
    headerActions,
    canCreate = true,
    canDelete = true,
}: ResourceIndexProps) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<ResourceRow | null>(null);
    const [filePreviewUrls, setFilePreviewUrls] = useState<Record<string, string>>({});
    const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
    const { data, setData, post, put, processing, errors, reset, clearErrors, transform } = useForm<Record<string, any>>(emptyData(fields));
    const hasFileFields = fields.some((field) => field.type === 'file');

    useEffect(() => {
        if (new URLSearchParams(window.location.search).get('create') === '1') {
            setOpen(true);
        }
    }, []);

    useEffect(() => {
        if (!open) {
            setEditing(null);
            reset();
            clearErrors();
            setFilePreviewUrls((currentUrls) => {
                Object.values(currentUrls).forEach((url) => URL.revokeObjectURL(url));
                return {};
            });
            setVisiblePasswords({});
        }
    }, [open]);

    useEffect(() => {
        return () => {
            Object.values(filePreviewUrls).forEach((url) => URL.revokeObjectURL(url));
        };
    }, [filePreviewUrls]);

    const tableColumns = useMemo<ColumnDef<ResourceRow>[]>(
        () => [
            ...columns.map((column) => ({
                accessorKey: column.key,
                header: column.header,
                cell: ({ row }: CellContext<ResourceRow, unknown>) => {
                    if (column.render) {
                        return column.render(row.original);
                    }

                    const value = valueFor(row.original, column.key);

                    if (column.type === 'money') {
                        return <MoneyDisplay value={Number(value ?? 0)} />;
                    }

                    if (column.type === 'status') {
                        return <StatusBadge status={String(value ?? 'Pendiente')} />;
                    }

                    if (column.type === 'date') {
                        return formatDate(value);
                    }

                    if (column.type === 'image') {
                        return value ? (
                            <a href={String(value)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-[#FFD000] hover:text-white">
                                <img src={String(value)} alt="" className="h-10 w-10 rounded-md border border-white/10 object-cover" />
                                Ver
                            </a>
                        ) : (
                            <span className="inline-flex items-center gap-2 text-sm text-white/50">
                                <Image className="h-4 w-4" />
                                Sin imagen
                            </span>
                        );
                    }

                    return value ?? '-';
                },
            })),
            {
                id: 'actions',
                header: '',
                cell: ({ row }) => (
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="icon" onClick={() => edit(row.original)} aria-label="Editar">
                            <Edit className="h-4 w-4" />
                        </Button>
                        {canDelete ? (
                            <Button type="button" variant="destructive" size="icon" onClick={() => destroy(row.original)} aria-label="Eliminar">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        ) : null}
                    </div>
                ),
            },
        ],
        [canDelete, columns],
    );

    function edit(row: ResourceRow) {
        setEditing(row);
        fields.forEach((field) => {
            setData(field.name, formValue(row, field));
        });
        setOpen(true);
    }

    function destroy(row: ResourceRow) {
        toast(
            (confirmationToast) => (
                <div className="space-y-3">
                    <div>
                        <p className="text-sm font-semibold text-white">Eliminar registro</p>
                        <p className="text-sm text-white/70">Esta acción no se puede deshacer.</p>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => toast.dismiss(confirmationToast.id)}>
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                                toast.dismiss(confirmationToast.id);
                                router.delete(`${resourceUrl}/${row.id}`, {
                                    preserveScroll: true,
                                    onError: () => toast.error('No se pudo eliminar el registro. Intenta nuevamente.'),
                                });
                            }}
                        >
                            Eliminar
                        </Button>
                    </div>
                </div>
            ),
            { duration: Infinity },
        );
    }

    function submit(event: FormEvent) {
        event.preventDefault();

        const options = {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
            onError: (formErrors: Record<string, string>) => toast.error(validationToastMessage(formErrors, fields)),
            onFinish: () => transform((currentData) => currentData),
        };

        transform((currentData) => applyFieldDefaults(currentData, fields));

        if (editing) {
            if (hasFileFields) {
                transform((currentData) => ({ ...applyFieldDefaults(currentData, fields), _method: 'put' }));
                post(`${resourceUrl}/${editing.id}`, {
                    ...options,
                    forceFormData: true,
                });
                return;
            }

            put(`${resourceUrl}/${editing.id}`, options);
            return;
        }

        post(storeUrl, { ...options, forceFormData: hasFileFields });
    }

    function toggleMultiselectValue(fieldName: string, optionValue: string, checked: boolean | 'indeterminate') {
        const values = Array.isArray(data[fieldName]) ? data[fieldName] : [];

        setData(
            fieldName,
            checked === true ? Array.from(new Set([...values, optionValue])) : values.filter((value: string) => value !== optionValue),
        );
    }

    function updateFileField(fieldName: string, file: File | null) {
        setData(fieldName, file);
        setFilePreviewUrls((currentUrls) => {
            const nextUrls = { ...currentUrls };

            if (nextUrls[fieldName]) {
                URL.revokeObjectURL(nextUrls[fieldName]);
                delete nextUrls[fieldName];
            }

            if (file) {
                nextUrls[fieldName] = URL.createObjectURL(file);
            }

            return nextUrls;
        });
    }

    function updateFieldValue(fieldName: string, value: any) {
        const nextData = { ...data, [fieldName]: value };

        fields
            .filter((field) => field.syncFrom === fieldName)
            .forEach((field) => {
                nextData[field.name] = syncedFieldValue(String(value ?? ''), field, String(nextData[field.name] ?? ''));
            });

        setData(nextData);
    }

    function togglePasswordVisibility(fieldName: string) {
        setVisiblePasswords((current) => ({
            ...current,
            [fieldName]: !current[fieldName],
        }));
    }

    return (
        <AppLayout user={auth.user}>
            <Head title={title} />

            <div className="mx-auto flex max-w-7xl flex-col gap-6">
                <PageHeader
                    title={title}
                    description={description}
                    actions={
                        <>
                            {headerActions}
                            {canCreate ? (
                                <Button type="button" onClick={() => setOpen(true)}>
                                    <Plus className="h-4 w-4" />
                                    Nuevo
                                </Button>
                            ) : null}
                        </>
                    }
                />

                <DataTable columns={tableColumns} data={items} searchPlaceholder={searchPlaceholder} toolbarContent={tableToolbar} />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
                    onInteractOutside={(event) => event.preventDefault()}
                >
                    <form onSubmit={submit} className="space-y-5">
                        <DialogHeader>
                            <DialogTitle>{editing ? 'Editar registro' : 'Nuevo registro'}</DialogTitle>
                            <DialogDescription>Completa los datos y guarda los cambios.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {fields
                                .filter((field) => !field.hidden)
                                .map((field) => (
                                <label key={field.name} className={field.type === 'textarea' || field.type === 'multiselect' || field.type === 'switchlist' ? 'space-y-2 sm:col-span-2' : 'space-y-2'}>
                                    <span className="text-sm font-medium text-white">
                                        {field.label}
                                        {(field.required || (!editing && field.requiredOnCreate)) && <span className="text-[#FFD000]"> *</span>}
                                    </span>
                                    {field.type === 'textarea' ? (
                                        <Textarea value={data[field.name] ?? ''} onChange={(event) => updateFieldValue(field.name, event.target.value)} />
                                    ) : field.type === 'phone' ? (
                                        <PhoneInput
                                            country="co"
                                            value={String(data[field.name] ?? '')}
                                            onChange={(value) => updateFieldValue(field.name, value)}
                                            inputClass="react-phone-input"
                                            buttonClass="react-phone-flag-button"
                                            dropdownClass="react-phone-dropdown"
                                            containerClass="react-phone-container"
                                            enableSearch
                                            disableSearchIcon
                                            specialLabel=""
                                        />
                                    ) : field.type === 'file' ? (
                                        <div className="space-y-3">
                                            {(filePreviewUrls[field.name] || editing?.[field.previewKey ?? `${field.name}_url`]) && (
                                                <a
                                                    href={filePreviewUrls[field.name] || editing?.[field.previewKey ?? `${field.name}_url`]}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="block w-fit"
                                                >
                                                    <img
                                                        src={filePreviewUrls[field.name] || editing?.[field.previewKey ?? `${field.name}_url`]}
                                                        alt=""
                                                        className="h-28 w-full max-w-xs rounded-md border border-white/10 object-cover"
                                                    />
                                                </a>
                                            )}
                                            <Input
                                                type="file"
                                                accept={field.accept ?? 'image/*'}
                                                onChange={(event) => updateFileField(field.name, event.target.files?.[0] ?? null)}
                                            />
                                        </div>
                                    ) : field.type === 'select' ? (
                                        <Select value={String(data[field.name] || 'none')} onValueChange={(value) => updateFieldValue(field.name, value === 'none' ? '' : value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder={`Seleccionar ${field.label.toLowerCase()}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">Sin seleccionar</SelectItem>
                                                {(field.options ?? []).map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : field.type === 'multiselect' ? (
                                        <div className="grid max-h-48 gap-2 overflow-y-auto rounded-md border border-white/10 bg-white/5 p-3 sm:grid-cols-2">
                                            {(field.options ?? []).map((option) => (
                                                <span key={option.value} className="flex items-center gap-2 text-sm text-white/85">
                                                    <Checkbox
                                                        checked={Array.isArray(data[field.name]) && data[field.name].includes(option.value)}
                                                        onCheckedChange={(checked) => toggleMultiselectValue(field.name, option.value, checked)}
                                                    />
                                                    {option.label}
                                                </span>
                                            ))}
                                        </div>
                                    ) : field.type === 'switchlist' ? (
                                        <div className="space-y-3 rounded-xl border border-white/10 bg-gradient-to-br from-white/8 to-white/4 p-4">
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {(field.options ?? []).map((option) => {
                                                    const isChecked = Array.isArray(data[field.name]) && data[field.name].includes(option.value);

                                                    return (
                                                        <div
                                                            key={option.value}
                                                            className={`rounded-xl border p-3 transition ${
                                                                isChecked
                                                                    ? 'border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(34,211,238,0.15)]'
                                                                    : 'border-white/10 bg-white/5'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div>
                                                                    <p className="text-sm font-medium text-white">{option.label}</p>
                                                                    <p className="text-xs text-white/55">Mostrar modulo en el menu lateral.</p>
                                                                </div>
                                                                <Switch
                                                                    checked={isChecked}
                                                                    onCheckedChange={(checked) => toggleMultiselectValue(field.name, option.value, checked)}
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : field.type === 'date' ? (
                                        <DateTimePicker
                                            value={data[field.name] ?? ''}
                                            onChange={(value) => updateFieldValue(field.name, value)}
                                            placeholder={`Seleccionar ${field.label.toLowerCase()}`}
                                        />
                                    ) : field.type === 'password' ? (
                                        <div className="relative">
                                            <Input
                                                type={visiblePasswords[field.name] ? 'text' : 'password'}
                                                value={data[field.name] ?? ''}
                                                onChange={(event) => updateFieldValue(field.name, event.target.value)}
                                                className="pr-11"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => togglePasswordVisibility(field.name)}
                                                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-white/60 transition hover:text-white"
                                                aria-label={visiblePasswords[field.name] ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                                            >
                                                {visiblePasswords[field.name] ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    ) : (
                                        <Input
                                            type={field.type === 'number' ? 'text' : field.type ?? 'text'}
                                            inputMode={field.type === 'number' ? 'decimal' : undefined}
                                            value={field.type === 'number' ? formatNumericInput(data[field.name] ?? '') : data[field.name] ?? ''}
                                            onChange={(event) =>
                                                updateFieldValue(field.name, field.type === 'number' ? parseNumericInput(event.target.value) : event.target.value)
                                            }
                                        />
                                    )}
                                    {errors[field.name] && <p className="text-xs text-red-300">{errors[field.name]}</p>}
                                </label>
                            ))}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
