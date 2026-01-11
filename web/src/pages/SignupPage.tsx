import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, UserPlus, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/shared/Input';
import { Button } from '../components/shared/Button';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password, name);
      showToast('Account created! Welcome to Iconscious 🎨', 'success');
      navigate('/');
    } catch (err: any) {
      showToast(err.message || 'Signup failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (password.length === 0) return { label: '', color: '' };
    if (password.length < 6) return { label: 'Too short', color: '#cb4154' };
    if (password.length < 8) return { label: 'Weak', color: '#ffd700' };
    if (password.length < 12) return { label: 'Good', color: '#007ba7' };
    return { label: 'Strong', color: '#228b22' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, rotate: 2, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-md"
      >
        <div className="card rotate-wabi-alt">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              className="text-5xl font-heading mb-2"
              animate={{ rotate: [1, -1, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              style={{ color: 'var(--burnt-orange, #cc5500)' }}
            >
              Iconscious
            </motion.h1>
            <p className="font-mono text-sm" style={{ color: 'var(--ink-color)', opacity: 0.7 }}>
              Track. Visualize. Achieve. 🎨
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <Input
              label="Name (optional)"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Creative Soul"
              autoComplete="name"
              leftIcon={<User size={20} />}
            />

            {/* Email Input */}
            <Input
              label="Email *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              leftIcon={<Mail size={20} />}
            />

            {/* Password Input */}
            <div>
              <Input
                label="Password *"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
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
              {/* Password Strength */}
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div 
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'var(--ink-color, #2c2c2c)', opacity: 0.1 }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: strength.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(password.length * 8, 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <Input
              label="Confirm Password *"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              leftIcon={<Lock size={20} />}
              error={confirmPassword && password !== confirmPassword ? "Passwords don't match" : undefined}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              icon={UserPlus}
              loading={isLoading}
              fullWidth
              className="mt-6"
            >
              Create Account
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="font-mono text-sm" style={{ color: 'var(--ink-color)', opacity: 0.7 }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-bold hover:underline"
                style={{ color: 'var(--cerulean, #007ba7)' }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
