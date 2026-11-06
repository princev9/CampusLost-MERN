import Item from '../models/Item.js';
export async function profile(req, res) {
  const user = req.user;
  const [items, active] = await Promise.all([Item.countDocuments({ owner: user._id }), Item.countDocuments({ owner: user._id, status: 'active' })]);
  res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, college: user.college, role: user.role }, stats: { total: items, active } });
}
export async function updateProfile(req, res, next) {
  try {
    const { name, phone, college } = req.body;
    if (name !== undefined) req.user.name = name;
    if (phone !== undefined) req.user.phone = phone;
    if (college !== undefined) req.user.college = college;
    await req.user.save();
    res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, phone: req.user.phone, college: req.user.college, role: req.user.role } });
  } catch (e) { next(e); }
}
