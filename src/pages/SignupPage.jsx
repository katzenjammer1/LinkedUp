import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, signInWithGoogle } from '../lib/authService';
import { Mail, Lock, Eye, EyeOff, User, CheckCircle, AlertCircle } from 'lucide-react';
import Group7 from '../assets/Group 7.png';
import './SignUpPage.css';

const SignUpPage = () => {
    const navigate = useNavigate();

    // Form state management
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
    const [errors, setErrors] = useState({});

    // Password strength calculation
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        return strength;
    };

    const getPasswordStrengthText = (strength) => {
        switch (strength) {
            case 0:
            case 1:
                return 'Weak';
            case 2:
                return 'Fair';
            case 3:
            case 4:
                return 'Good';
            case 5:
                return 'Strong';
            default:
                return '';
        }
    };

    const getPasswordStrengthClass = (strength) => {
        switch (strength) {
            case 0:
            case 1:
                return 'strength-weak';
            case 2:
                return 'strength-fair';
            case 3:
            case 4:
                return 'strength-good';
            case 5:
                return 'strength-strong';
            default:
                return '';
        }
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!acceptTerms) {
            newErrors.terms = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        
        // Clear general message when user starts typing
        if (message) {
            setMessage('');
            setMessageType('');
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setMessage('Please fix the errors below');
            setMessageType('error');
            return;
        }

        setIsLoading(true);
        setMessage("Creating account...");
        setMessageType('info');

        try {
            const result = await signUp(formData.email, formData.password, {
                name: formData.name,
                photoURL: null
            });

            if (result.success) {
                setMessage('Account created successfully! Redirecting...');
                setMessageType('success');
                console.log('Signup successful, user:', result.user);
                
                // Redirect to profile setup page
                setTimeout(() => {
                    navigate('/setup-profile');
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

    // Handle Google sign up
    const handleGoogleSignUp = async () => {
        setIsLoading(true);
        setMessage('Signing up with Google...');
        setMessageType('info');

        try {
            const result = await signInWithGoogle();

            if (result.success) {
                setMessage('Signed up with Google successfully! Redirecting...');
                setMessageType('success');
                console.log('Google signup successful, user:', result.user);

                setTimeout(() => {
                    navigate('/setup-profile');
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

    const passwordStrength = calculatePasswordStrength(formData.password);

    return (
        <div className="signup-container">
            {/* Sign Up Card */}
            <div className="signup-card-container">
                <div className="signup-card">
                    {/* Header */}
                    <div className="signup-header">
                        <h1 className="signup-title">Create Account</h1>
                        <p className="signup-subtitle">Join LinkedUp and start connecting</p>
                    </div>

                    {/* Message Display */}
                    {message && (
                        <div className={`signup-message-container signup-message-${messageType}`}>
                            {getMessageIcon()}
                            <span>{message}</span>
                            <button
                                onClick={clearMessage}
                                className="signup-message-close"
                                aria-label="Clear message"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Sign Up Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Name Field */}
                        <div className="signup-form-group">
                            <label htmlFor="name" className="signup-form-label">
                                Full Name
                            </label>
                            <div className="signup-input-container">
                                <User className="signup-input-icon" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    placeholder="Enter your full name"
                                    required
                                    className={`signup-form-input ${errors.name ? 'input-error' : ''}`}
                                />
                            </div>
                            {errors.name && <div className="error-message">{errors.name}</div>}
                        </div>

                        {/* Email Field */}
                        <div className="signup-form-group">
                            <label htmlFor="email" className="signup-form-label">
                                Email Address
                            </label>
                            <div className="signup-input-container">
                                <Mail className="signup-input-icon" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    placeholder="Enter your email"
                                    required
                                    className={`signup-form-input ${errors.email ? 'input-error' : ''}`}
                                />
                            </div>
                            {errors.email && <div className="error-message">{errors.email}</div>}
                        </div>

                        {/* Password Field */}
                        <div className="signup-form-group">
                            <label htmlFor="password" className="signup-form-label">
                                Password
                            </label>
                            <div className="signup-input-container">
                                <Lock className="signup-input-icon" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    placeholder="Create a strong password"
                                    required
                                    className={`signup-form-input ${errors.password ? 'input-error' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="signup-password-toggle"
                                    disabled={isLoading}
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {formData.password && (
                                <div className="password-strength">
                                    <div className="password-strength-bar">
                                        <div className={`password-strength-fill ${getPasswordStrengthClass(passwordStrength)}`}></div>
                                    </div>
                                    <div className="password-strength-text">
                                        Password strength: {getPasswordStrengthText(passwordStrength)}
                                    </div>
                                </div>
                            )}
                            {errors.password && <div className="error-message">{errors.password}</div>}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="signup-form-group">
                            <label htmlFor="confirmPassword" className="signup-form-label">
                                Confirm Password
                            </label>
                            <div className="signup-input-container">
                                <Lock className="signup-input-icon" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    disabled={isLoading}
                                    placeholder="Confirm your password"
                                    required
                                    className={`signup-form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="signup-password-toggle"
                                    disabled={isLoading}
                                    aria-label="Toggle confirm password visibility"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="signup-terms-container">
                            <label className="signup-checkbox-container">
                                <input
                                    type="checkbox"
                                    checked={acceptTerms}
                                    onChange={(e) => setAcceptTerms(e.target.checked)}
                                    disabled={isLoading}
                                    className="signup-form-checkbox"
                                />
                                <span className="signup-terms-label">
                                    I agree to the{' '}
                                    <a href="/terms" className="signup-terms-link">
                                        Terms of Service
                                    </a>
                                    {' '}and{' '}
                                    <a href="/privacy" className="signup-terms-link">
                                        Privacy Policy
                                    </a>
                                </span>
                            </label>
                            {errors.terms && <div className="error-message">{errors.terms}</div>}
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="signup-submit-button"
                        >
                            {isLoading ? (
                                <div className="signup-loading-spinner">
                                    <div className="signup-spinner"></div>
                                    Creating account...
                                </div>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="signup-divider">
                        <div className="signup-divider-line"></div>
                        <span className="signup-divider-text">Or sign up with</span>
                        <div className="signup-divider-line"></div>
                    </div>

                    {/* Google Sign Up */}
                    <button
                        onClick={handleGoogleSignUp}
                        disabled={isLoading}
                        className="signup-google-button"
                    >
                        <svg className="signup-google-icon" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        {isLoading ? 'Signing up...' : 'Sign up with Google'}
                    </button>

                    {/* Sign In Link */}
                    <div className="signup-login-link">
                        <p className="signup-login-text">
                            Already have an account?{' '}
                            <a href="/login" className="signup-login-link-text">
                                Sign in here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;