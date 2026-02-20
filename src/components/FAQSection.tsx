import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQSchema } from "./JsonLd";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSectionProps {
  title?: string;
  faqs: FAQItem[];
  showSchema?: boolean;
}

const FAQSection = ({ title = "Sıkça Sorulan Sorular", faqs, showSchema = true }: FAQSectionProps) => (
  <section className="py-16">
    {showSchema && <FAQSchema faqs={faqs} />}
    <div className="container max-w-3xl">
      <h2 className="mb-8 text-center font-display text-3xl font-bold">{title}</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-base">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
