 var formRecuperar = document.querySelector(".formRecuperarContraseña");
var formMensaje = document.querySelector(".formMensaje");
var modalElement = document.querySelector(".modal");
const enviarBtn = document.getElementById("recuperarbtn");
var formMensaje2 = document.querySelector(".formMensajeFallo");
var cancelar = document.querySelector(".cancelarbtn");
const erroresLabel = document.querySelector('.errores');
const olvidastecontra = document.getElementById("olvidaste");
var numerodecontrol = document.getElementById("numeroDeControl");
var contrasena = document.getElementById("contrasena");
var btniniciar = document.getElementById("iniciarsesion");


var errores = erroresLabel;



// JWT//
//async function estoyAutenticado() {
//    return await sessionStorage.jwt;
//}
//async function login() {
//    var credenciales = await navigator.credentials.get({ password: true });


//    if (credenciales) {    //ya tengo credenciales
//        await fetchToken(credenciales.id, credenciales.password);
//    }
//    else {  //No tengo guardadas
//        location.href = "/login";
//    }
//}

//async function logout() {
//    sessionStorage.removeItem("jwt");
//    await navigator.credentials.preventSilentAccess();
//    location.href = "/login";
//}

btniniciar.addEventListener("click", async function (event) {
    event.preventDefault();
    
        let json = {
            Contrasena: contrasena.value,
            Numcontrol: numerodecontrol.value
        };

        let response = await fetch("https://localhost:7137/api/IniciarSesion", {
            method: 'POST',
            body: JSON.stringify(json),
            headers: {
                "content-type": "application/json"
            }
        });

        if (response.ok) {
            var token = await response.text();
            sessionStorage.jwt = token;
            let credencial = new PasswordCredential({
                id: numerodecontrol.value,
                password: contrasena.value,
                username: numerodecontrol.value
            });
            await navigator.credentials.store(credencial);
            window.location.href = "/login/Tareas";
        } else {
            console.error('Error en la respuesta:', response.status, response.statusText);
        }

});


////
document.addEventListener("DOMContentLoaded", function () {


   

    //enviarBtn.addEventListener('click', async function (event) {

    //    event.preventDefault();

    //    errores = null;



    //    let form = event.target.closest('form');;

    //    let json = {
    //        Numcontrol: form.elements.numControl.value,
    //    };

    //    let response = await fetch("https://apiresidenciaswebca.sistemas19.com/api/CambiarContrasena/login", {
    //        method: 'POST',
    //        body: JSON.stringify(json),
    //        headers: {
    //            "content-type": "application/json"
    //        }

    //    });

    //    if (response.ok) {
    //        let idobj = await response.json();
    //        console.log(idobj);


    //        let json2 = {
    //            Id: idobj,
    //        };

    //        let response2 = await fetch("https://apiresidenciaswebca.sistemas19.com/api/CambiarContrasena", {
    //            method: 'PUT',
    //            body: JSON.stringify(json2),
    //            headers: {
    //                "content-type": "application/json"
    //            },

    //        });

    //        if (response2.ok) {
    //            formRecuperar.parentElement.style.display = "none";
    //            formMensaje.parentElement.style.display = "flex";
    //            formMensaje2.parentElement.style.display = "none";

    //        }
    //        else {
    //            ocultarformulario();

    //        }



    //    }
    //    else {
    //        let idobj = await response.text();
    //        console.log(idobj);
    //        erroresLabel.textContent = idobj;

    //    }

    //});

    //cancelar.addEventListener('click', async function (event) {
    //    formRecuperar.parentElement.style.display = "none";
    //    formMensaje.parentElement.style.display = "none";
    //    formMensaje2.parentElement.style.display = "none";
    //});
    //function ocultarformulario() {
    //    formRecuperar.parentElement.style.display = "none";
    //    formMensaje.parentElement.style.display = "none";
    //    formMensaje2.parentElement.style.display = "flex";
    //}
    //olvidastecontra.addEventListener('click',function (event) {
    //    formRecuperar.parentElement.style.display = "flex";
    //    formMensaje.parentElement.style.display = "none";
    //    formMensaje2.parentElement.style.display = "none";
    //});
    
  
    //document.body.addEventListener("click", function (e) {
        

    //     if (e.target.tagName == "A" && e.target.textContent == "Registrarte") {
    //        window.location.href = "/Registro/RegistroAlumno";
    //    } else if (e.target.tagName === "BUTTON" && e.target.textContent === "Iniciar Sesión") {
    //        const numeroDeControl = document.getElementById('numeroDeControl').value;
    //        if (numeroDeControl.length === 4) {
    //            window.location.href = "/admin/departamento/verListadeCarreras";
    //        } else if (numeroDeControl.length === 8) {
    //            window.location.href = "/login/Tareas";
    //        }
    //        else if (numeroDeControl.length === 2) {
    //            window.location.href = "/login/Solicitudes";
    //        }
    //    }
    //});
});



