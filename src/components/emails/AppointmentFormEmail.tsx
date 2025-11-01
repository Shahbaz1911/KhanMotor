
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
  Section,
} from '@react-email/components';
import * as React from 'react';
import { format } from 'date-fns';

interface AppointmentFormEmailProps {
  name: string;
  userEmail: string;
  preferredDate: Date;
  preferredTime: string;
  vehicleOfInterest?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

const formatTime = (time: string) => {
    if (!time || !time.includes(':')) return 'Not specified';
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return `${formattedHour}:${minute} ${ampm}`;
};


export const AppointmentFormEmail = ({
  name,
  userEmail,
  preferredDate,
  preferredTime,
  vehicleOfInterest
}: AppointmentFormEmailProps) => (
  <Html>
    <Head />
    <Preview>Motor Khan | Your Appointment Request</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://delhi.motorkhan.com/images/motorkhandarktheme.png"
          width="150"
          height="auto"
          alt="Motor Khan"
          style={logo}
        />
        <Heading style={heading}>Thanks for Your Interest, {name}!</Heading>
        <Text style={text}>
          We've received your request for a test drive appointment. We're excited to get you behind the wheel! Our team will contact you shortly at{' '}
           <Link style={link} href={`mailto:${userEmail}`}>{userEmail}</Link> to confirm your appointment details.
        </Text>
        
        <Section style={detailsSection}>
          <Heading as="h2" style={subHeading}>Your Request Summary</Heading>
          <Text style={detailItem}>
            <strong>Date:</strong> {format(preferredDate, 'PPP')}
          </Text>
          <Text style={detailItem}>
            <strong>Time:</strong> {formatTime(preferredTime)}
          </Text>
          {vehicleOfInterest && (
            <Text style={detailItem}>
              <strong>Vehicle of Interest:</strong> {vehicleOfInterest}
            </Text>
          )}
        </Section>
        
        <Text style={text}>
            If you need to make any changes to your request, please don't hesitate to contact us directly.
        </Text>
        
        <Section style={{ textAlign: 'center' }}>
            <Link
                style={button}
                href="https://motorkhan.com/contact"
                target="_blank"
            >
                Contact Us
            </Link>
        </Section>
        <Text style={text}>
            Follow us on{' '}
            <Link style={link} href="https://instagram.com/motorkhan">Instagram</Link> and{' '}
            <Link style={link} href="https://facebook.com/motorkhan">Facebook</Link>!
        </Text>
        <Text style={footer}>
          Motor Khan | Shop No 12, Vijay Vihar Phase I, Delhi, 110085
        </Text>
      </Container>
    </Body>
  </Html>
);

export default AppointmentFormEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
};

const logo = {
  margin: '0 auto',
};

const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  marginTop: '48px',
  textAlign: 'center' as const,
  color: '#1F2937',
};

const subHeading = {
  fontSize: '20px',
  fontWeight: 'bold',
  marginTop: '0px',
  marginBottom: '10px',
  textAlign: 'left' as const,
  color: '#1F2937',
}

const text = {
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  textAlign: 'center' as const,
  padding: '0 20px',
  color: '#4B5563',
};

const detailsSection = {
  backgroundColor: '#F9FAFB',
  padding: '20px',
  margin: '20px 0',
  borderTop: '1px solid #E5E7EB',
  borderBottom: '1px solid #E5E7EB',
};

const detailItem = {
    fontSize: '14px',
    lineHeight: '22px',
    margin: '8px 0',
    color: '#4B5563',
}

const link = {
  color: '#C31327',
  textDecoration: 'underline',
};

const button = {
    backgroundColor: '#C31327',
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: '12px 20px',
    margin: '20px 0',
};

const footer = {
  color: '#9CA3AF',
  fontSize: '12px',
  lineHeight: '24px',
  textAlign: 'center' as const,
};
