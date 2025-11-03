
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "What services does Motor Khan offer?",
    answer: "We specialize in a wide range of services including car denting, painting, detailing, complete restoration, regular servicing, and buying/selling certified pre-owned luxury cars."
  },
  {
    question: "Where is Motor Khan located?",
    answer: "Our workshop is conveniently located at Shop No 12, Vijay Vihar Phase I, Block B, Near Rice Mill, Rithala, Rohini, Delhi, 110085. You can find us on the map in our location section."
  },
  {
    question: "Do you offer financing options for used cars?",
    answer: "Yes, we partner with reputable financial institutions to offer flexible and competitive financing options to help you purchase your dream car."
  },
  {
    question: "How long does a typical car service take?",
    answer: "A standard service usually takes between 2 to 4 hours. However, the duration can vary depending on the specific needs of your vehicle. We always provide a time estimate before starting any work."
  },
  {
    question: "Can I get a quote for a repair or restoration project?",
    answer: "Absolutely! You can get a quote by filling out the contact form on our website, calling us directly, or visiting our workshop for a detailed assessment and estimate."
  }
];

export function FaqSection() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          className="mb-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
            hidden: {},
          }}
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
            className="text-4xl tracking-tight lg:text-5xl font-black uppercase"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.2 },
              },
            }}
            className="text-lg text-muted-foreground md:text-xl mt-4 max-w-3xl mx-auto lowercase"
          >
            Have questions? We've got answers. Here are some of the most common inquiries we receive.
          </motion.p>
        </motion.div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
             <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AccordionItem value={`item-${index}`} className="border-b border-border/50">
                <AccordionTrigger className="text-left text-lg hover:no-underline font-bold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base lowercase">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
