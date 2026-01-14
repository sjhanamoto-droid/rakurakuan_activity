import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { MapPin, Clock, Users, ChevronDown, Star, CheckCircle, Info, Calendar, Phone, Utensils, Coffee, Crown, Sparkles, Flame, CloudRain } from 'lucide-react';
import '../index.css';
// 画像をimport方式で読み込む（ルート相対パスを避けるため）
import sushiImage from './assets/images/sushi.jpg';
import matchaImage from './assets/images/matcha.jpg';
import exteriorImage from './assets/images/exterior.jpg';
import ultimatePlanImage from './assets/images/ultimateplan.jpg';
import newYearImage from './assets/images/newyear.jpg';

// --- Types ---
interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

// --- Animation Components ---
const Reveal: React.FC<RevealProps> = ({ children, delay = 0, className = "" }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // プログレスバーのアニメーション
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 800); // Wait for fade out
      }, 300);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onComplete]);

  if (!visible) return <div className="fixed inset-0 z-50 bg-black transition-opacity duration-800 opacity-0 pointer-events-none" />;

  const title = "Samurai Restaurant";
  const subtitle = "Kyoto";

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] flex flex-col items-center justify-center text-white transition-opacity duration-800 overflow-hidden">
      {/* 背景パーティクル */}
      <div className="loading-particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="loading-particle" />
        ))}
      </div>

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col items-center">
        {/* ローディングスピナー */}
        <div className="relative w-24 h-24 mb-8">
          {/* 外側のリング */}
          <div className="absolute inset-0 border-4 border-[#C5A059]/20 rounded-full"></div>
          {/* 回転するリング */}
          <div className="absolute inset-0 border-4 border-transparent border-t-[#C5A059] border-r-[#C5A059] rounded-full animate-spin loading-spinner"></div>
          {/* 内側のグロー効果 */}
          <div className="absolute inset-2 border-2 border-[#C5A059]/40 rounded-full animate-pulse"></div>
          {/* 中央の文字 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[#C5A059] brush-text text-3xl">侍</span>
          </div>
        </div>

        {/* タイトル */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase loading-text">
          {title.split('').map((char, i) => (
            <span key={i} className="loading-char inline-block">
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>
        
        {/* サブタイトル */}
        <p className="text-base md:text-lg tracking-wider text-gray-300 mt-3 loading-subtitle">
          {subtitle.split('').map((char, i) => (
            <span key={i} className="loading-char inline-block">
              {char}
            </span>
          ))}
        </p>

        {/* プログレスバー */}
        <div className="mt-8 w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#C5A059] via-[#d4b068] to-[#C5A059] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* 装飾的なグラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/50 via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
};

// --- Main Components ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-[#1a1a1a]/95 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className={`text-xl font-bold tracking-widest uppercase ${scrolled ? 'text-white' : 'text-white'}`}>
          Samurai <span className="text-[#C5A059]">Restaurant</span>
        </div>
        <a 
          href="#booking"
          className="bg-[#C5A059] hover:bg-[#b08d4b] text-white p-2 rounded-sm transition-colors flex items-center justify-center"
          aria-label="Book Now"
        >
          <Calendar className="w-4 h-4" />
        </a>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop" 
          alt="Kyoto Atmosphere" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#1a1a1a]"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
        <Reveal delay={200}>
          <p className="text-[#C5A059] text-sm md:text-base tracking-[0.2em] uppercase mb-4">
            Kyoto Authentic Experience
          </p>
        </Reveal>
        <Reveal delay={400}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Samurai Restaurant<br/>
            <span className="text-3xl md:text-5xl font-light block mt-2">Kyoto</span>
          </h1>
        </Reveal>
        <Reveal delay={600}>
          <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
            Make Your Own Sushi & Discover the Art of Matcha
          </p>
        </Reveal>
        <Reveal delay={800}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <a href="#menu" className="w-full sm:w-auto px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest text-sm">
              View Experiences
            </a>
            <a href="#booking" className="w-full sm:w-auto px-8 py-3 bg-[#C5A059] text-white hover:bg-[#b08d4b] transition-all duration-300 uppercase tracking-widest text-sm font-bold shadow-lg shadow-[#C5A059]/30">
              Book Now
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center text-gray-400 text-xs tracking-wide">
            <MapPin className="w-4 h-4 mr-2" />
            <a href="#access" className="hover:text-[#C5A059] transition-colors cursor-pointer">Hotel Rakurakuan</a>
          </div>
        </Reveal>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
        <ChevronDown />
      </div>
    </section>
  );
};

const ExperienceMenu = () => {
  return (
    <section id="menu" className="py-20 bg-[#F9F8F6]">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3">Experience Menu</h2>
            <div className="w-20 h-1 bg-[#C5A059] mx-auto"></div>
            <p className="mt-4 text-gray-600">Discover authentic Japanese traditions with professional guidance</p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Sushi Card */}
          <Reveal delay={200}>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group h-full flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={sushiImage} 
                  alt="Sushi Making" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
          
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">Sushi Experience</h3>
                <p className="text-[#C5A059] font-medium mb-4">Make Your Own Sushi</p>
                
                <ul className="text-gray-600 mb-6 flex-1 space-y-2 text-sm">
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-[#C5A059] flex-shrink-0 mt-1" /> Direct lesson from a professional sushi chef</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-[#C5A059] flex-shrink-0 mt-1" /> Hands-on experience making authentic nigiri sushi</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-[#C5A059] flex-shrink-0 mt-1" /> Enjoy your freshly made sushi on the spot</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-[#C5A059] flex-shrink-0 mt-1" /> Step-by-step guidance, perfect for beginners</li>
                </ul>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-6 border-t border-gray-100 pt-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-[#C5A059]" />
                    <span>Approx. 1.5 hrs</span>
                  </div>
                  <div className="font-bold text-lg text-[#1a1a1a]">¥12,500 <span className="text-xs font-normal text-gray-400">/ person</span></div>
                </div>

                <a href="https://docs.google.com/forms/d/e/1FAIpQLScVV_cota9yew0hHGxtL3bG6cfwnYh4OUKvGJWvfWFS0Vt1ew/viewform" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-[#1a1a1a] text-white py-3 uppercase tracking-wide text-sm hover:bg-[#333] transition-colors">
                  Reserve Sushi
                </a>
              </div>
            </div>
          </Reveal>

          {/* Matcha Card */}
          <Reveal delay={400}>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group h-full flex flex-col">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={matchaImage} 
                  alt="Matcha Tea Ceremony" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">Matcha Experience</h3>
                <p className="text-[#6B8C42] font-medium mb-4">Discover the Art of Matcha</p>
                <ul className="text-gray-600 mb-6 flex-1 space-y-2 text-sm">
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-[#6B8C42] flex-shrink-0 mt-1" /> Learn basic etiquette of Japanese tea ceremony</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-[#6B8C42] flex-shrink-0 mt-1" /> Whisk your own matcha and enjoy tasting</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-[#6B8C42] flex-shrink-0 mt-1" /> Savor seasonal Japanese sweets together</li>
                  <li className="flex items-start"><CheckCircle className="w-4 h-4 mr-2 text-[#6B8C42] flex-shrink-0 mt-1" /> Care and elegance, perfect for beginners</li>
                </ul>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-6 border-t border-gray-100 pt-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-[#6B8C42]" />
                    <span>1 ~ 1.5 hrs</span>
                  </div>
                  <div className="font-bold text-lg text-[#1a1a1a]">¥7,700 <span className="text-xs font-normal text-gray-400">/ person</span></div>
                </div>

                <a href="https://docs.google.com/forms/d/e/1FAIpQLSdFs3MGYV_IqDAapMPbv9ZkWZRb0dq-hEjjvvXt9egA_HmN9g/viewform?usp=header" target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-[#1a1a1a] text-white py-3 uppercase tracking-wide text-sm hover:bg-[#333] transition-colors">
                  Reserve Matcha
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const PremiumPlan = () => {
  return (
    <section className="py-20 bg-[#121212] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-50"></div>
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl"></div>
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 border border-[#C5A059] text-[#C5A059] text-xs tracking-[0.2em] uppercase mb-4">
              Premium
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              The Ultimate Kyoto Plan
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              "I want to do it all, but time is short."<br/>
              We created this comprehensive plan just for you. Experience culture and a luxurious feast in one session.
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="bg-gradient-to-br from-[#1E1E1E] to-[#252525] border border-[#C5A059]/30 rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
            <div className="flex flex-col">
              <div className="relative h-64 md:h-80 group">
                 <img 
                   src={ultimatePlanImage} 
                   alt="Wagyu and Japanese Cuisine" 
                   className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-transparent to-transparent"></div>
                 <div className="absolute bottom-6 left-6 text-white">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
                      <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
                      <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
                      <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
                      <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
                    </div>
                    <p className="font-bold text-2xl font-serif">All-Inclusive Luxury</p>
                    <p className="text-sm text-gray-300 mt-1">Experience + 5-Course Meal</p>
                 </div>
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-[#C5A059] mb-6 flex items-center">
                  <Crown className="w-6 h-6 mr-3" />
                  What's Included
                </h3>
                
                <div className="space-y-8 mb-8">
                  <div>
                    <h4 className="text-white font-bold text-lg flex items-center mb-3">
                      <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full mr-3"></span>
                      Mini Cultural Experiences
                    </h4>
                    <p className="text-gray-400 text-sm ml-4 pl-0.5 leading-relaxed">
                      Compact versions of our signature activities. Try your hand at <strong>Sushi Making</strong> and <strong>Matcha Whisking</strong> efficiently without the long commitment.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white font-bold text-lg flex items-center mb-3">
                      <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full mr-3"></span>
                      5-Course Japanese Feast
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300 text-sm ml-4 pl-0.5">
                      <li className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-[#C5A059]"/> Wagyu Sukiyaki</li>
                      <li className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-[#C5A059]"/> Wagyu Steak</li>
                      <li className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-[#C5A059]"/> Unagi (Eel)</li>
                      <li className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-[#C5A059]"/> Authentic Ramen</li>
                      <li className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-[#C5A059]"/> Seasonal Sushi</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-t border-white/10 pt-6 gap-4">
                  <div>
                     <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Package Price</p>
                     <p className="text-3xl font-bold text-white">¥30,000 <span className="text-sm font-normal text-gray-500">/ person</span></p>
                  </div>
                  <a href="#booking" className="bg-[#C5A059] hover:bg-[#b08d4b] text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest text-sm transition-all shadow-lg shadow-[#C5A059]/20 hover:shadow-[#C5A059]/40 flex items-center justify-center">
                    Book Premium
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const NewYearPlan = () => {
  return (
    <section className="py-20 bg-[#121212] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent opacity-50"></div>
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl"></div>
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-[#C5A059]/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 border border-[#C5A059] text-[#C5A059] text-xs tracking-[0.2em] uppercase mb-4">
              January 2026 – Limited Time Only
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              NEW YEAR SPECIAL OMAKASE COURSE
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Step into the New Year with an exclusive Japanese dining experience.<br/>
              Savor traditional flavors, premium ingredients, and Kyoto hospitality—available for a limited time only.
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="bg-gradient-to-br from-[#1E1E1E] to-[#252525] border border-[#C5A059]/30 rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
            <div className="flex flex-col">
              <div className="relative h-64 md:h-80 group">
                 <img 
                   src={newYearImage} 
                   alt="New Year Special Plan" 
                   className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-transparent to-transparent"></div>
                 <div className="absolute bottom-6 left-6 text-white">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
                      <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
                      <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
                      <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
                      <Star className="w-4 h-4 text-[#C5A059] fill-[#C5A059]" />
                    </div>
                    <p className="font-bold text-2xl font-serif">New Year Limited</p>
                    <p className="text-sm text-gray-300 mt-1">Experience + Special Osechi Course</p>
                 </div>
              </div>

              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-[#C5A059] mb-6 flex items-center">
                  <Crown className="w-6 h-6 mr-3" />
                  What's Included
                </h3>
                
                <div className="space-y-8 mb-8">
                  <div>
                    <h4 className="text-white font-bold text-lg flex items-center mb-3">
                      <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full mr-3"></span>
                      Premium Course with All-You-Can-Drink Sake
                    </h4>
                    <p className="text-gray-400 text-sm ml-4 pl-0.5 leading-relaxed">
                      A special New Year experience designed for international guests.<br/>
                      Enjoy a thoughtfully curated Japanese dining experience inspired by traditional New Year cuisine, perfect for celebrating the season and creating lasting memories in Kyoto.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-white font-bold text-lg flex items-center mb-3">
                      <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full mr-3"></span>
                      New Year Special Course
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300 text-sm ml-4 pl-0.5">
                      <li className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-[#C5A059]"/> Mini Osechi (black soybeans, herring roe, datemaki)</li>
                      <li className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-[#C5A059]"/> Mini Ozoni (Kyoto-style New Year soup with grilled mochi experience)</li>
                      <li className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-[#C5A059]"/> Chef's Choice Nigiri Sushi (7 pieces)</li>
                      <li className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-[#C5A059]"/> Jumbo Fried Prawns (2 pieces)</li>
                      <li className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-[#C5A059]"/> Wagyu Beef Bowl</li>
                      <li className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-[#C5A059]"/> Samurai Ramen (New Year special with extra chashu & yuzu)</li>
                      <li className="flex items-center"><Utensils className="w-4 h-4 mr-2 text-[#C5A059]"/> Kyoto-style Matcha Dessert</li>
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-t border-white/10 pt-6 gap-4">
                  <div>
                     <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Package Price</p>
                     <p className="text-3xl font-bold text-white">¥15,000 <span className="text-sm font-normal text-gray-500"> / person</span></p>
                  </div>
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLScJWPOvCi2S1Kom7fJ_J5g05Zl917oT8TRvMcvROj8DrQVDog/viewform" target="_blank" rel="noopener noreferrer" className="bg-[#C5A059] hover:bg-[#b08d4b] text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest text-sm transition-all shadow-lg shadow-[#C5A059]/20 hover:shadow-[#C5A059]/40 flex items-center justify-center">
                    Book New Year Plan
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const WhyUs = () => {
  const features = [
    { title: "Professional Chef", icon: <Utensils className="w-6 h-6" />, desc: "Direct guidance from Chef Keigo Morisawa." },
    { title: "Authentic Venue", icon: <MapPin className="w-6 h-6" />, desc: "Held at the restaurant on the 1st floor of Rakurakuan." },
    { title: "Rain or Shine", icon: <CloudRain className="w-6 h-6" />, desc: "Indoor activity, perfect for rainy days in Kyoto." },
    { title: "Beginner Friendly", icon: <Users className="w-6 h-6" />, desc: "Step-by-step guidance for first-timers." }
  ];

  return (
    <section className="py-20 bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Samurai Restaurant?</h2>
            <div className="w-20 h-1 bg-[#C5A059]"></div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, idx) => (
            <Reveal key={idx} delay={idx * 150}>
              <div className="p-6 border border-gray-700 rounded-lg hover:border-[#C5A059] transition-colors duration-300">
                <div className="text-[#C5A059] mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const RecommendedFor = () => {
  const targets = [
    "Travelers seeking authentic cultural memory in Kyoto",
    "Couples and families looking for hands-on activities",
    "Beginners who want to try making Sushi with a Pro",
    "Those interested in the elegance of Tea Ceremony"
  ];

  return (
    <section className="py-20 bg-white">
       <div className="container mx-auto px-6 max-w-4xl">
         <Reveal>
          <div className="bg-[#F9F8F6] p-8 md:p-12 rounded-2xl relative overflow-hidden">
             {/* Decorative circle */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
             
             <h2 className="text-3xl font-bold text-center mb-10 text-[#1a1a1a]">Recommended For</h2>
             
             <div className="grid md:grid-cols-2 gap-6">
                {targets.map((text, i) => (
                  <div key={i} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-[#C5A059] mr-3 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{text}</span>
                  </div>
                ))}
             </div>
          </div>
         </Reveal>
       </div>
    </section>
  );
};

const Access = () => {
  return (
    <section id="access" className="py-20 bg-gray-50" style={{ scrollMarginTop: '80px' }}>
      <div className="container mx-auto px-6">
        <Reveal>
          <h2 className="text-3xl font-bold text-center mb-3">Access</h2>
          <p className="text-center text-gray-500 mb-10">Held at the restaurant on the 1st floor of Rakurakuan</p>
        </Reveal>

        <div className="max-w-5xl mx-auto bg-white p-4 shadow-lg rounded-lg">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-64 md:h-auto bg-gray-200 rounded overflow-hidden relative">
              {/* Google Map Placeholder */}
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3268.0833153675037!2d135.7533089!3d34.9945899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60010899c73b06c1%3A0x1a8f9c0b7b6b0b0!2s452%20Tenshitsukinu%20Ke3chome%2C%20Shimogyo%20Ward%2C%20Kyoto%2C%20600-8456%2C%20Japan!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              ></iframe>
            </div>
            <div className="flex flex-col justify-center space-y-6 p-4">
              <div>
                <h3 className="font-bold text-lg mb-2 text-[#C5A059]">HOTEL RAKURAKUAN</h3>
                <p className="text-gray-600 text-sm">452 Tenshitsukinu Ke3chome,<br/>Shimogyo Ward, Kyoto, 600-8456</p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Venue Info</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Held at the restaurant on the 1st floor of Rakurakuan.
                </p>
                <img 
                  src={exteriorImage} 
                  alt="Rakurakuan Exterior" 
                  className="w-full rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    { q: "Do I need experience?", a: "No, beginners are completely welcome! Step-by-step guidance is provided." },
    { q: "Can children join?", a: "Yes, children are welcome. We recommend ages 6+ for the Sushi experience." },
    { q: "Is tax included in the price?", a: "Yes, all prices listed (¥12,500 for Sushi, ¥7,700 for Matcha) include tax." },
    { q: "Is it suitable for vegetarians?", a: "Please let us know in advance, and we can arrange vegetable sushi options." }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <Reveal>
          <h2 className="text-3xl font-bold text-center mb-10">FAQ</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-200 pb-4">
                <button 
                  className="flex justify-between items-center w-full text-left font-semibold text-lg py-2 focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  {faq.q}
                  <ChevronDown className={`transform transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const Booking = () => {
  return (
    <section id="booking" className="py-20 bg-[#1a1a1a] text-white" style={{ scrollMarginTop: '80px' }}>
      <div className="container mx-auto px-6 max-w-6xl text-center">
        <Reveal>
          <h2 className="text-4xl font-bold mb-6 text-[#C5A059]">Book Your Experience</h2>
          <p className="text-xl text-gray-300 mb-6">Reservations accepted until 1:00 PM on the day before.</p>
          <div className="mb-10 inline-block bg-white/10 px-6 py-2 rounded-full text-sm">
             <Phone className="w-4 h-4 inline mr-2" />
             For inquiries, please contact Keigo at 070-3609-0830
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
             <div className="bg-white/5 border border-white/10 p-8 rounded-lg hover:border-[#C5A059] transition-all relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 bg-[#C5A059] text-xs font-bold uppercase">Popular</div>
                <h3 className="text-2xl font-bold mb-4">Sushi Experience</h3>
                <p className="text-gray-400 mb-2">Approx. 1.5 hours</p>
                <p className="text-3xl font-bold text-white mb-6">¥12,500 <span className="text-sm font-normal text-gray-400">/ person</span></p>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScVV_cota9yew0hHGxtL3bG6cfwnYh4OUKvGJWvfWFS0Vt1ew/viewform" target="_blank" rel="noopener noreferrer" className="w-full bg-[#C5A059] hover:bg-[#b08d4b] text-white font-bold py-4 rounded transition-colors uppercase tracking-widest flex items-center justify-center">
                   <Calendar className="mr-2 w-5 h-5" />
                   Book Sushi
                </a>
             </div>

             <div className="bg-white/5 border border-white/10 p-8 rounded-lg hover:border-[#6B8C42] transition-all">
                <h3 className="text-2xl font-bold mb-4">Matcha Experience</h3>
                <p className="text-gray-400 mb-2">1 ~ 1.5 hours</p>
                <p className="text-3xl font-bold text-white mb-6">¥7,700 <span className="text-sm font-normal text-gray-400">/ person</span></p>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSdFs3MGYV_IqDAapMPbv9ZkWZRb0dq-hEjjvvXt9egA_HmN9g/viewform?usp=header" target="_blank" rel="noopener noreferrer" className="w-full bg-[#6B8C42] hover:bg-[#5a7637] text-white font-bold py-4 rounded transition-colors uppercase tracking-widest flex items-center justify-center">
                   <Calendar className="mr-2 w-5 h-5" />
                   Book Matcha
                </a>
             </div>

             <div className="bg-gradient-to-b from-[#1E1E1E] to-black border border-[#C5A059]/50 p-8 rounded-lg hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all">
                <div className="flex justify-center mb-2"><Crown className="text-[#C5A059] w-6 h-6"/></div>
                <h3 className="text-2xl font-bold mb-4 text-[#C5A059]">New Year Plan</h3>
                <p className="text-gray-400 mb-2">Experience + Special Osechi Course</p>
                <p className="text-3xl font-bold text-white mb-6">¥15,000 <span className="text-sm font-normal text-gray-400"> / person</span></p>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScJWPOvCi2S1Kom7fJ_J5g05Zl917oT8TRvMcvROj8DrQVDog/viewform" target="_blank" rel="noopener noreferrer" className="w-full bg-transparent border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white font-bold py-4 rounded transition-colors uppercase tracking-widest flex items-center justify-center">
                   <Sparkles className="mr-2 w-5 h-5" />
                   Book New Year Plan
                </a>
             </div>

             <div className="bg-gradient-to-b from-[#1E1E1E] to-black border border-[#C5A059]/50 p-8 rounded-lg hover:shadow-[0_0_20px_rgba(197,160,89,0.3)] transition-all">
                <div className="flex justify-center mb-2"><Crown className="text-[#C5A059] w-6 h-6"/></div>
                <h3 className="text-2xl font-bold mb-4 text-[#C5A059]">Premium Plan</h3>
                <p className="text-gray-400 mb-2">Experience + 5-Course Meal</p>
                <p className="text-3xl font-bold text-white mb-6">¥30,000 <span className="text-sm font-normal text-gray-400"> / person</span></p>
                <a href="#booking" className="w-full bg-transparent border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-white font-bold py-4 rounded transition-colors uppercase tracking-widest flex items-center justify-center">
                   <Crown className="mr-2 w-5 h-5" />
                   Book Premium
                </a>
             </div>
          </div>
          
          <div className="mt-8 flex items-center justify-center text-gray-500 text-sm">
             <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
             Price includes tax
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 border-t border-gray-800">
      <div className="container mx-auto px-6 text-center">
        <h4 className="text-2xl font-bold uppercase tracking-widest mb-4">Samurai Restaurant</h4>
        <div className="flex justify-center space-x-6 mb-8 text-sm text-gray-400">
          <a href="https://www.instagram.com/samurai.restaurant.omakase/" target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059]">Instagram</a>
          <a href="#" className="hover:text-[#C5A059]">Contact</a>
        </div>
        <p className="text-xs text-gray-600">© {new Date().getFullYear()} Samurai Restaurant-Kyoto. All rights reserved.</p>
      </div>
    </footer>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="antialiased text-gray-800 bg-white">
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      
      {!loading && (
        <div className="animate-fade-in">
          <Navbar />
          <Hero />
          <ExperienceMenu />
          <PremiumPlan />
          <NewYearPlan />
          <WhyUs />
          <RecommendedFor />
          <Access />
          <FAQ />
          <Booking />
          <Footer />
        </div>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);