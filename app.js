import "dotenv/config";
import express from "express";
import airbnbRouter from "./routes/airbnb.js";
import userRouter from "./routes/user.js";

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use("/api/airbnb", airbnbRouter);
app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log("Servidor Web en el puerto:", PORT);
});
