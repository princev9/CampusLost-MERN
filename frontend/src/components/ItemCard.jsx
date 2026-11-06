import { Link } from 'react-router-dom';
export default function ItemCard({ item }) {
  return <div className="card item-card h-100">{item.imageUrl ? <img src={item.imageUrl} className="item-image" alt={item.title} onError={e => e.currentTarget.style.display='none'}/> : <div className="item-placeholder"><i className="bi bi-box-seam"/></div>}
    <div className="card-body d-flex flex-column"><div className="d-flex justify-content-between mb-2"><span className={`badge ${item.type === 'lost' ? 'text-bg-danger' : 'text-bg-success'}`}>{item.type}</span><span className="small text-muted">{new Date(item.date).toLocaleDateString()}</span></div>
    <h5 className="card-title">{item.title}</h5><p className="text-muted small flex-grow-1">{item.description}</p><div className="small text-muted mb-3"><i className="bi bi-geo-alt me-1"/>{item.location} · {item.category}</div><Link className="btn btn-outline-dark w-100" to={`/items/${item._id}`}>View details</Link></div></div>;
}
