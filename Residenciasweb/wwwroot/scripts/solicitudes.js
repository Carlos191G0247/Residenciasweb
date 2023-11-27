const divSolicitudes = document.querySelector(".solicitudes");
const divVerListacarrera = document.querySelector(".verlistacarrera");
const divSolicitude = document.querySelector(".solicitude");

document.body.addEventListener("click", function (e) {
    if (e.target.tagName === "INPUT") {
        

        if (e.target.value === "Solicitudes") {
            divSolicitudes.style.display = "flex";
            divVerListacarrera.style.display = "none";
            divSolicitude.style.display = "none";
        } else if (e.target.value === "Tareas") {

            divSolicitude.style.display = "none";
            divSolicitudes.style.display = "none";
            divVerListacarrera.style.display = "flex";
        } else if (e.target.value === "Registro") {
            window.location.href = "/Registro/RegistroAlumno";
        }

        

    }

    if (e.target.tagName === "LI") {
        
            divSolicitude.style.display = "flex";
            divSolicitudes.style.display = "none";
            divVerListacarrera.style.display = "none";
 
    }
});
