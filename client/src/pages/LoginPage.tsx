import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

interface FormData {
  email: string;
  password: string;

}

interface FormErrors {
  email?: string;
  password?: string;
}

export const LoginPage: React.FC = () => {
    const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',

  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }


    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            })
        })
        const data = await response.json()
        if(!response.ok) {
            throw new Error(data.message || "Failed to create account")
        }
            setIsSuccess(true);
            //navigate success logic
            navigate("/todo")
      setFormData({  email: '', password: '',});
   
    } catch (error) {
  if (error instanceof Error) {
    alert(error.message)
  } else {
    console.log("Unexpected error", error);
  }
    }finally{
        setIsLoading(false)
    }

  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Here</h1>
        </div>

        <div className="space-y-6">

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5" />
              )}
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                placeholder="Enter your pasword password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
        
            
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-cyan-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging..
              </div>
            ) : (
              'Log In'
            )}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Dont't have an account?{' '}
            <Link to="/">
            <button className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200">
              Sign Up here
            </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

