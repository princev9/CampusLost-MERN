import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

const tokenFor = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const publicUser = user => ({ 
  id: user._id, 
  name: user.name, 
  email: user.email, 
  phone: user.phone, 
  college: user.college, 
  role: user.role,
  isVerified: user.isVerified 
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper function to generate and send OTP email
const sendOtpEmail = async (user) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  await user.save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'CampusLost - Verification OTP',
    html: `<h3>Your OTP for CampusLost verification is: <b>${otp}</b></h3><p>This OTP is valid for 10 minutes.</p>`
  });
};

// 1. Register (Creates unverified user and sends OTP)
export async function register(req, res, next) {
  try {
    const { name, email, password, phone, college } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    
    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });
    
    if (user) {
      if (user.isVerified) {
        return res.status(409).json({ message: 'Email is already registered' });
      }
      // If user exists but not verified, update details and resend OTP
      user.name = name;
      user.password = await bcrypt.hash(password, 12);
      user.phone = phone;
      user.college = college;
    } else {
      const role = normalizedEmail === (process.env.ADMIN_EMAIL || '').toLowerCase() ? 'admin' : 'student';
      const hashedPassword = await bcrypt.hash(password, 12);
      user = await User.create({ 
        name, 
        email: normalizedEmail, 
        password: hashedPassword, 
        phone, 
        college, 
        role, 
        isVerified: false 
      });
    }

    await sendOtpEmail(user);
    res.status(200).json({ message: 'OTP sent to your email. Please verify to complete registration.', email: normalizedEmail });
  } catch (e) { next(e); }
}

// 2. Verify OTP (Verifies user and logs them in by returning token)
export async function verifyOTP(req, res, next) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ 
      message: 'Account verified successfully', 
      token: tokenFor(user._id), 
      user: publicUser(user) 
    });
  } catch (e) { next(e); }
}

// 3. Resend OTP
export async function resendOTP(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User is already verified' });

    await sendOtpEmail(user);
    res.status(200).json({ message: 'New OTP sent successfully to your email' });
  } catch (e) { next(e); }
}

// 4. Login (Checks password and ensures account is verified)
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: String(email || '').toLowerCase().trim() }).select('+password');
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      await sendOtpEmail(user);
      return res.status(403).json({ 
        message: 'Account not verified. A new OTP has been sent to your email.', 
        needsVerification: true,
        email: user.email 
      });
    }

    res.json({ token: tokenFor(user._id), user: publicUser(user) });
  } catch (e) { next(e); }
}

export function me(req, res) { res.json({ user: publicUser(req.user) }); }