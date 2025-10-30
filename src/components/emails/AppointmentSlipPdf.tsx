
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';

interface AppointmentSlipPdfProps {
  name: string;
  preferredDate: Date;
  preferredTime: string;
  vehicleOfInterest?: string;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 40,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#C31327',
    paddingBottom: 15,
  },
  logo: {
    width: 120,
    height: 'auto',
  },
  headerText: {
    fontSize: 10,
    color: '#4B5563',
    textAlign: 'right',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    color: '#4B5563',
    marginBottom: 40,
  },
  section: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#C31327',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    width: '40%',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#4B5563',
  },
  detailValue: {
    width: '60%',
    fontSize: 12,
  },
  qrCodeSection: {
    marginTop: 40,
    textAlign: 'center',
    alignItems: 'center',
  },
  qrCode: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  qrText: {
    fontSize: 10,
    color: '#6B7280',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#9CA3AF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
});

const formatTime = (time: string) => {
    if (!time || !time.includes(':')) return 'Not specified';
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const formattedHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
    return `${formattedHour}:${minute} ${ampm}`;
};

export const AppointmentSlipPdf = ({
  name,
  preferredDate,
  preferredTime,
  vehicleOfInterest
}: AppointmentSlipPdfProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image
          style={styles.logo}
          src="https://armanautoxperts-in.vercel.app/armanautoxperts/motorkhanblack.png"
        />
        <View>
          <Text style={styles.headerText}>Motor Khan</Text>
          <Text style={styles.headerText}>Rithala, Rohini, Delhi</Text>
          <Text style={styles.headerText}>+91 8595853918</Text>
        </View>
      </View>

      <Text style={styles.title}>Test Drive Appointment Slip</Text>
      <Text style={styles.subtitle}>Please bring this slip (digital or printed) with you to your appointment.</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appointment Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Client Name:</Text>
          <Text style={styles.detailValue}>{name}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Appointment Date:</Text>
          <Text style={styles.detailValue}>{format(preferredDate, 'EEEE, MMMM d, yyyy')}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Appointment Time:</Text>
          <Text style={styles.detailValue}>{formatTime(preferredTime)}</Text>
        </View>
        {vehicleOfInterest && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Vehicle of Interest:</Text>
            <Text style={styles.detailValue}>{vehicleOfInterest}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.qrCodeSection}>
         <Image 
            style={styles.qrCode}
            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://motorkhan.com/book-appointment"
         />
         <Text style={styles.qrText}>Scan to manage your appointment</Text>
      </View>

      <Text style={styles.footer}>
        This is an automated confirmation slip. Our team will contact you to confirm your appointment.
      </Text>
    </Page>
  </Document>
);

export default AppointmentSlipPdf;
