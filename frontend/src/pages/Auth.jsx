import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Auth({ mode }) {
  const isRegister = mode === 'register';
  const [step, setStep] = useState('auth'); // 'auth' ya 'otp'
  const [emailForOtp, setEmailForOtp] = useState('');
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '', 
    college: '',
    otp: '' 
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);
  
  const { saveSession } = useAuth();
  const nav = useNavigate();
  
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setBusy(true);

    try {
      if (step === 'otp') {
        // Step 2: Verify OTP
        const { data } = await api.post('/auth/verify-otp', {
          email: emailForOtp,
          otp: form.otp
        });
        setSuccess(data.message);
        saveSession(data);
        setTimeout(() => nav('/dashboard'), 1200);
      } else if (isRegister) {
        // Register (Triggers OTP send)
        const { data } = await api.post('/auth/register', form);
        setEmailForOtp(form.email);
        setStep('otp');
        setSuccess(data.message || 'OTP sent to your email');
      } else {
        // Login
        const { data } = await api.post('/auth/login', form);
        
        // Agar account unverified ho aur backend se needsVerification aaye
        if (data.needsVerification) {
          setEmailForOtp(data.email);
          setStep('otp');
          setSuccess('Account not verified. OTP sent to your email.');
        } else {
          saveSession(data);
          nav('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  }

  async function handleResendOtp() {
    setError('');
    setSuccess('');
    setBusy(true);
    try {
      const { data } = await api.post('/auth/resend-otp', { email: emailForOtp });
      setSuccess(data.message || 'New OTP sent successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap transition-all duration-500">
      <div className="auth-card shadow-lg rounded-4 p-4 p-sm-5 bg-white animate-fade-in">
        <div className="auth-icon"><i className="bi bi-search-heart"/></div>
        
        <span className="eyebrow dark">
          {step === 'otp' ? 'VERIFY YOUR EMAIL' : isRegister ? 'JOIN THE COMMUNITY' : 'WELCOME BACK'}
        </span>
        
        <h2>
          {step === 'otp' ? 'Enter Verification Code' : isRegister ? 'Create your account' : 'Sign in to CampusLost'}
        </h2>
        
        <p className="text-muted">
          {step === 'otp' 
            ? `Please enter the 6-digit OTP sent to ${emailForOtp}` 
            : isRegister 
            ? 'A campus full of helpful people starts here.' 
            : 'Pick up where your campus search left off.'}
        </p>

        {error && <div className="alert alert-danger py-2 animate-shake">{error}</div>}
        {success && <div className="alert alert-success py-2 animate-fade-in">{success}</div>}

        <form onSubmit={submit}>
          {step === 'otp' ? (
            <div className="animate-fade-in">
              <input 
                className="form-control mb-3 text-center tracking-widest fs-4 fw-bold" 
                name="otp" 
                placeholder="123456" 
                maxLength="6"
                value={form.otp} 
                onChange={change} 
                required 
              />
              <button disabled={busy} className="btn btn-dark w-100 py-2 mb-3">
                {busy ? 'Verifying...' : 'Verify & Continue'} <i className="bi bi-check-circle ms-2"/>
              </button>
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={handleResendOtp} 
                  disabled={busy}
                  className="btn btn-link text-decoration-none small p-0"
                >
                  Didn't receive OTP? Resend
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              {isRegister && (
                <>
                  <input className="form-control mb-3" name="name" placeholder="Full name" value={form.name} onChange={change} required/>
                  <input className="form-control mb-3" name="phone" placeholder="Phone (optional)" value={form.phone} onChange={change}/>
                  <input className="form-control mb-3" name="college" placeholder="College / university" value={form.college} onChange={change}/>
                </>
              )}
              
              <input className="form-control mb-3" type="email" name="email" placeholder="College email address" value={form.email} onChange={change} required/>
              <input className="form-control mb-3" type="password" name="password" placeholder="Password (minimum 8 characters)" value={form.password} onChange={change} minLength="8" required/>
              
              <button disabled={busy} className="btn btn-dark w-100 py-2">
                {busy ? 'Please wait...' : isRegister ? 'Create account & send OTP' : 'Login'} <i className="bi bi-arrow-right ms-2"/>
              </button>
            </div>
          )}
        </form>

        {step !== 'otp' && (
          <p className="text-center mt-4 mb-0 small">
            {isRegister ? 'Already registered?' : 'New to CampusLost?'} <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Login' : 'Create an account'}</Link>
          </p>
        )}
      </div>
    </div>
  );
}