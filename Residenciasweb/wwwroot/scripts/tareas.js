
var pdfBase64;
document.addEventListener('DOMContentLoaded', function () {
    // Manejar clic en tareas
    const handleTareaClick = (tarea) => {
        const tareaId = tarea.getAttribute('data-tarea');
        const tareasContainer = document.querySelectorAll('.derecha');

        tareasContainer.forEach(container => {
            container.style.display = (container.id === tareaId) ? 'flex' : 'none';
        });
    };
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



    const enviarBtn = document.getElementById("enviarBtn");
    const formulario = document.querySelector('.formtarea1');
    const erroresLabel = document.querySelector('.errores');

    var errores = erroresLabel;
    enviarBtn.addEventListener("click", async function (event) {
        event.preventDefault();

        errores.textContent = null;
        // Encuentra el formulario asociado al botón clickeado
        let form = event.target.closest('form');;


        if (pdfBase64 != null) {
            let json = {
                IdResidente: form.elements.idres.value,
                NombreArchivo: "mi_archivo.pdf",
                FechaEnvio: new Date().toISOString(),
                NumTarea: form.elements.ntarea.value,
            };

            let response = await fetch("https://apiresidenciaswebca.sistemas19.com/api/ArchivosEnviados", {
                method: 'POST',
                body: JSON.stringify(json),
                headers: {
                    "content-type": "application/json"
                }

            });
            //validar que exista el usuario

            if (response.ok) {

                let idobj = await response1.json();
                console.log(idobj);
                if (pdfBase64 != null) {
                    let json = {
                        Id: idobj,
                        pdfBase64: pdfBase64.replace("data:application/pdf;base64,", "")
                    };
                    let response1 = await fetch("https://apiresidenciaswebca.sistemas19.com/api/ArchivosEnviados/PDF", {
                        method: 'POST',
                        body: JSON.stringify(json),
                        headers: {
                            "content-type": "application/json"
                        }
                    })


                }

            }
            else {
                errores.textContent = "Fallo al subir el pdf.";
            }

        }

        else {

            errores.textContent = "Debes adjuntar un archivo PDF antes de enviar.";
        }


    });
});





