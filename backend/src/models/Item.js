import mongoose from 'mongoose';
const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 1500 },
  type: { type: String, enum: ['lost', 'found'], required: true },
  category: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  imageUrl: { type: String, default: '' },
  status: { type: String, enum: ['active', 'resolved', 'hidden'], default: 'active' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
itemSchema.index({ title: 'text', description: 'text', category: 'text', location: 'text' });
export default mongoose.model('Item', itemSchema);
