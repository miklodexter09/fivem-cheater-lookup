const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const DB_FILE = "./db.json";
const ADMIN_KEY = "Miklo";

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, "{}");
}

function readDb() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get("/api/user/:id", (req, res) => {
  const db = readDb();
  res.json(db[req.params.id] || null);
});

app.post("/api/user/:id", (req, res) => {
  const adminKey = req.headers["admin-key"];

  if (adminKey !== ADMIN_KEY) {
    return res.status(403).send("No access");
  }

  const db = readDb();

  db[req.params.id] = {
    status: req.body.status,
    note: req.body.note || "",
    evidence: req.body.evidence || ""
  };

  writeDb(db);
  res.send("OK");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server kører på port " + PORT);
});
