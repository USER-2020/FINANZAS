# Guia de implementacion shadcn/ui

Esta guia aplica cuando el proyecto Laravel + Inertia + React + TypeScript ya exista en este workspace.

## Instalacion base

```bash
npm install lucide-react class-variance-authority clsx tailwind-merge tailwindcss-animate react-hook-form zod @hookform/resolvers sonner
npm install @tanstack/react-table date-fns
npx shadcn@latest init
```

Durante `shadcn init`, usar:

- TypeScript: si
- Style: default o new-york
- Base color: neutral
- CSS variables: si
- Tailwind config: `tailwind.config.js`
- Global CSS: `resources/css/app.css`
- Components path: `resources/js/Components/ui`
- Utils path: `resources/js/lib/utils.ts`

## Componentes shadcn obligatorios

```bash
npx shadcn@latest add button card badge dialog sheet dropdown-menu tabs table input textarea select checkbox switch avatar separator scroll-area tooltip popover calendar command alert progress skeleton sonner form
```

## Estructura sugerida

```text
resources/js/
  Components/
    ui/
    dashboard/
    data-table/
    forms/
    layout/
    shared/
  Layouts/
    AppLayout.tsx
    DashboardShell.tsx
  lib/
    format.ts
    utils.ts
```

## Tailwind

Agregar `tailwindcss-animate` en `tailwind.config.js`:

```js
export default {
  darkMode: ["class"],
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx",
    "./resources/**/*.ts",
    "./resources/**/*.tsx",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
}
```

## Tema The Velvet Studio

Configurar `resources/css/app.css` para que dark mode sea la identidad visual principal.

```css
@layer base {
  :root {
    color-scheme: dark;
  }

  .dark {
    --background: 0 0% 2%;
    --foreground: 0 0% 96%;
    --card: 0 13% 5%;
    --card-foreground: 0 0% 100%;
    --popover: 0 13% 5%;
    --popover-foreground: 0 0% 100%;
    --primary: 350 100% 27%;
    --primary-foreground: 0 0% 100%;
    --secondary: 353 84% 12%;
    --secondary-foreground: 0 0% 100%;
    --muted: 0 0% 12%;
    --muted-foreground: 0 0% 72%;
    --accent: 44 65% 52%;
    --accent-foreground: 0 0% 2%;
    --destructive: 347 100% 38%;
    --destructive-foreground: 0 0% 100%;
    --border: 0 0% 100% / 0.08;
    --input: 0 0% 100% / 0.08;
    --ring: 350 100% 38%;
    --radius: 0.65rem;
  }

  body {
    @apply dark bg-background text-foreground antialiased;
  }
}
```

## Utilidades base

`resources/js/lib/utils.ts`:

```ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

`resources/js/lib/format.ts`:

```ts
export function formatCOP(value: number | string | null | undefined) {
  const amount = Number(value ?? 0)

  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount)
}
```

## Variantes visuales clave

Los botones principales deben sentirse premium y propios de la marca:

```tsx
className="bg-gradient-to-r from-[#8B0018] to-[#C1002B] text-white shadow-lg shadow-[#8B0018]/20 hover:from-[#A4001F] hover:to-[#D10030]"
```

Las cards financieras deben usar superficies oscuras con borde sutil:

```tsx
className="border-white/10 bg-[#0D0A0A]/85 shadow-xl shadow-black/30 backdrop-blur"
```

## Componentes prioritarios

Implementar primero estas primitivas, porque desbloquean el resto de la app:

1. `AppLayout`
2. `DashboardShell`
3. `Header`
4. `Sidebar`
5. `PageHeader`
6. `StatCard`
7. `FinancialCard`
8. `StatusBadge`
9. `MoneyDisplay`
10. `DataTable`
11. `SearchInput`
12. `FilterSheet`
13. `ConfirmDialog`
14. `EmptyState`

## StatusBadge

El componente `StatusBadge` debe mapear estados financieros a variantes visuales consistentes:

```ts
export const financialStatusStyles = {
  planeado: "border-white/10 bg-white/10 text-zinc-300",
  "por hacerse": "border-[#FF8A2A]/30 bg-[#FF8A2A]/15 text-[#FFB36F]",
  cotizado: "border-[#FFD000]/30 bg-[#FFD000]/15 text-[#FFE166]",
  aprobado: "border-[#D4AF37]/30 bg-[#D4AF37]/15 text-[#F1D978]",
  adquirido: "border-emerald-400/30 bg-emerald-400/15 text-emerald-200",
  instalado: "border-blue-400/30 bg-blue-400/15 text-blue-200",
  "en mantenimiento": "border-purple-400/30 bg-purple-400/15 text-purple-200",
  cancelado: "border-zinc-700 bg-zinc-900 text-zinc-400",
  rechazado: "border-[#C1002B]/30 bg-[#C1002B]/15 text-red-200",
  pagado: "border-emerald-400/30 bg-emerald-400/15 text-emerald-200",
  pendiente: "border-[#FFD000]/30 bg-[#FFD000]/15 text-[#FFE166]",
} as const
```

## Dashboard

El dashboard debe abrir directamente en la experiencia operativa, sin landing page. Debe priorizar lectura financiera rapida:

- Cards financieras superiores
- Ingresos vs gastos
- Gastos por departamento
- Gastos por sector
- Compras pendientes
- Ultimos movimientos
- Alertas financieras
- Inventario bajo

## Verificacion

Antes de cerrar la implementacion:

- Ejecutar `npm run build`.
- Revisar que dark mode sea el estado inicial.
- Verificar responsive en mobile y desktop.
- Confirmar que los estados vacios, skeletons, toasts y errores de formulario esten cubiertos.
