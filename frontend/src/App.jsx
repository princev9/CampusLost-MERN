import { Routes,Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Items from './pages/Items';
import Report from './pages/Report';
import ItemDetail from './pages/ItemDetail';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
function Footer(){return <footer className="footer"><div className="container d-flex justify-content-between flex-wrap gap-2"><span><b>CampusLost</b> · Lost something? Find it here.</span><span>Made for helpful campus communities.</span></div></footer>}
export default function App(){return <AuthProvider><Navbar/><Routes><Route path="/" element={<Home/>}/><Route path="/login" element={<Auth mode="login"/>}/><Route path="/register" element={<Auth mode="register"/>}/><Route path="/items" element={<Items/>}/><Route path="/items/:id" element={<ItemDetail/>}/><Route path="/report" element={<ProtectedRoute><Report/></ProtectedRoute>}/><Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/><Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/><Route path="/admin" element={<ProtectedRoute admin><Admin/></ProtectedRoute>}/><Route path="*" element={<div className="container page-section"><h2>Page not found</h2></div>}/></Routes><Footer/></AuthProvider>}
