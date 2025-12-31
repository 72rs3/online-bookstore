const CART_KEY = 'cart';

const readCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const addToCart = (book) => {
  const cart = readCart();
  const existing = cart.find(item => item.id === book.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: book.id,
      title: book.title,
      price: Number(book.price) || 0,
      coverImage: book.coverImage,
      author: book.author,
      qty: 1
    });
  }
  writeCart(cart);
  return cart;
};

export const updateQty = (id, qty) => {
  const cart = readCart().map(item => item.id === id ? { ...item, qty: Math.max(1, qty) } : item);
  writeCart(cart);
  return cart;
};

export const removeFromCart = (id) => {
  const cart = readCart().filter(item => item.id !== id);
  writeCart(cart);
  return cart;
};

export const clearCart = () => writeCart([]);

export const getCart = () => readCart();
