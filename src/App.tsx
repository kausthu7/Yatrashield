/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './routes/Landing';
import Order from './routes/Order';
import HomeDelivery from './routes/HomeDelivery';
import Success from './routes/Success';
import Verify from './routes/Verify';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-soft-cream selection:bg-luxury-gold/30">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/order" element={<Order />} />
          <Route path="/home-delivery" element={<HomeDelivery />} />
          <Route path="/success" element={<Success />} />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
