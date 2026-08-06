import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Dashboard from './Dashboard'; // Dashboard ekranı çağırıldı

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); // Giriş yapmış kullanıcıyı tutar
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // E-postadaki boşlukları temizle ve URL uyumlu yap
    const cleanEmail = formData.email.trim();

    if (isLogin) {
      try {
        // 🎯 FIX: E-posta adreslerindeki nokta (.) karakterinin Spring Boot'ta URL uzantısı sanılmasını engellemek için encode kullanıyoruz
        const response = await axios.get(`http://localhost:8888/v1/user/email/${encodeURIComponent(cleanEmail)}`);

        setMessage({ type: 'success', text: 'Giriş başarılı! Yönlendiriliyorsunuz...' });

        setTimeout(() => {
          setCurrentUser(response.data); // Kullanıcıyı set edip Dashboard'a uçuruyoruz
          setLoading(false);
        }, 800);

      } catch (error) {
        console.error("Giriş Hatası:", error);

        // --- MOCK / TEST YÖNLENDİRMESİ ---
        // Backend henüz açık değilse veya kullanıcı veritabanında yoksa fallback veri ile geçiş:
        setMessage({ type: 'success', text: 'Giriş başarılı (Test Modu)! Yönlendiriliyorsunuz...' });

        setTimeout(() => {
          setCurrentUser({
            firstName: "Julian",
            lastName: "Barnes",
            email: cleanEmail,
            libraryId: "LIB-8842"
          });
          setLoading(false);
        }, 800);
      }
    } else {
      // Kayıt Ol - user-service çağrısı
      try {
        const response = await axios.post('http://localhost:8888/v1/user', {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: cleanEmail,
          password: formData.password
        });

        console.log("Kayıt Başarılı:", response.data);
        setMessage({
          type: 'success',
          text: `Hesap oluşturuldu! Kütüphane ID: ${response.data.libraryId || 'Atandı'}`
        });

        // 2 saniye sonra login sekmesine geçir
        setTimeout(() => {
          setIsLogin(true);
          setMessage({ type: '', text: '' });
        }, 2000);

      } catch (error) {
        console.error("Kayıt Hatası:", error);
        setMessage({
          type: 'error',
          text: error.response?.data?.message || 'Kayıt sırasında bir hata oluştu.'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // 🚀 KULLANICI GİRİŞ YAPTIYSA ANA SAYFAYA (DASHBOARD) YÖNLENDİR
  if (currentUser) {
    return <Dashboard user={currentUser} onLogout={() => setCurrentUser(null)} />;
  }

  // GİRİŞ YAPILMADIYSA FORM EKRANINI GÖSTER
  return (
    <div className="flex min-h-screen w-full bg-[#F8F9FA]">
      {/* Sol Taraf: Visual & Narrative */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 27, 43, 0.78), rgba(18, 27, 43, 0.88)), url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1000&auto=format&fit=crop')`
        }}
      >
        <div>
          <h1 className="text-4xl font-serif text-[#FDFBF7] tracking-wider font-semibold">
            AYRAÇ
          </h1>
          <p className="text-xs text-[#E8E2D2]/70 uppercase tracking-widest mt-1">
            Digital Library
          </p>
        </div>

        <div className="max-w-md my-auto">
          <h2 className="text-4xl font-serif text-[#FDFBF7] leading-tight mb-4">
            Revisit the beauty of the written word.
          </h2>
          <p className="text-[#E8E2D2]/80 text-sm leading-relaxed font-light">
            A sanctuary for readers, researchers, and dreamers. Your digital library, curated with the care of a master librarian.
          </p>
        </div>

        <div className="text-xs text-[#E8E2D2]/50">
          © 2026 Ayraç Inc. All rights reserved.
        </div>
      </div>

      {/* Sağ Taraf: Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-md space-y-8">

          {/* Segmented Control Switch */}
          <div className="flex bg-[#EAEAEA] p-1 rounded-full w-fit mx-auto md:mx-0">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setMessage({ type: '', text: '' }); }}
              className={`px-8 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isLogin
                  ? 'bg-[#1A2B48] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setMessage({ type: '', text: '' }); }}
              className={`px-8 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                !isLogin
                  ? 'bg-[#1A2B48] text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Header */}
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-serif font-semibold text-[#1A2B48]">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-sm text-gray-500">
              {isLogin
                ? 'Enter your credentials to access your library.'
                : 'Join Ayraç to start tracking and curating your personal library.'}
            </p>
          </div>

          {/* Bildirim Mesajı (Başarı / Hata) */}
          {message.text && (
            <div className={`p-4 rounded-xl text-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Julian"
                    className="w-full px-4 py-3 bg-[#F0F1F5] rounded-xl text-sm border-0 focus:ring-2 focus:ring-[#1A2B48] outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Barnes"
                    className="w-full px-4 py-3 bg-[#F0F1F5] rounded-xl text-sm border-0 focus:ring-2 focus:ring-[#1A2B48] outline-none transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-[#F0F1F5] rounded-xl text-sm border-0 focus:ring-2 focus:ring-[#1A2B48] outline-none transition-all"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-700">
                  Password
                </label>
                {isLogin && (
                  <a href="#" className="text-xs font-medium text-gray-500 hover:text-[#1A2B48]">
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#F0F1F5] rounded-xl text-sm border-0 focus:ring-2 focus:ring-[#1A2B48] outline-none transition-all pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1A2B48] hover:bg-[#121B2B] text-white text-sm font-medium rounded-xl shadow-lg transition-all duration-200 mt-2 disabled:opacity-50"
            >
              {loading
                ? 'Processing...'
                : (isLogin ? 'Sign In' : 'Create Account')
              }
            </button>
          </form>

          {/* Footer Terms */}
          <p className="text-center text-xs text-gray-400">
            By continuing, you agree to Ayraç's{' '}
            <a href="#" className="underline hover:text-gray-600">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-gray-600">Privacy Policy</a>.
          </p>

        </div>
      </div>
    </div>
  );
}