"use client";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { generateAiReport } from "../_actions/generate-ai-report";
import { useState } from "react";
import { ScrollArea } from "@/app/_components/ui/scroll-area";
import Markdown from "react-markdown";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";

interface AiReportButtonProps {
  hasPremiumPlan: boolean;
  month: string;
}

const AiReportButton = ({ month, hasPremiumPlan }: AiReportButtonProps) => {
  const [report, setReport] = useState<string | null>(null);
  const [reportIsLoading, setReportIsLoading] = useState(false);
  const handleGenerateReport = async () => {
    try {
      setReportIsLoading(true);
      const alReport = await generateAiReport({ month });
      console.log({ alReport });
      setReport(alReport);
    } catch (error) {
      setReportIsLoading(false);
      console.error(error);
    } finally {
      setReportIsLoading(false);
    }
  };
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setReport(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" className="font-bold">
          Relatório IA
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        {hasPremiumPlan ? (
          <>
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>
              <DialogDescription>
                Use inteligência artificial para gerar um relatório com insights
                sobre suas finanças.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="prose max-h-[450px] text-white prose-h3:text-white prose-h4:text-white prose-strong:text-white">
              <Markdown>{report}</Markdown>
            </ScrollArea>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleGenerateReport} disabled={reportIsLoading}>
                {reportIsLoading && <Loader2Icon className="animate-spin" />}
                Gerar relatório
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Relatório IA</DialogTitle>
              <DialogDescription>
                Você precisa de um plano premium para gerar relatórios com IA.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button asChild>
                <Link href="/subscription">Assinar plano premium</Link>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AiReportButton;
