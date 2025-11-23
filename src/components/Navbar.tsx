import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from "@/contexts/LocationContext";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, LifeBuoy, CreditCard, Siren, Video, ShoppingCart, Package, MapPin, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import LocationMap from './LocationMap';

// A simple WhatsApp icon component
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { city, coordinates, isLoading: isLocationLoading } = useLocation();
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const getInitials = (email: string) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* FIX: The Medy-Era logo/name div has been removed. An empty div is used as a placeholder to maintain layout. */}
          <div></div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Location Map Trigger */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border">
                  {isLocationLoading && !city ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <MapPin className="w-4 h-4 text-primary" />
                  )}
                  <span>{city || (isLocationLoading ? 'Detecting...' : 'Location')}</span>
                </Button>
              </DialogTrigger>
              {coordinates && city && (
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>Your Current Location</DialogTitle>
                    <DialogDescription>
                      This is your approximate location. Nearby pharmacies are marked in red.
                    </DialogDescription>
                  </DialogHeader>
                  <LocationMap lat={coordinates.lat} lon={coordinates.lon} cityName={city} />
                </DialogContent>
              )}
            </Dialog>

            <Button variant="ghost" onClick={() => navigate('/shop')}>
              <ShoppingCart className="w-5 h-5 mr-0 md:mr-2" />
              <span className="hidden md:inline">Shop</span>
            </Button>

            {user ? (
              <>
                <div className="text-center">
                  <Button
                    onClick={() => setIsEmergencyModalOpen(true)}
                    className="relative w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/40"
                  >
                    <Siren className="w-5 h-5" />
                  </Button>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">
                          {getInitials(user.email || '')}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">My Account</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/orders')}>
                        <Package className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/billing')}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Support</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-primary to-primary-glow"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Emergency Modal */}
      <Dialog open={isEmergencyModalOpen} onOpenChange={setIsEmergencyModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Siren className="w-6 h-6 text-red-600" />
              Emergency Assistance
            </DialogTitle>
            <DialogDescription>
              Please choose one of the options below for immediate help. Use these options only in a genuine emergency.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Consult Nearby Store</h3>
              <p className="text-sm text-muted-foreground mb-3">Get in touch with a 24/7 available pharmacy for urgent medicine needs.</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                  <div>
                    <p className="font-mono text-sm">Pharmacy 1</p>
                    <p className="font-mono text-xs text-muted-foreground">+91 8882471904</p>
                  </div>
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <a href="https://wa.me/918882471904" target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon />
                      Call Now
                    </a>
                  </Button>
                </div>
                <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                  <div>
                    <p className="font-mono text-sm">Pharmacy 2</p>
                    <p className="font-mono text-xs text-muted-foreground">+91 9797781785</p>
                  </div>
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <a href="https://wa.me/919797781785" target="_blank" rel="noopener noreferrer">
                      <WhatsAppIcon />
                      Call Now
                    </a>
                  </Button>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">Consult Nearby Doctor</h3>
              <p className="text-sm text-muted-foreground mb-3">Start an instant video call with an on-duty doctor for emergency consultation.</p>
              <div className="flex justify-between items-center bg-muted p-2 rounded-md">
                <div>
                  <p className="font-mono text-sm">Dr. Avinash Reddy</p>
                  <p className="font-mono text-xs text-muted-foreground">General Physician (On-Call)</p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer">
                    <Video className="mr-2 h-4 w-4" />
                    Instant Consult
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Navbar;
