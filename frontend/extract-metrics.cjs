const fs = require('fs');

const html = fs.readFileSync('./lighthouse/critical-css-report.html', 'utf8');

// Buscar el JSON embebido en el HTML
const jsonMatch = html.match(/window\.__LIGHTHOUSE_JSON__\s*=\s*({[\s\S]*?});/);

if (!jsonMatch) {
    console.log('No se encontró el JSON de resultados');
    process.exit(1);
}

const results = JSON.parse(jsonMatch[1]);

// Extraer métricas
const audits = results.audits || {};

console.log('=== Métricas de Rendimiento ===\n');

const perfScore = audits.performance?.score;
console.log('Performance Score:', perfScore !== undefined ? (perfScore * 100).toFixed(0) : 'N/A');

const fcp = audits['first-contentful-paint']?.numericValue;
console.log('First Contentful Paint (FCP):', fcp !== undefined ? (fcp / 1000).toFixed(2) + 's' : 'N/A');

const lcp = audits['largest-contentful-paint']?.numericValue;
console.log('Largest Contentful Paint (LCP):', lcp !== undefined ? (lcp / 1000).toFixed(2) + 's' : 'N/A');

const si = audits['speed-index']?.numericValue;
console.log('Speed Index:', si !== undefined ? (si / 1000).toFixed(2) + 's' : 'N/A');

const tbt = audits['total-blocking-time']?.numericValue;
console.log('Total Blocking Time:', tbt !== undefined ? tbt.toFixed(0) + 'ms' : 'N/A');

const cls = audits['cumulative-layout-shift']?.numericValue;
console.log('Cumulative Layout Shift:', cls !== undefined ? cls.toFixed(3) : 'N/A');

console.log('\n=== Objetivo ===');
console.log('FCP objetivo: < 1.8s');
console.log('FCP actual:', fcp !== undefined ? (fcp / 1000).toFixed(2) + 's' : 'N/A');
console.log('Estado:', fcp !== undefined && (fcp / 1000) < 1.8 ? '✅ CUMPLIDO' : '❌ NO CUMPLIDO');

// Guardar resumen
const summary = {
    timestamp: new Date().toISOString(),
    performance: perfScore,
    fcp: fcp ? (fcp / 1000).toFixed(2) + 's' : 'N/A',
    lcp: lcp ? (lcp / 1000).toFixed(2) + 's' : 'N/A',
    speedIndex: si ? (si / 1000).toFixed(2) + 's' : 'N/A',
    tbt: tbt ? tbt.toFixed(0) + 'ms' : 'N/A',
    cls: cls !== undefined ? cls.toFixed(3) : 'N/A',
    fcpTarget: '< 1.8s',
    fcpMet: fcp !== undefined && (fcp / 1000) < 1.8
};

fs.writeFileSync('./lighthouse/summary.json', JSON.stringify(summary, null, 2));
console.log('\nResumen guardado en: ./lighthouse/summary.json');
