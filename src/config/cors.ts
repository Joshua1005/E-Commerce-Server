import { CorsOptions } from "cors";
import { client } from "./keys.js";

const corsOptions: CorsOptions = {
  origin: [client.url],
  credentials: true,
};

export default corsOptions;
