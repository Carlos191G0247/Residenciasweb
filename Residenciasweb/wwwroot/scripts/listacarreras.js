document.body.addEventListener("click", function (e) {
    if (e.target.tagName == "LI") {
        window.location.href = "/admin/departamento/verListaGrupos";
    }
});

const tareas = document.querySelectorAll('ul li');
