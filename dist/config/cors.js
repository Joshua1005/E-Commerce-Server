import { client } from "./keys.js";
const corsOptions = {
    origin: [client.url],
    credentials: true,
};
export default corsOptions;
