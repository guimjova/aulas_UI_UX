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

// Rota principal
app.get("/", (req, res) => {
    res.json({
        message: "Crud NODE.JS",
        rotas :{
            listar_todas: "/notas",
            criar_nota: "POST /notas",
            buscar_por_id: "/notas/:id",
            atualizar: "PUT /notas/:id",
            deletar: "DELETE /notas/:id"
        }
    });
});

// Rota de inserção
app.post('/notas', (req,res) => {
    const {titulo, conteudo} = req.body;
    db.run(
        "INSERT INTO notas (titulo , conteudo) VALUES (?, ?)",
        [titulo, conteudo],
        function (err){
            if (err) return res.status(500).json({error: err.message});
            res.json({id:this.lastID, titulo, conteudo});
        }
    );
});

//buscar 

app.get("/notas/:id", (req, res) => {
  db.get("SELECT * FROM notas WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Nota não encontrada" });
    res.json(row);
  });
});

// Rota - Atualizar
app.put("/notas/:id", (req, res) => {
  const { titulo, conteudo } = req.body;
  db.run(
    "UPDATE notas SET titulo = ?, conteudo = ? WHERE id = ?",
    [titulo, conteudo, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Nota não encontrada" });
      res.json({ id: req.params.id, titulo, conteudo });
    }
  );
});

// Rota - Deletar
app.delete("/notas/:id", (req, res) => {
  db.run("DELETE FROM notas WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Nota não encontrada" });
    res.json({ message: "Nota deletada" });
  });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});