var formRecuperar = document.querySelector(".formRecuperarContraseña");
var formMensaje = document.querySelector(".formMensaje");
var modalElement = document.querySelector(".modal"); 

document.body.addEventListener("click", function (e) {
    if (e.target.tagName == "A" && e.target.textContent == "¿Olvidaste tu contraseña?") {

        formRecuperar.style.display = "block";
        formMensaje.style.display = "none";
        modalElement.classList.add("modal--show");
    }
    else if (e.target.tagName == "A" && e.target.textContent == "Registrarte") {
        formMensaje.style.display = "block";
        formRecuperar.style.display = "none";
        modalElement.classList.add("modal--show");
    } 
    
});