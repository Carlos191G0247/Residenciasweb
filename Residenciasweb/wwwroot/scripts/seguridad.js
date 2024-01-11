



// JWT//
async function estoyAutenticado() {
    return await sessionStorage.jwt;
}
//async function login() {
//    var credenciales = await navigator.credentials.get({ password: true });


//    if (credenciales) {    //ya tengo credenciales
//        await fetchToken(credenciales.id, credenciales.password);
//    }
//    else {  //No tengo guardadas
//        location.href = "/login/index";
//    }
//}
//async function login() {
//    const storedLastCredentialId = sessionStorage.getItem('lastCredentialId');
//    var credenciales = await navigator.credentials.get({ password: true });

//    if (credenciales) {
//        // Si hay múltiples credenciales almacenadas, invierte el orden y busca la última credencial utilizada
//        if (Array.isArray(credenciales) && credenciales.length > 0) {
//            const credencialesInvertidas = credenciales.reverse();
//            const ultimaCredencial = credencialesInvertidas.find(credencial => credencial.id === storedLastCredentialId);

//            if (ultimaCredencial) {
//                await fetchToken(ultimaCredencial.id, ultimaCredencial.password);
//            } else {
//                // Si no se encuentra la última credencial utilizada, inicia sesión con la primera
//                const primeraCredencial = credencialesInvertidas[0];
//                await fetchToken(primeraCredencial.id, primeraCredencial.password);
//            }
//        } else {
//            // Si solo hay una credencial almacenada, inicia sesión automáticamente
//            await fetchToken(credenciales.id, credenciales.password);
//        }

//        // Almacenar el ID de la última credencial utilizada
//        sessionStorage.setItem('lastCredentialId', credenciales.id);
//    } else {
//        // No hay credenciales almacenadas, redirigir a la página de inicio de sesión
//        location.href = "/login/index";
//    }
//}
async function logout() {
    sessionStorage.removeItem("jwt");
    await navigator.credentials.preventSilentAccess();
    location.href = "/login/index";
}

async function fetchToken(username, password) {

    let rol;
    if (username.length === 5) {
        rol = "Admin";
    }
    else if (username.length ==4) {
        rol = "Telma";
    }
    else {
        rol = "Residente";
    }
    
  
    let json = {
        Contrasena: password,
        Numcontrol: username,
        Rol: rol
    };

    let response = await fetch("https://apiresidenciaswebca.sistemas19.com/api/IniciarSesion", {
        method: 'POST',
        body: JSON.stringify(json),
        headers: {
            "content-type": "application/json"
        }
    });

    if (response.ok) {

       
        var token = await response.text();
        sessionStorage.jwt = token;

        sessionStorage.lastCredentials = JSON.stringify({
            Numcontrol: username,
            Contrasena: password
        });

        let credencial = new PasswordCredential({
            id: username,
            password: password,
            username: username
        });
        await navigator.credentials.store(credencial);
        if (rol == "Admin") {
            window.location.href = "/login/Solicitudes";
        }
        else if (rol == "Residente") {
            window.location.href = "/login/Tareas";
        }
        else if (rol == "Telma") {

            window.location.href = "/admin/departamento/ControlEscolar";
        }
        
    } else {
        console.error('Error en la respuesta:', response.status, response.statusText);
    }

};
async function renewToken() {
    try {
        // Obtener la última credencial almacenada
        const lastCredentials = JSON.parse(sessionStorage.lastCredentials || '{}');

        let rol;
        if (lastCredentials.Numcontrol && lastCredentials.Numcontrol.length === 5) {
            rol = "Admin";
        }
        else if (lastCredentials.Numcontrol && lastCredentials.Numcontrol.length === 4) {
            rol = "Telma";
        }
        else {
            rol = "Residente";
        }


        let json = {
            Numcontrol: lastCredentials.Numcontrol,
            Contrasena: lastCredentials.Contrasena,           
            Rol: rol
        };
        // Realizar una solicitud al servidor para renovar el token
        const response = await fetch("https://apiresidenciaswebca.sistemas19.com/api/IniciarSesion", {
            method: 'POST',
            body: JSON.stringify(json),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.jwt
            },
         
        });

        if (response.ok) {
            // Obtener el nuevo token del cuerpo de la respuesta
            const newToken = await response.text();

            // Almacenar el nuevo token en sessionStorage
            sessionStorage.jwt = newToken;

            sessionStorage.lastRenewalTime = Date.now();


            sessionStorage.lastCredentials = JSON.stringify({
                Numcontrol: lastCredentials.Numcontrol,
                Contrasena: lastCredentials.Contrasena
            });
            // Puedes realizar otras acciones necesarias después de renovar el token
            console.log('Token renovado con éxito.');

          
        } else {
            console.error('Error al renovar el token:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado al renovar el token:', error);
    }
}
const TIEMPO_ANTES_DE_EXPIRACION = 28 * 60 * 1000;  // 29 minutos en milisegundos

// Llama a la función renewToken antes de que el token expire
// Puedes hacer esto en un temporizador o en respuesta a eventos relevantes
// Asegúrate de ajustar el tiempo según tus necesidades específicas
setTimeout(renewToken, TIEMPO_ANTES_DE_EXPIRACION);
async function guardarUltimaPagina() {
    const ultimaPagina = window.location.href;
    localStorage.setItem('ultimaPagina', ultimaPagina);
    console.log('Página guardada:', ultimaPagina);
}

async function obtenerUltimaPagina() {
    const ultimaPagina = localStorage.getItem('ultimaPagina');
    console.log('Página obtenida:', ultimaPagina);
    return ultimaPagina;
}

async function checkAndRedirectToHome() {
    if (!sessionStorage.jwt) {

       
        console.log('No se realizará ninguna redirección.');

    }
    else {
        if (!sessionStorage.jwt && !sessionStorage.lastCredentials) {
            // Redirigir a la página de inicio
            console.log('Página obtenida:');
        }
        else {
            if (ultimaPagina && ultimaPagina === "https://residencias.sistemas19.com/login/index") {
                console.log('Página obtenida:');
            }
            else {
                const ultimaPagina = await obtenerUltimaPagina();
                location.href = ultimaPagina;
            }
        }
       
    }
}
async function verificarDatoss() {
    let autenticado = await estoyAutenticado();
    if (autenticado) {

    }
    else {
        await login();
    }
}


////