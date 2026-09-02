import React, { useState } from 'react';
import { ManagerUser } from '../types';
import { Lock, User, Eye, EyeOff, X, ShieldAlert, KeyRound, CheckCircle2, Sparkles } from 'lucide-react';

interface ManagerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (manager: ManagerUser) => void;
}

export const ManagerLoginModal: React.FC<ManagerLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleFillCredentials = () => {
    setUsername('gestor123');
    setPassword('gestão123');
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanUser = username.trim();
      const cleanPass = password.trim();

      const isValidUser = cleanUser === 'gestor123';
      const isValidPass = cleanPass === 'gestão123' || cleanPass === 'gestao123';

      if (isValidUser && isValidPass) {
        setIsLoading(false);
        onSuccessLogin({
          username: 'gestor123',
          role: 'gestor',
          name: 'Gestor Administrativo',
          loggedInAt: new Date().toLocaleTimeString('pt-BR'),
        });
        onClose();
      } else {
        setIsLoading(false);
        setErrorMsg('Credenciais incorretas! Verifique o login e a senha informados.');
      }
    }, 500);
  };

  return (
    <div id="manager-login-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121212] w-full max-w-md rounded-2xl shadow-2xl border border-[#2A2A2A] overflow-hidden flex flex-col text-[#E0E0E0]">
        {/* Header */}
        <div className="bg-[#0A0A0A] text-white p-6 relative overflow-hidden border-b border-[#222222]">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#181818] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-luxury font-bold text-white text-lg tracking-wide">Portal do Gestor</h3>
                <p className="text-xs text-[#888888]">Acesso restrito para administração</p>
              </div>
            </div>
            <button
              id="close-manager-login-btn"
              onClick={onClose}
              className="text-[#888888] hover:text-white hover:bg-[#222222] p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Helper quick-fill badge */}
        <div className="bg-[#161616] border-b border-[#222222] px-6 py-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#C0C0C0] font-medium">
            <KeyRound className="w-4 h-4 text-[#D4AF37] shrink-0" />
            <span>Login: <strong className="text-[#D4AF37]">gestor123</strong> | Senha: <strong className="text-[#D4AF37]">gestão123</strong></span>
          </div>
          <button
            id="fill-manager-credentials-btn"
            type="button"
            onClick={handleFillCredentials}
            className="text-[10px] font-bold uppercase tracking-wider text-black bg-[#D4AF37] hover:bg-[#e2bd46] px-2.5 py-1 rounded transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-black" />
            Preencher
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-950/50 border border-red-800/40 text-red-300 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#C0C0C0] mb-1.5 uppercase tracking-wider">Usuário do Gestor</label>
            <div className="relative">
              <User className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
              <input
                id="manager-username-input"
                type="text"
                required
                autoFocus
                placeholder="Digite o login (gestor123)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#161616] border border-[#2A2A2A] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white font-medium placeholder:text-[#666666]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#C0C0C0] mb-1.5 uppercase tracking-wider">Senha de Acesso</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#666666] absolute left-3.5 top-3.5" />
              <input
                id="manager-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Digite a senha (gestão123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#161616] border border-[#2A2A2A] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] text-white font-medium placeholder:text-[#666666]"
              />
              <button
                type="button"
                id="toggle-manager-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#666666] hover:text-[#D4AF37] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              id="submit-manager-login-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#D4AF37] hover:bg-[#e2bd46] text-black font-bold uppercase tracking-widest text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Autenticando Gestor...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Acessar Painel de Gestão</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="p-4 bg-[#0D0D0D] border-t border-[#222222] text-center">
          <p className="text-[11px] text-[#666666]">
            Painel do Gestor com permissão total para gerenciar produtos, estoque, preços e pedidos.
          </p>
        </div>
      </div>
    </div>
  );
};
