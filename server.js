const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./db.db");

// Lav database
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  status TEXT,
  note TEXT
)
`);

// Hent bruger
app.get("/api/user/:id", (req, res) => {
  db.get("SELECT * FROM users WHERE id = ?", [req.params.id], (err, row) => {
    res.json(row || null);
  });
});

// Gem bruger
app.post("/api/user/:id", (req, res) => {
  const { status, note } = req.body;

  db.run(`
    INSERT INTO users (id, status, note)
    VALUES (?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET status=?, note=?
  `, [req.params.id, status, note, status, note]);

  res.send("OK");
});

app.listen(3000, () => {
  console.log("Server kører på http://localhost:3000");
});