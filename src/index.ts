import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv, {config} from "dotenv"
import { usersController } from "./controllers/users_controller";
import { budgetController } from "./controllers/budget_controller";

config({path: ".env"})
dotenv.config()

const client = new PrismaClient();
const app = express();
app.use(express.json());

usersController(app, client);
budgetController(app, client);

app.get("/", (req, res) => {
  res.send(`<h1>Hello, world!</h1>`);
});

app.listen(3000, () => {
  console.log("I got started!");
});