var pdfBase64;
let tareaActual; // Variable global para almacenar el número de tarea actual

document.addEventListener('DOMContentLoaded', function () {
    // Obtener elementos del DOM
    const inputPdf = document.getElementById('inputPdf');
    const archivoNav = document.querySelector('.archivo');
    const mitarea = document.querySelector('.mitarea');

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

    // Manejar clic en cada tarea
    const tareas = document.querySelectorAll('ul li a');
    tareas.forEach(tarea => {
        tarea.addEventListener('click', handleTareaClick);
    });

    function handleTareaClick(event) {
        // Obtener el número de tarea desde el atributo data-tarea
        tareaActual = event.target.getAttribute('data-tarea');

        // Hacer una solicitud a la API para obtener los datos de la tarea específica
        obtenerDatosDeTarea(tareaActual);
    }

    async function obtenerDatosDeTarea(tareaId) {
        try {
            if (tareaId !== undefined) {
                let response = await fetch(`https://localhost:7136/api/AsginarTareas/${tareaId.substring(5)}`);
                if (response.ok) {
                    let datos = await response.json();

                    var titulo = document.getElementById("titulo");
                    var numeroTarea = document.getElementById("numtarea");
                    var instruccion = document.getElementById("instruccion");
                    var fecha = document.getElementById("fecha");
                    var mostrarnombrepdf = document.getElementById("nombredelpdf");

                    titulo.textContent = datos.nombreTarea;
                    mostrarnombrepdf.textContent = datos.nombreTarea+".PDF";
                    numeroTarea.value = datos.numTarea;
                    instruccion.textContent = datos.intruccion;
                    fecha.textContent = datos.fecha.replace("T", " ");

                    console.log("Archivos enviados:", datos);
                } else {
                    console.error("Error al obtener archivos enviados");
                }
            }
        } catch (error) {
            console.error("Error de red:", error);
        }
    }

    // ... (resto del código)

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
        let form = event.target.closest('form');

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

            if (response.ok) {
                let idobj = await response.json();
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
                    });
                }
            } else {
                errores.textContent = "Fallo al subir el pdf.";
            }
        } else {
            errores.textContent = "Debes adjuntar un archivo PDF antes de enviar.";
        }
    });

    //var titulo = document.getElementById("titulo");
    //var numeroTarea = document.getElementById("numtarea");
    //var instruccion = document.getElementById("instruccion");
    //var fecha = document.getElementById("fecha");
    var vertareapdf = document.getElementById("tareapdf");
    var mostrarnombre = document.getElementById("mostrarnombre");
    var traerid = document.getElementById("traeidresidente");

    var cerrarsesion = document.getElementById("cerrarsesion");


    cerrarsesion.addEventListener('click', function () {
        window.location.replace("https://localhost:7113/login/index");

    });



    vertareapdf.addEventListener('click', function () {
        nuevaRuta = `https://localhost:7136/tareasasignadas/${tareaActual.substring(5)+".pdf"}`;
        window.open(nuevaRuta, '_blank');
    });
  
    async function obtenernombre() {
        let response2 = await fetch(`https://localhost:7136/api/Residente/${traerid.value}`);
        if (response2.ok) {
            let datos2 = await response2.text();
            console.log("Archivos enviados:", datos2);

            mostrarnombre.textContent = datos2;
        }
        else {
            console.log("no trajo el nombre");
        }
    }
    obtenernombre();
    obtenerArchivosEnviados();
});


