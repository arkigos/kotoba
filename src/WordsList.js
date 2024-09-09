import React, { useEffect, useState, useCallback } from 'react';
import './WordsList.css';

const baseAudioUrl = '/audio/';
const baseImageUrl = '/images/';

function WordsList() {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(1); // Default to lesson 1
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);
  const [audio, setAudio] = useState(null); // Store the audio object
  const [autoPlayAudio, setAutoPlayAudio] = useState(true); // State for audio autoplay
  const [showEnglishFirst, setShowEnglishFirst] = useState(false); // State for word/English display order
  const [menuOpen, setMenuOpen] = useState(false); // State for the hamburger menu
  const [hoveredIndex, setHoveredIndex] = useState(null); // State for tracking hovered sidebar item
  const [showFurigana, setShowFurigana] = useState(true); // State for showing/hiding furigana
  const [showBackgroundImage, setShowBackgroundImage] = useState(true); // State for toggling background image

  
  // Memoize loadLesson to avoid unnecessary re-renders
  const loadLesson = useCallback((currentLesson) => {
    console.log(`Fetching lesson file: ${currentLesson}`); // Debugging
    fetch(`/api/lesson/lesson_${currentLesson}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch lesson: ${currentLesson}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Lesson data fetched:', data); // Debugging
        setWords(data);
        setCurrentIndex(0);
        setShowEnglish(showEnglishFirst);
          if (autoPlayAudio) {
            const initialAudio = new Audio(`${baseAudioUrl}lesson_${currentLesson}/audio_${currentLesson}_${data[0].id}.mp3`);
            setAudio(initialAudio);
            initialAudio.play().catch((error) => console.error('Audio play blocked:', error));
          }
      })
      .catch((error) => console.error('Error fetching lesson:', error));
  }, [autoPlayAudio]);

  // Fetch lessons and load the first one when the component first mounts
  useEffect(() => {
    fetch('/api/lessons.json')
      .then((response) => response.json())
      .then((data) => {
        setLessons(data.lessons);
        const firstLesson = data.lessons[1];
        setCurrentLesson(firstLesson.id); // Set the first lesson as current
        loadLesson(firstLesson.id); // Load the first lesson
      })
      .catch((error) => console.error('Error fetching lessons:', error));
  }, []); // Runs once on mount, no dependencies

  // Audio handling and lesson switching
  const handleLessonChange = (e) => {
    const selectedLesson = parseInt(e.target.value);
    console.log(`Switching to lesson ${selectedLesson})`); // Debugging
    setCurrentLesson(selectedLesson);
    loadLesson(selectedLesson);

  };

  // Audio handling for next and previous
  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % words.length;
    setCurrentIndex(nextIndex);
    const nextAudio = new Audio(`${baseAudioUrl}lesson_${currentLesson}/audio_${currentLesson}_${words[nextIndex].id}.mp3`);
    setAudio(nextAudio);
    setShowEnglish(showEnglishFirst);
    if (autoPlayAudio) nextAudio.play();
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + words.length) % words.length;
    setCurrentIndex(prevIndex);
    const prevAudio = new Audio(`${baseAudioUrl}lesson_${currentLesson}/audio_${currentLesson}_${words[prevIndex].id}.mp3`);
    setAudio(prevAudio);
    setShowEnglish(showEnglishFirst);
    if (autoPlayAudio) prevAudio.play();
  };

  const handleSidebarClick = (index) => {
    setCurrentIndex(index);
    const clickedAudio = new Audio(`${baseAudioUrl}lesson_${currentLesson}/audio_${currentLesson}_${words[index].id}.mp3`);
    setAudio(clickedAudio);
    setShowEnglish(showEnglishFirst);
    if (autoPlayAudio) clickedAudio.play();
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

  const toggleBackgroundImage = () => {
    setShowBackgroundImage(!showBackgroundImage); // Toggle background image visibility
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
      {/* Dropdown for Lesson Selection */}
      <div className="lesson-dropdown">
        <label htmlFor="lesson-select">Lesson:</label>
        <select id="lesson-select" value={currentLesson} onChange={handleLessonChange}>
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.name}
            </option>
          ))}
        </select>
      </div>

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
            <label>
              <input
                type="checkbox"
                checked={showBackgroundImage}
                onChange={toggleBackgroundImage}
              />
              Show Background Image
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
                      ? stripFurigana(word.word) // Show word without furigana if English is shown first
                      : word.english // Show English if word is shown first
                    : showEnglishFirst // If not hovered, follow the regular display logic
                    ? word.english // Show English first if checked
                    : stripFurigana(word.word), // Show word without furigana if unchecked
              }}
            />
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="word-content" style={{ backgroundColor: showBackgroundImage ? 'transparent' : 'black' }}>
        {showBackgroundImage && (
          <img
            className="word-image"
            src={`${baseImageUrl}lesson_${currentLesson}/image_${currentLesson}_${currentWord.id}.jpg`}
            alt={currentWord.word}
          />
        )}
        <h1
          className="word"
          onClick={() => setShowEnglish(!showEnglish)}
          dangerouslySetInnerHTML={{
            __html: showEnglish ? currentWord.english : renderWordWithFurigana(currentWord.word),
          }}
        />
        <div className="buttons-container">
          <button className="previous-button" onClick={handlePrevious}>
            Previous
          </button>
          <button className="replay-button" onClick={() => audio && audio.play()}>
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
