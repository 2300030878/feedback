import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn } from 'lucide-react';
import { authAPI } from '../../services/api';
import FormField from '../ui/FormField';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Card from '../ui/Card';

const schema = yup.object({
  email: yup.string().email('Invalid email format').required('Email is required'),
  // Keep frontend leniency; backend will validate credentials
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authAPI.login(data);
      const { token, userId, name, email, role } = response.data;
      
      login({ userId, name, email, role }, token);
      
      // Redirect based on role
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (role === 'FACULTY') {
        navigate('/faculty/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <LogIn className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue
          </p>
        </div>
        
        {/* Login Form */}
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <Alert type="error" onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            
            <div className="space-y-4">
              <FormField
                label="Email address"
                type="email"
                name="email"
                register={register}
                error={errors.email}
                placeholder="Enter your email"
                required
              />
              
              <FormField
                label="Password"
                type="password"
                name="password"
                register={register}
                error={errors.password}
                placeholder="Enter your password"
                showPasswordToggle
                required
              />
            </div>

            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Create one here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;