document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.querySelector('form');
   

    formulario.addEventListener('submit', async function (event) {
        event.preventDefault(); 
        let form = event.target.closest('form');;
        const erroresLabel = document.querySelector('.errores');
        const errores = erroresLabel; 
        const contrasena = form.elements.contraseña.value;
        const confirmarContrasena = form.elements.confirmarContraseña.value;

        if (contrasena !== confirmarContrasena) {
            errores.textContent = "Las contraseñas no coinciden";
            return;
        }
        const camposNoVacios = Array.from(form.elements).filter(element => element.name !== '' && element.value.trim() === '').length === 0;

        if (!camposNoVacios) {
            errores.textContent = "Todos los campos son requeridos";
            return;
        }
        
        let json = {
            NombreCompleto: form.elements.nombre.value,
            NumControl: form.elements.numcontrol.value,
            Carrera: form.elements.carreras.value,
            Fecha: form.elements.fecha.value,
            Cooasesor: form.elements.asesor.value,
            Contrasena: form.elements.contraseña.value,
        };

        try {
            const response = await fetch("https://apiresidenciaswebca.sistemas19.com/api/Residente", {
                method: 'POST',
                body: JSON.stringify(json),
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + sessionStorage.jwt
                },
            });

            if (response.ok) {
                errores.textContent = "";
                form.reset();
                
            }
            else {
                let respuesta = await response.text();
                errores.textContent = respuesta;


            }

         
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    });
});

document.body.addEventListener("click", function (e) {

    if (e.target.tagName == "INPUT" && e.target.value == "Cancelar") {
        window.history.back();

    }
});

