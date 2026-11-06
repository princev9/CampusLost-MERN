import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Navbar() {
  const { user, logout } = useAuth();
  return <nav className="navbar navbar-expand-lg navbar-dark site-nav"><div className="container">
    <Link className="navbar-brand fw-bold" to="/"><span className="brand-mark"><i className="bi bi-search-heart"/></span> CampusLost</Link>
    <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav"><span className="navbar-toggler-icon"/></button>
    <div className="collapse navbar-collapse" id="nav"><div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
      <NavLink className="nav-link" to="/items">Browse Items</NavLink>
      {user ? <><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink>{user.role === 'admin' && <NavLink className="nav-link" to="/admin">Admin</NavLink>}<button className="btn btn-sm btn-outline-light ms-lg-2" onClick={logout}>Logout</button></> : <><NavLink className="nav-link" to="/login">Login</NavLink><Link className="btn btn-sm btn-lime ms-lg-2" to="/register">Join CampusLost</Link></>}
    </div></div></div></nav>;
}
