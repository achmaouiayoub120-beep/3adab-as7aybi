import { useCallback, useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { toast } from "sonner";

export interface TicketData {
    ticketId: string;
    homeName: string;
    awayName: string;
    homeShort: string;
    awayShort: string;
    stadiumName: string;
    stadiumCity: string;
    date: string;
    time: string;
    zone: string;
    quantity: number;
    totalPrice: number;
    qrData?: string; // the database ticketCode or raw string to encode
}

export function useTicketPDF() {
    const [isGenerating, setIsGenerating] = useState(false);

    const generatePDF = useCallback(async (data: TicketData) => {
        try {
            setIsGenerating(true);
            const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });

            const w = doc.internal.pageSize.getWidth();
            const centerX = w / 2;

            // Background
            doc.setFillColor(244, 246, 249);
            doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), "F");

            // Header bar
            doc.setFillColor(0, 166, 81); // Primary green
            doc.rect(0, 0, w, 25, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text("BOTOLA TICKET", centerX, 16, { align: "center" });

            // Match info
            doc.setTextColor(26, 26, 26);
            doc.setFontSize(20);
            doc.setFont("helvetica", "bold");
            doc.text(`${data.homeShort}  VS  ${data.awayShort}`, centerX, 42, { align: "center" });

            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(107, 114, 128);
            doc.text(data.homeName, centerX, 50, { align: "center" });
            doc.text("vs", centerX, 56, { align: "center" });
            doc.text(data.awayName, centerX, 62, { align: "center" });

            // Separator
            doc.setDrawColor(229, 231, 235);
            doc.setLineWidth(0.3);
            doc.line(20, 70, w - 20, 70);

            // Details
            doc.setTextColor(26, 26, 26);
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            const details = [
                { label: "Date", value: data.date },
                { label: "Heure", value: data.time },
                { label: "Stade", value: `${data.stadiumName}, ${data.stadiumCity}` },
                { label: "Zone", value: data.zone },
                { label: "Quantité", value: `${data.quantity} billet(s)` },
                { label: "Total", value: `${data.totalPrice} MAD` },
            ];

            let yPos = 80;
            details.forEach(({ label, value }) => {
                doc.setFont("helvetica", "normal");
                doc.setTextColor(107, 114, 128);
                doc.text(label, 20, yPos);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(26, 26, 26);
                doc.text(value, w - 20, yPos, { align: "right" });
                yPos += 9;
            });

            // Separator
            doc.line(20, yPos + 2, w - 20, yPos + 2);

            // Ticket ID
            yPos += 14;
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(107, 114, 128);
            doc.text("N° Billet", centerX, yPos, { align: "center" });
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 166, 81);
            // Show only the random part or full depending on preference, here we show full
            doc.text(data.ticketId, centerX, yPos + 8, { align: "center" });

            // QR code Generation
            yPos += 12;
            const qrValue = data.qrData || data.ticketId; // Fallback to ID if no distinct QR
            
            try {
                const qrDataUrl = await QRCode.toDataURL(qrValue, {
                    width: 150,
                    margin: 1,
                    color: {
                        dark: '#1A1A1A',
                        light: '#FFFFFF'
                    }
                });
                
                // Add Image (x, y, width, height)
                // Center the QR: (w - width)/2
                const qrSize = 40;
                doc.addImage(qrDataUrl, "PNG", centerX - (qrSize/2), yPos, qrSize, qrSize);
                
                yPos += qrSize + 6;
                doc.setFontSize(8);
                doc.setTextColor(107, 114, 128);
                doc.setFont("helvetica", "normal");
                doc.text("Scan obligatoire à l'entrée du stade", centerX, yPos, { align: "center" });
                
            } catch (err) {
                console.error("Failed to generate QR Code", err);
                yPos += 20;
                doc.setFontSize(8);
                doc.setTextColor(239, 68, 68);
                doc.text("Erreur lors de la génération du QR Code", centerX, yPos, { align: "center" });
            }

            // Footer
            const footerY = doc.internal.pageSize.getHeight() - 12;
            doc.setFontSize(7);
            doc.setTextColor(107, 114, 128);
            doc.text("Billet vérifié · Non remboursable · Botola Pro Inwi 2025-2026", centerX, footerY, { align: "center" });
            doc.text("© 2026 Botola Ticket. Tous droits réservés.", centerX, footerY + 4, { align: "center" });

            // Save
            const safeName = data.ticketId.replace(/[^a-zA-Z0-9-]/g, '');
            doc.save(`botola-ticket-${safeName}.pdf`);
            
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la génération du PDF");
        } finally {
            setIsGenerating(false);
        }
    }, []);

    return { generatePDF, isGenerating };
}
