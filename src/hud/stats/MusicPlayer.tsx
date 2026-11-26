import React, { useEffect, useRef, useState } from "react";

const tracks = __MUSIC_FILES__.map((filename) => ({
  name: filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
  url: `${import.meta.env.BASE_URL}sounds/music/${encodeURIComponent(filename)}`,
}));

const MusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const request = useRef(0);
  const [open, setOpen] = useState(false);
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [error, setError] = useState("");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;
    if (tracks.length) audio.src = tracks[0].url;
    return () => {
      request.current++;
      audio.pause();
    };
  }, []);

  const play = (audio: HTMLAudioElement) => {
    const currentRequest = ++request.current;
    setError("");
    audio.play().catch((reason: unknown) => {
      if (currentRequest !== request.current) return;
      console.error("Unable to play music:", reason);
      setError("Unable to play this track. Check the audio file and browser permissions.");
    });
  };

  const changeTrack = (index: number, startPlaying: boolean) => {
    const audio = audioRef.current;
    if (!audio || !tracks.length) return;
    request.current++;
    audio.pause();
    audio.src = tracks[index].url;
    audio.load();
    setTrack(index);
    setError("");
    if (startPlaying) play(audio);
  };

  const step = (direction: number, startPlaying?: boolean) => {
    const audio = audioRef.current;
    if (!audio || !tracks.length) return;
    changeTrack((track + direction + tracks.length) % tracks.length, startPlaying ?? !audio.paused);
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio || !tracks.length) return;
    if (audio.paused) {
      play(audio);
    } else {
      request.current++;
      audio.pause();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => step(1, true)}
        onError={() => {
          setPlaying(false);
          setError("Unable to load this track. Check the audio file and browser support.");
        }}
      />
      <button
        type="button"
        aria-label={open ? "Close music player" : "Open music player"}
        aria-expanded={open}
        aria-controls="music-player"
        title="Music player"
        onClick={() => setOpen(!open)}
      >♫</button>
      <section id="music-player" className="music-player" aria-label="Music player" hidden={!open}>
        <div className="music-player__heading">
          <strong>Island Radio</strong>
          <button type="button" aria-label="Close music player" onClick={() => setOpen(false)}>×</button>
        </div>
        {tracks.length ? (
          <>
            <label htmlFor="music-track">Now playing</label>
            <select id="music-track" value={track} onChange={(event) => {
              const audio = audioRef.current;
              changeTrack(Number(event.target.value), !!audio && !audio.paused);
            }}>
              {tracks.map((item, index) => <option value={index} key={item.url}>{item.name}</option>)}
            </select>
            <div className="music-player__controls">
              <button type="button" aria-label="Previous track" onClick={() => step(-1)}>◀◀</button>
              <button type="button" aria-label={playing ? "Pause music" : "Play music"} onClick={togglePlayback}>
                {playing ? "❚❚" : "▶"}
              </button>
              <button type="button" aria-label="Next track" onClick={() => step(1)}>▶▶</button>
            </div>
            <label htmlFor="music-volume">Volume <span>{volume}%</span></label>
            <input id="music-volume" type="range" min="0" max="100" value={volume} onChange={(event) => {
              const value = Number(event.target.value);
              setVolume(value);
              if (audioRef.current) audioRef.current.volume = value / 100;
            }} />
            {error && <p className="music-player__error" role="alert">{error}</p>}
          </>
        ) : <p>No music found. Add audio files to public/sounds/music and restart the game server.</p>}
      </section>
    </>
  );
};

export default MusicPlayer;
