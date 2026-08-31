import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage(isLogin ? 'Successfully logged into Artisan Portal!' : 'Association registration submitted for verification!');
    setTimeout(() => {
      setToastMessage(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#fbf9f5] border border-[#767683]/20 rounded-xl max-w-md w-full p-6 md:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#767683] hover:text-[#000666] hover:bg-[#efeeea] rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#000666] text-white flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6 text-[#ffe088]" />
          </div>
          <h3 className="font-serif-garamond text-2xl font-bold text-[#000666]">
            {isLogin ? 'Artisan Portal Login' : 'Join Craftsmen Registry'}
          </h3>
          <p className="text-xs text-[#454652] mt-1">
            Access certified batik records, market analytics, and digital workshop tools.
          </p>
        </div>

        {toastMessage ? (
          <div className="p-4 bg-[#e0e0ff] border border-[#000666]/30 text-[#000666] rounded-lg text-center text-xs font-bold my-6">
            {toastMessage}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#a14000] mb-1">
                  Full Name / Workshop Title
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#767683] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Master Budi Santoso"
                    className="w-full pl-9 bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#000666]"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#a14000] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#767683] absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="artisan@batiknusantara.id"
                  className="w-full pl-9 bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#000666]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#a14000] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#767683] absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 bg-[#f5f3ef] border border-[#767683]/30 rounded-lg px-3 py-2 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#000666]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#000666] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#1a237e] transition-colors shadow-sm"
            >
              {isLogin ? 'Authenticate & Enter' : 'Submit Application'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-xs text-[#000666] font-semibold hover:underline"
              >
                {isLogin
                  ? "Don't have an artisan account? Register here"
                  : 'Already registered? Sign in here'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
