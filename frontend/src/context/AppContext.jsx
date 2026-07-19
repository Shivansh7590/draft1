import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { authService, cartService } from '../services';
import { getCart, saveCart } from '../lib/utils';
import { hydrateCartItems, mapServerCart, mergeCartItems } from '../lib/cartHelpers';
import { variantKey, variantsMatch } from '../lib/variantKey';

const AuthContext = createContext(null);
const CartContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .me()
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const signup = async (name, email, password) => {
    const data = await authService.signup(name, email, password);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await authService.logout().catch(() => {});
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cartReady, setCartReady] = useState(false);
  const { user, loading } = useAuth();
  const wasLoggedIn = useRef(false);

  // If a user was logged in and is now logged out, wipe the local cart so it
  // doesn't get merged into whichever account logs in next on this device.
  useEffect(() => {
    if (loading) return;

    if (user) {
      wasLoggedIn.current = true;
    } else if (wasLoggedIn.current) {
      wasLoggedIn.current = false;
      setItems([]);
      saveCart([]);
    }
  }, [user, loading]);

  // Load & hydrate local cart on mount
  useEffect(() => {
    (async () => {
      const local = getCart();
      const hydrated = await hydrateCartItems(local);
      setItems(hydrated);
      setCartReady(true);
    })();
  }, []);

  // Persist cart
  useEffect(() => {
    if (cartReady) saveCart(items);
  }, [items, cartReady]);

  // Sync with backend on login — merge local + server, then push merged cart
  useEffect(() => {
    if (!user || !cartReady) return;

    (async () => {
      try {
        const local = items;
        const { data } = await cartService.get();
        const server = mapServerCart(data.cart?.items);
        const merged = mergeCartItems(local, server);

        if (merged.length > 0) {
          await cartService.sync(merged);
        }

        const needsUpdate =
          merged.length !== local.length ||
          merged.some((m, i) => m.qty !== local[i]?.qty || m.productId !== local[i]?.productId);

        if (needsUpdate || merged.some((m) => !m.product?.slug)) {
          const hydrated = await hydrateCartItems(merged);
          setItems(hydrated);
        }
      } catch {
        // Guest or API unavailable — local cart still works
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, cartReady]);

  // Keep server cart in sync with any local changes while logged in
  useEffect(() => {
    if (!user || !cartReady) return undefined;
    const timeout = setTimeout(() => {
      cartService.sync(items).catch(() => {});
    }, 800);
    return () => clearTimeout(timeout);
  }, [items, user, cartReady]);

  const addItem = useCallback((product, variant = {}, qty = 1) => {
    setItems((prev) => {
      const key = `${product._id}-${variantKey(variant)}`;
      const existing = prev.find((i) => `${i.productId}-${variantKey(i.variant)}` === key);
      if (existing) {
        return prev.map((i) =>
          `${i.productId}-${variantKey(i.variant)}` === key ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          product,
          variant,
          qty,
          price: product.price + (variant.priceModifier || 0),
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId, variant = {}) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && variantsMatch(i.variant, variant)))
    );
  }, []);

  const updateQty = useCallback((productId, variant, qty) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && variantsMatch(i.variant, variant) ? { ...i, qty } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const cartTotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartReady,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export const useCart = () => useContext(CartContext);
