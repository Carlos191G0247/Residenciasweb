const divSolicitudes = document.querySelector(".solicitudes");
const divVerListacarrera = document.querySelector(".verlistacarrera");
const divSolicitude = document.querySelector(".solicitude");
const traerfecha = document.getElementById('traerfecha');
const NombreAdmin = document.getElementById('Nombreadmin');
const cerrarsesion = document.getElementById('cerrarsesion');

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
TraerNombre();
TraerFechas();

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
