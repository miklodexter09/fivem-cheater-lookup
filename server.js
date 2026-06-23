const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const ADMIN_KEY = process.env.ADMIN_KEY || "Miklo2025";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

app.get("/api/user/:id", async (req, res) => {
  const id = req.params.id;

  const { data, error } = await supabase
    .from("cheaters")
    .select("*")
    .eq("discord_id", id)
    .maybeSingle();

  if (error) {
    console.error(error);
    return res.status(500).send("Database error");
  }

  if (!data) {
    return res.json(null);
  }

  res.json({
    status: data.status,
    note: data.note,
    evidence: data.evidence
  });
});

app.post("/api/user/:id", async (req, res) => {
  const adminKey = req.headers["admin-key"];

  if (adminKey !== ADMIN_KEY) {
    return res.status(403).send("No access");
  }

  const id = req.params.id;
  const { status, note, evidence } = req.body;

  const { error } = await supabase
    .from("cheaters")
    .upsert({
      discord_id: id,
      status: status || "sus",
      note: note || "",
      evidence: evidence || "",
      updated_at: new Date()
    });

  if (error) {
    console.error(error);
    return res.status(500).send("Database error");
  }

  res.send("OK");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server kører på port " + PORT);
});
