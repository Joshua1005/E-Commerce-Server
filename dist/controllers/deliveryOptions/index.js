// Model
import DeliveryOption from "../../models/deliveryOption.js";
const allDeliveryOptions = async (_, res) => {
    try {
        const deliveryOptions = await DeliveryOption.find({});
        return res.status(200).json({ deliveryOptions });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export { allDeliveryOptions };
