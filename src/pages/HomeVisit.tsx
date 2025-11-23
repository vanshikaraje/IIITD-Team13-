import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Loader2, CheckCircle, ShieldCheck, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';

// --- TYPE AND DATA FOR HOME VISIT DOCTORS ---
type HomeDoctor = {
  id: number;
  name: string;
  specialization: string;
  qualifications: string[];
  experience: number;
  homeVisitFee: number; // Specific fee for home visits
  availableSlots: string[];
};

const homeVisitDoctors: HomeDoctor[] = [
  { id: 1, name: 'Dr. Sameer Gupta', specialization: 'General Physician', qualifications: ['MBBS', 'MD'], experience: 10, homeVisitFee: 1500, availableSlots: ['11:00 AM', '01:00 PM'] },
  { id: 2, name: 'Dr. Anjali Singh', specialization: 'Pediatrician', qualifications: ['MBBS', 'DCH'], experience: 15, homeVisitFee: 1800, availableSlots: ['10:00 AM', '12:00 PM'] },
  { id: 3, name: 'Dr. Vikram Rathore', specialization: 'Orthopedic Support', qualifications: ['MBBS', 'MS (Ortho)'], experience: 14, homeVisitFee: 2000, availableSlots: ['03:00 PM'] },
];

type BookingConfirmation = {
  doctor: HomeDoctor;
  time: string;
};

const HomeVisit = () => {
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);
  const [isBooking, setIsBooking] = useState<{ doctorId: number; time: string } | null>(null);

  const handleBookAppointment = async (doctor: HomeDoctor, time: string) => {
    setIsBooking({ doctorId: doctor.id, time });
    await new Promise(resolve => setTimeout(resolve, 2000));
    setBookingConfirmation({ doctor, time });
    setIsBooking(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-green-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">

        {!bookingConfirmation ? (
          <>
            <div className="mb-8 animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Request a Home Visit</h1>
              <p className="text-muted-foreground text-lg">Have a qualified doctor visit you at your home.</p>
            </div>

            {/* --- TERMS AND CONDITIONS CARD --- */}
            <Card className="mb-8 bg-amber-50 border-amber-200 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="flex flex-row items-start gap-4">
                <ShieldCheck className="w-8 h-8 text-amber-600 flex-shrink-0" />
                <div>
                  <CardTitle>Terms & Conditions for Home Visits</CardTitle>
                  <CardDescription>Your safety and trust are our top priority.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  <li>A valid government-issued ID for the patient is required for verification before the visit.</li>
                  <li>The home visit fee must be paid in advance to confirm the booking.</li>
                  <li>Our doctors are fully verified and will carry an official ID.</li>
                  <li>Please ensure a safe and appropriate environment for the doctor's visit.</li>
                </ul>
              </CardContent>
            </Card>

            {/* --- DOCTOR LIST --- */}
            <div className="space-y-8">
              {homeVisitDoctors.map((doctor, index) => (
                <Card key={doctor.id} className="animate-slide-up" style={{ animationDelay: `${(index + 2) * 0.1}s` }}>
                  <CardHeader className="flex flex-row items-center gap-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div>
                      <CardTitle className="text-2xl">{doctor.name}</CardTitle>
                      <CardDescription className="text-base">{doctor.specialization} | {doctor.experience} years experience</CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <span>{doctor.qualifications.join(', ')}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-lg font-bold">Home Visit Fee: <span className="text-primary">₹{doctor.homeVisitFee}</span></p>
                    </div>
                    <h4 className="font-semibold mb-3">Available Today:</h4>
                    <div className="flex flex-wrap gap-2">
                      {doctor.availableSlots.map(slot => (
                        <Button key={slot} variant="outline" onClick={() => handleBookAppointment(doctor, slot)} disabled={!!isBooking}>
                          {isBooking?.doctorId === doctor.id && isBooking?.time === slot ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Booking...</> : slot}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          // --- BOOKING CONFIRMATION SCREEN ---
          <div className="text-center animate-slide-up">
            <Card className="max-w-lg mx-auto">
              <CardHeader>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-3xl">Home Visit Booked!</CardTitle>
                <CardDescription className="text-base">Your appointment has been confirmed.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-left p-4 border rounded-lg bg-gray-50">
                  <p><strong>Doctor:</strong> {bookingConfirmation.doctor.name}</p>
                  <p><strong>Time:</strong> {bookingConfirmation.time} Today</p>
                  <p><strong>Visit Fee:</strong> ₹{bookingConfirmation.doctor.homeVisitFee} (to be paid)</p>
                </div>
                <p className="text-sm text-muted-foreground">Our team will contact you shortly for verification and payment to confirm your appointment.</p>
                <Button onClick={() => setBookingConfirmation(null)}>Book Another Visit</Button>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
};

export default HomeVisit;