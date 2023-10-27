

document.body.addEventListener("click", function (e) {
    
    if (e.target.tagName == "INPUT" && e.target.value == "Cancelar") {
        window.history.back();

    }
    if (e.target.tagName == "INPUT" && e.target.value == "Guardar") {
        window.history.back();

    }
    

});