const express = require('express');
const app = express()

// Rota principal
app.get('/', (req,res) => {
    res.send("Hello World!");
});

// Iniciar o servidor
app.listen(3000,() => {
    console.log('Servidor rodando em http://localhost:3000');
});