function login() {
    let user = document.getElementById("usuario").value;
    let pass = document.getElementById("password").value;

    if (user === "admin" && pass === "1234") {
        localStorage.setItem("login", "ok");
        window.location.href = "app.html";
    } else {
        document.getElementById("error").innerText = "Datos incorrectos";
    }
}