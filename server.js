const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static("public"));

 mongoose.connect("mongodb://localhost:27017/musicline")
    .then(() => console.log("Mongo conectado"))
    .catch(err => console.log("Error Mongo:", err));


const usuarioSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    password: String
});

const Usuario = mongoose.model("Usuario", usuarioSchema);



app.post("/registro", async (req, res) => {
    const { nombre, email, password } = req.body;

    const existente = await Usuario.findOne({ email });
    if (existente) {
        return res.status(400).send("Usuario ya existente!");
    }

    const nuevoUsuario = new Usuario({ nombre, email, password });
    await nuevoUsuario.save();

    res.send("Usuario registrado");
});



app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email, password });

    if (!usuario) {
        return res.status(401).send("Datos incorrectos!");
    }

   
res.send("Bienvenido " + usuario.nombre + " !");
});

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));