import express from "express";
import "./config.js";
import { getHousing } from "./mySql.js";
import cors from "cors";
import path from "path";

const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

const app = express();

app.use(cors());

app.get("/getHousing", async (req, res) => {
  try {
    const housingData = await getHousing();
    res.json(housingData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
