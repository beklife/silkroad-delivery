import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import musicSrc from "@assets/kuigai2.mp3";

interface MusicContextType {
  musicPlaying: boolean;
  toggleMusic: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [musicPlaying, setMusicPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioLoadedRef = useRef(false);
  const autoPlayRequestedRef = useRef(true);
  const musicPlayingRef = useRef(musicPlaying);

  useEffect(() => {
    musicPlayingRef.current = musicPlaying;
  }, [musicPlaying]);

  const loadAudio = () => {
    if (audioLoadedRef.current || audioRef.current) return;

    audioLoadedRef.current = true;
    audioRef.current = new Audio(musicSrc);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    audioRef.current.preload = "auto";
  };

  useEffect(() => {
    const attemptAutoplay = () => {
      loadAudio();
      if (!audioRef.current) return;
      audioRef.current.play()
        .then(() => {
          setMusicPlaying(true);
        })
        .catch(() => {
          setMusicPlaying(false);
        });
    };

    attemptAutoplay();

    const handleFirstInteraction = () => {
      if (!autoPlayRequestedRef.current) return;
      if (musicPlayingRef.current) {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
        return;
      }
      loadAudio();
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setMusicPlaying(true);
          })
          .catch(() => {
            setMusicPlaying(false);
          });
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (musicPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      autoPlayRequestedRef.current = false;
      setMusicPlaying(false);
      return;
    }

    loadAudio();
    if (!audioRef.current) return;
    audioRef.current.play()
      .then(() => {
        autoPlayRequestedRef.current = true;
        setMusicPlaying(true);
      })
      .catch(() => {
        // Play failed, keep button in off state
      });
  };

  return (
    <MusicContext.Provider value={{ musicPlaying, toggleMusic }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}
