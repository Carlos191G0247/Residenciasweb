var pdfBase64;
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

                    // Actualizar el nombre del archivo en el atributo de datos
                    enviarBtn.dataset.nombreArchivo = fileName;

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
        await MostrarTareaSubida();
        //await CancelarEstado();

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
             

                let response = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/AsginarTareas/${tareaId.substring(5)}`, {
                    method: 'GET',
                    headers: {
                        "Authorization": "Bearer " + sessionStorage.jwt
                    }
                });
                if (response.ok) {
                    let datos = await response.json();


                    var mostrarnombrepdf = document.getElementById("nombredelpdf");

                    titulo.textContent = datos.nombreTarea;
                    mostrarnombrepdf.textContent = datos.nombreTarea + ".PDF";
                    numeroTarea.value = datos.numTarea;
                    instruccion.textContent = datos.intruccion;
                    fecha.textContent = datos.fecha.replace("T", " ");

                    console.log("Archivos enviados:", datos);
                } else {
                    console.error("Error al obtener archivos enviados");
                }
            }
        } catch (error) {
            titulo.textContent = "Esta Tarea aun no esta asignada";
            var mostrarnombrepdf = document.getElementById("nombredelpdf");
            mostrarnombrepdf.textContent = "";
            numeroTarea.value = null;
            instruccion.textContent = "";
            fecha.textContent = "";

            enviarBtn.value = "Enviar";
            formulario.style.backgroundColor = '#FFFFFF';

         
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
            let estatustar;

            let fechas = new Date();
            if (fechas < Date.parse(fecha.textContent)) {
                estatustar = 1;
            }
            else {
                estatustar = 3;
            }
            if (pdfBase64 != null) {
                const nombreArchivo = enviarBtn.dataset.nombreArchivo;

                let json = {
                    IdResidente: form.elements.idres.value,
                    NombreArchivo: nombreArchivo,
                    FechaEnvio: new Date().toISOString(),
                    NumTarea: form.elements.ntarea.value,
                    Estatus: estatustar
                };

                let response = await fetch("https://apiresidenciaswebca.sistemas19.com/api/ArchivosEnviados", {
                    method: 'POST',
                    body: JSON.stringify(json),
                    headers: {
                        "content-type": "application/json",
                        "Authorization": "Bearer " + sessionStorage.jwt
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
                                "content-type": "application/json",
                                "Authorization": "Bearer " + sessionStorage.jwt
                            }
                        });
                       /* await Traerestatus();*/
                    }

                    enviarBtn.value = "Cancelar";
                    await Traerestatus();
                    await MostrarTareaSubida();
                } else {
                    errores.textContent = "Fallo al subir el pdf.";
                }
            } else {
                errores.textContent = "Debes adjuntar un archivo PDF antes de enviar.";
            }

        }
        //eliminar el pdf
        else {
            await EliminarTarea();
            await Traerestatus();
            await MostrarTareaSubida();
            /*await CancelarEstado();*/
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


    cerrarsesion.addEventListener('click', async function () {
        await logout();

    });


    var ruta;//////////////////////////////////////
    vertareapdf.addEventListener('click', async function () {
        let responsedatos = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/AsginarTareas/vertarea/${numeroTarea.value}`, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + sessionStorage.jwt
            }

        });
        if (responsedatos.ok) {
            let idtarea = await responsedatos.text();
            nuevaRuta = `https://apiresidenciaswebca.sistemas19.com/tareasasignadas/${idtarea + ".pdf"}`;
            window.open(nuevaRuta, '_blank');
        }
    


    });
  


    //Nuevo codigo//


    async function CancelarEstado() {

        let responsedatos = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/ArchivosEnviados/${numeroTarea.value}`, {
            method: 'PUT',
            headers: {
                "Authorization": "Bearer " + sessionStorage.jwt
            }

        });

    }
    async function EliminarTarea() {
        let responsedatos = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/ArchivosEnviados/${numeroTarea.value}`, {
            method: 'DELETE',
            headers: {
                "Authorization": "Bearer " + sessionStorage.jwt
            }

        });
        if (responsedatos.ok) {
            let datos = await responsedatos.text();
            console.log(datos);
        }
        else {

            let datos = await responsedatos.text();
            console.log(datos);

        }
    }
    async function MostrarTareaSubida() {
        ruta = null;
        let response = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/ArchivosEnviados/Datos/${numeroTarea.value}`, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + sessionStorage.jwt
            }

        });
        if (response.ok) {
         
            try {
                let datosalumno = await response.json();
                mitarea.textContent = datosalumno.nombreArchivo;
                ruta = `https://apiresidenciaswebca.sistemas19.com/pdfs/${datosalumno.id + ".pdf"}`;
            } catch (error) {
                ruta = null;
                mitarea.textContent = "";
            }
        }
        else {
            ruta = null;
            mitarea.textContent = "";
        }
    }

    async function obtenernombre() {
        let response2 = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/Residente/nombre`, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + sessionStorage.jwt
            }
        });

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
    var ocultar = document.querySelector('.derecha');
    var elementosDerecha = document.querySelectorAll('.derecha *:not(#enviarBtn)');

    async function Traerestatus() {

        
        let response2 = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/ArchivosEnviados/${tareaActual.substring(5)}`, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + sessionStorage.jwt
            }

        });
    

        if (response2.ok) {
            let datos2 = await response2.text();
            console.log("Archivos enviados:", datos2);

            estatus.textContent = datos2;
            if (datos2 == "Enviado") {
                enviarBtn.value = "Cancelar";
                formulario.style.backgroundColor = 'rgba(0,0,0,.3)'; 
                elementosDerecha.forEach(function (elemento) {
                    elemento.disabled = true;
                });

            }
            else if (datos2 == "Entregado Tarde") {
                enviarBtn.value = "Cancelar";
                formulario.style.backgroundColor = 'rgba(0,0,0,.3)'; 

                elementosDerecha.forEach(function (elemento) {
                    elemento.disabled = true;
                });
            }
            else if (datos2 == "Regresado") {
                enviarBtn.value = "Cancelar";
                formulario.style.backgroundColor = 'rgba(0,0,0,.3)';

                elementosDerecha.forEach(function (elemento) {
                    elemento.disabled = true;
                });
            }
            else if (datos2 =="No Entregado") {
                
                enviarBtn.value = "Enviar";
                formulario.style.backgroundColor = '#FFFFFF';

                elementosDerecha.forEach(function (elemento) {
                    elemento.disabled = false;
                });
            }
        }
        else {
            let error = await response2.text();
            estatus.textContent = error;
            enviarBtn.value = "Enviar";
            formulario.style.backgroundColor = '#FFFFFF';

            elementosDerecha.forEach(function (elemento) {
                elemento.disabled = false;
            });
        }
    }
    
    async function CargaDATOSS() {
        await guardarUltimaPagina();
        await obtenernombre();
      
    }

    CargaDATOSS();
  
});


