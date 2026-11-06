import { useEffect,useState } from 'react';
import { Link,useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
export default function ItemDetail(){
 const {id}=useParams(),[item,setItem]=useState(null),[error,setError]=useState(''),{user}=useAuth();
 useEffect(()=>{api.get(`/items/${id}`).then(r=>setItem(r.data.item)).catch(e=>setError(e.response?.data?.message||'Unable to load item'));},[id]);
 if(error)return <main className="container page-section"><div className="alert alert-warning">{error}</div><Link to="/items">Back to listings</Link></main>;
 if(!item)return <div className="page-loader">Loading item...</div>;
 const own=user&&user.id===item.owner?._id;
 return <main className="container page-section narrow"><Link to="/items" className="text-link"><i className="bi bi-arrow-left"/> Back to listings</Link><div className="detail-card mt-3">{item.imageUrl&&<img src={item.imageUrl} className="detail-image" alt={item.title}/>}<div className="p-4"><span className={`badge ${item.type==='lost'?'text-bg-danger':'text-bg-success'}`}>{item.type}</span><h1 className="mt-3">{item.title}</h1><p className="text-muted">{item.description}</p><hr/><p><i className="bi bi-tag me-2"/>{item.category}</p><p><i className="bi bi-geo-alt me-2"/>{item.location}</p><p><i className="bi bi-calendar me-2"/>{new Date(item.date).toLocaleDateString()}</p><p><i className="bi bi-person me-2"/>{item.owner?.name||'Campus student'}</p>{item.owner?.college&&<p><i className="bi bi-mortarboard me-2"/>{item.owner.college}</p>}{user?<a className="btn btn-dark w-100" href={`mailto:${item.owner?.email}?subject=${encodeURIComponent('CampusLost: '+item.title)}`}><i className="bi bi-envelope me-2"/>Contact student</a>:<Link className="btn btn-dark w-100" to="/login">Login to contact student</Link>}{own&&<p className="small text-muted mt-3 mb-0">This is your listing. Manage it from your dashboard.</p>}</div></div></main>;
}
