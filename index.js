//importar npm de express
const express = require('express')
const app = express()
const fs=require('fs')

//incluir middleware de fileupload, especificando un limite de subida de archivo de 5 mb, respondiendo con un mensaje indicando que se sobrepaso el limite especificado
const expressFileUpload = require('express-fileupload')
app.use(expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit: 'el peso de la imagen que ud quiere subir supera el limite permitido'
}))
//disponibilizar carpeta publica
app.use(express.static('public'))

//para actualizar o crear nuevos registros
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//disponibilizar rutas web
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/formulario.html");
});
app.get('/imagen', (req, res) => {
    res.sendFile(__dirname + '/collage.html')
})
//crear ruta post/imagen que reciba y almacene una imagen en una carpeta publica del servidor, considerando su posicion en el grid-
app.post('/imagen', (req, res) => {
    const {target_file} = req.files;
    const { posicion } = req.body;
    const nombre = `imagen-${posicion}.jpg`;
    target_file.mv(`${__dirname}/public/imgs/${nombre}`, (err) => {
        res.redirect("/imagen")
    })

})
//crear ruta get (?) para borrar la imagen de la carpeta (funciona al hacer click).
app.get('/deleteImg/:imagen', (req, res) => {
    const { imagen } = req.params
    fs.unlink(`${__dirname}/public/imgs/${imagen}`,(err)=> {
        res.redirect("/imagen")
    })
})

//creacion del servidor
app.listen(3000,()=>{console.log('el servidor se esta inicializando en el puerto 3000')})