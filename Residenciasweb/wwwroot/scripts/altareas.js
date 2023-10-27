document.body.addEventListener("click", function (e) {
    if (e.target.tagName == "LI") {
        window.location.href = "/login/Tarea";
    }
});

const tareas = document.querySelectorAll('ul li');