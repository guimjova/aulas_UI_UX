const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = 3000;

// Middleware para JSON
app.use(express.json());

// Criar ou abrir o banco
const db = new sqlite3.Database("./database.db");

// Cria a tabela (se não existir)
db.run(`CREATE TABLE IF NOT EXISTS notas(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT,
    conteudo TEXT
)`);

// Rota de inserção
app.post('/notas', (req,res) => {
    const {titulo, conteudo} = req.body;
    db.run(
        "INSERT INTO notas (titulos , conteudo) VALUES (?, ?)",
        [titulo, conteudo],
        function (err){
            if (err) return res.status(500).json({error: err.message});
            res.json({id:this.lastID, titulo, conteudo});
        }
    );
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});