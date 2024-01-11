const divSolicitudes = document.querySelector(".solicitudes");
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

    let response = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/Residente/fecha`, {
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
    let response = await fetch('https://apiresidenciaswebca.sistemas19.com/api/Coordinadores/CordiNom', {
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

async function Filtro() {
    
    let response = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/Residente/Filtro/${traerfecha.value}/${checkbox1.checked}/${checkbox2.checked}/${numtarea.value}`, {
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
            const estatusArchivos = datos[i].archivosenviados && datos[i].archivosenviados.length > 0
                ? datos[i].archivosenviados[0].estatus
                : null;

            listaAlumnos.children[i].dataset.id = datos[i].id;
            listaAlumnos.children[i].dataset.estatus = estatusArchivos; 
            listaAlumnos.children[i].innerHTML = `
                    <label class="nombre">${datos[i].nombreCompleto}</label>
                    <label class="NumControl">${datos[i].idIniciarSesionNavigation.numcontrol}</label>
                    <a id="ver" class="icono"><img src="/img/busqueda.png" /></a>
                    <a id="regresar" class="icono1"><img src="/img/regresartarea.png" /></a>
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

    let responsedatos = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/ArchivosEnviados/${numtarea}/${idresidente}`, {
        method: 'PUT',
        headers: {
            "Authorization": "Bearer " + sessionStorage.jwt
        }

    });

}
var ruta;
async function MostrarTareaSubida(idres, numtarea) {
    ruta = null;
    let response = await fetch(`https://apiresidenciaswebca.sistemas19.com/ArchivosEnviados/TareaCordi/${idres}/${numtarea}`, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + sessionStorage.jwt
        }
        
    });
    if (response.ok) {
        let id = await response.text();
        ruta = `https://apiresidenciaswebca.sistemas19.com/pdfs/${id + ".pdf"}`;

    }
}
listaAlumnos.addEventListener('click', async function (event) {
    let clickedLink = event.target.closest('li a');

    if (clickedLink) {
        event.stopPropagation();

        let elementoLi = clickedLink.closest('li');
        let elementoId = elementoLi.dataset.id;

        let elementoIdA = clickedLink.id;
        if (elementoIdA == "ver") {
            await MostrarTareaSubida(elementoId, numtarea.value);
            window.open(ruta, '_blank');
        }
        else {
            let confirmacion = window.confirm("¿Desea Regresar la tarea?" );
            if (confirmacion) {
                await RegresarEstado(numtarea.value, elementoId);
                await Filtro();
             

            } else {
                console.log("Usuario seleccionó 'No', no se realizará la edición");
            }
            
        }

    }
});

registro.addEventListener('click', async function () {

        window.location.href = "/Registro/RegistroAlumno";

});
vertareasasignadas.addEventListener('click', async function () {
    window.location.href = "/admin/coordinador/verTareasAsignadas";
});

async function iniciar() {
    guardarUltimaPagina();
    await TraerNombre();
    await TraerFechas();
    await Filtro();
}


iniciar();
document.body.addEventListener("change", async function (event) {
        await Filtro();
    
});


