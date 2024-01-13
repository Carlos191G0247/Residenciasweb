



// JWT//
async function estoyAutenticado() {
    return await sessionStorage.jwt;
}

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
        const response = await fetch("https://apiresidenciaswebca.sistemas19.com/api/IniciarSesion", {
            method: 'POST',
            body: JSON.stringify(json),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.jwt
            },
         
        });

        if (response.ok) {
            const newToken = await response.text();

            sessionStorage.jwt = newToken;

            sessionStorage.lastRenewalTime = Date.now();


            sessionStorage.lastCredentials = JSON.stringify({
                Numcontrol: lastCredentials.Numcontrol,
                Contrasena: lastCredentials.Contrasena
            });
            console.log('Token renovado con éxito.');

          
        } else {
            console.error('Error al renovar el token:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error inesperado al renovar el token:', error);
    }
}
const TIEMPO_ANTES_DE_EXPIRACION = 28 * 60 * 1000;  


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