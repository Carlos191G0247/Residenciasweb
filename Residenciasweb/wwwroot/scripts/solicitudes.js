﻿const divSolicitudes = document.querySelector(".solicitudes");
const divVerListacarrera = document.querySelector(".verlistacarrera");
const divSolicitude = document.querySelector(".solicitude");
const traerfecha = document.getElementById('traerfecha');
const NombreAdmin = document.getElementById('Nombreadmin');
const cerrarsesion = document.getElementById('cerrarsesion');
const checkbox1 = document.getElementById('check1');
const checkbox2 = document.getElementById('check2');
const numtarea = document.getElementById('numtarea');
const registro = document.getElementById('registro');
const vertareasasignadas = document.getElementById('vertareas');
async function TraerFechas() {

    let response = await fetch(`https://localhost:7137/api/Residente/fecha`, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + sessionStorage.jwt
        }
    });

    if (response.ok) {
        let datos = await response.json();
        datos.forEach(anio => {
            const option = document.createElement('option');
            option.value = anio;
            option.textContent = anio;
            traerfecha.appendChild(option);
        });
    }
};
cerrarsesion.addEventListener('click', async function () {
    await logout();

});
async function TraerNombre() {
    let response = await fetch('https://localhost:7137/api/Coordinadores/CordiNom', {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + sessionStorage.jwt
        }
    });
    if (response.ok) {
        let datos = await response.text();
        NombreAdmin.textContent = datos;
    }
    else {
        console.log("no trajo el nombre");
    }

};



let listaAlumnos = document.querySelector('.alumnos ul');

/*/${checkbox1.checked}*/
async function Filtro() {
    
    let response = await fetch(`https://localhost:7137/api/Residente/Filtro/${traerfecha.value}/${checkbox1.checked}/${checkbox2.checked}/${numtarea.value}`, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + sessionStorage.jwt
        }
    });
    if (response.ok) {
        let datos = await response.json();
        console.log(datos);

        console.log(datos);
        for (let i = listaAlumnos.children.length; i < datos.length; i++) {
            listaAlumnos.appendChild(document.createElement("li"));
        }

        let resta = listaAlumnos.children.length > datos.length ? listaAlumnos.children.length - datos.length : 0;
        for (let i = 0; i < resta; i++) {
            listaAlumnos.lastElementChild.remove();
        }

        for (let i = 0; i < datos.length; i++) {
            listaAlumnos.children[i].dataset.id = datos[i].id;
            listaAlumnos.children[i].innerHTML = `
                    <label class="nombre">${datos[i].nombreCompleto}</label>
                    <label class="NumControl">${datos[i].idIniciarSesionNavigation.numcontrol}</label>
                    <a id="ver" class="icono"><img src="/img/clip.png" /></a>
                    <a id="regresar" class="icono1"><img src="/img/usuario.png" /></a>
                `;
            const etiquetasVer = listaAlumnos.querySelectorAll('.icono');
            const etiquetasRegresar = listaAlumnos.querySelectorAll('.icono1');

            if (datos[i].archivosenviados == null || datos[i].archivosenviados.length == 0) {
                etiquetasVer.forEach(etiqueta => {
                    etiqueta.style.display = 'none';
                });

                etiquetasRegresar.forEach(etiqueta => {
                    etiqueta.style.display = 'none';
                });
            } else {
                etiquetasVer.forEach(etiqueta => {
                    etiqueta.style.display = 'flex';
                });

                etiquetasRegresar.forEach(etiqueta => {
                    etiqueta.style.display = 'flex';
                });
            }


        }

    }
    else {
        console.log("no el filtro");
    }
  

}
async function RegresarEstado(numtarea,idresidente) {

    let responsedatos = await fetch(`https://localhost:7137/api/ArchivosEnviados/${numtarea}/${idresidente}`, {
        method: 'PUT',
        headers: {
            "Authorization": "Bearer " + sessionStorage.jwt
        }

    });

}
var ruta;
async function MostrarTareaSubida(idres, numtarea) {
    ruta = null;
    let response = await fetch(`https://localhost:7137/api/ArchivosEnviados/TareaCordi/${idres}/${numtarea}`, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + sessionStorage.jwt
        }
        
    });
    if (response.ok) {
        let id = await response.text();
        ruta = `https://localhost:7137/pdfs/${id + ".pdf"}`;

    }
}
listaAlumnos.addEventListener('click', async function (event) {
    // Verifica si el clic ocurrió en un elemento <a> dentro de un <li>
    let clickedLink = event.target.closest('li a');

    if (clickedLink) {
        // Evita la propagación del evento a elementos más externos
        event.stopPropagation();

        // Obtén el dataset-id del <li>
        let elementoLi = clickedLink.closest('li');
        let elementoId = elementoLi.dataset.id;

        let elementoIdA = clickedLink.id;
        if (elementoIdA == "ver") {
            await MostrarTareaSubida(elementoId, numtarea.value);
            window.open(ruta, '_blank');
        }
        else {
            await RegresarEstado(numtarea.value, elementoId);
        }
        // Construye la URL con el ID y realiza la redirección
        //const url = `https://ejemplo.com/miPagina/${elementoId}`;
        //window.location.href = url;
    }
});

registro.addEventListener('click', async function () {

        window.location.href = "/Registro/RegistroAlumno";

});
vertareasasignadas.addEventListener('click', async function () {
    window.location.href = "/admin/coordinador/verTareasAsignadas";
});

TraerNombre();
TraerFechas();

document.body.addEventListener("change", async function (event) {
        await Filtro();
    
});

//document.body.addEventListener("click", function (e) {
//    if (e.target.tagName === "INPUT") {
        

//        if (e.target.value === "Solicitudes") {
//            divSolicitudes.style.display = "flex";
//            divVerListacarrera.style.display = "none";
//            divSolicitude.style.display = "none";
//        } else if (e.target.value === "Tareas") {

//            divSolicitude.style.display = "none";
//            divSolicitudes.style.display = "none";
//            divVerListacarrera.style.display = "flex";
//        } else if (e.target.value === "Registro") {
//            window.location.href = "/Registro/RegistroAlumno";
//        }

        

//    }

//    if (e.target.tagName === "LI") {
        
//            divSolicitude.style.display = "flex";
//            divSolicitudes.style.display = "none";
//            divVerListacarrera.style.display = "none";
 
//    }
//});
