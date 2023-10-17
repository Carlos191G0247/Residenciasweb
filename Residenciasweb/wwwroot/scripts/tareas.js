//var formtarea1 = document.querySelector(".formtarea1");
//var formtarea2 = document.querySelector(".formtarea2");
//var mostrarderecha = document.querySelector(".derecha");

//formtarea2.parentElement.style.display = "none";

//document.body.addEventListener("click", function (e) {

//    if (e.target.tagName == "A" && e.target.textContent =="Tarea 2") {

//        formtarea2.parentElement.style.display = "flex";
//        formtarea1.parentElement.style.display = "none";
//    }

//});


const tareas = document.querySelectorAll('ul li a');

tareas.forEach(tarea => {
    tarea.addEventListener('click', () => {
        const tareaId = tarea.getAttribute('data-tarea');
        const tareasContainer = document.querySelectorAll('.derecha');

        tareasContainer.forEach(container => {
            if (container.id === tareaId) {
                container.style.display = 'flex'; 
            } else {
                container.style.display = 'none'; 
            }
        });
    });
});


