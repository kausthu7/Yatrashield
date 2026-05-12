import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Loader2, ArrowLeft, ShieldCheck, User } from 'lucide-react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Order } from '../types';
import { useNavigate } from 'react-router-dom';

export default function Verify() {
  const navigate = useNavigate();
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'notFound' | 'alreadyDelivered'>('idle');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    scannerRef.current = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA]
      },
      false
    );

    scannerRef.current.render(onScanSuccess, onScanFailure);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, []);

  async function onScanSuccess(decodedText: string) {
    if (status === 'loading' || isUpdating) return;
    
    setScannedResult(decodedText);
    setStatus('loading');
    
    try {
      const orderDoc = await getDoc(doc(db, 'orders', decodedText));
      if (orderDoc.exists()) {
        const data = orderDoc.data();
        const fetchedOrder = {
          id: decodedText,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Order;
        
        setOrder(fetchedOrder);
        if (fetchedOrder.status === 'delivered') {
          setStatus('alreadyDelivered');
        } else {
          setStatus('success');
        }
      } else {
        setStatus('notFound');
      }
    } catch (error) {
      console.error(error);
      setStatus('notFound');
    }
  }

  function onScanFailure(error: any) {
    // Silently handle scan errors
  }

  const markAsDelivered = async () => {
    if (!order || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status: 'delivered',
        updatedAt: serverTimestamp(),
      });
      setOrder({ ...order, status: 'delivered' });
      setStatus('success');
      alert('Order marked as Delivered successfully!');
      resetScanner();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${order.id}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const resetScanner = () => {
    setScannedResult(null);
    setOrder(null);
    setStatus('idle');
  };

  return (
    <div className="min-h-screen bg-deep-olive text-natural-bg flex flex-col p-6 font-sans">
      <header className="flex items-center justify-between mb-8">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full transition-colors text-natural-bg">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2 text-luxury-gold">
          <ShieldCheck size={20} />
          <span className="sans-label text-luxury-gold">Staff Verification</span>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-grow flex flex-col items-center">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div
                key="scanner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl italic mb-2 text-natural-bg">Scan Registry QR</h2>
                  <p className="text-natural-bg/40 text-sm">Align the customer's digital receipt within the frame</p>
                </div>
                <div id="reader" className="overflow-hidden clay-card bg-black"></div>
              </motion.div>
            )}

            {(status === 'loading') && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <Loader2 className="w-12 h-12 text-luxury-gold animate-spin mb-4" />
                <p className="sans-label text-luxury-gold/60">Verifying Credentials...</p>
              </motion.div>
            )}

            {(status === 'success' || status === 'alreadyDelivered') && order && (
              <motion.div
                key="result-success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full clay-card p-8 border border-white/10"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-natural-bg flex items-center justify-center text-emerald-deep clay-button">
                    <CheckCircle2 size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="sans-label text-emerald-deep/40 mb-1">Authenticated Ticket</div>
                    <div className="text-lg font-bold font-serif italic">{order.id}</div>
                  </div>
                </div>

                <div className="space-y-4 py-8 border-y border-emerald-deep/5 mb-8">
                  <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-2 sans-label text-emerald-deep/40">
                      <User size={14} />
                      <span>Passenger</span>
                    </div>
                    <span className="font-bold text-emerald-deep">{order.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center px-2 text-sm">
                    <span className="sans-label text-emerald-deep/40">Phone Number</span>
                    <span className="font-bold">{order.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <span className="sans-label text-emerald-deep/40">State</span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-luxury-gold/10 text-luxury-gold'
                    )}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {order.status === 'pending' ? (
                  <button
                    onClick={markAsDelivered}
                    disabled={isUpdating}
                    className="w-full bg-emerald-deep text-natural-bg py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 clay-button active:scale-95"
                  >
                    {isUpdating ? <Loader2 className="animate-spin" /> : <><span className="sans-label">Complete Delivery</span><ShieldCheck size={18} /></>}
                  </button>
                ) : (
                  <button
                    onClick={resetScanner}
                    className="w-full bg-emerald-deep/5 hover:bg-emerald-deep/10 text-emerald-deep py-5 rounded-2xl font-bold transition-all sans-label clay-button"
                  >
                    Return to Scanner
                  </button>
                )}
                
                {order.status === 'pending' && (
                  <button onClick={resetScanner} className="w-full mt-6 sans-label text-emerald-deep/40 underline text-[8px]">
                    Cancel & Rescan
                  </button>
                )}
              </motion.div>
            )}

            {status === 'notFound' && (
              <motion.div
                key="result-fail"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 w-full"
              >
                <XCircle className="w-20 h-20 text-luxury-red mb-6 opacity-80" />
                <h3 className="text-xl font-serif italic mb-2">Registry Mismatch</h3>
                <p className="text-natural-bg/40 text-center mb-10 px-10 text-sm">This entry does not exist in our YATRA Shield record systems.</p>
                <button
                  onClick={resetScanner}
                  className="bg-white/5 border border-white/10 px-10 py-4 clay-button sans-label transition-all active:scale-95"
                >
                  Return to Scanner
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="text-center text-natural-bg/20 sans-label mt-12 py-4">
        Official YATRA Shield Logistics • Intranet v4.2
      </footer>
    </div>
  );
}
