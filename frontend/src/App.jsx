import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, CartProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ConsumerProducts from './pages/ConsumerProducts';
import CorporateOrders from './pages/CorporateOrders';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import Orders from './pages/Orders';
import About from './pages/About';
import Contact from './pages/Contact';
import JoinUs from './pages/JoinUs';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: { borderRadius: '12px', background: '#17181A', color: '#F4F2EE' },
            }}
          />
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="consumer" element={<ConsumerProducts />} />
              <Route path="corporate" element={<CorporateOrders />} />
              <Route path="products/:slug" element={<ProductDetail />} /> {/* universal product page */}
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="account" element={<Account />} />
              <Route path="orders" element={<Orders />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="join-us" element={<JoinUs />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
