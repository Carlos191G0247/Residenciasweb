﻿var pdfBase64;
let tareaActual; 

document.addEventListener('DOMContentLoaded', function () {
    const inputPdf = document.getElementById('inputPdf');
    const archivoNav = document.querySelector('.archivo');
    const mitarea = document.querySelector('.mitarea');

    const handlePdfChange = (inputPdf, archivoNav, mitarea) => {
        inputPdf.addEventListener('change', function () {
            if (inputPdf.files.length > 0) {
                const file = inputPdf.files[0];
                const fileName = file.name;
                mitarea.textContent = fileName;
                archivoNav.style.display = 'flex';

                const reader = new FileReader();
                reader.onload = function (e) {
                    const base64Content = e.target.result;
                    pdfBase64 = base64Content;
                };
                reader.readAsDataURL(file);
            } else {
                mitarea.textContent = '';
                archivoNav.style.display = 'none';
            }
        });
    };

    const handleArchivoNavClick = (inputPdf) => {
        const archivoNav = document.querySelector('.archivo');
        archivoNav.addEventListener('click', function () {
            inputPdf.click();
        });
    };

    const handleEliminarTareaClick = (inputPdf, archivoNav, mitarea) => {
        const eliminarTareaBtn = document.getElementById('eliminarTarea');
        eliminarTareaBtn.addEventListener('click', function () {
            mitarea.textContent = '';
            archivoNav.style.display = 'none';
            inputPdf.value = ''; 
        });
    };

    const tareas = document.querySelectorAll('ul li a');
    tareas.forEach(tarea => {
        tarea.addEventListener('click', handleTareaClick);
    });

    async function handleTareaClick(event) {

        tareaActual = event.target.getAttribute('data-tarea');

   

        

        await obtenerDatosDeTarea(tareaActual);
        await Traerestatus();

    }
    var verpdfbtn = document.getElementById('verpdfbtn');
    verpdfbtn.addEventListener('click', function () {
        
        if (pdfBase64) {
            const pdfBlob = base64toBlob(pdfBase64);

            const pdfUrl = URL.createObjectURL(pdfBlob);

            window.open(pdfUrl, '_blank');
        } else {
            window.open(ruta, '_blank');
        }
    });

    function base64toBlob(base64) {
        const byteString = atob(base64.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'application/pdf' });
    }

    async function obtenerDatosDeTarea(tareaId) {
        try {
            if (tareaId !== undefined) {
                let response = await fetch(`https://localhost:7136/api/AsginarTareas/${tareaId.substring(5)}`);
                if (response.ok) {
                    let datos = await response.json();

                    
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


    handlePdfChange(inputPdf, archivoNav, mitarea);

    handleArchivoNavClick(inputPdf);

    handleEliminarTareaClick(inputPdf, archivoNav, mitarea);

    const enviarBtn = document.getElementById("enviarBtn");
    const formulario = document.querySelector('.formtarea1');
    const erroresLabel = document.querySelector('.errores');

    var errores = erroresLabel;
    enviarBtn.addEventListener("click", async function (event) {

       
        event.preventDefault();
        if (enviarBtn.value === "Enviar") {
            errores.textContent = null;
            let form = event.target.closest('form');

            if (pdfBase64 != null) {
                let json = {
                    IdResidente: form.elements.idres.value,
                    NombreArchivo: "mi_archivo.pdf",
                    FechaEnvio: new Date().toISOString(),
                    NumTarea: form.elements.ntarea.value,
                };

                let response = await fetch("https://localhost:7136/api/ArchivosEnviados", {
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
                        let response1 = await fetch("https://localhost:7136/api/ArchivosEnviados/PDF", {
                            method: 'POST',
                            body: JSON.stringify(json),
                            headers: {
                                "content-type": "application/json"
                            }
                        });
                        await Traerestatus();
                    }

                    enviarBtn.value = "Cancelar";
                } else {
                    errores.textContent = "Fallo al subir el pdf.";
                }
            } else {
                errores.textContent = "Debes adjuntar un archivo PDF antes de enviar.";
            }

        }
        //eliminar el pdf
        else {
            let datos3 = await Traeridtarea();

            try {
                let json = {
                    Id: datos3,
                };

                let response = await fetch(`https://localhost:7136/api/ArchivosEnviados`, {
                    method: 'DELETE',
                    body: JSON.stringify(json),
                    headers: {
                        'Content-Type': 'application/json',
                    },

                });

                if (response.ok) {
                    console.log('Tarea eliminada correctamente');
                    await Traerestatus();
                    enviarBtn.value = "Enviar";

                    
                } else {
                    console.error('Error al intentar eliminar la tarea');
                }
            } catch (error) {
                console.error('Error de red:', error);
            }
        }
        
    });
    var titulo = document.getElementById("titulo");
    var numeroTarea = document.getElementById("numtarea");
    var instruccion = document.getElementById("instruccion");
    var fecha = document.getElementById("fecha");
    var vertareapdf = document.getElementById("tareapdf");
    var mostrarnombre = document.getElementById("mostrarnombre");
    var traerid = document.getElementById("traeidresidente");

    var cerrarsesion = document.getElementById("cerrarsesion");


    cerrarsesion.addEventListener('click', function () {
        window.location.replace("https://localhost:7113/login/index");

    });


    var ruta;//////////////////////////////////////
    vertareapdf.addEventListener('click', function () {

        
            nuevaRuta = `https://localhost:7136/tareasasignadas/${tareaActual.substring(5) + ".pdf"}`;
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
    var estatus = document.getElementById("estatus");

    async function Traeridtarea() {

        let response3 = await fetch(`https://localhost:7136/api/ArchivosEnviados/${numeroTarea.value}/${traerid.value}`);
        if (response3.ok) {
            let datos3 = await response3.text();
            console.log("id de la tarea:", datos3);
            return datos3;
         
        }
        else {
            console.log("no trajo el id de tarea");
        }
    }
    async function Traerestatus() {
        ruta = null;
        let response3 = await fetch(`https://localhost:7136/api/ArchivosEnviados/${numeroTarea.value}/${traerid.value}`);
        if (response3.ok) {
            let datos3 = await response3.text();
            console.log("id de la tarea:", datos3);

            let response4 = await fetch(`https://localhost:7136/api/ArchivosEnviados/${datos3}`);
            if (response4.ok) {
                let datos4 = await response4.text();
                console.log("Traer el estatus", datos4);
                estatus.textContent = datos4;
                if (datos4 == "Enviado") {
                    
                    let responsedatos = await fetch(`https://localhost:7136/api/ArchivosEnviados/todo/${datos3}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },

                    });
                    if (responsedatos.ok) {
                        let datosalumno = await responsedatos.json();

                        mitarea.textContent = datosalumno.nombreArchivo;
                        ruta = `https://localhost:7136/pdfs/${datosalumno.id + ".pdf"}`;

                    }

                   
                }
            }
           

        }
        else {
            ruta = null;
            let datos5 = await response3.text();
            estatus.textContent = datos5;
        }
    }
    //Traerestatus();
    obtenernombre();
});


