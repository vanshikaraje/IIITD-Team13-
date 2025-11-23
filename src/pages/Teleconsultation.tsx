import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Video, Loader2, CheckCircle, CalendarDays, AlertTriangle } from 'lucide-react';
import Navbar from '@/components/Navbar';

// --- TYPE AND DATA DEFINITIONS (UNCHANGED) ---
type Doctor = {
  id: number;
  name: string;
  specialization: string;
  qualifications: string[];
  experience: number;
  availableSlots: string[];
};

const nearbyDoctors: Doctor[] = [
  { id: 1, name: 'Dr. Priya Sharma', specialization: 'Cardiologist', qualifications: ['MD', 'DM (Cardiology)'], experience: 12, availableSlots: ['10:00 AM', '10:30 AM', '11:00 AM'] },
  { id: 2, name: 'Dr. Rahul Verma', specialization: 'Dermatologist', qualifications: ['MBBS', 'MD (Dermatology)'], experience: 8, availableSlots: ['02:00 PM', '02:30 PM'] },
  { id: 3, name: 'Dr. Anjali Singh', specialization: 'Pediatrician', qualifications: ['MBBS', 'DCH'], experience: 15, availableSlots: ['04:00 PM', '04:30 PM', '05:00 PM'] },
  { id: 4, name: 'Dr. Sameer Gupta', specialization: 'General Physician', qualifications: ['MBBS', 'MD (General Medicine)'], experience: 10, availableSlots: ['09:00 AM', '09:30 AM', '11:30 AM'] },
  { id: 5, name: 'Dr. Meera Desai', specialization: 'Gynecologist', qualifications: ['MBBS', 'MS (Obs & Gyn)'], experience: 18, availableSlots: ['11:00 AM', '11:30 AM', '12:00 PM'] },
  { id: 6, name: 'Dr. Vikram Rathore', specialization: 'Orthopedic Surgeon', qualifications: ['MBBS', 'MS (Ortho)'], experience: 14, availableSlots: ['03:00 PM', '03:30 PM'] },
  { id: 7, name: 'Dr. Sunita Reddy', specialization: 'Neurologist', qualifications: ['MD', 'DM (Neurology)'], experience: 9, availableSlots: ['01:00 PM', '01:30 PM'] },
  { id: 8, name: 'Dr. Alok Nath', specialization: 'ENT Specialist', qualifications: ['MBBS', 'MS (ENT)'], experience: 11, availableSlots: ['05:00 PM', '05:30 PM'] },
];

type BookingConfirmation = {
  doctor: Doctor;
  time: string;
  meetLink: string; // Added a permanent meeting link
};

const Teleconsultation = () => {
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);
  const [isBooking, setIsBooking] = useState<{ doctorId: number; time: string } | null>(null);

  // --- NEW STATES FOR THE VIDEO CALL FLOW ---
  const [callInProgress, setCallInProgress] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- This function now only books the appointment ---
  const handleBookAppointment = async (doctor: Doctor, time: string) => {
    setIsBooking({ doctorId: doctor.id, time });
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create a new booking confirmation with a simulated permanent link
    setBookingConfirmation({
      doctor,
      time,
      meetLink: 'https://meet.google.com/xyz-abc-def' // Placeholder Google Meet link
    });
    setIsBooking(null);
  };

  // --- NEW: This function handles joining the call and requesting permissions ---
  const handleJoinCall = async () => {
    setCameraError(null); // Reset any previous errors

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError("Your browser does not support video calls. Please try a different browser.");
      return;
    }

    // Request camera and microphone access every time the button is clicked.
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCallInProgress(true); // Move to the video call screen
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError("Camera and microphone access was denied. To join the call, you must allow permissions in your browser settings.");
      } else {
        setCameraError(`An unexpected error occurred: ${err.name}. Please ensure your camera isn't being used by another app.`);
      }
    }
  };

  // --- NEW: Function to leave the video call ---
  const handleLeaveCall = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop()); // Important: This turns off the camera light
    }
    setCallInProgress(false);
    setCameraError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">

        {!bookingConfirmation ? (
          // --- 1. DOCTOR LIST SCREEN (UNCHANGED) ---
          <>
            <div className="mb-12 animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Teleconsultation</h1>
              <p className="text-muted-foreground text-lg">Book an appointment with a specialist.</p>
            </div>
            <div className="space-y-8">
              {nearbyDoctors.map(doctor => (
                <Card key={doctor.id} className="animate-slide-up" style={{ animationDelay: `${doctor.id * 0.1}s` }}>
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
        ) : !callInProgress ? (
          // --- 2. BOOKING CONFIRMATION SCREEN ---
          <div className="text-center animate-slide-up">
            <Card className="max-w-lg mx-auto">
              <CardHeader>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-3xl">Appointment Booked!</CardTitle>
                <CardDescription className="text-base">Your appointment has been confirmed and is scheduled for today.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-left p-4 border rounded-lg bg-gray-50">
                  <p><strong>Doctor:</strong> {bookingConfirmation.doctor.name}</p>
                  <p><strong>Time:</strong> {bookingConfirmation.time} Today</p>
                  <p><strong>Meet Link:</strong> <a href={bookingConfirmation.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{bookingConfirmation.meetLink}</a></p>
                </div>

                {/* --- JOIN CALL BUTTON --- */}
                <Button onClick={handleJoinCall} size="lg">
                  <Video className="mr-2 h-5 w-5" /> Join Call Now
                </Button>

                {/* --- CAMERA ERROR DISPLAY --- */}
                {cameraError && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-start gap-3 text-left">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                    <p className="font-semibold">{cameraError}</p>
                  </div>
                )}

                <Button variant="link" onClick={() => setBookingConfirmation(null)}>Book Another Appointment</Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // --- 3. VIDEO CALL SCREEN ---
          <div className="text-center animate-slide-up">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Connecting to {bookingConfirmation.doctor.name}...</CardTitle>
                <CardDescription>You should see your face from the camera below. Please wait for the doctor to join.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-black rounded-lg mb-4 aspect-video flex items-center justify-center text-white">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full rounded-lg" />
                </div>
                <Button onClick={handleLeaveCall} variant="destructive" size="lg">Leave Call</Button>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
};

export default Teleconsultation;
