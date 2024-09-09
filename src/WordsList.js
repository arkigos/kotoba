import React, { useEffect, useState } from 'react';
import './WordsList.css';

const baseImageUrl = '/images/';
const baseAudioUrl = '/audio/';

function WordsList() {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);
  const [audio, setAudio] = useState(null); // Store the audio object

  useEffect(() => {
    // Fetch words from the API
    fetch('/api/words')
      .then(response => response.json())
      .then(data => {
        setWords(data);
        if (data.length > 0) {
          // Create the first audio object and play it
          const initialAudio = new Audio(`${baseAudioUrl}audio_${data[0].id}.mp3`);
          setAudio(initialAudio);
          initialAudio.play();
        }
      })
      .catch(error => console.error('Error fetching words:', error));
  }, []);

  useEffect(() => {
    // Play audio whenever the word is shown
    if (audio) {
      audio.play();
    }
  }, [audio]);

  const handleToggle = () => {
    // Toggle between showing the Japanese word and English translation
    setShowEnglish(!showEnglish);
  };

  const handleNext = () => {
    // Move to the next word
    const nextIndex = (currentIndex + 1) % words.length;
    setCurrentIndex(nextIndex);
    setShowEnglish(false); // Reset to showing Japanese when moving to the next word

    // Update and play the audio for the next word
    const nextAudio = new Audio(`${baseAudioUrl}audio_${words[nextIndex].id}.mp3`);
    setAudio(nextAudio);
  };

  const handlePrevious = () => {
    // Move to the previous word
    const prevIndex = (currentIndex - 1 + words.length) % words.length;
    setCurrentIndex(prevIndex);
    setShowEnglish(false); // Reset to showing Japanese when moving to the previous word

    // Update and play the audio for the previous word
    const prevAudio = new Audio(`${baseAudioUrl}audio_${words[prevIndex].id}.mp3`);
    setAudio(prevAudio);
  };

  const handleReplay = () => {
    // Replay the current audio
    if (audio) {
      audio.currentTime = 0; // Reset the audio to the beginning
      audio.play();
    }
  };

  const handleSidebarClick = (index) => {
    // Handle clicking on an item in the sidebar
    setCurrentIndex(index);
    setShowEnglish(false); // Reset to showing Japanese when navigating via sidebar
    const clickedAudio = new Audio(`${baseAudioUrl}audio_${words[index].id}.mp3`);
    setAudio(clickedAudio);
  };

  if (words.length === 0) {
    return <div>Loading...</div>;
  }

  const currentWord = words[currentIndex];

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          {words.map((word, index) => (
            <li key={word.id} className={index === currentIndex ? 'active' : ''} onClick={() => handleSidebarClick(index)}>
              {word.word} {/* Display either the word or sentence */}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="word-content">
        <img className="word-image" src={`${baseImageUrl}${currentWord.id}.jpg`} alt={currentWord.word || currentWord.sentence} />
        <h1 className="word" onClick={handleToggle}>
          {showEnglish ? currentWord.english : currentWord.word || currentWord.sentence}
        </h1>
        <div className="buttons-container">
          <button className="previous-button" onClick={handlePrevious}>Previous</button>
          <button className="replay-button" onClick={handleReplay}>Replay Audio</button>
          <button className="next-button" onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default WordsList;
