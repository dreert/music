     document.addEventListener("DOMContentLoaded", () => {
       window.mostrarRegistro = function () {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("registerBox").style.display = "block";
    }

    window.mostrarLogin = function () {
        document.getElementById("registerBox").style.display = "none";
        document.getElementById("loginBox").style.display = "block";
    }

    
    window.registrar = async function () {
        const nombre = document.getElementById("regUser").value.trim();
        const correo = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPass").value.trim();
        const repetir = document.getElementById("regPass2").value.trim();
        const error = document.getElementById("regError");

        error.innerText = "";

         if (!nombre || !correo || !password || !repetir) {
            error.innerText = "Completa todos los campos!";
            return;
        }
         if (password !== repetir) {
            error.innerText = "Las contraseñas no coinciden!";
            return;
        }

        try {
            const res = await fetch("/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre,
                    email: correo,
                    password
                })
            });

            const data = await res.text();

            if (!res.ok) {
                error.innerText = data;
                return;
            }

            alert(data);
            mostrarLogin();

        } catch (err) {
            error.innerText = "Error al conectar con el servidor";
            console.error(err);
        }
    }

      window.login = async function () {
        const email = document.getElementById("loginUser").value.trim();
        const password = document.getElementById("loginPass").value.trim();
        const error = document.getElementById("loginError");

        error.innerText = "";
          if (!email || !password) {
            error.innerText = "Completa todos los campos";
            return;
        }

        try {
            const res = await fetch("/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.text();

            if (!res.ok) {
                error.innerText = data;
                return;
            }

            alert(data); 
            window.location.href = "the lobby.html"; 

        } catch (err) {
            error.innerText = "Error al conectar con el servidor";
            console.error(err);
        }
    }

});