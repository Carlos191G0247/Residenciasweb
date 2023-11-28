

document.addEventListener('DOMContentLoaded', function () {


    const enviarBtn = document.getElementById("enviarbBtn");
    const inputPdf = document.getElementById("inputPdf");
    var pdfBase64 = null;

    inputPdf.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                // El contenido del archivo en base64 estará disponible en e.target.result
                const base64Content = e.target.result;
                // Aquí puedes hacer lo que quieras con el contenido base64, como guardarlo en una variable.
                pdfBase64 = base64Content;
            };

            reader.readAsDataURL(file);
        }
    });
    enviarBtn.addEventListener('click', async function (event) {
        event.preventDefault();

        let form = event.target.closest('form');;
        if (pdfBase64 != null) {
            let json = {
                "Idcoordinador": 1,
                "NombreTarea": form.elements.nomtarea.value,
                "Fecha": form.elements.fechater.value,
                "Intruccion": form.elements.instruccion.value,
                "NumTarea": form.elements.numTareas.value
            };


            let response = await fetch("https://localhost:7136/api/AsginarTareas", {
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

                    let json2 = {
                        Id: idobj,
                        pdfBase64: pdfBase64.replace("data:application/pdf;base64,", "")
                    }
                    let response1 = await fetch("https://localhost:7136/api/AsginarTareas/PDF", {
                        method: 'POST',
                        body: JSON.stringify(json2),
                        headers: {
                            "content-type": "application/json"
                        }
                    })

                }
                else {

                }



            }

        }
        else {
            console.log("No has seleccionado un pdf")
        }

    });


});