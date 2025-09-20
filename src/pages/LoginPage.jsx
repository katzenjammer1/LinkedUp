import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signInWithGoogle } from '../lib/authService';

const LoginPage = () => {
    const navigate = useNavigate();

    // form state management
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');


    // handle inpout changes
    const handleChange = (e) => {
        const { name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // basically clear the message when user starts typing
        if (message) setMessage('');
    };

    // handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setIsLoading(true);
        setMessage("Signing in...");

        try {
            const result = await signIn(formData.email, formData.password);

            if (result.success) {
                setMessage('Signed in succesfully! Redirecting...');
                console.log('Login successful, user:', result.user);
                
                // redirect to dashboard 
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500); // small delay
            } else {
                setMessage(`Error: ${result.error}`);
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // handle google sign in
    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setMessage('Signing in with google...');

        try {
            const result = await signInWithGoogle();

            if (result.success) {
                setMessage('Signed in with Google successfully! Redirecting...');
                console.log('Google login successful, user:', result.user);

                // redirect 
                setTimeout(() => {
                    navigate('/dashboard');
                }, 1500);
            } else {
                setMessage(`Error: ${result.message}`);
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const clearMessage = () => {
        setMessage('');
    };

    return (
        <div>
            <h1>Sign in to your LinkedUp account</h1>
            {message && (
                <div>
                    <p>{message}</p>
                    <button onClick={clearMessage}>Clear</button>
                </div>
            )}
            <div>
                <div>
                    <label>Email Address</label>
                    <br />
                    <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder='Enter your email'
                    required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <br />
                    <input
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder='Enter your password'
                    required
                    />
                    <div>
                        <input type="checkbox" id="remember-me"/>
                        <label htmlFor="remember-me">remember me</label>
                    </div>

                    <div>
                        <a href='#'>Forgot your password</a>
                    </div>

                    <button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Signining in...' : 'Sign in'}
                    </button>
                </div>

            </div>
            <hr />
            <p>Or continue with</p>

            <button onClick={handleGoogleSignIn} disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>

            <p>
                Don't have an account? <a href="/signup">Sign up for free</a>
            </p>
        </div>
    )
};
export default LoginPage;