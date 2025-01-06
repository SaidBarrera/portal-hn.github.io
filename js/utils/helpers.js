// Funciones de utilidad general
export function getStatusText(status) {
    const statusMap = {
        'pending': 'Pendiente',
        'accept': 'Aceptado',
        'reject': 'Rechazado'
    };
    return statusMap[status] || status;
}

export function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

export function createNotification(userEmail, message) {
    console.log(`Notificación para ${userEmail}: ${message}`);
    showToast(message);
}

// Funciones para exportación de datos
export function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const rows = [
        headers.join(','),
        ...data.map(obj => headers.map(header => JSON.stringify(obj[header])).join(','))
    ];
    return rows.join('\n');
}

export function downloadCSV(content, fileName) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}