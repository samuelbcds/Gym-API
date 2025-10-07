import express from "express";
import swaggerUi from "swagger-ui-express";
import configDotenv from "./src/config/dotenv";
import passport from "passport";
import routes from "./src/routes/routes";
import swaggerSpec from "./src/config/swagger";

configDotenv();

const app = express();

const name = process.env.APP_NAME || "GymWebSystem";
const host = process.env.APP_HOST || "localhost";
const port = parseInt(process.env.APP_PORT || "3333", 10);

/* ---------------------------- middleware ---------------------------------- */
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------------- swagger documentation -------------------------- */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ------------------------------ routes ------------------------------------ */
app.use("/api", routes);

/* --------------------------- welcome route -------------------------------- */
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Gym Management API",
    version: "1.0.0",
    documentation: `http://${host}:${port}/api-docs`,
  });
});

/* ------------------------------ server ------------------------------------ */
app.listen(port, host, () => {
  console.log(`${name} listening at http://${host}:${port}`);
  console.log(`API Documentation available at http://${host}:${port}/api-docs`);
});
