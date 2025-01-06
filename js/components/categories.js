document.addEventListener('DOMContentLoaded', function() {
    const categoriesGrid = document.querySelector('.categories-grid');
    const prevButton = document.getElementById('prevCategory');
    const nextButton = document.getElementById('nextCategory');

    // Valor de scroll para cada click
    const scrollAmount = 300;

    if (prevButton && nextButton) {
        // Scroll hacia la izquierda
        prevButton.addEventListener('click', () => {
            categoriesGrid.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        // Scroll hacia la derecha
        nextButton.addEventListener('click', () => {
            categoriesGrid.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Actualizar estado de los botones
        const updateButtonStates = () => {
            prevButton.disabled = categoriesGrid.scrollLeft <= 0;
            nextButton.disabled = 
                categoriesGrid.scrollLeft >= 
                categoriesGrid.scrollWidth - categoriesGrid.clientWidth;

            // Actualizar estilos visuales
            prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
            nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
        };

        // Escuchar el evento scroll
        categoriesGrid.addEventListener('scroll', updateButtonStates);
        
        // Verificar estado inicial
        updateButtonStates();
    }
});