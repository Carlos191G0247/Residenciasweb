



// JWT//
async function estoyAutenticado() {
    return await sessionStorage.jwt;
}
async function login() {
    var credenciales = await navigator.credentials.get({ password: true });


    if (credenciales) {    //ya tengo credenciales
        await fetchToken(credenciales.id, credenciales.password);
    }
    else {  //No tengo guardadas
        location.href = "/login/index";
    }
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

async function verificarDatoss() {
    let autenticado = await estoyAutenticado();
    if (autenticado) {

    }
    else {
        await login();
    }
}


////