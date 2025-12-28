'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


interface TextToSpeechButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  text: string;
}

export function TextToSpeechButton({ text, className, ...props }: TextToSpeechButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  // This effect will run only on the client side.
  useEffect(() => {
    const synth = window.speechSynthesis;

    const handleSpeechEnd = () => {
      setIsSpeaking(false);
    };

    // When the component unmounts, cancel any ongoing speech.
    return () => {
      synth.cancel();
      // Remove any listeners if they were attached to utterances
      const utterances = synth.getUtterances();
      if (utterances.length > 0) {
        utterances[0].removeEventListener('end', handleSpeechEnd);
      }
    };
  }, []);

  const handleToggleSpeech = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const synth = window.speechSynthesis;

    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
    } else {
      if(text){
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        synth.speak(utterance);
      }
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleSpeech}
            className={cn('h-8 w-8', className)}
            aria-label={isSpeaking ? 'Stop text-to-speech' : 'Read text aloud'}
            {...props}
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isSpeaking ? 'Stop reading' : 'Read aloud'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
