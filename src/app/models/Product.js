import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  targetPrice: { type: Number, required: true },
  shipmentType: { type: String, enum: ['dropship', 'direct'], required: true },
  sources: [{ type: String }],
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);