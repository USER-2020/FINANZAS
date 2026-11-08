import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Camera, CheckCircle2, FileScan, Loader2, Plus, RotateCcw, Trash2, Upload } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { DateTimePicker } from '@/Components/shared/DateTimePicker';
import type { ResourceRow } from '@/Pages/Crud/ResourceIndex';
import toast from 'react-hot-toast';

type InvoiceItem = { description: string; quantity: number; unit_price: number; line_total?: number; total: number };
type InvoiceData = {
    document_type?: 'thermal_receipt' | 'structured_invoice' | 'generic_document';
    merchant: string | null;
    nit: string | null;
    invoice_number: string | null;
    date: string | null;
    total: number | null;
    subtotal: number | null;
    tax: number | null;
    discount: number | null;
    items: InvoiceItem[];
    confidence: number | null;
    raw_text: string;
    requires_review: boolean;
};

function numberValue(value: string | number | null | undefined): number {
    if (typeof value === 'number') return value;
    return Number(String(value ?? '').replace(/\./g, '').replace(',', '.')) || 0;
}

export function InvoiceScanner({ categories, initialOpen = false }: { categories: ResourceRow[]; initialOpen?: boolean }) {
    const [open, setOpen] = useState(initialOpen);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [step, setStep] = useState<'capture' | 'processing' | 'review'>('capture');
    const [invoice, setInvoice] = useState<InvoiceData | null>(null);
    const [categoryId, setCategoryId] = useState('');
    const [account, setAccount] = useState('');
    const [amount, setAmount] = useState('');
    const [processing, setProcessing] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [scanStage, setScanStage] = useState('Preparando la imagen…');

    useEffect(() => {
        if (initialOpen) {
            setOpen(true);
        }
    }, [initialOpen]);

    const confidenceLabel = useMemo(() => {
        if (!invoice?.confidence) return 'No disponible';
        return `${Math.round(invoice.confidence * 100)}% de confianza OCR`;
    }, [invoice?.confidence]);
    const itemsTotal = useMemo(() => invoice?.items.reduce((sum, item) => sum + numberValue(item.line_total ?? item.total), 0) ?? 0, [invoice?.items]);
    const itemsMismatch = Boolean(invoice?.items.length && Math.abs(itemsTotal - numberValue(amount)) > 1);

    useEffect(() => () => {
        if (preview) URL.revokeObjectURL(preview);
    }, [preview]);

    function reset() {
        setFile(null);
        setPreview(null);
        setStep('capture');
        setInvoice(null);
        setCategoryId('');
        setAccount('');
        setAmount('');
        setProcessing(false);
        setScanProgress(0);
        setScanStage('Preparando la imagen…');
    }

    function handleFile(event: ChangeEvent<HTMLInputElement>) {
        const selected = event.target.files?.[0] ?? null;
        if (!selected) return;
        if (selected.size > 8 * 1024 * 1024) {
            toast.error('La factura no puede superar los 8 MB.');
            event.target.value = '';
            return;
        }
        if (preview) URL.revokeObjectURL(preview);
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
        setInvoice(null);
        setStep('capture');
    }

    async function scan() {
        if (!file) return;
        setProcessing(true);
        setStep('processing');
        setScanProgress(12);
        setScanStage('Preparando la imagen…');
        const formData = new FormData();
        formData.append('file', file);
        const progressInterval = window.setInterval(() => {
            setScanProgress((current) => {
                if (current < 30) {
                    setScanStage('Enviando la factura de forma segura…');
                    return Math.min(current + 7, 30);
                }
                if (current < 68) {
                    setScanStage('Detectando texto y estructura…');
                    return Math.min(current + 5, 68);
                }
                if (current < 91) {
                    setScanStage('Interpretando importes, fecha y comercio…');
                    return Math.min(current + 2, 91);
                }
                setScanStage('Terminando la lectura…');
                return current;
            });
        }, 800);

        try {
            // Axios debe construir automáticamente el boundary multipart; si se fija a mano,
            // algunos navegadores envían el archivo sin el separador y Laravel lo recibe vacío.
            const response = await axios.post('/api/invoices/scan', formData);
            const parsed = response.data.invoice as InvoiceData;
            setScanProgress(100);
            setScanStage('Lectura completada. Preparando revisión…');
            setInvoice(parsed);
            setAmount(parsed.total?.toString() ?? '');
            await new Promise((resolve) => window.setTimeout(resolve, 350));
            setStep('review');
        } catch (error: any) {
            setStep('capture');
            setScanProgress(0);
            setScanStage('Preparando la imagen…');
            const validationErrors = error?.response?.data?.errors as Record<string, string[]> | undefined;
            const firstValidationError = validationErrors ? Object.values(validationErrors).flat()[0] : null;
            toast.error(firstValidationError ?? error?.response?.data?.message ?? 'No se pudo leer la factura.');
        } finally {
            window.clearInterval(progressInterval);
            setProcessing(false);
        }
    }

    function updateItem(index: number, key: keyof InvoiceItem, value: string) {
        if (!invoice) return;
        const items = [...invoice.items];
        const item = { ...items[index], [key]: key === 'description' ? value : numberValue(value) };
        if (key === 'quantity' || key === 'unit_price') {
            item.line_total = item.quantity * item.unit_price;
            item.total = item.line_total;
        }
        items[index] = item;
        setInvoice({ ...invoice, items });
    }

    function removeItem(index: number) {
        if (!invoice) return;
        setInvoice({ ...invoice, items: invoice.items.filter((_, itemIndex) => itemIndex !== index) });
    }

    function addItem() {
        setInvoice((current) => current ? { ...current, items: [...current.items, { description: '', quantity: 1, unit_price: 0, line_total: 0, total: 0 }] } : current);
    }

    function confirmMovement() {
        if (!file || !invoice || !amount || numberValue(amount) <= 0) {
            toast.error('Revisa el valor total antes de guardar.');
            return;
        }

        const itemDescription = invoice.items
            .filter((item) => item.description.trim())
            .map((item) => `${item.description} x${item.quantity} — ${item.total}`)
            .join('\n');

        router.post('/financial-movements', {
            concept: invoice.merchant || 'Factura escaneada',
            merchant_name: invoice.merchant,
            invoice_number: invoice.invoice_number,
            invoice_nit: invoice.nit,
            type: 'Gasto',
            amount: numberValue(amount),
            movement_date: invoice.date || new Date().toISOString().slice(0, 10),
            status: 'Pagado',
            category_id: categoryId,
            account,
            description: itemDescription || invoice.raw_text.slice(0, 5000),
            ocr_raw_text: invoice.raw_text,
            ocr_confidence: invoice.confidence,
            image: file,
        }, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Gasto creado desde la factura.');
                setOpen(false);
                reset();
            },
            onError: () => toast.error('No se pudo guardar el gasto. Revisa los campos e intenta nuevamente.'),
        });
    }

    return (
        <Dialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) reset(); }}>
            <DialogTrigger asChild>
                <Button type="button" variant="outline"><FileScan className="h-4 w-4" /> Escanear factura</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><FileScan className="h-5 w-5 text-emerald-300" /> Registrar gasto desde factura</DialogTitle>
                    <DialogDescription>Captura, procesa y revisa los datos antes de crear el movimiento.</DialogDescription>
                </DialogHeader>

                <DialogBody className="space-y-4 pr-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {['Capturar', 'Procesar', 'Revisar'].map((label, index) => <span key={label} className={index <= (step === 'capture' ? 0 : step === 'processing' ? 1 : 2) ? 'text-emerald-300' : ''}>{index + 1}. {label}</span>)}
                </div>

                {step === 'capture' && (
                    <div className="space-y-4">
                        <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-emerald-300/30 bg-emerald-300/[0.05] p-8 text-center transition hover:bg-emerald-300/[0.1]">
                            <div className="rounded-2xl bg-emerald-300/10 p-4 text-emerald-300"><Camera className="h-8 w-8" /></div>
                            <div><p className="font-medium text-white">Usar cámara o seleccionar factura</p><p className="mt-1 text-xs text-muted-foreground">JPG, PNG o WebP · máximo 8 MB</p></div>
                            <Input type="file" accept="image/jpeg,image/png,image/webp" capture="environment" onChange={handleFile} className="hidden" />
                        </label>
                        {preview && <img src={preview} alt="Vista previa de factura" className="max-h-72 w-full rounded-2xl border border-white/10 object-contain" />}
                    </div>
                )}

                {step === 'processing' && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 rounded-2xl border border-emerald-300/15 bg-gradient-to-br from-emerald-300/[0.08] to-white/[0.03] p-6 text-center" aria-live="polite">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-300/10 text-emerald-300 shadow-[0_0_35px_rgba(52,211,153,0.16)]">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                        <div>
                            <p className="font-medium text-white">Analizando tu factura</p>
                            <p className="mt-1 text-sm text-emerald-100/75">{scanStage}</p>
                        </div>
                        <div className="space-y-2 text-left">
                            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>Progreso de lectura</span><span className="font-semibold text-emerald-300">{scanProgress}%</span></div>
                            <div className="h-2 overflow-hidden rounded-full bg-slate-900/80" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={scanProgress} aria-label="Progreso de lectura de factura">
                                <motion.div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400" animate={{ width: `${scanProgress}%` }} transition={{ ease: 'easeOut', duration: 0.35 }} />
                            </div>
                        </div>
                        <div className="grid gap-2 text-left text-xs sm:grid-cols-3">
                            {[
                                ['Imagen preparada', scanProgress >= 20],
                                ['Texto detectado', scanProgress >= 68],
                                ['Datos interpretados', scanProgress >= 100],
                            ].map(([label, done]) => <div key={String(label)} className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${done ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-200' : 'border-white/10 bg-white/[0.02] text-muted-foreground'}`}><span className={`h-2 w-2 rounded-full ${done ? 'bg-emerald-300' : 'bg-slate-600'}`} />{label}</div>)}
                        </div>
                        <p className="text-xs text-muted-foreground">Este proceso puede tardar unos segundos. No cierres la ventana.</p>
                    </motion.div>
                )}

                {step === 'review' && invoice && (
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06] p-3 text-sm text-cyan-50">
                            <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2 py-0.5 text-xs font-medium text-cyan-200">
                                {invoice.document_type === 'thermal_receipt' ? 'Recibo térmico' : invoice.document_type === 'structured_invoice' ? 'Factura estructurada' : 'Documento financiero'}
                            </span>
                            <span>Los importes de productos se organizaron y validaron contra el total.</span>
                            <span className="text-cyan-200/70">{confidenceLabel}</span>
                        </div>
                        {invoice.requires_review && <div className="rounded-xl border border-amber-300/25 bg-amber-300/10 p-3 text-sm text-amber-100">Revisa los datos resaltados: el OCR encontró campos que pueden necesitar corrección.</div>}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="space-y-2"><span className="text-sm font-medium text-white">Comercio</span><Input value={invoice.merchant ?? ''} onChange={(event) => setInvoice({ ...invoice, merchant: event.target.value })} /></label>
                            <label className="space-y-2"><span className="text-sm font-medium text-white">Fecha</span><DateTimePicker value={invoice.date ?? ''} onChange={(value) => setInvoice({ ...invoice, date: value.slice(0, 10) })} placeholder="Seleccionar fecha" /></label>
                            <label className="space-y-2"><span className="text-sm font-medium text-white">Total pagado</span><Input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
                            <label className="space-y-2"><span className="text-sm font-medium text-white">Cuenta o billetera</span><Input value={account} onChange={(event) => setAccount(event.target.value)} placeholder="Bancolombia, efectivo…" /></label>
                            <label className="space-y-2 sm:col-span-2"><span className="text-sm font-medium text-white">Categoría</span><Select value={categoryId || 'none'} onValueChange={(value) => setCategoryId(value === 'none' ? '' : value)}><SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger><SelectContent><SelectItem value="none">Sin categoría</SelectItem>{categories.map((category) => <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>)}</SelectContent></Select></label>
                        </div>
                        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                            <div className="flex items-center justify-between"><p className="text-sm font-medium text-white">Productos detectados</p><Button type="button" size="sm" variant="outline" onClick={addItem}><Plus className="h-3.5 w-3.5" /> Añadir</Button></div>
                            {invoice.items.length ? <>
                                <div className="hidden grid-cols-[1fr_5rem_8rem_8rem_auto] gap-2 px-1 text-[11px] uppercase tracking-wide text-muted-foreground sm:grid"><span>Producto</span><span>Cant.</span><span>Unitario</span><span>Total línea</span><span /></div>
                                {invoice.items.map((item, index) => {
                                    const lineTotal = numberValue(item.line_total ?? item.total);
                                    return <div key={`${item.description}-${index}`} className="grid gap-2 sm:grid-cols-[1fr_5rem_8rem_8rem_auto]">
                                        <Input value={item.description} onChange={(event) => updateItem(index, 'description', event.target.value)} placeholder="Producto" />
                                        <Input value={item.quantity} onChange={(event) => updateItem(index, 'quantity', event.target.value)} inputMode="decimal" aria-label="Cantidad" />
                                        <Input value={item.unit_price} onChange={(event) => updateItem(index, 'unit_price', event.target.value)} inputMode="decimal" aria-label="Precio unitario" />
                                        <Input value={lineTotal} readOnly aria-label="Total de línea" className="bg-emerald-300/[0.06] text-emerald-100" />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)} aria-label="Eliminar producto"><Trash2 className="h-4 w-4 text-rose-300" /></Button>
                                    </div>;
                                })}
                            </> : <p className="text-sm text-muted-foreground">No se detectaron productos con suficiente confianza. Puedes registrar el total igualmente.</p>}
                            {itemsMismatch && <p className="text-xs text-amber-200">La suma de los productos ({itemsTotal.toLocaleString('es-CO')}) no coincide con el total del gasto. Revisa cantidades y precios.</p>}
                        </div>
                        <Textarea value={invoice.raw_text} readOnly className="min-h-24 text-xs text-muted-foreground" aria-label="Texto OCR" />
                    </div>
                )}
                </DialogBody>

                <DialogFooter>
                    {step === 'capture' && <Button type="button" onClick={scan} disabled={!file || processing}><Upload className="h-4 w-4" /> Leer factura</Button>}
                    {step === 'processing' && <Button type="button" disabled><Loader2 className="h-4 w-4 animate-spin" /> Procesando…</Button>}
                    {step === 'review' && <><Button type="button" variant="outline" onClick={() => setStep('capture')}><RotateCcw className="h-4 w-4" /> Volver</Button><Button type="button" onClick={confirmMovement}><CheckCircle2 className="h-4 w-4" /> Confirmar gasto</Button></>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
