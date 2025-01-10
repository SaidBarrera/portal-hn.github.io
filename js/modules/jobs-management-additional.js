// Funciones para gestión de empleos
export function handleJobSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const jobData = {
        id: formData.get('id') || Date.now().toString(),
        title: formData.get('title'),
        description: formData.get('description'),
        location: formData.get('location'),
        type: formData.get('type'),
        salaryMin: parseInt(formData.get('salaryMin')),
        salaryMax: parseInt(formData.get('salaryMax')),
        status: 'active',
        createdAt: new Date().toISOString(),
        benefits: getTags('benefitsTags'),
        requirements: getTags('requirementsTags'),
        views: 0,
        applications: 0
    };

    // Validar datos
    if (!validateJobData(jobData)) {
        return;
    }

    // Guardar o actualizar empleo
    saveJob(jobData);

    // Cerrar modal y actualizar vista
    closeModal();
    loadJobs();
    showToast('Empleo guardado exitosamente', 'success');
}

function validateJobData(jobData) {
    if (!jobData.title || jobData.title.length < 5) {
        showToast('El título debe tener al menos 5 caracteres', 'error');
        return false;
    }

    if (!jobData.description || jobData.description.length < 50) {
        showToast('La descripción debe tener al menos 50 caracteres', 'error');
        return false;
    }

    if (jobData.salaryMax && jobData.salaryMin && jobData.salaryMax < jobData.salaryMin) {
        showToast('El salario máximo no puede ser menor al mínimo', 'error');
        return false;
    }

    return true;
}

export function editJob(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) {
        showToast('Empleo no encontrado', 'error');
        return;
    }

    // Abrir modal en modo edición
    openJobModal(jobId);
}

export function deleteJob(jobId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este empleo?')) {
        return;
    }

    const index = jobs.findIndex(j => j.id === jobId);
    if (index !== -1) {
        jobs.splice(index, 1);
        loadJobs();
        showToast('Empleo eliminado exitosamente', 'success');
    }
}

export function toggleJobStatus(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    // Cambiar estado
    if (job.status === 'active') {
        job.status = 'paused';
    } else if (job.status === 'paused') {
        job.status = 'active';
    }

    // Actualizar vista
    loadJobs();
    showToast(`Empleo ${job.status === 'active' ? 'activado' : 'pausado'} exitosamente`, 'success');
}

// Funciones de estadísticas
export function getJobStatistics() {
    return {
        total: jobs.length,
        active: jobs.filter(j => j.status === 'active').length,
        paused: jobs.filter(j => j.status === 'paused').length,
        closed: jobs.filter(j => j.status === 'closed').length,
        totalApplications: jobs.reduce((sum, job) => sum + job.applications, 0),
        totalViews: jobs.reduce((sum, job) => sum + job.views, 0),
        averageApplicationsPerJob: calculateAverageApplications(),
        mostViewedJobs: getMostViewedJobs(5),
        mostAppliedJobs: getMostAppliedJobs(5)
    };
}

function calculateAverageApplications() {
    const activeJobs = jobs.filter(j => j.status === 'active');
    if (activeJobs.length === 0) return 0;
    
    const totalApplications = activeJobs.reduce((sum, job) => sum + job.applications, 0);
    return (totalApplications / activeJobs.length).toFixed(1);
}

function getMostViewedJobs(limit = 5) {
    return [...jobs]
        .sort((a, b) => b.views - a.views)
        .slice(0, limit)
        .map(job => ({
            id: job.id,
            title: job.title,
            views: job.views
        }));
}

function getMostAppliedJobs(limit = 5) {
    return [...jobs]
        .sort((a, b) => b.applications - a.applications)
        .slice(0, limit)
        .map(job => ({
            id: job.id,
            title: job.title,
            applications: job.applications
        }));
}

// Funciones de reportes
export function generateJobReport(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return null;

    return {
        jobDetails: {
            ...job,
            daysActive: calculateDaysActive(job.createdAt),
            applicationRate: calculateApplicationRate(job),
            viewToApplicationRate: calculateViewToApplicationRate(job)
        },
        performanceMetrics: {
            viewsPerDay: calculateViewsPerDay(job),
            applicationsPerDay: calculateApplicationsPerDay(job),
            // Más métricas según necesidad
        }
    };
}

function calculateDaysActive(createdAt) {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculateApplicationRate(job) {
    const daysActive = calculateDaysActive(job.createdAt);
    return (job.applications / daysActive).toFixed(2);
}

function calculateViewToApplicationRate(job) {
    if (job.views === 0) return 0;
    return ((job.applications / job.views) * 100).toFixed(2);
}

function calculateViewsPerDay(job) {
    const daysActive = calculateDaysActive(job.createdAt);
    return (job.views / daysActive).toFixed(2);
}

function calculateApplicationsPerDay(job) {
    const daysActive = calculateDaysActive(job.createdAt);
    return (job.applications / daysActive).toFixed(2);
}