import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, MapPin, Phone, User, CreditCard, ChevronLeft } from 'lucide-react';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { cn } from '../lib/utils';

const PRODUCTS = [
  { id: '1-unit', name: 'Single Pack', price: 59, units: 1, badge: '' },
  { id: '3-units', name: 'Pack of Three (Value Pack)', price: 149, units: 3, badge: 'Save ₹28' },
  { id: '4-units', name: 'Pack of Four (Family Pack)', price: 199, units: 4, badge: 'Best Seller • Save ₹37' },
  { id: 'custom', name: 'Custom Pack', price: 59, units: 0, badge: '' },
];

export default function HomeDelivery() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    pincode: '',
    city: 'Kochi',
    state: 'Kerala',
  });

  const [selectedProduct, setSelectedProduct] = useState<string | null>('1-unit');
  const [customQuantity, setCustomQuantity] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOrder = async () => {
    if (!selectedProduct || !formData.name || !formData.phoneNumber || !formData.address || !formData.pincode) {
      alert('Please complete all delivery details and select a product.');
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
      finalAmount = customQuantity * 59;
      finalUnits = customQuantity;
    }

    // Home delivery might have a small shipping fee
    const shippingFee = 40;
    const totalAmount = finalAmount + shippingFee;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          receipt: `hm_rcpt_${Math.random().toString(36).substring(2, 11)}`
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Backend error: ${response.status}`);
      }

      const { order } = await response.json();

      if (!(window as any).Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please check your internet connection.');
      }

      const options = {
        key: 'rzp_test_SnjYkobCR2xPYe',
        amount: order.amount,
        currency: order.currency,
        name: "YATRA Shield",
        description: `Home Delivery of ${product.name}`,
        image: "/product.png",
        order_id: order.id,
        handler: async function (response: any) {
          const orderId = `HME-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

          try {
            await setDoc(doc(db, 'orders', orderId), {
              deliveryType: 'home',
              customerName: formData.name,
              phoneNumber: formData.phoneNumber,
              address: formData.address,
              pincode: formData.pincode,
              city: formData.city,
              state: formData.state,
              productId: product.id,
              units: finalUnits,
              amount: totalAmount,
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
        className="bg-emerald-deep pt-12 pb-8 px-8 text-center text-natural-bg relative"
      >
        <button 
          onClick={() => navigate('/')}
          className="absolute left-6 top-12 p-2 hover:bg-white/10 rounded-full transition-colors text-white"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex flex-col items-center justify-center mb-6">
          <span className="font-sans uppercase text-xl tracking-[0.15em] leading-none text-natural-bg mb-[-5px]">YATRA</span>
          <span className="font-serif text-[3.5rem] leading-none text-natural-bg">Shield</span>
        </div>
        <p className="!text-xl sans-label opacity-100 mt-2 font-bold tracking-tight">Home Delivery Service</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-xs font-sans uppercase tracking-widest text-emerald-deep shadow-sm">
          <Home size={18} />
          <span className="font-bold">Standard Delivery</span>
        </div>
      </motion.header>

      <div className="p-8 space-y-8">
        <section className="space-y-4">
          <label className="sans-label text-emerald-deep ml-1">Delivery Address</label>
          <div className="grid gap-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-natural-bg border-none rounded-2xl py-3 px-5 text-sm focus:ring-1 focus:ring-luxury-gold outline-none clay-card"
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full bg-natural-bg border-none rounded-2xl py-3 px-5 text-sm focus:ring-1 focus:ring-luxury-gold outline-none clay-card"
            />
            <textarea
              name="address"
              placeholder="Full House Address"
              rows={3}
              value={formData.address}
              onChange={handleInputChange}
              className="w-full bg-natural-bg border-none rounded-2xl py-3 px-5 text-sm focus:ring-1 focus:ring-luxury-gold outline-none resize-none clay-card"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full bg-natural-bg border-none rounded-2xl py-3 px-5 text-sm focus:ring-1 focus:ring-luxury-gold outline-none clay-card"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                disabled
                value={formData.city}
                className="w-full bg-natural-bg/50 border-none rounded-2xl py-3 px-5 text-sm outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <label className="sans-label text-emerald-deep ml-1">Select Package</label>
          <div className="grid gap-3">
            {PRODUCTS.map((product) => (
              <React.Fragment key={product.id}>
                <motion.div
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
                      </div>
                      <p className="sans-label opacity-60 lowercase mt-0.5">
                        {product.id === 'custom' ? 'Any Quantity' : `${product.units} Units`}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-emerald-deep">₹{product.id === 'custom' ? '59/kit' : product.price}</p>
                </motion.div>
                {product.id === 'custom' && selectedProduct === 'custom' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-4 pb-2">
                    <input
                      type="number"
                      placeholder="Number of packs"
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

        <div className="bg-natural-bg p-4 rounded-2xl space-y-2">
          <div className="flex justify-between text-sm">
            <span className="opacity-60">Subtotal</span>
            <span className="font-bold">₹{selectedProduct === 'custom' ? (typeof customQuantity === 'number' ? customQuantity * 59 : 0) : PRODUCTS.find(p => p.id === selectedProduct)?.price}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="opacity-60">Shipping</span>
            <span className="font-bold">₹40</span>
          </div>
          <div className="pt-2 border-t border-emerald-deep/5 flex justify-between">
            <span className="font-bold text-emerald-deep">Total</span>
            <span className="font-bold text-emerald-deep text-lg">₹{(selectedProduct === 'custom' ? (typeof customQuantity === 'number' ? customQuantity * 59 : 0) : PRODUCTS.find(p => p.id === selectedProduct)?.price || 0) + 40}</span>
          </div>
        </div>

        <motion.button
          disabled={isSubmitting}
          whileTap={{ scale: 0.95 }}
          onClick={handleOrder}
          className="w-full bg-emerald-deep text-natural-bg py-4 rounded-2xl font-bold clay-button flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Pay with UPI"}
          <CreditCard size={16} />
        </motion.button>
      </div>
    </div>
  );
}
