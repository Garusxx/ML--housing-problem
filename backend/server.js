import express from "express";
import "./config.js";
import { getHousing } from "./mySql.js";
import cors from "cors";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Yesss World!");
});

app.get("/getHousing", async (req, res) => {
  try {
    const housingData = await getHousing();
    res.json(housingData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
