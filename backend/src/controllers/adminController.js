import User from '../models/User.js';
import Item from '../models/Item.js';
export async function users(_req, res, next) {
  try { const users = await User.find().select('-password').sort({ createdAt: -1 }); res.json({ users }); } catch (e) { next(e); }
}
export async function items(_req, res, next) {
  try { const items = await Item.find().populate('owner', 'name email').sort({ createdAt: -1 }); res.json({ items }); } catch (e) { next(e); }
}
export async function setItemStatus(req, res, next) {
  try {
    if (!['active', 'resolved', 'hidden'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });
    const item = await Item.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate('owner', 'name email');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ item });
  } catch (e) { next(e); }
}
export async function deleteUser(req, res, next) {
  try {
    if (String(req.user._id) === req.params.id) return res.status(400).json({ message: 'You cannot delete your own admin account' });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await Item.deleteMany({ owner: user._id });
    res.json({ message: 'User and their listings deleted' });
  } catch (e) { next(e); }
}
