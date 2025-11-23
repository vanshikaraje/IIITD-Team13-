import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IndianRupee, Plus, Minus } from 'lucide-react';

// --- DUMMY DATA FOR TRANSACTIONS ---
const transactions = [
  {
    id: 1,
    type: 'Order Payment',
    description: 'Order #MED-Y-00782',
    amount: -116.00,
    date: 'Today',
  },
  {
    id: 2,
    type: 'Order Payment',
    description: 'Order #MED-Y-00751',
    amount: -45.00,
    date: 'Yesterday',
  },
    {
    id: 3,
    type: 'Funds Added',
    description: 'Credit via UPI',
    amount: 500.00,
    date: '2 days ago',
  },
  {
    id: 4,
    type: 'Order Payment',
    description: 'Order #MED-Y-00734',
    amount: -151.00,
    date: '2 days ago',
  },
];

const currentBalance = transactions.reduce((acc, t) => acc + t.amount, 0);

const Billing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Billing</h1>
          <p className="text-muted-foreground text-lg">Manage your payments and transaction history.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* --- BALANCE CARD --- */}
          <div className="md:col-span-1">
            <Card className="animate-fade-in sticky top-24">
              <CardHeader>
                <CardTitle>Medy-Era Wallet</CardTitle>
                <CardDescription>Your current balance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold mb-6">₹{currentBalance.toFixed(2)}</p>
                <Button className="w-full" disabled>
                  <Plus className="w-4 h-4 mr-2" /> Add Funds
                </Button>
                 <p className="text-xs text-muted-foreground text-center mt-2">Feature coming soon</p>
              </CardContent>
            </Card>
          </div>

          {/* --- TRANSACTION HISTORY --- */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
            <Card className="animate-slide-up">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {transactions.map(t => (
                    <div key={t.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.amount > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                          {t.amount > 0 ? <Plus className="w-5 h-5 text-green-600" /> : <Minus className="w-5 h-5 text-red-600" />}
                        </div>
                        <div>
                          <p className="font-semibold">{t.type}</p>
                          <p className="text-sm text-muted-foreground">{t.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${t.amount > 0 ? 'text-green-600' : ''}`}>
                          {t.amount > 0 ? `+₹${t.amount.toFixed(2)}` : `-₹${Math.abs(t.amount).toFixed(2)}`}
                        </p>
                        <p className="text-sm text-muted-foreground">{t.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;