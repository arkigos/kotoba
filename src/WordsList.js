import React, { useEffect, useState } from 'react';
import './WordsList.css';

const baseImageUrl = '/images/';
const baseAudioUrl = '/audio/';

function WordsList() {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);
  const [audio, setAudio] = useState(null); // Store the audio object
  const [autoPlayAudio, setAutoPlayAudio] = useState(true); // State for audio autoplay
  const [showEnglishFirst, setShowEnglishFirst] = useState(false); // State for word/English display order
  const [menuOpen, setMenuOpen] = useState(false); // State for the hamburger menu
  const [hoveredIndex, setHoveredIndex] = useState(null); // State for tracking hovered sidebar item
  const [showFurigana, setShowFurigana] = useState(true); // State for showing/hiding furigana

  useEffect(() => {
    // Fetch words from the API
    fetch('/api/words')
      .then(response => response.json())
      .then(data => {
        setWords(data);
        if (data.length > 0) {
          setShowEnglish(showEnglishFirst); // Set display based on checkbox
          if (autoPlayAudio) {
            const initialAudio = new Audio(`${baseAudioUrl}audio_${data[0].id}.mp3`);
            setAudio(initialAudio);
            initialAudio.play();
          }
        }
      })
      .catch(error => console.error('Error fetching words:', error));
  }, [autoPlayAudio, showEnglishFirst]); // Dependencies include the checkbox states

  useEffect(() => {
    // Play audio whenever the word is shown if autoPlayAudio is true
    if (audio && autoPlayAudio) {
      audio.play();
    }
  }, [audio, autoPlayAudio]);

  const handleToggle = () => {
    setShowEnglish(!showEnglish);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % words.length;
    setCurrentIndex(nextIndex);
    setShowEnglish(showEnglishFirst); // Reset display order based on checkbox
    const nextAudio = new Audio(`${baseAudioUrl}audio_${words[nextIndex].id}.mp3`);
    setAudio(nextAudio);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + words.length) % words.length;
    setCurrentIndex(prevIndex);
    setShowEnglish(showEnglishFirst); // Reset display order based on checkbox
    const prevAudio = new Audio(`${baseAudioUrl}audio_${words[prevIndex].id}.mp3`);
    setAudio(prevAudio);
  };

  const handleReplay = () => {
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  const handleSidebarClick = (index) => {
    setCurrentIndex(index);
    setShowEnglish(showEnglishFirst); // Reset to showing Japanese/English based on checkbox
    const clickedAudio = new Audio(`${baseAudioUrl}audio_${words[index].id}.mp3`);
    setAudio(clickedAudio);
  };

  const handleMouseOver = (index) => {
    setHoveredIndex(index); // Track the index of the hovered item
  };

  const handleMouseOut = () => {
    setHoveredIndex(null); // Reset hovered index when mouse leaves
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Open/close the hamburger menu
  };

  const toggleFurigana = () => {
    setShowFurigana(!showFurigana); // Toggle furigana visibility
  };

  const stripFurigana = (wordHtml) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(wordHtml, 'text/html');
    const rtElements = doc.querySelectorAll('rt');
    
    rtElements.forEach(rt => rt.remove()); // Remove all <rt> tags
    return doc.body.innerHTML; // Return the HTML without <rt> tags
  };

  const renderWordWithFurigana = (wordHtml) => {
    // If furigana should be hidden, strip out <rt> content
    if (!showFurigana) {
      wordHtml = stripFurigana(wordHtml);
    }
    return wordHtml; // Return the full HTML with furigana
  };

  if (words.length === 0) {
    return <div>Loading...</div>;
  }

  const currentWord = words[currentIndex];

  return (
    <div className="container">
      {/* Hamburger Menu */}
      <div className="hamburger-menu">
        <button className="hamburger-icon" onClick={toggleMenu}>
          ☰
        </button>
        {menuOpen && (
          <div className="menu">
            <label>
              <input
                type="checkbox"
                checked={autoPlayAudio}
                onChange={(e) => setAutoPlayAudio(e.target.checked)}
              />
              Play Audio Automatically
            </label>
            <label>
              <input
                type="checkbox"
                checked={showEnglishFirst}
                onChange={(e) => setShowEnglishFirst(e.target.checked)}
              />
              Show English First
            </label>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="sidebar">
  <ul>
    {words.map((word, index) => (
      <li
        key={word.id}
        className={index === currentIndex ? 'active' : ''}
        onClick={() => handleSidebarClick(index)}
        onMouseOver={() => handleMouseOver(index)}
        onMouseOut={handleMouseOut}
        dangerouslySetInnerHTML={{
          __html:
            hoveredIndex === index
              ? showEnglishFirst // If hovered, reverse the display logic
                ? stripFurigana(word.word) // Show word if English is shown first
                : word.english // Show English if word is shown first
              : showEnglishFirst // If not hovered, follow the regular display logic
              ? word.english // Show English first if checked
              : stripFurigana(word.word) // Show word first if unchecked
        }}
      />
    ))}
  </ul>
</div>

      {/* Main Content */}
      <div className="word-content">
        <img
          className="word-image"
          src={`${baseImageUrl}${currentWord.id}.jpg`}
          alt={currentWord.word || currentWord.sentence}
        />
        <h1
          className="word"
          onClick={handleToggle}
          dangerouslySetInnerHTML={{
            __html: showEnglish ? currentWord.english : renderWordWithFurigana(currentWord.word)
          }}
        />
        <div className="buttons-container">
          <button className="previous-button" onClick={handlePrevious}>
            Previous
          </button>
          <button className="replay-button" onClick={handleReplay}>
            Replay Audio
          </button>
          <button className="toggle-furigana-button" onClick={toggleFurigana}>
            {showFurigana ? 'Hide Furigana' : 'Show Furigana'}
          </button>
          <button className="next-button" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default WordsList;
