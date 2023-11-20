﻿document.addEventListener('DOMContentLoaded', function () {
    // Obtén referencias a los elementos del formulario
    const formulario = document.querySelector('form');

    // Agrega un event listener al formulario para manejar el envío
    formulario.addEventListener('submit', async function (event) {
        event.preventDefault(); // Evita el comportamiento predeterminado del formulario
        let form = event.target.closest('form');;

        // Crea un objeto con los datos del formulario
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
            const response = await fetch("https://localhost:7136/api/Residente", {
                method: 'POST',
                body: JSON.stringify(json),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Hubo un problema con la solicitud.');
            }

            // Espera la conversión de la respuesta a formato JSON
            const data = await response.json();

            // Maneja la respuesta exitosa aquí (si es necesario)
            console.log('Respuesta exitosa:', data);
        } catch (error) {
            // Maneja los errores aquí
            console.error('Error en la solicitud:', error);
        }
    });
});

