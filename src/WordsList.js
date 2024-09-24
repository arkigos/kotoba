import React, { useEffect, useState, useCallback, useRef } from 'react';
import './WordsList.css';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedImage } from '@cloudinary/react';

function WordsList() {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(1);
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);
  const [audio, setAudio] = useState(null);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [showEnglishFirst, setShowEnglishFirst] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredWordIndex, setHoveredWordIndex] = useState(null);
  const [showBackgroundImage, setShowBackgroundImage] = useState(true);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('jp');
  const [showText, setShowText] = useState(true);
  const [randomizeWords, setRandomizeWords] = useState(false);
  const [randomizedIndices, setRandomizedIndices] = useState([]);

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'hgcstx3uy' // Replace with your Cloudinary cloud name
    }
  });
  const baseAudioUrl = `/audio/${selectedLanguage}/`;
  const tooltipRef = useRef(null);

  const loadLesson = useCallback((currentLesson, langCode) => {
    fetch(`/api/${langCode}/lesson_${currentLesson}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch lesson: ${currentLesson}`);
        }
        return response.json();
      })
      .then((data) => {
        setWords(data);
        if (randomizeWords) {
          setRandomizedIndices(generateRandomSequence(data.length));
        }
        setCurrentIndex(0);
        setShowEnglish(showEnglishFirst);

        if (autoPlayAudio && data.length > 0) {
          const initialAudio = new Audio(
            `${baseAudioUrl}lesson_${currentLesson}/audio_${currentLesson}_${data[0].id}.mp3`
          );
          setAudio(initialAudio);
          initialAudio
            .play()
            .catch((error) => console.error('Audio play blocked:', error));
        }
      })
      .catch((error) => console.error('Error fetching lesson:', error));
  }, [autoPlayAudio, showEnglishFirst, baseAudioUrl, randomizeWords]);

  const generateRandomSequence = (length) => {
    let sequence = Array.from({ length }, (_, i) => i);
    for (let i = length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
    }
    return sequence;
  };

  useEffect(() => {
    fetch(`/api/${selectedLanguage}/lessons.json`)
      .then((response) => response.json())
      .then((data) => {
        setLessons(data.lessons);
        if (data.lessons.length > 0) {
          const firstLesson = data.lessons[0];
          setCurrentLesson(firstLesson.id);
          loadLesson(firstLesson.id, selectedLanguage);
        }
      })
      .catch((error) => console.error('Error fetching lessons:', error));

    fetch('/server/data/languages.json')
      .then((response) => response.json())
      .then((data) => {
        setLanguages(data);
      })
      .catch((error) => console.error('Error fetching languages:', error));
  }, [selectedLanguage, loadLesson]);

  const handleLessonChange = (e) => {
    const selectedLesson = parseInt(e.target.value);
    setCurrentLesson(selectedLesson);
    loadLesson(selectedLesson, selectedLanguage);
  };

  const handleLanguageChange = (e) => {
    const selectedLangCode = e.target.value;
    setSelectedLanguage(selectedLangCode);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % words.length;
    setCurrentIndex(nextIndex);
    playAudioForIndex(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + words.length) % words.length;
    setCurrentIndex(prevIndex);
    playAudioForIndex(prevIndex);
  };

  const handleSidebarClick = (index) => {
    setCurrentIndex(index);
    playAudioForIndex(index);
  };

  const playAudioForIndex = (index) => {
    const actualIndex = randomizeWords ? randomizedIndices[index] : index;
    const nextAudio = new Audio(
      `${baseAudioUrl}lesson_${currentLesson}/audio_${currentLesson}_${words[actualIndex].id}.mp3`
    );
    setAudio(nextAudio);
    setShowEnglish(showEnglishFirst);
    if (autoPlayAudio) nextAudio.play();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleBackgroundImage = () => {
    setShowBackgroundImage(!showBackgroundImage);
  };

  const handleWordContainerClick = () => {
    setShowEnglish(!showEnglish);
  };

  const handleWordPartMouseMove = (e) => {
    const tooltip = tooltipRef.current;
    if (tooltip) {
      tooltip.style.left = `${e.clientX}px`;
      tooltip.style.top = `${e.clientY}px`;
    }
  };

  if (words.length === 0) {
    return <div>Loading...</div>;
  }

  const displayedWords = words;
  const currentWord =
    displayedWords[randomizeWords ? randomizedIndices[currentIndex] : currentIndex];
  const myImage = cld.image(
    `${selectedLanguage}/images/image_${currentLesson}_${currentWord.id}.png`
  );

  return (
    <div className="container">
      {/* Header Container for Dropdowns and Menu */}
      <div className="header-container">
        <div className="language-dropdown">
          <label htmlFor="language-select">Language:</label>
          <select
            id="language-select"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.language}
              </option>
            ))}
          </select>
        </div>

        <div className="lesson-dropdown">
          <label htmlFor="lesson-select">Lesson:</label>
          <select
            id="lesson-select"
            value={currentLesson}
            onChange={handleLessonChange}
          >
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
              <label>
                <input
                  type="checkbox"
                  checked={showText}
                  onChange={(e) => setShowText(e.target.checked)}
                />
                Show Text
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={randomizeWords}
                  onChange={(e) => {
                    setRandomizeWords(e.target.checked);
                    if (e.target.checked) {
                      setRandomizedIndices(generateRandomSequence(words.length));
                    } else {
                      setCurrentIndex(0);
                    }
                  }}
                />
                Randomize
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          {displayedWords.map((word, index) => {
            const displayIndex = randomizeWords ? randomizedIndices[index] : index;
            return (
              <li
                key={word.id}
                className={displayIndex === currentIndex ? 'active' : ''}
                onClick={() => handleSidebarClick(displayIndex)}
              >
                {showEnglishFirst ? word.english : word.line.join('')}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Main Content */}
      <div
        className="word-content"
        style={{ backgroundColor: showBackgroundImage ? 'transparent' : 'black' }}
      >
        {showBackgroundImage && (
          <AdvancedImage
            className="word-image"
            cldImg={myImage}
            alt={currentWord.english}
          />
        )}

        {showText && (
          <div className="word-container">
            {showEnglish ? (
              <h1 className="word" onClick={handleWordContainerClick}>
                {currentWord.english}
              </h1>
            ) : (
              currentWord.line.map((wordPart, wordIndex) => (
                <span
                  key={wordIndex}
                  className={`word-part ${
                    hoveredWordIndex === wordIndex ? 'highlighted' : ''
                  }`} // Dynamic class
                  onClick={handleWordContainerClick}
                  onMouseOver={() => setHoveredWordIndex(wordIndex)}
                  onMouseOut={() => setHoveredWordIndex(null)}
                  onMouseMove={(e) => {
                    if (hoveredWordIndex === wordIndex) {
                      handleWordPartMouseMove(e);
                    }
                  }}
                >
                  {wordPart}
                  {hoveredWordIndex === wordIndex && (
                    <div className="tooltip" ref={tooltipRef}>
                      <div>{currentWord.tts[wordIndex]}</div>
                      <div>{currentWord.explain[wordIndex]}</div>
                    </div>
                  )}
                </span>
              ))
            )}
          </div>
        )}
        
        {/* Buttons Container (always visible) */}
        <div className="buttons-container"> 
          <button className="previous-button" onClick={handlePrevious}>
            Previous
          </button>
          <button className="replay-button" onClick={() => audio && audio.play()}>
            Replay Audio
          </button>
          <button className="next-button" onClick={handleNext}>
            Next
          </button>
        </div>

        {/* Fact Display (only visible if showText is true) */}
        {showText && (
          <p className="fact-text">
            <i>{currentWord.fact}</i>
          </p>
        )}

      </div>
    </div>
  );
}

export default WordsList;