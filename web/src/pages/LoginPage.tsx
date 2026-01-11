import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/shared/Input';
import { Button } from '../components/shared/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
      showToast('Welcome back! 🎨', 'success');
      navigate('/');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, rotate: -2, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-md"
      >
        <div className="card rotate-wabi">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              className="text-5xl font-heading text-burnt-orange mb-2"
              animate={{ rotate: [-1, 1, -1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              style={{ color: 'var(--burnt-orange, #cc5500)' }}
            >
              Iconscious
            </motion.h1>
            <p className="font-mono text-sm" style={{ color: 'var(--ink-color, #2c2c2c)', opacity: 0.7 }}>
              Track. Visualize. Achieve. ✨
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              leftIcon={<Mail size={20} />}
            />

            {/* Password Input */}
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              leftIcon={<Lock size={20} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="hover:opacity-100 opacity-50 transition-opacity"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              icon={LogIn}
              loading={isLoading}
              fullWidth
            >
              Sign In
            </Button>
          </form>

          {/* Signup Link */}
          <div className="mt-8 text-center">
            <p className="font-mono text-sm" style={{ color: 'var(--ink-color)', opacity: 0.7 }}>
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-bold hover:underline"
                style={{ color: 'var(--cerulean, #007ba7)' }}
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Demo Mode Notice */}
          <div className="mt-6 p-3 border-2 border-dashed rounded-organic text-center" style={{ borderColor: 'var(--dandelion, #ffd700)', backgroundColor: 'var(--dandelion, #ffd700)', opacity: 0.3 }}>
            <p className="font-mono text-xs">
              💡 Demo mode: Any email/password works!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
