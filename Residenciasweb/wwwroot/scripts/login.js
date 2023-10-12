var formRecuperar = document.querySelector(".formRecuperarContraseña");
var formMensaje = document.querySelector(".formMensaje");
var modalElement = document.querySelector(".modal"); 

document.body.addEventListener("click", function (e) {
    if (e.target.tagName == "A" && e.target.textContent == "¿Olvidaste tu contraseña?") {

        formRecuperar.parentElement.style.display = "flex";
        formMensaje.parentElement.style.display = "none";
        
    }
    else if (e.target.tagName == "A" && e.target.textContent == "Registrarte") {
        formMensaje.parentElement.style.display = "flex";
        formRecuperar.parentElement.style.display = "none";
    
    } 
    
});