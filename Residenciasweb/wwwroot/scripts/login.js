var formRecuperar = document.querySelector(".formRecuperarContraseña");
var formMensaje = document.querySelector(".formMensaje");
var modalElement = document.querySelector(".modal");

//document.body.addEventListener("click", function (e) {
//    if (e.target.tagName == "A" && e.target.textContent == "¿Olvidaste tu contraseña?") {

//        formRecuperar.parentElement.style.display = "flex";
//        formMensaje.parentElement.style.display = "none";

//    }
//    else if (e.target.tagName == "INPUT" && e.target.value == "Cancelar") {
//        modalElement.style.display = "none";

//    }
//    if (e.target.tagName == "INPUT" && e.target.value == "Recuperar") {
//        formRecuperar.parentElement.style.display = "none";
//        formMensaje.parentElement.style.display = "flex";
//    }


//    else if (e.target.tagName == "A" && e.target.textContent == "Registrarte") {
//        window.location.href = "/Registro/registroAdmin";

//    }
//    else if (e.target.tagName === "BUTTON" && e.target.textContent === "Iniciar Sesión") {
//        window.location.href = "/login/Tareas";
//    }

//});
document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (e) {
        if (e.target.tagName == "A" && e.target.textContent == "¿Olvidaste tu contraseña?") {
            formRecuperar.parentElement.style.display = "flex";
            formMensaje.parentElement.style.display = "none";
        } else if (e.target.tagName == "INPUT" && e.target.value == "Cancelar") {
            modalElement.style.display = "none";
        } else if (e.target.tagName == "INPUT" && e.target.value == "Recuperar") {
            formRecuperar.parentElement.style.display = "none";
            formMensaje.parentElement.style.display = "flex";
        } else if (e.target.tagName == "A" && e.target.textContent == "Registrarte") {
            window.location.href = "/Registro/registroAdmin";
        } else if (e.target.tagName === "BUTTON" && e.target.textContent === "Iniciar Sesión") {
            const numeroDeControl = document.getElementById('numeroDeControl').value;
            if (numeroDeControl.length === 4) {
                window.location.href = "/admin/departamento/verListadeCarreras";
            } else if (numeroDeControl.length === 8) {
                window.location.href = "/login/Tareas";
            }
             else if (numeroDeControl.length === 2) {
                window.location.href = "/login/Solicitudes";
            } 
        }
    });
});



