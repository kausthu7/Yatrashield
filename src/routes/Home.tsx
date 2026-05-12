import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Train, User, MapPin, Armchair, ChevronRight, CreditCard } from 'lucide-react';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { cn } from '../lib/utils';

const PRODUCTS = [
  { id: '1-unit', name: 'Single Pack', price: 59, units: 1, badge: '' },
  { id: '3-units', name: 'Pack of Three (Value Pack)', price: 149, units: 3, badge: 'Save ₹28' },
  { id: '4-units', name: 'Pack of Four (Family Pack)', price: 199, units: 4, badge: 'Best Seller • Save ₹37' },
  { id: 'custom', name: 'Custom Pack', price: 59, units: 0, badge: '' },
];

export default function Home() {
  const [searchParams] = useSearchParams();
  const station = searchParams.get('st') || 'Kochi Junction';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: 'Mrs. Eleanor Sterling',
    platform: 'Platform 1',
    phoneNumber: '9876543210',
  });

  const [selectedProduct, setSelectedProduct] = useState<string | null>('1-unit');
  const [customQuantity, setCustomQuantity] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    if (!selectedProduct || !formData.name || !formData.platform || !formData.phoneNumber) {
      alert('Please complete all details and select a product.');
      return;
    }

    const product = PRODUCTS.find(p => p.id === selectedProduct);
    if (!product) return;

    let finalAmount = product.price;
    let finalUnits = product.units;

    if (product.id === 'custom') {
      if (typeof customQuantity !== 'number' || customQuantity <= 0) {
        alert('Please enter a valid number of packs.');
        return;
      }
      finalAmount = customQuantity * 59; // Base price for 1 unit
      finalUnits = customQuantity;
    }

    setIsSubmitting(true);

    try {
      // 1. Create order on the backend
      const response = await fetch('http://localhost:5000/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          receipt: `rcpt_${Math.random().toString(36).substring(2, 11)}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Backend error: ${response.status}`);
      }

      const { order } = await response.json();

      if (!order) {
        throw new Error('Failed to create Razorpay order on the backend');
      }

      // 2. Open Razorpay Checkout
      if (!(window as any).Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please check your internet connection.');
      }

      const options = {
        key: 'rzp_test_SnjYkobCR2xPYe',
        amount: order.amount,
        currency: order.currency,
        name: "YATRA Shield",
        description: `Purchase of ${product.name}`,
        image: "/product.png",
        order_id: order.id,
        handler: async function (response: any) {
          // 3. On success, save to Firebase
          const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

          try {
            await setDoc(doc(db, 'orders', orderId), {
              stationName: station,
              customerName: formData.name,
              platformNumber: formData.platform,
              phoneNumber: formData.phoneNumber,
              productId: product.id,
              units: finalUnits,
              amount: finalAmount,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              status: 'paid',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });

            navigate(`/success?orderId=${orderId}`);
          } catch (error) {
            console.error('Firestore Error:', error);
            handleFirestoreError(error, OperationType.WRITE, 'orders');
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phoneNumber
        },
        theme: {
          color: "#0055a5"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error: any) {
      console.error('Payment Error:', error);
      alert(error.message || 'Failed to initiate payment. Please check if the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-soft-cream overflow-hidden relative">
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-emerald-deep pt-12 pb-8 px-8 text-center text-natural-bg"
      >
        <div className="flex flex-col items-center justify-center mb-6">
          <span className="font-sans uppercase text-xl tracking-[0.15em] leading-none text-natural-bg mb-[-5px]">YATRA</span>
          <span className="font-serif text-[3.5rem] leading-none text-natural-bg">Shield</span>
        </div>
        <p className="!text-xl sans-label opacity-100 mt-2 font-bold tracking-tight">Your Hygiene Delivers in 20 mins
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-sans uppercase tracking-widest text-emerald-deep shadow-sm">
          <MapPin size={18} />
          <span className="font-bold">{station}</span>
        </div>
      </motion.header>

      <div className="p-8 space-y-8">
        <section className="space-y-3">
          <label className="sans-label text-emerald-deep ml-1">Traveler Details</label>
          <div className="grid gap-3">
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Name of Passenger"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-natural-bg border-none rounded-2xl py-3 px-5 text-sm focus:ring-1 focus:ring-luxury-gold outline-none transition-all placeholder-deep-olive/30 clay-card"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select
                name="platform"
                value={formData.platform}
                onChange={handleInputChange as any}
                className="w-full bg-natural-bg border-none rounded-2xl py-3 px-5 text-sm outline-none focus:ring-1 focus:ring-luxury-gold appearance-none text-deep-olive clay-card"
              >
                <option value="Platform 1">Platform 1</option>
                <option value="Platform 2">Platform 2</option>
                <option value="Platform 3">Platform 3</option>
                <option value="Platform 4">Platform 4</option>
                <option value="Platform 5">Platform 5</option>
                <option value="Platform 6">Platform 6</option>
              </select>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full bg-natural-bg border-none rounded-2xl py-3 px-5 text-sm outline-none focus:ring-1 focus:ring-luxury-gold placeholder-deep-olive/30 clay-card"
              />
            </div>
          </div>
        </section>
        <section className="space-y-3">
          <div className="clay-card p-4 mb-6 w-full flex justify-center">
            {/* The user will place their product image in the public folder as product.png */}
            <img src="/product.png" alt="YATRA Shield Travel Hygiene Kit" className="max-h-48 object-contain rounded-xl" onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=400'; }} />
          </div>

          <label className="sans-label text-emerald-deep ml-1">Select Package</label>
          <div className="grid gap-3">
            {PRODUCTS.map((product) => (
              <React.Fragment key={product.id}>
                <motion.div
                  key={product.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedProduct(product.id)}
                  className={cn(
                    "flex items-center justify-between p-4 bg-white transition-all cursor-pointer",
                    selectedProduct === product.id
                      ? "clay-button ring-1 ring-luxury-gold shadow-none"
                      : "clay-card hover:scale-[1.02]"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-3 h-3 rounded-full transition-all flex-shrink-0",
                      selectedProduct === product.id
                        ? "bg-luxury-gold shadow-[0_0_0_4px_rgba(197,160,89,0.1)]"
                        : "border border-emerald-deep/20"
                    )} />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-deep-olive">{product.name}</p>
                        {product.badge && (
                          <span className="bg-emerald-deep/10 text-emerald-deep text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            {product.badge}
                          </span>
                        )}
                      </div>
                      <p className="sans-label opacity-60 lowercase mt-0.5">
                        {product.id === 'custom' ? 'Any Quantity' : `${product.units} ${product.units === 1 ? 'Unit' : 'Units'}`}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-emerald-deep">
                    {product.id === 'custom'
                      ? (selectedProduct === 'custom' && typeof customQuantity === 'number' && customQuantity > 0 ? `₹${customQuantity * 59}` : '₹59/kit')
                      : `₹${product.price}`}
                  </p>
                </motion.div>
                {product.id === 'custom' && selectedProduct === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-4 pb-2"
                  >
                    <input
                      type="number"
                      min="1"
                      placeholder="Enter number of packs (e.g. 10)"
                      value={customQuantity}
                      onChange={(e) => setCustomQuantity(e.target.value === '' ? '' : parseInt(e.target.value))}
                      className="w-full bg-natural-bg border-none rounded-xl py-3 px-5 text-sm outline-none focus:ring-1 focus:ring-luxury-gold text-deep-olive"
                    />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        <motion.button
          disabled={isSubmitting}
          whileTap={{ scale: 0.95 }}
          onClick={handleOrder}
          className="w-full bg-emerald-deep text-natural-bg py-4 rounded-2xl font-bold clay-button flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-natural-bg border-t-transparent rounded-full animate-spin" />
              <span className="sans-label text-natural-bg">Processing...</span>
            </div>
          ) : (
            <>
              <span className="sans-label text-natural-bg text-xs tracking-widest">Confirm via UPI</span>
              <CreditCard size={16} />
            </>
          )}
        </motion.button>

        <div className="pt-8 text-center space-y-4">
          <div className="flex items-center gap-4 text-sm sans-label text-emerald-deep opacity-40">
            <div className="h-[1px] flex-1 bg-emerald-deep/20"></div>
            <span>Verified Service</span>
            <div className="h-[1px] flex-1 bg-emerald-deep/20"></div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 clay-card">
              <p className="text-[10px] opacity-60 mb-1">Avg. Delivery</p>
              <p className="font-bold text-emerald-deep">10-20 Minutes</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
