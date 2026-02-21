import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";

interface ContractPreviewProps {
  content: string;
  onBack?: () => void;
}

const ContractPreview = ({ content, onBack }: ContractPreviewProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 print:hidden">
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Geri
          </Button>
        )}
        <Button size="sm" onClick={handlePrint}>
          <Printer className="mr-1 h-4 w-4" /> Yazdır / PDF
        </Button>
      </div>

      <div ref={printRef} className="contract-print mx-auto max-w-[210mm] rounded-lg border bg-background p-8 shadow-sm print:border-none print:shadow-none">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-extrabold text-primary">
            Work<span className="text-accent">hibrit</span>
          </h2>
          <p className="text-xs text-muted-foreground">Sakarya | Sanal Ofis & Coworking</p>
        </div>

        <div className="whitespace-pre-wrap text-sm leading-relaxed">{content}</div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .contract-print, .contract-print * { visibility: visible; }
          .contract-print { position: absolute; left: 0; top: 0; width: 210mm; padding: 20mm; font-size: 12pt; line-height: 1.6; }
        }
      `}</style>
    </div>
  );
};

export default ContractPreview;
