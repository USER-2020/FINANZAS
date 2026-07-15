# Stack obligatorio y sistema visual

## Stack obligatorio

El proyecto The Velvet Studio debe construirse con el siguiente stack:

- PHP 8.2
- Laravel 10
- Laravel Breeze
- Inertia.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- Lucide React
- Spatie Laravel Permission
- MySQL
- Vite
- Vite PWA
- Recharts o ApexCharts
- Laravel Excel para exportaciones
- DomPDF o Browsershot para reportes PDF
- Framer Motion para microanimaciones

## Requisito visual principal

shadcn/ui debe ser el sistema principal de componentes para construir una interfaz moderna, elegante, consistente y escalable.

El proyecto debe instalar y configurar shadcn/ui sobre React, TypeScript y Tailwind dentro de Laravel + Inertia.

## Componentes shadcn/ui obligatorios

El proyecto debe incluir y estandarizar el uso de estos componentes:

- Button
- Card
- Badge
- Dialog
- Sheet
- Dropdown Menu
- Tabs
- Table
- Input
- Textarea
- Select
- Checkbox
- Switch
- Avatar
- Separator
- Scroll Area
- Tooltip
- Popover
- Calendar
- Command
- Alert
- Progress
- Skeleton
- Toast / Sonner
- Form

## Librerias complementarias

El frontend debe incluir:

- lucide-react
- class-variance-authority
- clsx
- tailwind-merge
- tailwindcss-animate
- react-hook-form
- zod
- @hookform/resolvers

## Tema shadcn personalizado para The Velvet Studio

El tema debe evitar la apariencia generica de shadcn/ui. La interfaz debe sentirse propia de The Velvet Studio: premium, oscura, financiera, clara y refinada.

### Paleta de marca

- Negro principal: `#050505`
- Negro secundario: `#0D0A0A`
- Vino tinto oscuro: `#3A050B`
- Rojo Velvet: `#8B0018`
- Rojo accion: `#C1002B`
- Dorado: `#D4AF37`
- Amarillo acento: `#FFD000`
- Naranja calido: `#FF8A2A`
- Blanco texto: `#FFFFFF`
- Gris texto: `#B7B7B7`

### Variables CSS recomendadas en modo dark

- `background`: negro profundo
- `foreground`: blanco suave
- `card`: negro secundario con glassmorphism
- `card-foreground`: blanco
- `primary`: rojo velvet
- `primary-foreground`: blanco
- `secondary`: vino tinto oscuro
- `secondary-foreground`: blanco
- `accent`: dorado / naranja calido
- `accent-foreground`: negro
- `muted`: gris oscuro
- `muted-foreground`: gris claro
- `border`: `rgba(255,255,255,0.08)`
- `input`: `rgba(255,255,255,0.08)`
- `ring`: rojo velvet / dorado

## Configuracion visual esperada

shadcn/ui debe quedar configurado con:

- Dark mode por defecto
- Componentes con bordes suaves
- Cards oscuras con borde sutil
- Botones premium con gradiente rojo velvet
- Badges por estado financiero
- Dialogs elegantes
- Tablas modernas
- Formularios limpios
- Tabs para modulos financieros
- Sheets laterales para filtros
- Dropdowns para acciones rapidas
- Toasts para confirmaciones
- Skeletons para carga de datos

## Componentes personalizados basados en shadcn/ui

Crear componentes reutilizables usando shadcn/ui como base:

- AppLayout
- DashboardShell
- Sidebar
- Header
- StatCard
- FinancialCard
- StatusBadge
- MoneyDisplay
- DataTable
- DataTableToolbar
- DataTableFilters
- SearchInput
- FilterSheet
- DateRangePicker
- DepartmentCard
- BudgetProgress
- CashFlowChartCard
- SectorExpenseChartCard
- DepartmentExpenseChartCard
- EmptyState
- ConfirmDialog
- FormWizard
- FileUploader
- ApprovalTimeline
- QuickActionMenu
- ModuleTabs
- PageHeader
- SectionTitle
- MetricGrid

## DataTable

Crear una tabla reutilizable basada en shadcn/ui y TanStack Table cuando sea necesario.

Debe soportar:

- Busqueda
- Filtros
- Ordenamiento
- Paginacion
- Acciones por fila
- Estados con badges
- Formato de moneda COP
- Fechas
- Columnas configurables
- Empty state
- Skeleton loading

## Formularios

Los formularios deben construirse con:

- react-hook-form
- zod
- shadcn Form
- shadcn Input
- shadcn Select
- shadcn Textarea
- shadcn Calendar
- shadcn Dialog
- shadcn Button

Todos los formularios deben tener:

- Validacion frontend con Zod
- Errores visuales claros
- Estados loading
- Boton guardar
- Boton cancelar
- Toast de exito/error
- Diseno responsive

## Badges de estados financieros

Crear el componente `StatusBadge` usando shadcn `Badge`.

Estados y colores:

- Planeado: gris
- Por hacerse: naranja
- Cotizado: amarillo
- Aprobado: dorado
- Adquirido: verde
- Instalado: azul
- En mantenimiento: morado
- Cancelado: gris oscuro
- Rechazado: rojo
- Pagado: verde
- Pendiente: amarillo

## Dashboard

Construir el dashboard con shadcn Card, Tabs, Progress, Badge y componentes de graficos.

Secciones obligatorias:

- Cards financieras superiores
- Grafica de ingresos vs gastos
- Gastos por departamento
- Gastos por sector
- Compras pendientes
- Ultimos movimientos
- Alertas financieras
- Inventario bajo

## Checklist de implementacion cuando exista el proyecto Laravel

1. Instalar Laravel Breeze con Inertia, React y TypeScript.
2. Instalar Tailwind CSS y validar que Vite compile correctamente.
3. Instalar shadcn/ui y configurar `components.json`.
4. Instalar los componentes shadcn/ui obligatorios.
5. Agregar `tailwindcss-animate` al preset de Tailwind.
6. Configurar dark mode por defecto.
7. Definir las variables CSS de marca en `resources/css/app.css`.
8. Crear utilidades `cn`, formato COP y helpers de fechas.
9. Crear los componentes base en `resources/js/Components`.
10. Crear layouts principales en `resources/js/Layouts`.
11. Crear componentes de dashboard y graficos.
12. Crear `StatusBadge`, `MoneyDisplay` y `DataTable` como primitivas reutilizables.
13. Estandarizar formularios con react-hook-form, zod y shadcn Form.
14. Configurar Sonner para toasts globales.
15. Verificar responsive, estados loading, estados vacios y accesibilidad basica.
