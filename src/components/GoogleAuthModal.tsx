import React, { useState } from 'react';
import { GoogleUser } from '../types';
import { X, ShieldCheck, CheckCircle2, User, Mail, ArrowRight } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: GoogleUser) => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [loadingUser, setLoadingUser] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = (email: string, name: string, avatar: string) => {
    setLoadingUser(email);
    setTimeout(() => {
      onLogin({
        id: `g-${Date.now()}`,
        name,
        email,
        avatar,
        givenName: name.split(' ')[0],
      });
      setLoadingUser(null);
      onClose();
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customName) return;
    setLoadingUser('custom');
    setTimeout(() => {
      onLogin({
        id: `g-${Date.now()}`,
        name: customName,
        email: customEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customName)}`,
        givenName: customName.split(' ')[0],
      });
      setLoadingUser(null);
      onClose();
    }, 600);
  };

  return (
    <div id="google-auth-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121212] w-full max-w-md rounded-2xl shadow-2xl border border-[#2A2A2A] overflow-hidden flex flex-col text-[#E0E0E0]">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#222222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#333333] flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-white text-lg tracking-wide">Fazer Login com Google</h3>
              <p className="text-xs text-[#888888]">Para continuar suas compras com segurança</p>
            </div>
          </div>
          <button
            id="close-google-auth-btn"
            onClick={onClose}
            className="text-[#888888] hover:text-white hover:bg-[#222222] p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="bg-[#181818] border border-[#2A2A2A] rounded-xl p-3.5 flex items-start gap-3 text-xs text-[#C0C0C0]">
            <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white uppercase tracking-wider text-[11px]">Acesso Rápido para Clientes</p>
              <p className="text-[#888888] mt-0.5">Faça login com sua conta Google para acompanhar pedidos, salvar produtos no carrinho e receber condições exclusivas.</p>
            </div>
          </div>

          {!showCustomForm ? (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Escolha uma conta Google</p>
              
              {/* Pre-configured Account (Current User) */}
              <button
                id="quick-google-login-gustavo"
                disabled={loadingUser !== null}
                onClick={() => handleQuickLogin('gustavo.isidorio.2002@gmail.com', 'Gustavo Isidório', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80')}
                className="w-full text-left p-3.5 rounded-xl border border-[#2A2A2A] hover:border-[#D4AF37] hover:bg-[#181818] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80"
                    alt="Gustavo"
                    className="w-10 h-10 rounded-full object-cover border border-[#333333]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-[#D4AF37] transition-colors">Gustavo Isidório</p>
                    <p className="text-xs text-[#888888]">gustavo.isidorio.2002@gmail.com</p>
                  </div>
                </div>
                {loadingUser === 'gustavo.isidorio.2002@gmail.com' ? (
                  <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>

              {/* Demo Account 2 */}
              <button
                id="quick-google-login-ana"
                disabled={loadingUser !== null}
                onClick={() => handleQuickLogin('ana.beatriz.tech@gmail.com', 'Ana Beatriz Costa', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80')}
                className="w-full text-left p-3.5 rounded-xl border border-[#2A2A2A] hover:border-[#D4AF37] hover:bg-[#181818] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                    alt="Ana Beatriz"
                    className="w-10 h-10 rounded-full object-cover border border-[#333333]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-[#D4AF37] transition-colors">Ana Beatriz Costa</p>
                    <p className="text-xs text-[#888888]">ana.beatriz.tech@gmail.com</p>
                  </div>
                </div>
                {loadingUser === 'ana.beatriz.tech@gmail.com' ? (
                  <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>

              {/* Custom Google Account Option */}
              <button
                id="use-another-google-account-btn"
                type="button"
                onClick={() => setShowCustomForm(true)}
                className="w-full py-2.5 px-4 text-center text-xs font-semibold text-[#D4AF37] hover:text-[#e2bd46] hover:bg-[#181818] rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#2A2A2A]"
              >
                <User className="w-4 h-4" />
                Usar outra Conta Google
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#C0C0C0] mb-1">Seu Nome Completo</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                  <input
                    id="google-custom-name-input"
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#161616] border border-[#2A2A2A] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white placeholder:text-[#666666]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C0C0C0] mb-1">E-mail Google (@gmail.com)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-3" />
                  <input
                    id="google-custom-email-input"
                    type="email"
                    required
                    placeholder="seu.email@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#161616] border border-[#2A2A2A] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white placeholder:text-[#666666]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-[#A0A0A0] bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] rounded-xl transition-colors cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  id="confirm-custom-google-login-btn"
                  type="submit"
                  disabled={loadingUser !== null}
                  className="flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-[#D4AF37] hover:bg-[#e2bd46] rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {loadingUser ? 'Conectando...' : 'Entrar com Google'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-[#0D0D0D] border-t border-[#222222] text-center">
          <p className="text-[11px] text-[#666666]">
            Conexão segura criptografada SSL • Login Google integrado
          </p>
        </div>
      </div>
    </div>
  );
};
