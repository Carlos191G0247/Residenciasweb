﻿const nomTareaInput = document.getElementById('idnomtarea');
const fechaInput = document.getElementById('idfecha');
const numTareasSelect = document.getElementById('idnumtareas');
const instruccionTextarea = document.getElementById('idinstruccion');
const urlParams = new URLSearchParams(window.location.search);
const idFromUrl = urlParams.get('id');
const inputPdf = document.getElementById('inputPdf');
const editarBtn = document.getElementById('editarbBtn');
const regresar = document.getElementById('cancelar');
const errores = document.querySelector('.errores');

var otropdf;
var pdfBase64;
inputPdf.addEventListener('change', function () {
    if (inputPdf.files.length > 0) {
        const archivoSeleccionado = inputPdf.files[0];

        const lector = new FileReader();
        lector.onload = function (evento) {
            otropdf = evento.target.result; // Asigna directamente a pdfBase64
            console.log('PDF en formato base64:', otropdf);
        };

        lector.readAsDataURL(archivoSeleccionado);
    } else {
        console.log('No se seleccionó ningún archivo.');
    }
});
async function TraerDatos() {
    

    let response = await fetch(`https://localhost:7137/api/AsginarTareas/${idFromUrl}`, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + sessionStorage.jwt
        }
    });

    if (response.ok) {
        let datos = await response.json();
        console.log(datos);
        nomTareaInput.value = datos.nombreTarea;
        // Ajusta el formato de la fecha si es necesario
        fechaInput.value = datos.fecha.replace('T', ' '); // Puedes ajustar esto según tus necesidades
        numTareasSelect.value = datos.numTarea;
        instruccionTextarea.value = datos.intruccion;
    }
};
regresar.addEventListener('click', async function () {
    window.history.back();
});
editarBtn.addEventListener('click', async function (event) {
    errores.textContent = null;
    event.preventDefault(); 
    

    let json = {
        Idcoordinador: 1,
        NombreTarea: nomTareaInput.value,
        Fecha: fechaInput.value, 
        Intruccion: instruccionTextarea.value,
        NumTarea: numTareasSelect.value

    };
    let response = await fetch(`https://localhost:7137/api/AsginarTareas/${idFromUrl}`, {
        method: 'PUT',
        body: JSON.stringify(json),
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + sessionStorage.jwt,
        },
    });
    if (response.ok) {
        
        await EliminarPDF();
        await AgregarPDF();
        pdfBase64= null;

        window.location.replace('https://localhost:7136/admin/coordinador/verTareasAsignadas');
    }
    else {
        //let nuevoPdfBase64 = await obtenerBase64DelPdfSeleccionado();
        if (typeof otropdf === 'undefined') {
            let respuesta = await response.text();
            console.log(respuesta);
            errores.textContent = respuesta;
        }
        else {
            await EliminarPDF();
            await AgregarPDF();
            pdfBase64 = null;

            window.location.replace('https://localhost:7136/admin/coordinador/verTareasAsignadas');
        }
        //if (pdfBase64 !== nuevoPdfBase64) {
        //    await EliminarPDF();
        //    await AgregarPDF();
        //    pdfBase64 = null;

        //    window.location.replace('https://localhost:7136/admin/coordinador/verTareasAsignadas');

        //} else {
        //    let respuesta = await response.text();
        //    console.log(respuesta);
        //    errores.textContent = respuesta;
        //}
         


    }
});

async function AgregarPDF() {
    let nuevoPdfBase64 = await obtenerBase64DelPdfSeleccionado();

    if (pdfBase64 !== nuevoPdfBase64) {
        pdfBase64 = nuevoPdfBase64;
    }
    let json = {
        Id: idFromUrl,
        pdfBase64: pdfBase64.replace("data:application/pdf;base64,", "")
    };
    let response = await fetch(`https://localhost:7137/api/AsginarTareas/PDF`, {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
            "content-type": "application/json",
            "Authorization": "Bearer " + sessionStorage.jwt,
        },
    });
    if (response.ok) {

     

    }
}
async function EliminarPDF() {
    let response = await fetch(`https://localhost:7137/api/AsginarTareas/EliminarPDF/${idFromUrl}`, {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + sessionStorage.jwt,
        },
    });
    if (response.ok) {

        console.log("SE ELIMINO");

    }
}
async function obtenerBase64DelPdfSeleccionado() {
    const inputPdf = document.getElementById('inputPdf');

    if (inputPdf.files.length > 0) {
        const archivoSeleccionado = inputPdf.files[0];
        const lector = new FileReader();

        return new Promise((resolve) => {
            lector.onload = function (evento) {
                resolve(evento.target.result);
            };

            lector.readAsDataURL(archivoSeleccionado);
        });
    } else {
        // No se seleccionó ningún archivo
        return null;
    }
}
async function cargarPDF() {
    let ruta = `https://localhost:7137/tareasasignadas/${idFromUrl + ".pdf"}`;
    try {
        let response = await fetch(ruta);
        if (!response.ok) {
            throw new Error('No se pudo cargar el PDF.');
        }

        const blob = await response.blob();
        

        const file = new File([blob], " PDF", { type: 'application/pdf' });

        const inputPdf = document.getElementById('inputPdf');
        if (inputPdf) {
            const lector = new FileReader();

            // Utiliza una Promesa para gestionar la carga del PDF
            const cargarPdfPromise = new Promise((resolve) => {
                lector.onload = function (evento) {
                    pdfBase64 = evento.target.result;
                    console.log('PDF en formato base64:', pdfBase64);
                    resolve();
                };
            });

            // Lee el archivo PDF y espera a que se complete
            lector.readAsDataURL(file);
            await cargarPdfPromise;

            // Crea un objeto DataTransfer y añade el archivo
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            // Asigna el objeto DataTransfer al campo de entrada de archivo
            inputPdf.files = dataTransfer.files;
        } else {
            console.error('Elemento inputPdf no encontrado.');
        }
    } catch (error) {
        console.error('Error al cargar el PDF:', error);
    }
}
TraerDatos();
cargarPDF();
