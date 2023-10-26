
const tareas = document.querySelectorAll('ul li a');

tareas.forEach(tarea => {
    tarea.addEventListener('click', () => {
        const tareaId = tarea.getAttribute('data-tarea');
        const tareasContainer = document.querySelectorAll('.derecha');

        tareasContainer.forEach(container => {
            if (container.id === tareaId) {
                container.style.display = 'flex'; 
            } else {
                container.style.display = 'none'; 
            }
        });
    });
});


