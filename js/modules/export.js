export function exportJobs(jobs, format = 'csv') {
    switch (format) {
        case 'csv':
            exportToCSV(jobs);
            break;
        case 'excel':
            exportToExcel(jobs);
            break;
        default:
            console.error('Formato no soportado');
    }
}

function exportToCSV(jobs) {
    // Preparar los datos
    const headers = [
        'Título',
        'Ubicación',
        'Tipo',
        'Salario Mínimo',
        'Salario Máximo',
        'Estado',
        'Postulaciones',
        'Vistas',
        'Fecha de Creación'
    ];

    const data = jobs.map(job => [
        job.title,
        job.location,
        job.type,
        job.salaryMin,
        job.salaryMax,
        job.status,
        job.applications,
        job.views,
        job.createdAt
    ]);

    // Crear el contenido CSV
    const csvContent = [
        headers.join(','),
        ...data.map(row => row.join(','))
    ].join('\n');

    // Crear y descargar el archivo
    downloadFile(csvContent, 'empleos.csv', 'text/csv');
}

function exportToExcel(jobs) {
    // Aquí iría la lógica para exportar a Excel
    // Necesitaría una librería como SheetJS
    console.log('Exportación a Excel no implementada');
}

function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}