import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { Button } from '@/Components/ui/button';
import { DataTableToolbar } from '@/Components/data-table/DataTableToolbar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { SearchInput } from '@/Components/shared/SearchInput';
import { EmptyState } from '@/Components/shared/EmptyState';

function columnLabel<TData, TValue>(cell: { column: { id: string; columnDef: ColumnDef<TData, TValue> } }) {
    const header = cell.column.columnDef.header;

    return typeof header === 'string' ? header : cell.column.id;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchPlaceholder = 'Buscar...',
    toolbarContent,
}: {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchPlaceholder?: string;
    toolbarContent?: React.ReactNode;
}) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-4">
            <DataTableToolbar>
                <SearchInput
                    placeholder={searchPlaceholder}
                    value={(table.getState().globalFilter as string) ?? ''}
                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                    className="w-full sm:max-w-sm"
                />
                {toolbarContent}
            </DataTableToolbar>

            <div className="space-y-3 md:hidden">
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => {
                        const visibleCells = row.getVisibleCells();
                        const actionCell = visibleCells.find((cell) => cell.column.id === 'actions');
                        const dataCells = visibleCells.filter((cell) => cell.column.id !== 'actions');
                        const titleCell = dataCells[0];
                        const detailCells = dataCells.slice(1);

                        return (
                            <article key={row.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4 shadow-lg shadow-black/20">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
                                            {titleCell ? columnLabel(titleCell) : 'Registro'}
                                        </p>
                                        <div className="mt-1 break-words text-base font-semibold text-white">
                                            {titleCell ? flexRender(titleCell.column.columnDef.cell, titleCell.getContext()) : '-'}
                                        </div>
                                    </div>
                                    {actionCell && (
                                        <div className="shrink-0">
                                            {flexRender(actionCell.column.columnDef.cell, actionCell.getContext())}
                                        </div>
                                    )}
                                </div>

                                {detailCells.length > 0 && (
                                    <div className="mt-4 grid gap-3">
                                        {detailCells.map((cell) => (
                                            <div key={cell.id} className="grid grid-cols-[7rem_1fr] gap-3 text-sm">
                                                <span className="text-muted-foreground">
                                                    {columnLabel(cell)}
                                                </span>
                                                <span className="min-w-0 break-words text-right text-white/90">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </article>
                        );
                    })
                ) : (
                    <div className="rounded-lg border border-white/10 p-4">
                        <EmptyState title="Sin resultados" description="Ajusta la busqueda o los filtros para ver datos." />
                    </div>
                )}
            </div>

            <div className="hidden rounded-lg border border-white/10 md:block">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length}>
                                    <EmptyState title="Sin resultados" description="Ajusta la busqueda o los filtros para ver datos." />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    Anterior
                </Button>
                <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    Siguiente
                </Button>
            </div>
        </div>
    );
}
