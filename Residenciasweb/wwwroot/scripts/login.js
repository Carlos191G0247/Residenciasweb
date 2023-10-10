var formRecuperar = document.querySelector(".formRecuperarContraseña");
var formMensaje = document.querySelector(".formMensaje");

document.body.addEventListener("click", function (e) {
    if (e.target.tagName == "A") {
        formRecuperar.parentElement.style.display = "block";
    } 
});