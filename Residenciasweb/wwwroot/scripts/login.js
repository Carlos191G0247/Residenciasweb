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




btniniciar.addEventListener("click", async function (event) {
    event.preventDefault();

    await fetchToken(numerodecontrol.value, contrasena.value)
      
 
});
document.addEventListener("DOMContentLoaded", function () {


   

    enviarBtn.addEventListener('click', async function (event) {

        event.preventDefault();

        errores = null;



        let form = event.target.closest('form');;

        let json = {
            Numcontrol: form.elements.numControl.value,
        };

        let response = await fetch("https://apiresidenciaswebca.sistemas19.com/api/CambiarContrasena/login", {
            method: 'POST',
            body: JSON.stringify(json),
            headers: {
                "content-type": "application/json"
            }

        });

        if (response.ok) {
            let idobj = await response.json();
            console.log(idobj);


            let json2 = {
                Id: idobj,
            };

            let response2 = await fetch("https://apiresidenciaswebca.sistemas19.com/api/CambiarContrasena", {
                method: 'PUT',
                body: JSON.stringify(json2),
                headers: {
                    "content-type": "application/json"
                },

            });

            if (response2.ok) {
                formRecuperar.parentElement.style.display = "none";
                formMensaje.parentElement.style.display = "flex";
                formMensaje2.parentElement.style.display = "none";

            }
            else {
                ocultarformulario();

            }



        }
        else {
            let idobj = await response.text();
            console.log(idobj);
            erroresLabel.textContent = idobj;

        }

    });

    cancelar.addEventListener('click', async function (event) {
        formRecuperar.parentElement.style.display = "none";
        formMensaje.parentElement.style.display = "none";
        formMensaje2.parentElement.style.display = "none";
    });
    function ocultarformulario() {
        formRecuperar.parentElement.style.display = "none";
        formMensaje.parentElement.style.display = "none";
        formMensaje2.parentElement.style.display = "flex";
    }
    olvidastecontra.addEventListener('click',function (event) {
        formRecuperar.parentElement.style.display = "flex";
        formMensaje.parentElement.style.display = "none";
        formMensaje2.parentElement.style.display = "none";
    });
    
  
   
});
async function iniciar() {
    await obtenerUltimaPagina();
    await checkAndRedirectToHome();
    
}
iniciar();

