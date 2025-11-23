import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus, X, CheckCircle, CreditCard, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// --- IMPORT ONLY YOUR SINGLE IMAGE ---
import paracetamolImg from '@/assets/paracetamol.jpg';

// --- TYPE DEFINITIONS FOR SHOP ---
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

type CartItem = Product & {
  quantity: number;
};

// --- USE THE SAME IMAGE FOR ALL PRODUCTS ---
const medicineProducts: Product[] = [
  { id: 1, name: 'Paracetamol 650mg', description: 'For fever and pain relief (15 tablets)', price: 30.25, image: paracetamolImg },
  { id: 2, name: 'Cetirizine 10mg', description: 'For allergy relief (10 tablets)', price: 25.50, image: paracetamolImg },
  { id: 3, name: 'Ondansetron 4mg', description: 'For nausea and vomiting (10 tablets)', price: 55.00, image: paracetamolImg },
  { id: 4, name: 'ORS Powder', description: 'Oral Rehydration Salts (21.8g sachet)', price: 20.00, image: paracetamolImg },
  { id: 5, name: 'Antacid Gel', description: 'For heartburn and indigestion (170ml bottle)', price: 85.75, image: paracetamolImg },
  { id: 6, name: 'Band-Aid Pack', description: 'Assorted waterproof bandages (20 strips)', price: 45.00, image: paracetamolImg },
];

// --- NEW: TYPE FOR CHECKOUT STEPS ---
type CheckoutStep = 'confirm' | 'processing' | 'complete';

const Shop = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('confirm');

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, amount: number) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      );
      return updatedCart;
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // --- NEW: SIMULATED PAYMENT FUNCTION ---
  const handlePayment = async () => {
    setCheckoutStep('processing');
    console.log('--- SIMULATING BACKEND PAYMENT FLOW ---');
    console.log('STEP 1: Sending cart details to backend to create payment intent...', { cart, total: cartTotal });
    
    // Simulate network delay for backend processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    console.log('STEP 2: Backend confirms payment intent. Frontend would now redirect to payment gateway (e.g., Stripe, Razorpay).');
    console.log('STEP 3: Simulating successful payment confirmation callback from gateway...');

    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('--- PAYMENT SUCCESSFUL --- ');
    setCheckoutStep('complete');
    setCart([]); // Clear the cart after successful order
  };

  const openCheckout = () => {
    setCheckoutStep('confirm'); // Reset to confirm step every time
    setIsCheckoutOpen(true);
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-8 animate-slide-up">Shop General Medicines</h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicineProducts.map((product, index) => (
                <Card key={product.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.05}s` }}>
                  <CardHeader className="p-0">
                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-t-md" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg h-12 mb-2">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-4 h-10">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-xl font-bold">₹{product.price.toFixed(2)}</p>
                      <Button size="sm" onClick={() => handleAddToCart(product)}>
                        <ShoppingCart className="w-4 h-4 mr-2" /> Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Shopping Cart */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  Your Cart
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Your cart is empty.</p>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">₹{item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, -1)}><Minus className="w-4 h-4" /></Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, 1)}><Plus className="w-4 h-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => handleRemoveFromCart(item.id)}><X className="w-4 h-4" /></Button>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-4 mt-4 space-y-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                      </div>
                      <Button className="w-full" onClick={openCheckout} disabled={cart.length === 0}>
                        <CreditCard className="w-4 h-4 mr-2" /> Proceed to Payment
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* --- NEW: MULTI-STEP CHECKOUT DIALOG --- */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent>
          {checkoutStep === 'confirm' && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Confirm Your Order</DialogTitle>
                <DialogDescription>Review your items before proceeding to payment.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="border rounded-md p-4 bg-muted/50 max-h-48 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm mb-1">
                      <span>{item.name} x {item.quantity}</span>
                      <span className="font-mono">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-lg mt-4 border-t pt-2">
                  <span>Total to Pay:</span>
                  <span className="font-mono">₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>Cancel</Button>
                <Button onClick={handlePayment}>Pay Now</Button>
              </DialogFooter>
            </>
          )}

          {checkoutStep === 'processing' && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">Processing Payment</DialogTitle>
                <DialogDescription>Please wait... Do not close this window.</DialogDescription>
              </DialogHeader>
              <div className="py-16 flex justify-center items-center gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-lg text-muted-foreground">Connecting securely...</p>
              </div>
            </>
          )}

          {checkoutStep === 'complete' && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  Order Placed!
                </DialogTitle>
                <DialogDescription>Your payment was successful and your order is on its way.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-center text-muted-foreground">Your order will be delivered in 10-20 minutes.</p>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsCheckoutOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shop;
