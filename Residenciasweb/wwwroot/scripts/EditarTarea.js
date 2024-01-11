const nomTareaInput = document.getElementById('idnomtarea');
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
            otropdf = evento.target.result; 
            console.log('PDF en formato base64:', otropdf);
        };

        lector.readAsDataURL(archivoSeleccionado);
    } else {
        console.log('No se seleccionó ningún archivo.');
    }
});
async function TraerDatos() {
    

    let response = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/AsginarTareas/${idFromUrl}`, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + sessionStorage.jwt
        }
    });

    if (response.ok) {
        let datos = await response.json();
        console.log(datos);
        nomTareaInput.value = datos.nombreTarea;
        fechaInput.value = datos.fecha.replace('T', ' '); 
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
    let response = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/AsginarTareas/${idFromUrl}`, {
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

        window.location.replace('https://residencias.sistemas19.com/admin/coordinador/verTareasAsignadas');
    }
    else {
        if (typeof otropdf === 'undefined') {
            let respuesta = await response.text();
            console.log(respuesta);
            errores.textContent = respuesta;
        }
        else {
            await EliminarPDF();
            await AgregarPDF();
            pdfBase64 = null;

            window.location.replace('https://residencias.sistemas19.com/admin/coordinador/verTareasAsignadas');
        }
     
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
    let response = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/AsginarTareas/PDF`, {
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
    let response = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/AsginarTareas/EliminarPDF/${idFromUrl}`, {
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
        return null;
    }
}
async function cargarPDF() {
    let ruta = `https://apiresidenciaswebca.sistemas19.com/tareasasignadas/${idFromUrl + ".pdf"}`;
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

            const cargarPdfPromise = new Promise((resolve) => {
                lector.onload = function (evento) {
                    pdfBase64 = evento.target.result;
                    console.log('PDF en formato base64:', pdfBase64);
                    resolve();
                };
            });

            lector.readAsDataURL(file);
            await cargarPdfPromise;

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            inputPdf.files = dataTransfer.files;
        } else {
            console.error('Elemento inputPdf no encontrado.');
        }
    } catch (error) {
        console.error('Error al cargar el PDF:', error);
    }
}

async function TraerDatossss() {
    await TraerDatos();
    await cargarPDF();
}
TraerDatossss();
