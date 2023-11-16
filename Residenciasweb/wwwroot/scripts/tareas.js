
//const tareas = document.querySelectorAll('ul li a');

//tareas.forEach(tarea => {
//    tarea.addEventListener('click', () => {
//        const tareaId = tarea.getAttribute('data-tarea');
//        const tareasContainer = document.querySelectorAll('.derecha');

//        tareasContainer.forEach(container => {
//            if (container.id === tareaId) {
//                container.style.display = 'flex'; 
//            } else {
//                container.style.display = 'none'; 
//            }
//        });
//    });
//});

//document.addEventListener('DOMContentLoaded', function () {
//    var inputPdf = document.getElementById('inputPdf');
//    var archivoNav = document.querySelector('.archivo');
//    var mitarea = document.querySelector('.mitarea');

//    // Manejar el cambio en el campo de entrada de archivo
//    inputPdf.addEventListener('change', function () {
//        if (inputPdf.files.length > 0) {
//            var fileName = inputPdf.files[0].name; // Obtener el nombre del archivo seleccionado
//            mitarea.textContent = fileName; // Mostrar el nombre del archivo en el elemento con la clase "mitarea"
//            archivoNav.style.display = 'flex'; // Mostrar el elemento con la clase "archivo"
//        } else {
//            mitarea.textContent = ''; // Limpiar el contenido del elemento con la clase "mitarea"
//            archivoNav.style.display = 'none'; // Ocultar el elemento con la clase "archivo"
//        }
//    });
//});


document.addEventListener('DOMContentLoaded', function () {
    // Manejar clic en tareas
    const handleTareaClick = (tarea) => {
        const tareaId = tarea.getAttribute('data-tarea');
        const tareasContainer = document.querySelectorAll('.derecha');

        tareasContainer.forEach(container => {
            container.style.display = (container.id === tareaId) ? 'flex' : 'none';
        });
    };
    var pdfBase64;
    // Manejar cambio en el campo de entrada de archivo
    const handlePdfChange = (inputPdf, archivoNav, mitarea) => {
        inputPdf.addEventListener('change', function () {
            if (inputPdf.files.length > 0) {
                const file = inputPdf.files[0];
                const fileName = file.name;
                mitarea.textContent = fileName;
                archivoNav.style.display = 'flex';

                // Leer el contenido del archivo como base64
                const reader = new FileReader();
                reader.onload = function (e) {
                    const base64Content = e.target.result;
                    // Aquí puedes hacer lo que quieras con el contenido base64, como guardarlo en una variable.
                    pdfBase64 = base64Content;
                };
                reader.readAsDataURL(file);
            } else {
                mitarea.textContent = '';
                archivoNav.style.display = 'none';
            }
        });
    };
    
    // Manejar clic en el nav de archivo para cambiar el PDF
    const handleArchivoNavClick = (inputPdf) => {
        const archivoNav = document.querySelector('.archivo');
        archivoNav.addEventListener('click', function () {
            // Abrir el diálogo de selección de archivo al hacer clic en el nav
            inputPdf.click();
        });
    };

    // Manejar clic en el botón para eliminar la tarea
    const handleEliminarTareaClick = (inputPdf, archivoNav, mitarea) => {
        const eliminarTareaBtn = document.getElementById('eliminarTarea');
        eliminarTareaBtn.addEventListener('click', function () {
            mitarea.textContent = '';
            archivoNav.style.display = 'none';
            inputPdf.value = ''; // Vaciar el campo de entrada de archivos
        });
    };

    // Obtener elementos del DOM
    const inputPdf = document.getElementById('inputPdf');
    const archivoNav = document.querySelector('.archivo');
    const mitarea = document.querySelector('.mitarea');
    const tareas = document.querySelectorAll('ul li a');

    // Manejar clic en cada tarea
    tareas.forEach(tarea => {
        tarea.addEventListener('click', () => handleTareaClick(tarea));
    });

    // Manejar cambio en el campo de entrada de archivo
    handlePdfChange(inputPdf, archivoNav, mitarea);

    // Manejar clic en el nav de archivo para cambiar el PDF
    handleArchivoNavClick(inputPdf);

    // Manejar clic en el botón para eliminar la tarea
    handleEliminarTareaClick(inputPdf, archivoNav, mitarea);
});



