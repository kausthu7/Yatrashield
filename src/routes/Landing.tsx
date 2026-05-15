import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Shield, Truck, Clock, CheckCircle, ChevronRight, Menu, X, ArrowRight, Star, Instagram, Facebook, Twitter, Home, Train, Shrink, Timer, Leaf, Compass } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = React.useState(false);
  const [activeProductImage, setActiveProductImage] = React.useState('/product_kit.png');

  // Pre-order form state
  const [preOrderForm, setPreOrderForm] = React.useState({
    name: '',
    contact: '',
    place: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = React.useState(false);

  const SPREADSHEET_URL = "https://script.google.com/macros/s/AKfycbxWnUXTdvVPwesOJortlonqpmEQ7Zw-wRkl_Nn7oIqf2keTS3Lahd2pMSncl79asrEO/exec";

  const handlePreOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preOrderForm.name || !preOrderForm.contact || !preOrderForm.place) {
      alert("Please fill all fields. Email or Number is mandatory.");
      return;
    }
    setIsSubmitting(true);

    try {
      await fetch(SPREADSHEET_URL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script requires no-cors for simple POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...preOrderForm,
          type: 'Pre-order'
        })
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsOrderModalOpen(false);
        setIsSubmitted(false);
        setPreOrderForm({ name: '', contact: '', place: '' });
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };
  const productItems = [
    { name: "Medical-grade face mask", image: "/mask.png" },
    { name: "70% Alcohol Sanitizer (2ml)", image: "/sanitizer.png" },
    { name: "Antiseptic Surface Wipes", image: "/wipes.png" },
    { name: "Bio-degradable Seat Covers", image: "/toilet seat cover.png" },
    { name: "Tissues", image: "/tissue.png" }
  ];

  const features = [
    {
      icon: <Shield className="text-emerald-deep" />,
      title: "Certified Hygiene",
      description: "Every kit is medical-grade for your safety during travel."
    },
    {
      icon: <Clock className="text-emerald-deep" />,
      title: "20-Min Delivery",
      description: "Our logistics network ensures your kit reaches your station platformin under 20 minutes."
    },
    {
      icon: <Truck className="text-emerald-deep" />,
      title: "Station Network",
      description: "Currently available at Ernakulam Junction(ERS). Expanding soon across all major railway stations in India."
    }
  ];

  const productValues = [
    {
      icon: <Shrink className="text-[#00abff]" />,
      title: "Compact",
      description: "Fits in your palm. Designed for the limited space of travel luggage."
    },
    {
      icon: <Timer className="text-[#00abff]" />,
      title: "Ready anytime",
      description: "No more hunting for soap or water in crowded railway stations."
    },
    {
      icon: <Leaf className="text-[#00abff]" />,
      title: "Sustainable",
      description: "Biodegradable wipes and recyclable packaging to respect our Earth."
    },
    {
      icon: <Compass className="text-[#00abff]" />,
      title: "Travel-First",
      description: "Designed specifically for the unique hygiene challenges of Indian travel."
    }
  ];

  const steps = [
    { number: "01", title: "Select Station", description: "Choose your upcoming station from our list or scan the QR on your station." },
    { number: "02", title: "Choose Pack", description: "Pick a single shield or a family value pack based on your travel needs." },
    { number: "03", title: "Swift Delivery", description: "Our agent will deliver it directly to your platform within minutes." }
  ];

  const testimonials = [
    {
      name: "Amritha Appu",
      role: "Student",
      content: "Yatra Shield has changed how I travel. I no longer worry about hygiene in public transport. The delivery was incredibly fast!",
      rating: 5
    },
    {
      name: "Priya Rajan",
      role: "Marketing executive",
      content: "Professional service and high-quality kits. It's a must-have for anyone traveling with family.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Floating Product Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, x: -20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-15 left-5 md:left-8 z-[700] w-[calc(100%-2rem)] md:w-[400px] glass-card !bg-black/60 md:!bg-black/40 p-1  md:p-4 rounded-[2rem] md:rounded-[4rem] hidden md:flex items-center gap-2 md:gap-4"
      >
        <div className="rounded-2xl md:rounded-6xl w-24 h-24 md:w-25 md:h-25 flex items-center justify-center rotate-3 bg-white/10 shrink-0">
          <img src="/product.png" alt="Travel Hygiene Kit" className="w-full h-full object-contain" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-bold text-base md:text-lg mb-1 md:mb-3">Travel Hygiene Kit</h4>
          <ul className="hidden md:block space-y-1.5 mb-5">
            <li className="flex items-center gap-2 text-white/90 text-[11px] font-bold">
              <div className="w-1.5 h-1.5 bg-[#00c9ff] rounded-full" /> Easy to carry
            </li>
            <li className="flex items-center gap-2 text-white/90 text-[11px] font-bold">
              <div className="w-1.5 h-1.5 bg-[#00c9ff] rounded-full" /> Delivered in Station
            </li>
            <li className="flex items-center gap-2 text-white/90 text-[11px] font-bold">
              <div className="w-1.5 h-1.5 bg-[#00c9ff] rounded-full" /> in 20 minutes
            </li>
          </ul>
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="w-50 bg-[#00abff] text-white py-1 md:py-2 rounded-full font-black text-[8px] uppercase tracking-widest clay-button hover:scale-105 active:scale-90 transition-all"
          >
            Pre order
          </button>
        </div>
      </motion.div>

      {/* Floating WhatsApp Icon */}
      <a
        href="https://wa.me/YOUR_NUMBER"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>

      {/* Hero Container with Background */}
      <div className="relative min-h-screen w-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          {/* Mobile Background */}
          <img
            src="/hero_mobile.jpeg"
            alt="Yatra Shield Hero Mobile"
            className="w-250 h-250 object-cover block md:hidden"
          />
          {/* Desktop Background */}
          <img
            src="/hero_new.jpeg"
            alt="Yatra Shield Hero Desktop"
            className="w-full h-full object-cover hidden md:block"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Navigation */}
        <nav className="sticky top-0 left-0 right-0 z-50 flex justify-center px-6 py-4 md:py-0 bg-white/0 md:bg-colour bg[#ffffff] backdrop-blur-md md:backdrop-blur-none">
          <div className="w-full max-w-7xl flex items-center justify-between">
            {/* Branding - Top Left */}
            <div
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); }}
              className="cursor-pointer"
            >
              <img
                src="/logo.png"
                alt="Yatra Shield Logo"
                className="h-8 md:h-18 w-auto object-contain"
              />
            </div>

            {/* Desktop Navbar - Center Top */}
            <div className="hidden md:flex items-center gap-1 clay-nav px-2 py-2">
              <a href="#" className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-deep-olive hover:bg-white/100 rounded-full transition-all">Home</a>
              <a href="#features" className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-deep-olive/70 hover:text-deep-olive hover:bg-white/100 rounded-full transition-all">Products</a>
              <a href="#where-we-deliver" className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-deep-olive/70 hover:text-deep-olive hover:bg-white/100 rounded-full transition-all">Coverage</a>
              <a href="#how-it-works" className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-deep-olive/70 hover:text-deep-olive hover:bg-white/100 rounded-full transition-all">About Us</a>
              <a href="#testimonials" className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-deep-olive/70 hover:text-deep-olive hover:bg-white/100 rounded-full transition-all">Contact Us</a>
            </div>

            {/* Mobile Menu Toggle & Cart */}
            <div className="flex items-center gap-4">
              <div className="md:clay-nav p-2 md:p-3 text-white md:text-deep-olive cursor-pointer hover:bg-white/20 transition-all flex items-center justify-center">
                <div className="relative">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-7-3h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5.12L4.38 5H2v2h1.56l2.32 9.24A2 2 0 0 0 7 18h10v-2H7.42l-.25-1H16z" /></svg>
                </div>
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white focus:outline-none"
              >
                {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-0 left-0 right-0 mt-10 h-screen bg-black/0 backdrop-blur-2xl flex flex-col p-10 gap-8 md:hidden z-50"
              >
                <a href="#" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest text-white border-b border-white/10 pb-4">Home</a>
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest text-white/60 border-b border-white/10 pb-4">Products</a>
                <a href="#where-we-deliver" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest text-white/60 border-b border-white/10 pb-4">Coverage</a>
                <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest text-white/60 border-b border-white/10 pb-4">About Us</a>
                <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black uppercase tracking-widest text-white/60 border-b border-white/10 pb-4">Contact Us</a>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 px-10 pt-20 md:px-20 min-h-screen flex flex-col md:flex-row md:items-end pb-12 md:pb-35 pt-5 md:pt-15">
          <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end justify-end gap-10 md:gap-24">
            {/* Left Column: Title Block */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full md:max-w-3xl order-1 md:order-2 text-right"
            >
              <div className="mb-6 md:mb-8 h-130">
                <h1 className="text-lg sm:text-2xl md:text-5xl font-thin !text-[#ffffff] uppercase tracking-[0.2em] md:tracking-[0.1em] leading-tight mb-2">
                  Designed For Your
                </h1>
                <h2 className="!text-white text-[2rem] sm:text-4xl md:text-7xl font-black uppercase tracking-tight leading-[1.1] md:leading-tight">
                  Unprepared <br className="md:hidden" /> Journeys
                </h2>
              </div>



              <p className="text-[13px] md:text-lg text-white mb-8 md:mb-12 max-w-xl ml-auto leading-relaxed font-bold drop-shadow-lg">
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={() => setIsOrderModalOpen(true)}
                  className="bg-[#00abff] text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
                >
                  Pre-order
                </button>
                <a
                  href="#features"
                  className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white/20 hover:scale-105 active:scale-95 transition-all text-center w-full sm:w-auto"
                >
                  View Features
                </a>
              </div>
            </motion.div>

            {/* Desktop Hero Image (Side by Side) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="hidden md:block flex-1 md:order-1 order-2"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-[#00abff]/20 blur-[120px] rounded-full group-hover:bg-[#00abff]/10 transition-all" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>


      {/* Stats Section */}
      <section className="bg-[#0089CF] py-10 md:py-5 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-emerald-deep/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          <div>
            <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-3">Total Orders</p>
            <p className="text-2xl md:text-5xl font-black text-white">-</p>
          </div>
          <div>
            <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-3">Active Stations</p>
            <p className="text-2xl md:text-5xl font-black text-white">1</p>
          </div>
          <div>
            <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-3">Avg. Delivery</p>
            <p className="text-2xl md:text-5xl font-black text-white">20m</p>
          </div>
          <div>
            <p className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-3">Satisfaction</p>
            <p className="text-3xl md:text-5xl font-black text-[#10ff61]">-</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-30 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <p className="text-sm md:text-lg font-black uppercase tracking-[0.3em] text-emerald-deep mb-4">Why Yatra Shield</p>
            <h2 className="text-2xl sm:text-4xl md:text-7xl font-black uppercase tracking-[0.1em] mb-6 md:mb-10 leading-tight">Engineered for <br className="hidden md:block" /> Your Safety</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="clay-card p-8 md:p-12 transition-all group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-natural-bg text-emerald-deep rounded-2xl md:rounded-[2rem] flex items-center justify-center mb-8 md:mb-10 group-hover:scale-110 transition-all duration-500 clay-button">
                  {React.cloneElement(feature.icon as React.ReactElement, { size: 28 })}
                </div>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4">{feature.title}</h3>
                <p className="text-deep-olive/60 leading-relaxed font-medium text-sm md:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section className="bg-[#a3eeff] gradient-to-br from-[#0085ff ] to-[#00457a] py-20 md:py-32 px-6 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[1200px] h-[300px] md:h-[600px] bg-[#ffffff] blur-[100px] md:blur-[150px] rounded-full" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 md:gap-24 items-center relative z-10">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-[#ffffff]/50 blur-[100px] rounded-full" />
            <img
              src={activeProductImage}
              alt="The Kit"
              key={activeProductImage}
              className="relative z-5 w-full h-auto max-h-[300px] md:max-h-[500px] object-contain rounded-3xl md:rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] rotate-2 hover:rotate-0 transition-all duration-1000"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/product_kit.jpeg';
              }}
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-base md:text-lg font-black uppercase tracking-[0.3em] text-[#ffffff] mb-4 md:mb-6">Inside the Shield</p>
            <h2 className="text-2xl sm:text-4xl md:text-7xl font-black uppercase tracking-[0.1em] mb-8 md:mb-10 leading-tight">What's in your kit?</h2>
            <div className="space-y-3 md:space-y-4">
              {productItems.map((item, i) => (
                <div
                  key={i}
                  onClick={() => setActiveProductImage(item.image)}
                  className={`flex items-center gap-3 md:gap-4 p-4 md:p-5 rounded-2xl md:rounded-3xl cursor-pointer transition-all group ${activeProductImage === item.image
                    ? 'bg-emerald-deep text-white clay-button scale-[1.02] md:scale-105'
                    : 'bg-white clay-card hover:scale-[1.01]'
                    }`}
                >
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-black text-sm transition-colors ${activeProductImage === item.image
                    ? 'bg-white text-emerald-deep'
                    : 'bg-emerald-deep/5 text-emerald-deep group-hover:bg-emerald-deep group-hover:text-white'
                    }`}>
                    {i + 1}
                  </div>
                  <span className={`font-bold text-sm md:text-base transition-colors ${activeProductImage === item.image ? 'text-white' : 'text-deep-olive/80'
                    }`}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="mt-8 md:mt-12 bg-white text-[#00abff] px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
            >
              Pre-order This Kit Now
            </button>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 md:py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-deep mb-4">Seamless Experience</p>
            <h2 className="text-2xl sm:text-4xl md:text-7xl font-black uppercase tracking-[0.1em] mb-6 md:mb-10 leading-tight">How it Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                <div className="text-6xl md:text-[120px] font-black text-emerald-deep/5 absolute -top-8 md:-top-20 -left-2 md:-left-4 group-hover:text-emerald-deep/10 transition-colors">
                  {step.number}
                </div>
                <div className="relative z-10">
                  <h4 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-3 md:mb-4">{step.title}</h4>
                  <p className="text-deep-olive/60 leading-relaxed font-medium text-sm md:text-base">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where we Deliver Section */}
      <section id="where-we-deliver" className="py-20 md:py-32 px-6 bg-natural-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-deep mb-4">Coverage</p>
            <h2 className="text-2xl sm:text-4xl md:text-7xl font-black uppercase tracking-[0.1em] mb-6 md:mb-10 leading-tight">Where we Deliver</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            {[
              {
                title: "Bus Station",
                caption: "We will initially deliver in Vyttila",
                image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Railway Station",
                caption: "We will initially deliver Ernakulam Junction",
                image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: "Home",
                caption: "We will deliver All around Ernakulam",
                image: "https://images.unsplash.com/photo-1513584684374-8bdb74838a0f?auto=format&fit=crop&q=80&w=800"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="clay-card overflow-hidden group"
              >
                <div className="h-64 md:h-80 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8">
                    <h3 className="text-white text-2xl md:text-3xl font-black uppercase tracking-tight mb-2">{item.title}</h3>
                    <p className="text-white/80 text-xs md:text-sm font-medium leading-relaxed">{item.caption}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product DNA / Values Section */}
      <section className="bg-[#a3eeff] py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {productValues.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#a3eeff] backdrop-blur-sm border border-white/40 p-6 md:p-5 rounded-3xl md:rounded-[2.5rem] hover:bg-white/20 transition-all group"
              >
                <div className="mb-6 md:mb-8 p-3 md:p-4 bg-white rounded-2xl inline-block group-hover:scale-110 transition-transform">
                  {React.cloneElement(value.icon as React.ReactElement, { size: 24 })}
                </div>
                <h3 className="text-[#ffffff] text-xl md:text-2xl font-black uppercase tracking-tight mb-3 md:mb-4">
                  {value.title}
                </h3>
                <p className="text-[#0160C9] leading-relaxed font-medium text-xs md:text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-[#3acbe8] py-24 md:py-40 px-6 text-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-emerald-deep/20 blur-[100px] md:blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40 mb-4">Testimonials</p>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-[0.1em] mb-6 md:mb-10 leading-tight">What Travelers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="clay-card p-8 md:p-12 text-deep-olive">
                <div className="flex gap-1 mb-6 md:mb-8">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="#00abff" className="text-[#00abff]" />)}
                </div>
                <p className="text-lg md:text-2xl font-medium leading-relaxed mb-8 md:mb-10 italic">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-deep text-white rounded-full flex items-center justify-center font-black text-xs clay-button">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-[10px] md:text-xs">{t.name}</h4>
                    <p className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-40 mt-1">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-20 md:py-40 px-6 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/background waitinglist.png"
            alt="Waitlist Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[20px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 md:mb-12"
          >
            <h2 className="text-2xl sm:text-4xl md:text-7xl font-black uppercase tracking-[0.1em] mb-6 md:mb-10 leading-tight text-white">
              Be the first <br /> to know.
            </h2>
            <p className="text-sm md:text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed">
              We're crafting the final touches of the Yatra Shield experience. Join the priority waitlist for early access and exclusive launch offers.
            </p>
          </motion.div>

          {waitlistSubmitted ? (
            <div className="py-8 md:py-10 bg-white/10 backdrop-blur-xl rounded-[2rem] md:rounded-[3rem] border border-white/20">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#00abff] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4 text-white">You're on the list!</h3>
              <p className="text-xs md:text-sm text-white/60 font-medium max-w-sm mx-auto px-6">
                We've received your email. You'll be the first to know about our official launch and early-bird offers!
              </p>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const emailInput = e.currentTarget.querySelector('input') as HTMLInputElement;
                const email = emailInput.value;

                try {
                  setWaitlistSubmitted(true); // Show success immediately for better UX
                  await fetch(SPREADSHEET_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: email,
                      type: 'Waitlist'
                    })
                  });
                } catch (error) {
                  console.error("Waitlist error:", error);
                }
              }}
              className="flex flex-col md:flex-row gap-3 md:gap-4 max-w-lg mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 md:px-8 py-4 md:py-5 text-sm font-bold text-white placeholder:text-white/40 focus:ring-2 focus:ring-[#00abff] outline-none transition-all"
              />
              <button
                type="submit"
                className="bg-[#00abff] text-white px-10 py-4 md:py-5 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.2em] clay-button hover:scale-105 active:scale-95 transition-all"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-40 px-4 md:px-6">
        <div className="max-w-10xl mx-auto bg-[#a3eeff] rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-32 text-center text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,102,204,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FF88]/10 to-transparent" />
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-[0.1em] mb-6 md:mb-10 leading-tight">Ready for a <br /> safer journey?</h2>
            <p className="text-base md:text-xl text-[#0000ff]/70 mb-8 md:mb-12 max-w-lg mx-auto font-medium">Join thousands of travelers who trust Yatra Shield for their hygiene needs.</p>
            <button
              onClick={() => setIsOrderModalOpen(true)}
              className="bg-white text-[#00abff] px-10 md:px-14 py-4 md:py-6 rounded-full font-black text-sm md:text-base uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
            >
              Join the Waitlist
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-20 md:pt-32 pb-12 md:pb-16 px-6 border-t border-emerald-deep/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20 mb-16 md:mb-24">
            <div className="md:col-span-2">
              <div
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="cursor-pointer mb-6 md:mb-0"
              >
                <img
                  src="/logo.png"
                  alt="Yatra Shield Logo"
                  className="h-12 md:h-15 w-auto object-contain"
                />
              </div>
              <p className="text-deep-olive/60 max-w-sm leading-relaxed mb-8 md:mb-10 font-medium text-sm md:text-base">
                The gold standard in travel hygiene. We are on a mission to make public transport safer for everyone in India.
              </p>
              <div className="flex gap-3 md:gap-4">
                <a href="#" className="w-10 h-10 md:w-14 md:h-14 text-emerald-deep hover:bg-emerald-deep hover:text-white clay-button flex items-center justify-center transition-all duration-300"><Instagram size={20} /></a>
                <a href="#" className="w-10 h-10 md:w-14 md:h-14 text-emerald-deep hover:bg-emerald-deep hover:text-white clay-button flex items-center justify-center transition-all duration-300"><Facebook size={20} /></a>
                <a href="#" className="w-10 h-10 md:w-14 md:h-14 text-emerald-deep hover:bg-emerald-deep hover:text-white clay-button flex items-center justify-center transition-all duration-300"><Twitter size={20} /></a>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:col-span-2 md:grid-flow-col">
              <div>
                <h4 className="font-black uppercase tracking-[0.2em] text-[10px] md:text-xs mb-6 md:mb-10 text-emerald-deep">Company</h4>
                <ul className="space-y-3 md:space-y-4">
                  <li><a href="#features" className="text-xs md:text-sm font-bold text-deep-olive/40 hover:text-emerald-deep transition-colors">Products</a></li>
                  <li><a href="#how-it-works" className="text-xs md:text-sm font-bold text-deep-olive/40 hover:text-emerald-deep transition-colors">About Us</a></li>
                  <li><a href="#testimonials" className="text-xs md:text-sm font-bold text-deep-olive/40 hover:text-emerald-deep transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-black uppercase tracking-[0.2em] text-[10px] md:text-xs mb-6 md:mb-10 text-emerald-deep">Legal</h4>
                <ul className="space-y-3 md:space-y-4">
                  <li><a href="#" className="text-xs md:text-sm font-bold text-deep-olive/40 hover:text-emerald-deep transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-xs md:text-sm font-bold text-deep-olive/40 hover:text-emerald-deep transition-colors">Terms</a></li>
                  <li><a href="#" className="text-xs md:text-sm font-bold text-deep-olive/40 hover:text-emerald-deep transition-colors">Refund</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="pt-8 md:pt-12 border-t border-emerald-deep/5 text-center text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-deep-olive/20">
            © {new Date().getFullYear()} Yatra Shield Private Limited.
          </div>
        </div>
      </footer>

      {/* Pre-Order Registration Modal */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOrderModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md clay-card overflow-hidden"
            >
              <div className="p-6 md:p-12">
                {!isSubmitted ? (
                  <>
                    <div className="text-center mb-6 md:mb-8">
                      <div className="inline-block px-4 py-1 bg-blue-50 text-[#00abff] rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4">
                        Exclusive Pre-launch Offer
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-3 md:mb-4 leading-tight">
                        Join the <br /> Waitlist
                      </h3>
                      <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed">
                        Register now to get your Travel Hygiene Kit for just <span className="text-[#00abff] font-bold">₹40</span> (Special Pre-sale Price). We'll notify you the moment we launch!
                      </p>
                    </div>

                    <form onSubmit={handlePreOrderSubmit} className="space-y-3 md:space-y-4">
                      <div>
                        <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 md:mb-2 ml-4">Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          className="w-full bg-gray-50 border-none rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-sm font-bold focus:ring-2 focus:ring-[#00abff] transition-all"
                          value={preOrderForm.name}
                          onChange={(e) => setPreOrderForm({ ...preOrderForm, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 md:mb-2 ml-4">Email or Phone</label>
                        <input
                          type="text"
                          required
                          placeholder="Where should we notify you?"
                          className="w-full bg-gray-50 border-none rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-sm font-bold focus:ring-2 focus:ring-[#00abff] transition-all"
                          value={preOrderForm.contact}
                          onChange={(e) => setPreOrderForm({ ...preOrderForm, contact: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 md:mb-2 ml-4">Preferred Station / City</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ernakulam / Kochi"
                          className="w-full bg-gray-50 border-none rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-sm font-bold focus:ring-2 focus:ring-[#00abff] transition-all"
                          value={preOrderForm.place}
                          onChange={(e) => setPreOrderForm({ ...preOrderForm, place: e.target.value })}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#00abff] text-white py-4 md:py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                      >
                        {isSubmitting ? "Registering..." : "Claim Special Offer"}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-6 md:py-10">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={32} md:size={40} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-4">You're on the list!</h3>
                    <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed mb-6 md:mb-8">
                      Thank you, {preOrderForm.name.split(' ')[0]}! We've reserved your special ₹40 pricing. We'll reach out to {preOrderForm.contact} as soon as we're ready.
                    </p>
                    <button
                      onClick={() => setIsOrderModalOpen(false)}
                      className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                )}

                {!isSubmitted && (
                  <button
                    onClick={() => setIsOrderModalOpen(false)}
                    className="w-full mt-6 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-gray-500 transition-colors"
                  >
                    Maybe Later
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div >
  );
}
