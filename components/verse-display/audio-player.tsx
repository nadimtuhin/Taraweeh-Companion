"use client";

import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PlayCircle,
  PauseCircle,
  Repeat,
  SkipBack,
  SkipForward,
  Volume2,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Example reciters data
const reciters = [
  { id: "mishary", name: "Mishary Rashid Alafasy", available_offline: true },
  { id: "sudais", name: "Abdur-Rahman As-Sudais", available_offline: false },
  { id: "ghamdi", name: "Saad Al-Ghamdi", available_offline: false },
  {
    id: "minshawi",
    name: "Mohamed Siddiq El-Minshawi",
    available_offline: true,
  },
];

interface AudioPlayerProps {
  audioUrl: string | null;
}

export function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isLooping, setIsLooping] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState(reciters[0].id);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Audio event listeners
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration || 0);
      });

      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("loadedmetadata", () => {});
          audioRef.current.removeEventListener("timeupdate", () => {});
        }
      };
    }
  }, []);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
      setVolume(value[0]);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        audioRef.current.duration,
        currentTime + 5
      );
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 5);
    }
  };

  const handleDownload = async () => {
    const selectedReciterData = reciters.find((r) => r.id === selectedReciter);
    if (!selectedReciterData?.available_offline) {
      toast({
        title: "Download not available",
        description: "This recitation is not available for offline listening.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Download started",
      description: "The recitation will be available offline once downloaded.",
    });
    // Implement actual download logic here
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <Slider
        value={[currentTime]}
        max={duration}
        step={0.1}
        onValueChange={handleSeek}
        className="w-full"
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsLooping(!isLooping)}
            className={isLooping ? "text-primary" : ""}
          >
            <Repeat className="h-4 w-4" />
          </Button>
          <Select
            value={playbackRate.toString()}
            onValueChange={(value) =>
              handlePlaybackRateChange(parseFloat(value))
            }
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.75">0.75x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="1.25">1.25x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={skipBackward}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            className="h-12 w-12"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <PauseCircle className="h-8 w-8" />
            ) : (
              <PlayCircle className="h-8 w-8" />
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={skipForward}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4" />
          <Slider
            value={[volume]}
            max={100}
            className="w-[100px]"
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
      
      <audio
        ref={audioRef}
        src={audioUrl || ""}
        loop={isLooping}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
}

export function ReciterSelection({
  selectedReciter,
  setSelectedReciter
}: {
  selectedReciter: string;
  setSelectedReciter: (id: string) => void;
}) {
  const { toast } = useToast();
  
  const handleDownload = async () => {
    const selectedReciterData = reciters.find((r) => r.id === selectedReciter);
    if (!selectedReciterData?.available_offline) {
      toast({
        title: "Download not available",
        description: "This recitation is not available for offline listening.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Download started",
      description: "The recitation will be available offline once downloaded.",
    });
    // Implement actual download logic here
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedReciter}
        onValueChange={setSelectedReciter}
      >
        <SelectTrigger className="w-[200px]">
          <Volume2 className="w-4 h-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {reciters.map((reciter) => (
            <SelectItem key={reciter.id} value={reciter.id}>
              {reciter.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={handleDownload}
        title="Download for offline listening"
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
}
