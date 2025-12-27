'use client';

import * as React from 'react';
import { handleFileUpload } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileUp, FileText, Loader2, X, UploadCloud } from 'lucide-react';

type PdfFile = {
  name: string;
  dataUri: string;
};

interface FileUploadProps {
  onFileChange: (file: PdfFile | null) => void;
  uploadedFile: PdfFile | null;
}

export function FileUpload({ onFileChange, uploadedFile }: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processFile = async (file: File) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a PDF file.',
      });
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('pdf', file);

    const result = await handleFileUpload(formData);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: result.error,
      });
      onFileChange(null);
    } else {
      onFileChange(result);
    }
    setIsProcessing(false);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (uploadedFile) {
    return (
      <div className="p-3 border rounded-lg bg-card flex items-center justify-between gap-2 shadow-sm">
        <div className="flex items-center gap-3 overflow-hidden">
          <FileText className="h-5 w-5 text-primary flex-shrink-0" />
          <span className="truncate text-sm font-medium">{uploadedFile.name}</span>
        </div>
        <Button size="icon" variant="ghost" className="h-7 w-7 flex-shrink-0" onClick={handleRemoveFile}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={cn(
        'border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group',
        isDragging ? 'border-primary bg-primary/10' : 'border-border/50 hover:border-primary/50 hover:bg-primary/5'
      )}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
      {isProcessing ? (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="font-semibold text-sm">Processing...</p>
          <p className="text-xs text-muted-foreground">Your PDF is being prepared.</p>
        </>
      ) : (
        <>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="h-6 w-6 text-primary" />
          </div>
          <p className="font-semibold text-sm">Upload your notes</p>
          <p className="text-xs text-muted-foreground mt-1">Drag & drop or click to select a PDF.</p>
        </>
      )}
    </div>
  );
}
