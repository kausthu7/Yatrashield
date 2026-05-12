import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { motion } from 'motion/react';
import { CheckCircle2, Download, Home as HomeIcon, Printer, Share2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Order } from '../types';

export default function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        if (orderDoc.exists()) {
          const data = orderDoc.data();
          setOrder({
            id: orderId,
            ...data,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
          } as Order);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `orders/${orderId}`);
      }
    };

    fetchOrder();
  }, [orderId]);

  const downloadQR = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `YATRAShield-Receipt-${orderId}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  if (!orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-natural-bg">
        <h1 className="text-2xl font-serif text-emerald-deep">Registry Entry Not Found</h1>
        <button onClick={() => navigate('/')} className="mt-4 text-luxury-gold sans-label underline">Return to Concourse</button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-soft-cream flex flex-col items-center py-12 px-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="text-emerald-deep mb-6"
      >
        <CheckCircle2 size={64} strokeWidth={1} />
      </motion.div>

      <h1 className="text-3xl text-emerald-deep font-bold mb-1 italic">Order Confirmed</h1>
      <p className="sans-label text-luxury-gold opacity-80 mb-10">Premium Service Reserved</p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full clay-card p-8 space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-deep/10" />
        
        <div className="flex justify-between items-center sans-label text-emerald-deep/40 mb-4">
          <span>Official Receipt</span>
          <span>#{orderId?.split('-')[1]}</span>
        </div>

        <div className="flex flex-col items-center p-6 bg-natural-bg clay-card" id="qr-container" ref={qrRef}>
          <div className="p-4 bg-white clay-card mb-4 border-4 border-luxury-gold/20">
            <QRCodeCanvas
              value={orderId || ''}
              size={180}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="sans-label text-emerald-deep/60">Digital verification required</p>
        </div>

        <div className="space-y-4 pt-4 border-t border-dashed border-emerald-deep/10">
          <div className="flex justify-between items-baseline">
            <span className="sans-label text-emerald-deep/40">Passenger</span>
            <span className="text-emerald-deep font-bold italic">{order?.customerName}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="sans-label text-emerald-deep/40">{order?.deliveryType === 'home' ? 'Delivery Address' : 'Service Point'}</span>
            <span className="text-emerald-deep font-semibold text-right max-w-[200px]">
              {order?.deliveryType === 'home' ? `${order.address}, ${order.pincode}` : order?.stationName}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="sans-label text-emerald-deep/40">Phone Number</span>
            <span className="text-emerald-deep font-bold">{order?.phoneNumber}</span>
          </div>
          <div className="flex justify-between items-baseline pt-4 mt-4 border-t border-emerald-deep/5">
            <span className="sans-label text-emerald-deep font-bold">Gratuity Total</span>
            <span className="text-2xl font-serif text-luxury-red">₹{order?.amount}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 w-full mt-10">
        <button
          onClick={downloadQR}
          className="flex items-center justify-center gap-2 bg-emerald-deep/5 py-4 clay-button sans-label text-emerald-deep hover:bg-emerald-deep/10 transition-colors"
        >
          <Download size={16} />
          Save e-Receipt
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 bg-emerald-deep/5 py-4 clay-button sans-label text-emerald-deep hover:bg-emerald-deep/10 transition-colors"
        >
          <Printer size={16} />
          Print Ticket
        </button>
      </div>

      <button
        onClick={() => navigate('/')}
        className="mt-12 group flex flex-col items-center gap-2"
      >
        <div className="p-3 rounded-full border border-emerald-deep/10 group-hover:bg-emerald-deep group-hover:text-white transition-all">
          <HomeIcon size={20} />
        </div>
        <span className="sans-label text-emerald-deep text-[8px] opacity-60">Return to Concourse</span>
      </button>
    </div>
  );
}
