// This file is the entry point for the server application.
// It initializes the server and listens on a specified port.
// It also loads environment variables from a .env file.
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3000", 10);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
