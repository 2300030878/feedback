import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus } from 'lucide-react';
import { authAPI } from '../../services/api';
import FormField from '../ui/FormField';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import Card from '../ui/Card';

const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
  role: yup.string().oneOf(['STUDENT', 'FACULTY', 'ADMIN'], 'Please select a valid role').required('Role is required'),
});


const Register = () => {
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
      const { confirmPassword, ...userData } = data;
      const response = await authAPI.register(userData);
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
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { value: 'STUDENT', label: 'Student' },
    { value: 'FACULTY', label: 'Faculty' },
    { value: 'ADMIN', label: 'Administrator' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100">
            <UserPlus className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the Academic Feedback System
          </p>
        </div>
        
        {/* Registration Form */}
        <Card>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <Alert type="error" onClose={() => setError('')}>
                {error}
              </Alert>
            )}
            
            <div className="space-y-4">
              <FormField
                label="Full Name"
                type="text"
                name="name"
                register={register}
                error={errors.name}
                placeholder="Enter your full name"
                required
              />
              
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
              
              <FormField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                register={register}
                error={errors.confirmPassword}
                placeholder="Confirm your password"
                showPasswordToggle
                required
              />
              
              <FormField
                label="Role"
                type="select"
                name="role"
                register={register}
                error={errors.role}
                placeholder="Select your role"
                options={roleOptions}
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
              {isLoading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;