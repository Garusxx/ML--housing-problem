import express from "express";
import "./config.js";
import { getHausing } from "./mySql.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("Helssslo World!");
});

app.get("/getHousing", async (req, res) => {
  try {
    const housingData = await getHausing();
    res.json(housingData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
