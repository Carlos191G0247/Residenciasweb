
var nombreCordi = document.getElementById('nombrecordi');
var cerrarsesion = document.getElementById('cerrarsesion');
var boton = document.getElementById('miBoton');
const regresar = document.getElementById('miBotonRe');
regresar.addEventListener('click', async function () {
    window.history.back();
});
boton.addEventListener('click' ,async function () {
    location.href = '/admin/coordinador/AgregarTareas';

});
cerrarsesion.addEventListener('click', async function () {
    await logout();

});
async function logout() {
    sessionStorage.removeItem("jwt");
    await navigator.credentials.preventSilentAccess();
    location.href = "/login/index";
}
async function TraerNombre() {
    let response = await fetch('https://apiresidenciaswebca.sistemas19.com/api/Coordinadores/CordiNom', {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + sessionStorage.jwt
        }
    });
    if (response.ok) {
        let datos = await response.text();
        nombreCordi.textContent = datos;
    }
    else {
        console.log("no trajo el nombre");
    }

};

let listaTareas = document.querySelector('.Alumnos ul');
async function TraerTareas() {
    let response = await fetch('https://apiresidenciaswebca.sistemas19.com/api/AsginarTareas', {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + sessionStorage.jwt
        }
    });

    if (response.ok) {
        let datos = await response.json();
        console.log(datos);

        for (let i = listaTareas.children.length; i < datos.length; i++) {
            listaTareas.appendChild(document.createElement("li"));
        }

        let resta = listaTareas.children.length > datos.length ? listaTareas.children.length - datos.length : 0;
        for (let i = 0; i < resta; i++) {
            listaTareas.lastElementChild.remove();
        }

        for (let i = 0; i < datos.length; i++) {
            listaTareas.children[i].dataset.id = datos[i].id;
            listaTareas.children[i].innerHTML = `
                <label class="NumeroTarea">${datos[i].numTarea + "."}</label>
                <label class="Tarea">${datos[i].nombreTarea}</label>
                <div class="botones">
                    <button id="ver" ><img src="/img/busqueda.png" /></button>
                    <button id="editar" ><img src="/img/boligrafo.png" /></button>
                    <button id="eliminar" ><img src="/img/Delate.png" /></button>
                </div>
                `;
        }
    }
}
var ruta;
async function MostrarTarea(numtarea) {
    ruta = null;
    let response = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/AsginarTareas/${numtarea}`, {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + sessionStorage.jwt
        }

    });
    if (response.ok) {
        let id = await response.text();
        ruta = `https://apiresidenciaswebca.sistemas19.com/tareasasignadas/${numtarea + ".pdf"}`;

    }
}
listaTareas.addEventListener('click', async function (event) {
    let clickedLink = event.target.closest('li button');

    if (clickedLink) {
        event.stopPropagation();

        let elementoLi = clickedLink.closest('li');
        let elementoId = elementoLi.dataset.id;
        let nombreTarea = elementoLi.querySelector('.Tarea').textContent;

        let elementoIdA = clickedLink.id;
        if (elementoIdA == "ver") {
            await MostrarTarea(elementoId);
            
            window.open(ruta, '_blank');
        }
        if (elementoIdA == "editar") {

            let confirmacion = window.confirm("¿Desea editar la tarea '" + nombreTarea + "'?");

            if (confirmacion) {
                location.href = '/admin/coordinador/EditarTarea?id=' + elementoId;

            } else {
                console.log("Usuario seleccionó 'No', no se realizará la edición");
            }

        }

        if (elementoIdA == "eliminar")
        {
            let confirmacion = window.confirm("¿Desea Eliminar la tarea '" + nombreTarea + "'?");

            if (confirmacion) {
                await EliminarTarea(elementoId);
            } else {
                console.log("Usuario seleccionó 'No', no se realizará la edición");
            }
        }

    }
});
async function EliminarTarea(numtarea) {
    let response = await fetch(`https://apiresidenciaswebca.sistemas19.com/api/AsginarTareas/${numtarea}`, {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + sessionStorage.jwt
        }

    });
    if (response.ok) {

        window.confirm("Tarea Eliminada");
        await TraerTareas();

    }
}

TraerTareas();
TraerNombre();