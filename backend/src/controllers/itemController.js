import Item from '../models/Item.js';
const populateOwner = { path: 'owner', select: 'name email phone college' };

export async function listItems(req, res, next) {
  try {
    const { q, type, category } = req.query;
    const filter = { status: 'active' };
    if (['lost', 'found'].includes(type)) filter.type = type;
    if (category) filter.category = category;
    if (q) filter.$text = { $search: q };
    const items = await Item.find(filter).populate(populateOwner).sort({ createdAt: -1 }).limit(100);
    res.json({ items });
  } catch (e) { next(e); }
}
export async function myItems(req, res, next) {
  try {
    const items = await Item.find({ owner: req.user._id }).populate(populateOwner).sort({ createdAt: -1 });
    res.json({ items });
  } catch (e) { next(e); }
}

export async function getItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id).populate(populateOwner);
    if (!item || (item.status === 'hidden' && req.user?.role !== 'admin')) return res.status(404).json({ message: 'Item not found' });
    res.json({ item });
  } catch (e) { next(e); }
}
export async function createItem(req, res, next) {
  try {
    const { title, description, type, category, location, date, imageUrl } = req.body;
    if (!title || !description || !type || !category || !location || !date) return res.status(400).json({ message: 'Please complete all required fields' });
    const item = await Item.create({ title, description, type, category, location, date, imageUrl, owner: req.user._id });
    await item.populate(populateOwner);
    res.status(201).json({ item });
  } catch (e) { next(e); }
}
export async function updateItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (String(item.owner) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'You cannot edit this listing' });
    const fields = ['title', 'description', 'type', 'category', 'location', 'date', 'imageUrl'];
    if (req.user.role === 'admin' && req.body.status !== undefined) fields.push('status');
    fields.forEach(key => { if (req.body[key] !== undefined) item[key] = req.body[key]; });
    await item.save(); await item.populate(populateOwner);
    res.json({ item });
  } catch (e) { next(e); }
}
export async function deleteItem(req, res, next) {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (String(item.owner) !== String(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'You cannot delete this listing' });
    await item.deleteOne(); res.json({ message: 'Listing deleted' });
  } catch (e) { next(e); }
}
