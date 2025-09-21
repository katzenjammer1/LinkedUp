import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signInWithGoogle } from '../lib/authService';
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import Group7 from '../assets/Group 7.png';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();

    // Form state management
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear message when user starts typing
        if (message) {
            setMessage('');
            setMessageType('');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("Signing in...");
        setMessageType('info');

        try {
            const result = await signIn(formData.email, formData.password);

            if (result.success) {
                setMessage('Signed in successfully! Redirecting...');
                setMessageType('success');
                console.log('Login successful, user:', result.user);
                
                // Redirect to dashboard 
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                setMessage(`Error: ${result.error}`);
                setMessageType('error');
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Google sign in
    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setMessage('Signing in with Google...');
        setMessageType('info');

        try {
            const result = await signInWithGoogle();

            if (result.success) {
                setMessage('Signed in with Google successfully! Redirecting...');
                setMessageType('success');
                console.log('Google login successful, user:', result.user);

                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                setMessage(`Error: ${result.message}`);
                setMessageType('error');
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
            setMessageType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const clearMessage = () => {
        setMessage('');
        setMessageType('');
    };

    const getMessageIcon = () => {
        switch (messageType) {
            case 'success':
                return <CheckCircle className="w-4 h-4" />;
            case 'error':
                return <AlertCircle className="w-4 h-4" />;
            default:
                return null;
        }
    };

    return (
        <div className="login-container">
            {/* Background Image */}
            
            
            {/* Login Card */}
            <div className="login-card-container">
                <div className="login-card">
                    {/* Header */}
                    <div className="login-header">
                        <h1 className="login-title">Welcome Back</h1>
                        <p className="login-subtitle">Sign in to your LinkedUp account</p>
                    </div>

                    {/* Message Display */}
                    {message && (
                        <div className={`message-container message-${messageType}`}>
                            {getMessageIcon()}
                            <span>{message}</span>
                            <button
                                onClick={clearMessage}
                                className="message-close"
                                aria-label="Clear message"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Email Field */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <div className="input-container">
                                <Mail className="input-icon" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    placeholder="Enter your email"
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <div className="input-container">
                                <Lock className="input-icon" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    placeholder="Enter your password"
                                    required
                                    className="form-input"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle"
                                    disabled={isLoading}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="form-options">
                            <label className="checkbox-container">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={isLoading}
                                    className="form-checkbox"
                                />
                                <span className="checkbox-label">Remember me</span>
                            </label>
                            <a href="#" className="forgot-link">
                                Forgot password?
                            </a>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="submit-button"
                        >
                            {isLoading ? (
                                <div className="loading-spinner">
                                    <div className="spinner"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="divider">
                        <div className="divider-line"></div>
                        <span className="divider-text">Or continue with</span>
                        <div className="divider-line"></div>
                    </div>

                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="google-button"
                    >
                        <svg className="google-icon" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        {isLoading ? 'Signing in...' : 'Sign in with Google'}
                    </button>

                    {/* Sign Up Link */}
                    <div className="signup-link">
                        <p className="signup-text">
                            Don't have an account?{' '}
                            <a href="/signup" className="signup-link-text">
                                Sign up for free
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;