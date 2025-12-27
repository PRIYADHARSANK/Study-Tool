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
  
  // Using useEffect to handle client-side only APIs
  useEffect(() => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    const onEnd = () => setIsSpeaking(false);
    utterance.addEventListener('end', onEnd);
    
    // Set state when speech starts
    const onStart = () => setIsSpeaking(true);
    utterance.addEventListener('start', onStart);

    const handleToggleSpeech = () => {
      if (synth.speaking) {
        synth.cancel();
        setIsSpeaking(false);
      } else {
        synth.speak(utterance);
      }
    };
    
    // Attach click handler to the button
    const buttonElement = document.getElementById(`tts-btn-${text.slice(0, 10)}`);
    buttonElement?.addEventListener('click', handleToggleSpeech);

    return () => {
      // Cleanup: remove listeners and cancel any speech
      utterance.removeEventListener('end', onEnd);
      utterance.removeEventListener('start', onStart);
      buttonElement?.removeEventListener('click', handleToggleSpeech);
      synth.cancel();
    };
  }, [text]);


  const handleToggleSpeech = () => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
        synth.cancel();
        setIsSpeaking(false);
    } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onstart = () => setIsSpeaking(true);
        synth.speak(utterance);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            id={`tts-btn-${text.slice(0, 10)}`}
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
