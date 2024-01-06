
var nombreCordi = document.getElementById('nombrecordi');

async function logout() {
    sessionStorage.removeItem("jwt");
    await navigator.credentials.preventSilentAccess();
    location.href = "/login/index";
}
async function TraerNombre() {
    let response = await fetch('https://localhost:7137/api/Coordinadores/CordiNom', {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + sessionStorage.jwt
        }
    });
    if (response.ok) {
        let datos = await response.text();
        nombreCordi.textContent = datos;
    }
    else {
        console.log("no trajo el nombre");
    }

};
 TraerNombre();