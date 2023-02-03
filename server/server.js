import APP from "express";
import connectDB from "./dbConnection/index.js";
import routes from "./routes/index.js";
import configureExpressApp from "./config/index.js";

const app = new APP();
configureExpressApp(app)

const PORT = 3001;

const startServer = () => {
  Promise.all([connectDB()])
    .then(() => {
      app.listen(PORT);
      console.log(`Server started on Port ${PORT}`);
      routes(app);
    }).catch((error) => console.error(`Unable to start the server`, error));
};

startServer();