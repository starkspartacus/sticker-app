"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface ProgressDialogProps {
  open: boolean;
  title: string;
  description: string;
  progress: number;
  currentFile: string;
}

export default function ProgressDialog({
  open,
  title,
  description,
  progress,
  currentFile,
}: ProgressDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Progress value={progress} className="w-full" />
          {currentFile && <p className="text-sm text-muted-foreground">{currentFile}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
