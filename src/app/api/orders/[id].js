import Order from "../../models/Order";
import connect from "../../utils/db";

export default async function handler(req, res) {
  const { method, query: { id } } = req;

  await connect();

  switch (method) {
    case "GET":
      try {
        const order = await Order.findById(id);
        if (!order) {
          return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).json({ message: `Method ${method} not allowed` });
  }
}