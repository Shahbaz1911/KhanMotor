
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookAppointmentPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl md:text-4xl font-kajiro md:font-headline">Schedule Your Test Drive</CardTitle>
          <CardDescription className="text-md md:text-lg">
            Choose your preferred date and time. We&apos;re excited to get you behind the wheel!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentForm />
        </CardContent>
      </Card>
    </div>
  );
}
