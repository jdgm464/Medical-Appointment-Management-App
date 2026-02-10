import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(__dirname, "../../.env") });

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MONGODB_URI no esta configurada");
}

export { mongoUri };
