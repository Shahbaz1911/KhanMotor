"use client";
import { Iphone } from "@/components/ui/iphone";

export default function IphoneDemo() {
  const mapUrl = "https://maps.google.com/maps?width=100%&height=100%&hl=en&q=Motor%20Khan%20,Shop%20No%2012,%20near%20Rice%20Mill,%20Vijay%20vihar%20Phase%20I,%20Phase%201,%20Block%20B,%20Rithala,%20Rohini,%20New%20Delhi,%20Delhi,%20110085&t=&z=15&ie=UTF8&iwloc=B&output=embed";

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      <Iphone showHeader>
        <div className="absolute inset-0 z-10 bg-gray-100 dark:bg-gray-900">
           <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Motor Khan Location Map"
          ></iframe>
        </div>
      </Iphone>
    </div>
  );
}
