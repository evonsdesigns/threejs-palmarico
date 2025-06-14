// Get the audio element
const backgroundMusic = document.getElementById("backgroundMusic") as HTMLAudioElement;

// Function to play the music
function playMusic() {
  backgroundMusic.play();
}

// Function to pause the music
function pauseMusic() {
  backgroundMusic.pause();
}

// Example: Play the music after a user interaction (e.g., a button click)
document.addEventListener("click", playMusic);

// Optional: Control volume
backgroundMusic.volume = 0.5; // Adjust volume (0.0 to 1.0)