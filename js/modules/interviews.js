// Estado de las entrevistas
const interviewsState = {
    interviews: [],
    currentDate: new Date()
};

export function initializeInterviews() {
    loadInterviews();
    setupInterviewEventListeners();
}

function loadInterviews() {
    // Simular carga de entrevistas
    interviewsState.interviews = [
        {
            id: '1',
            candidateId: '1',
            candidateName: 'Juan Pérez',
            jobId: '1',
            jobTitle: 'Desarrollador Frontend',
            date: '2024-01-20T10:00:00',
            duration: 60, // minutos
            type: 'technical',
            status: 'scheduled',
            interviewers: ['Ana Smith', 'Carlos Rodriguez']
        },
        // Más entrevistas...
    ];

    updateInterviewsCalendar();
}

function setupInterviewEventListeners() {
    // Implementar listeners para el calendario y acciones de entrevistas
}

export function scheduleNewInterview(candidateId) {
    const candidate = getCandidateById(candidateId);
    if (!candidate) return;

    showScheduleModal(candidate);
}

function showScheduleModal(candidate) {
    // Crear y mostrar modal de programación
    const modal = document.createElement('div');
    modal.className = 'modal interview-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Agendar Entrevista</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="scheduleInterviewForm">
                    <input type="hidden" name="candidateId" value="${candidate.id}">
                    
                    <div class="form-group">
                        <label>Candidato</label>
                        <div class="candidate-info-readonly">
                            ${candidate.name} - ${candidate.jobTitle}
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="interviewDate">Fecha</label>
                            <input type="date" id="interviewDate" name="date" required>
                        </div>
                        <div class="form-group">
                            <label for="interviewTime">Hora</label>
                            <input type="time" id="interviewTime" name="time" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="interviewType">Tipo de Entrevista</label>
                        <select id="interviewType" name="type" required>
                            <option value="technical">Técnica</option>
                            <option value="hr">Recursos Humanos</option>
                            <option value="cultural">Cultural</option>
                            <option value="final">Final</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="interviewers">Entrevistadores</label>
                        <select id="interviewers" name="interviewers" multiple required>
                            <!-- Se llena dinámicamente -->
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="duration">Duración (minutos)</label>
                        <select id="duration" name="duration" required>
                            <option value="30">30 minutos</option>
                            <option value="45">45 minutos</option>
                            <option value="60" selected>1 hora</option>
                            <option value="90">1.5 horas</option>
                            <option value="120">2 horas</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="notes">Notas</label>
                        <textarea id="notes" name="notes" rows="3"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline" data-dismiss="modal">
                    Cancelar
                </button>
                <button type="submit" form="scheduleInterviewForm" class="btn btn-primary">
                    Agendar Entrevista
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setupInterviewModal(modal);
}

function setupInterviewModal(modal) {
    const form = modal.querySelector('#scheduleInterviewForm');
    const closeBtn = modal.querySelector('.close-modal');

    form.addEventListener('submit', handleInterviewSchedule);
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });

    // Llenar select de entrevistadores
    const interviewers = getAvailableInterviewers();
    const interviewersSelect = modal.querySelector('#interviewers');
    interviewersSelect.innerHTML = interviewers.map(interviewer => `
        <option value="${interviewer.id}">${interviewer.name}</option>
    `).join('');
}

function handleInterviewSchedule(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Crear objeto de entrevista
    const interview = {
        id: Date.now().toString(),
        candidateId: formData.get('candidateId'),
        date: `${formData.get('date')}T${formData.get('time')}`,
        type: formData.get('type'),
        duration: parseInt(formData.get('duration')),
        interviewers: Array.from(formData.getAll('interviewers')),
        notes: formData.get('notes'),
        status: 'scheduled'
    };

    // Guardar entrevista
    interviewsState.interviews.push(interview);
    
    // Actualizar UI
    updateInterviewsCalendar();
    
    // Cerrar modal
    e.target.closest('.modal').remove();
    
    // Notificar
    showNotification('Entrevista agendada exitosamente', 'success');
}

function getAvailableInterviewers() {
    // Simulación de datos
    return [
        { id: '1', name: 'Ana Smith' },
        { id: '2', name: 'Carlos Rodriguez' },
        { id: '3', name: 'María González' }
    ];
}

// Exportar funciones necesarias
export {
    scheduleNewInterview,
    updateInterviewsCalendar
};