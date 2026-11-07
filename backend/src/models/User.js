import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  isVerified: { type: Boolean, default: false }, // Account verification status
  otp: { type: String },
  otpExpires: { type: Date },
  phone: { type: String, trim: true, default: '' },
  college: { type: String, trim: true, default: '' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' }
}, { timestamps: true });
export default mongoose.model('User', userSchema);
