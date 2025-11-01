
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

interface ContactFormEmailProps {
  name: string;
  userEmail: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const ContactFormEmail = ({
  name,
  userEmail,
}: ContactFormEmailProps) => (
  <Html>
    <Head />
    <Preview>Motor Khan | Thank You for Your Inquiry</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://delhi.motorkhan.com/images/motorkhandarktheme.png"
          width="150"
          height="auto"
          alt="Motor Khan"
          style={logo}
        />
        <Heading style={heading}>Thank You for Contacting Us, {name}!</Heading>
        <Text style={text}>
          We have successfully received your message. Our team is reviewing your inquiry and will get back to you at{' '}
          <Link style={link} href={`mailto:${userEmail}`}>{userEmail}</Link> as soon as possible.
        </Text>
        <Section style={infoSection}>
          <Text style={infoText}>
            While you wait, feel free to explore our collection of premium vehicles or learn more about our services.
          </Text>
        </Section>
        <Section style={{ textAlign: 'center' }}>
            <Link
                style={button}
                href="https://motorkhan.com/gallery"
                target="_blank"
            >
                View Our Cars
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

export default ContactFormEmail;

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

const text = {
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  textAlign: 'center' as const,
  padding: '0 20px',
  color: '#4B5563',
};

const infoSection = {
  backgroundColor: '#F9FAFB',
  padding: '20px',
  margin: '20px 0',
  borderTop: '1px solid #E5E7EB',
  borderBottom: '1px solid #E5E7EB',
};

const infoText = {
  fontSize: '14px',
  lineHeight: '22px',
  textAlign: 'center' as const,
  color: '#4B5563',
};

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
