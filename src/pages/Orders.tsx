import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, CheckCircle } from 'lucide-react';

// --- DUMMY DATA FOR ORDERS ---
const currentOrder = {
  id: 'MED-Y-00782',
  date: 'Today',
  status: 'Out for Delivery',
  items: [
    { name: 'Paracetamol 650mg', quantity: 1 },
    { name: 'Antacid Gel', quantity: 1 },
  ],
  total: 116.00,
};

const pastOrders = [
  {
    id: 'MED-Y-00751',
    date: 'Yesterday',
    status: 'Delivered',
    items: [
      { name: 'Band-Aid Pack', quantity: 1 },
    ],
    total: 45.00,
  },
  {
    id: 'MED-Y-00734',
    date: '2 days ago',
    status: 'Delivered',
    items: [
      { name: 'Cetirizine 10mg', quantity: 2 },
      { name: 'ORS Powder', quantity: 5 },
    ],
    total: 151.00,
  },
];

const Orders = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground text-lg">Track your current and past orders.</p>
        </div>

        {/* --- CURRENT ORDER --- */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Current Order</h2>
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Order #{currentOrder.id}</span>
                <Badge className="bg-amber-500 text-white">
                  <Truck className="w-4 h-4 mr-2" />
                  {currentOrder.status}
                </Badge>
              </CardTitle>
              <CardDescription>Placed: {currentOrder.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentOrder.items.map(item => (
                  <div key={item.name} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>₹{currentOrder.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- PAST ORDERS --- */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Past Orders</h2>
          <div className="space-y-6">
            {pastOrders.map((order, index) => (
              <Card key={order.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Order #{order.id}</span>
                    <Badge variant="secondary">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      {order.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Placed: {order.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {order.items.map(item => (
                      <div key={item.name} className="flex justify-between text-sm">
                        <span>{item.name} x {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Orders;