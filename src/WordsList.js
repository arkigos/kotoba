import React, { useEffect, useState, useCallback } from 'react';
import './WordsList.css';

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
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showFurigana, setShowFurigana] = useState(true);
  const [showBackgroundImage, setShowBackgroundImage] = useState(true);
  const [preloadedImages, setPreloadedImages] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('jp');

  // New states for text visibility and randomization
  const [showText, setShowText] = useState(true); // Default checked
  const [randomizeWords, setRandomizeWords] = useState(false); // Default unchecked

  const baseImageUrl = `https://res.cloudinary.com/hgcstx3uy/image/upload/${selectedLanguage}/images/`;
  const baseAudioUrl = `/audio/${selectedLanguage}/`;

  const loadLesson = useCallback((currentLesson, langCode) => {
    console.log(`Fetching lesson file: ${currentLesson}`);
    fetch(`/api/${langCode}/lesson_${currentLesson}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch lesson: ${currentLesson}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Lesson data fetched:', data);
        setWords(data);
        setCurrentIndex(0);
        setShowEnglish(showEnglishFirst);
        
        if (autoPlayAudio) {
          const initialAudio = new Audio(`${baseAudioUrl}lesson_${currentLesson}/audio_${currentLesson}_${data[0].id}.mp3`);
          setAudio(initialAudio);
          initialAudio.play().catch((error) => console.error('Audio play blocked:', error));
        }
        preloadImages(data);
      })
      .catch((error) => console.error('Error fetching lesson:', error));
  }, [autoPlayAudio, showEnglishFirst, baseAudioUrl]);

  const preloadImages = (words) => {
    const images = words.map(word => {
      const img = new Image();
      img.src = `${baseImageUrl}image_${currentLesson}_${word.id}.png`;
      return img;
    });
    console.log('Preloading images:', images);
    setPreloadedImages(images);
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
    console.log(`Switching to lesson ${selectedLesson}`);
    setCurrentLesson(selectedLesson);
    loadLesson(selectedLesson, selectedLanguage);
  };

  const handleLanguageChange = (e) => {
    const selectedLangCode = e.target.value;
    console.log(`Switching to language ${selectedLangCode}`);
    setSelectedLanguage(selectedLangCode);
  };

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleFurigana = () => {
    setShowFurigana(!showFurigana);
  };

  const toggleBackgroundImage = () => {
    setShowBackgroundImage(!showBackgroundImage);
  };

  const stripFurigana = (text) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    doc.querySelectorAll('rt').forEach(rt => rt.remove());
    return doc.body.innerHTML;
  };

  // Function to return a shuffled array
  const randomizeArray = (array) => {
    return array
      .map(value => ({ value, sort: Math.random() })) // Add random sorting
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value); // Extract the values back
  };

  if (words.length === 0) {
    return <div>Loading...</div>;
  }

  const displayedWords = randomizeWords ? randomizeArray(words) : words; // Use randomization logic.
  const currentWord = displayedWords[currentIndex];

  return (
    <div className="container">
      {/* Header Container for Dropdowns and Menu */}
      <div className="header-container">
        <div className="language-dropdown">
          <label htmlFor="language-select">Language:</label>
          <select id="language-select" value={selectedLanguage} onChange={handleLanguageChange}>
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.language}
              </option>
            ))}
          </select>
        </div>

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
              <label>
                <input
                  type="checkbox"
                  checked={showFurigana}
                  onChange={toggleFurigana}
                />
                Show Furigana
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
                  onChange={(e) => setRandomizeWords(e.target.checked)}
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
          {displayedWords.map((word, index) => (
            <li
              key={word.id}
              className={index === currentIndex ? 'active' : ''}
              onClick={() => handleSidebarClick(index)}
              onMouseOver={() => setHoveredIndex(index)}
              onMouseOut={() => setHoveredIndex(null)}
              dangerouslySetInnerHTML={{
                __html:
                  hoveredIndex === index
                    ? showEnglishFirst
                      ? word.english
                      : showFurigana ? word.line : stripFurigana(word.line)
                    : showEnglishFirst
                      ? word.english
                      : showFurigana ? word.line : stripFurigana(word.line),
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
            src={`${baseImageUrl}image_${currentLesson}_${currentWord.id}.png`}
            alt={currentWord.word}
          />
        )}
        
        {showText && ( // Condition to render only if showText is true
          <h1
            className="word"
            onClick={() => setShowEnglish(!showEnglish)}
            dangerouslySetInnerHTML={{
              __html: showEnglish ? currentWord.english : showFurigana ? currentWord.line : stripFurigana(currentWord.line),
            }}
          />
        )}
        
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
      </div>
    </div>
  );
}

export default WordsList;