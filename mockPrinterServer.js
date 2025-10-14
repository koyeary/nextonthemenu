import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.text({ type: "*/*" }));

app.post("/StarWebPRNT/SendMessage", (req, res) => {
  console.log("Received print request (mock):", req.body?.slice?.(0, 200));

  // Correct XML format the StarWebPrintTrader expects
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<StarWebPrint>
  <Status>Success</Status>
</StarWebPrint>`;

  res
    .status(200)
    .set("Content-Type", "text/xml; charset=utf-8")
    .set("Access-Control-Allow-Origin", "*")
    .send(xml);
});

app.get("/StarWebPRNT/Info", (req, res) => {
  res.json({ name: "Mock StarWebPRNT", version: "dev" });
});

app.listen(8001, () => {
  console.log("✅ Mock StarWebPRNT server listening on :8001");
});
