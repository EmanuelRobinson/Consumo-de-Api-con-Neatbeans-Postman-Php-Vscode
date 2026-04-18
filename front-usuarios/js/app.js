if (localStorage.getItem("login") !== "ok") {
    window.location.href = "index.html";
}

const API = "http://localhost:8080/usuarios";
let editando = null;


function listar() {
    fetch(API)
    .then(res => {
        if (!res.ok) throw new Error("Error en API");
        return res.json();
    })
    .then(data => {
        let tabla = document.getElementById("tabla");
        tabla.innerHTML = "";

        data.forEach(u => {
            tabla.innerHTML += `
                <tr>
                    <td>${u.id}</td>
                    <td>${u.nombre}</td>
                    <td>${u.email}</td>
                    <td>
                        <button class="btn-edit" onclick="editar(${u.id}, '${u.nombre}', '${u.email}')">Editar</button>
                        <button class="btn-delete" onclick="eliminar(${u.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    })
    .catch(err => {
        console.error("ERROR: No conecta con backend", err);
        mostrarMensaje("error", "Error al cargar usuarios");
    });
}

function guardar() {
    let nombre = document.getElementById("nombre").value;
    let email = document.getElementById("email").value;

if (nombre === "" || email === "") {
        mostrarMensaje("error", "Todos los campos son obligatorios");
        return;
    }
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) {
        mostrarMensaje("error", "Email inválido");
        return;
    }

    const metodo = (editando == null) ? "POST" : "PUT";
    const url = (editando == null) ? API : `${API}/${editando}`;

    fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email })
    })
    .then(() => {
        mostrarMensaje("success", editando ? "Usuario actualizado" : "Usuario creado");
        listar();
        limpiar();
        editando = null;
    });
}
function eliminar(id) {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
        mostrarMensaje("loading", "Eliminando...");
        fetch(`${API}/${id}`, { method: "DELETE" })
        .then(() => {
            mostrarMensaje("success", "Usuario eliminado");
            listar();
        })
        .catch(() => mostrarMensaje("error", "Error al eliminar"));
    }
}
function editar(id, nombre, email) {
    document.getElementById("nombre").value = nombre;
    document.getElementById("email").value = email;
    editando = id;
}

function limpiar() {
    document.getElementById("nombre").value = "";
    document.getElementById("email").value = "";
}

function logout() {
    localStorage.removeItem("login");
    window.location.href = "index.html";
}
function mostrarMensaje(tipo, texto) {

    const anterior = document.querySelector(".mensaje");
    if (anterior) anterior.remove();

    const mensaje = document.createElement("div");
    mensaje.className = `mensaje mensaje-${tipo}`;
    mensaje.textContent = texto;
    mensaje.style.cssText = `
        position: fixed; top: 20px; right: 20px; padding: 15px 20px;
        border-radius: 5px; color: white; font-weight: 600; z-index: 10000;
        ${tipo === "success" ? "background: #27ae60;" : tipo === "error" ? "background: #e74c3c;" : "background: #3498db;"}
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(mensaje);
    
    setTimeout(() => mensaje.remove(), 3000);
}

mostrarMensaje("loading", "Cargando usuarios...");
listar();
