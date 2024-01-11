const errores = document.getElementById('errores');
const cancelar = document.getElementById('cancelar');


cancelar.addEventListener('click', async function () {

    window.location.replace('https://residencias.sistemas19.com/admin/coordinador/verTareasAsignadas');
});
document.addEventListener('DOMContentLoaded', function () {


    const enviarBtn = document.getElementById("enviarbBtn");
    const inputPdf = document.getElementById("inputPdf");
    var pdfBase64 = null;

    inputPdf.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                const base64Content = e.target.result;
                pdfBase64 = base64Content;
            };

            reader.readAsDataURL(file);
        }
    });
    enviarBtn.addEventListener('click', async function (event) {
        event.preventDefault();

        errores.textContent = null;
        let form = event.target.closest('form');
        if (form.elements.nomtarea.value == "" || null) {
            errores.textContent = "Por favor, ingresa un nombre de tarea.";
            return;
        }

        if (form.elements.fechater.value == "" || null) {
            errores.textContent = "Por favor, selecciona una fecha de terminación.";
            return;
        }

        if (form.elements.numTareas.value == "" || null) {
            errores.textContent = "Por favor, selecciona un número de tarea.";
            return;
        }
        if (!pdfBase64) {
            errores.textContent = "No has seleccionado un archivo PDF.";
            return;
        }
        if (form.elements.instruccion.value == "" || null) {
            errores.textContent = "Por favor, escribe una instruccion";
            return;
        }
        
       
        if (pdfBase64 != null) {
            let json = {
                "Idcoordinador": 1,
                "NombreTarea": form.elements.nomtarea.value,
                "Fecha": form.elements.fechater.value,
                "Intruccion": form.elements.instruccion.value,
                "NumTarea": form.elements.numTareas.value
            };


            let response = await fetch("https://apiresidenciaswebca.sistemas19.com/api/AsginarTareas", {
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

                    let json2 = {
                        Id: idobj,
                        pdfBase64: pdfBase64.replace("data:application/pdf;base64,", "")
                    }
                    let response1 = await fetch("https://apiresidenciaswebca.sistemas19.com/api/AsginarTareas/PDF", {
                        method: 'POST',
                        body: JSON.stringify(json2),
                        headers: {
                            "content-type": "application/json",
                            "Authorization": "Bearer " + sessionStorage.jwt
                        }
                    })
                    window.location.replace('https://residencias.sistemas19.com/admin/coordinador/verTareasAsignadas');
                }

                else {

                }



            }
            else {
                let datos = await response.text();
                errores.textContent = datos;
            }

        }
        else {
            errores.textContent = "No has seleccionado un pdf";
        }

    });


});