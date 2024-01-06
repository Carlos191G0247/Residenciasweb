document.addEventListener('DOMContentLoaded', function () {
    // Obtén referencias a los elementos del formulario
    const formulario = document.querySelector('form');
   

    // Agrega un event listener al formulario para manejar el envío
    formulario.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evita el comportamiento predeterminado del formulario
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
            errores.textContent = "Todos los campos con atributo 'name' son requeridos";
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
            // Realiza la petición POST usando fetch y espera la respuesta
            const response = await fetch("https://localhost:7137/api/Residente", {
                method: 'POST',
                body: JSON.stringify(json),
                headers: {
                    'Content-Type': 'application/json',
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
            // Maneja los errores aquí
            console.error('Error en la solicitud:', error);
        }
    });
});

document.body.addEventListener("click", function (e) {

    if (e.target.tagName == "INPUT" && e.target.value == "Cancelar") {
        window.history.back();

    }
});

