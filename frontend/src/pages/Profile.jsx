import { useEffect,useState } from 'react';
import api from '../api';
export default function Profile(){
 const [form,setForm]=useState({name:'',phone:'',college:''}),[email,setEmail]=useState(''),[message,setMessage]=useState('');
 useEffect(()=>{api.get('/users/profile').then(r=>{setForm({name:r.data.user.name,phone:r.data.user.phone||'',college:r.data.user.college||''});setEmail(r.data.user.email);});},[]);
 async function submit(e){e.preventDefault();try{await api.put('/users/profile',form);setMessage('Profile updated successfully.');}catch(err){setMessage(err.response?.data?.message||'Update failed');}}
 return <main className="container page-section narrow"><h1>Your profile</h1><p className="text-muted">Keep your contact details up to date.</p><form className="form-panel" onSubmit={submit}>{message&&<div className="alert alert-info">{message}</div>}<label className="form-label">Name</label><input className="form-control mb-3" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><label className="form-label">Email</label><input className="form-control mb-3" value={email} disabled/><label className="form-label">Phone</label><input className="form-control mb-3" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><label className="form-label">College</label><input className="form-control mb-4" value={form.college} onChange={e=>setForm({...form,college:e.target.value})}/><button className="btn btn-dark w-100">Save changes</button></form></main>;
}
