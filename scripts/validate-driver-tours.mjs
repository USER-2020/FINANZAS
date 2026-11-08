import fs from 'node:fs';

const navigation = fs.readFileSync('config/navigation.php', 'utf8');
const catalog = fs.readFileSync('resources/js/lib/driverTours.ts', 'utf8');
const layout = fs.readFileSync('resources/js/Components/layout/AppLayout.tsx', 'utf8');

const navigationKeys = [...navigation.matchAll(/\['key'\s*=>\s*'([^']+)'/g)].map((match) => match[1]);
const catalogKeys = [...catalog.matchAll(/\{ key: '([^']+)'/g)].map((match) => match[1]);
const missing = [...new Set(navigationKeys)].filter((key) => !catalogKeys.includes(key));
const duplicates = catalogKeys.filter((key, index) => catalogKeys.indexOf(key) !== index);

if (!layout.includes('data-tour={`menu:${item.key}`}')) {
    console.error('Falta el selector dinámico data-tour del menú en AppLayout.tsx');
    process.exit(1);
}

if (missing.length || duplicates.length) {
    if (missing.length) console.error(`Módulos sin tour: ${missing.join(', ')}`);
    if (duplicates.length) console.error(`Claves duplicadas en el catálogo: ${duplicates.join(', ')}`);
    process.exit(1);
}

console.log(`Driver.js validado: ${new Set(navigationKeys).size} módulos de navegación cubiertos.`);
