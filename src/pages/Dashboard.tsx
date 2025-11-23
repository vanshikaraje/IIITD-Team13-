import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Video, Home, MapPin, Loader2, CheckCircle, Pill } from 'lucide-react';
import Navbar from '@/components/Navbar';

type MedicineInfo = { name: string; quantity: number; price: number; };
type OrderRequest = { userId: string; latitude: number; longitude: number; detectedCity: string; medicines: MedicineInfo[]; totalPrice: number; timestamp: Date; prescriptionFile: File; };

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState<string>('Please upload a prescription to start.');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [suggestedMedicines, setSuggestedMedicines] = useState<MedicineInfo[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCityFromCoords = async (lat: number, lon: number): Promise<string> => { try { const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`); const data = await response.json(); const adr = data.address; return adr.city || adr.town || adr.village || adr.county || 'Unknown Area'; } catch { return 'Unknown Area'; } };
  const processOrder = (selectedFile: File) => { setIsLoading(true); setDetectedLocation(null); setSuggestedMedicines([]); setTotalPrice(0); setOrderStatus(`Analyzing prescription '${selectedFile.name}' and finding best prices...`); const simulatedAnalysisResult: MedicineInfo[] = [ { name: 'Telma 40mg', quantity: 15, price: 180.50 }, { name: 'Rosuvas 10mg', quantity: 15, price: 255.00 }, { name: 'Paracetamol 650mg (Calpol)', quantity: 15, price: 30.25 }, ]; const total = simulatedAnalysisResult.reduce((sum, item) => sum + item.price, 0); setSuggestedMedicines(simulatedAnalysisResult); setTotalPrice(total); if (!navigator.geolocation) { setIsLoading(false); setOrderStatus('Geolocation is not supported.'); return; } navigator.geolocation.getCurrentPosition( async (position) => { const { latitude, longitude } = position.coords; const detectedCity = await getCityFromCoords(latitude, longitude); const orderRequest: OrderRequest = { userId: user!.id, latitude, longitude, detectedCity, medicines: simulatedAnalysisResult, totalPrice: total, timestamp: new Date(), prescriptionFile: selectedFile, }; console.log('--- FINAL ORDER REQUEST SENT TO BACKEND ---'); console.log(orderRequest); setDetectedLocation(`Delivery Location: ${detectedCity}`); setOrderStatus('Quote Received! Your order is ready.'); setIsLoading(false); }, (error) => { setOrderStatus(`Location Error: ${error.message}.`); setIsLoading(false); }, { enableHighAccuracy: true, timeout: 15000 } ); };
  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) { processOrder(file); } };
  const handleUploadClick = () => { setSuggestedMedicines([]); setOrderStatus('Please upload a prescription to start.'); fileInputRef.current?.click(); };

  const actions = [
    { icon: Upload, title: 'Upload Prescription', description: 'Get an instant quote and place your order for delivery.', cta: 'Upload and Get Quote', color: 'text-primary', action: handleUploadClick, },
    { icon: Video, title: 'Teleconsultation', description: 'Connect with doctors instantly.', cta: 'Start Consultation', color: 'text-secondary', action: () => navigate('/teleconsultation'), },
    {
      icon: Home,
      title: 'Request Home Visit',
      description: 'Schedule a doctor visit at your home.',
      cta: 'Book Visit',
      color: 'text-accent',
      action: () => navigate('/home-visit'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <input type="file" ref={fileInputRef} onChange={handleFileSelected} style={{ display: 'none' }} accept="image/*,application/pdf" capture="environment" />
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground text-lg">{user?.email}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {actions.map((action, index) => ( <ActionCard key={index} {...action} index={index} isLoading={isLoading && action.title === 'Upload Prescription'} /> ))}
        </div>
        <Card className="mt-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <CardHeader> <CardTitle>Recent Activity</CardTitle> </CardHeader>
          <CardContent>
            {isLoading ? ( <div className="text-center py-12 text-muted-foreground flex flex-col items-center justify-center gap-4"> <Loader2 className="w-12 h-12 animate-spin text-primary" /> <p className="text-lg">{orderStatus}</p> </div> ) : suggestedMedicines.length > 0 ? ( <div className="space-y-6"> <div className="text-center"> <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" /> <p className="text-lg font-semibold">{orderStatus}</p> {detectedLocation && ( <p className="text-sm text-muted-foreground">{detectedLocation}</p> )} </div> <div> <h4 className="font-semibold mb-3 text-lg">Order Summary:</h4> <ul className="divide-y divide-gray-200 border rounded-lg p-4 bg-gray-50"> {suggestedMedicines.map(med => ( <li key={med.name} className="flex justify-between items-center py-3"> <div className="flex items-center gap-3"> <Pill className="w-5 h-5 text-primary"/> <span>{med.name} (x{med.quantity})</span> </div> <span className="font-mono font-semibold">₹{med.price.toFixed(2)}</span> </li> ))} <li className="flex justify-between items-center py-3 font-bold text-lg border-t-2 border-gray-300 mt-2"> <span>Total Minimum Price</span> <span className="font-mono">₹{totalPrice.toFixed(2)}</span> </li> </ul> </div> <p className="text-center text-sm text-muted-foreground pt-4">(Your order will be dispatched from the nearest pharmacy with these items in stock)</p> </div> ) : ( <div className="text-center py-12 text-muted-foreground"> <p className="text-lg">{orderStatus}</p> </div> )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const ActionCard = ({ icon: Icon, title, description, cta, color, action, index, isLoading }: any) => ( <Card className="border-2 hover:border-primary/50 transition-all duration-300 animate-slide-up overflow-hidden group"> <CardHeader> <div className={`w-16 h-16 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}> <Icon className={`w-8 h-8 ${color}`} /> </div> <CardTitle className="text-2xl">{title}</CardTitle> <CardDescription>{description}</CardDescription> </CardHeader> <CardContent> <Button className="w-full bg-gradient-to-r from-primary to-primary-glow mt-4" onClick={action} disabled={isLoading}> {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : cta} </Button> </CardContent> </Card> );
export default Dashboard;
