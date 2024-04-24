import Stripe from "stripe";
import { stripeKey } from "../config/keys.js";

const stripe = new Stripe(stripeKey.apiKey);

export default stripe;
