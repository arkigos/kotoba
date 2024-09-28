import React, { useEffect, useState, useCallback, useRef } from 'react';
import './WordsList.css';
import WordDisplay from './components/WordDisplay';
import LessonControls from './components/LessonControls';
import LanguageControls from './components/LanguageControls';
import Sidebar from './components/Sidebar';
import SettingsMenu from './components/SettingsMenu';

function WordsList() {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(1);
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEnglish, setShowEnglish] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [showEnglishFirst, setShowEnglishFirst] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredWordIndex, setHoveredWordIndex] = useState(null);
  const [showBackgroundImage, setShowBackgroundImage] = useState(true);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('jp');
  const [showText, setShowText] = useState(true);

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
        // Add lessonId to each word object
        const wordsWithLessonId = data.map(word => ({ ...word, lessonId: currentLesson }));
        setWords(wordsWithLessonId); 
        setCurrentIndex(0);
        setShowEnglish(showEnglishFirst);

        if (autoPlayAudio && data.length > 0) {
          playAudio(currentLesson, data[0].id);
        }
      })
      .catch((error) => console.error('Error fetching lesson:', error));
  }, [autoPlayAudio, showEnglishFirst]);

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
    loadLesson(currentLesson, selectedLangCode);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % words.length;
    setCurrentIndex(nextIndex);
    playAudio(currentLesson, words[nextIndex].id);
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + words.length) % words.length;
    setCurrentIndex(prevIndex);
    playAudio(currentLesson, words[prevIndex].id);
  };

  const handleRandom = () => {
    const randIndex = Math.floor(Math.random() * words.length);
    setCurrentIndex(randIndex);
    playAudio(currentLesson, words[randIndex].id);
  };

  const handleSidebarClick = (index) => {
    setCurrentIndex(index);
    playAudio(currentLesson, words[index].id);
  };

  const playAudio = (lessonId, wordId) => {
    const myAudio = `https://res.cloudinary.com/hgcstx3uy/raw/upload/${selectedLanguage}/audio/audio_${lessonId}_${wordId}.mp3`;
    const audio = new Audio(myAudio);
    audio.play().catch((error) => console.error('Audio play blocked:', error));
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleBackgroundImage = () => {
    setShowBackgroundImage(!showBackgroundImage);
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
  const currentWord = displayedWords[currentIndex];

  return (
    <div className="container">
      <div className="header-container">
        <LanguageControls
          selectedLanguage={selectedLanguage}
          handleLanguageChange={handleLanguageChange}
          languages={languages}
        />

        <SettingsMenu 
          autoPlayAudio={autoPlayAudio}
          setAutoPlayAudio={setAutoPlayAudio}
          showEnglishFirst={showEnglishFirst}
          setShowEnglishFirst={setShowEnglishFirst}
          showBackgroundImage={showBackgroundImage}
          toggleBackgroundImage={toggleBackgroundImage}
          showText={showText}
          setShowText={setShowText}
          menuOpen={menuOpen}
          toggleMenu={toggleMenu}
        />
      </div>

      <Sidebar
        words={displayedWords}
        currentIndex={currentIndex}
        handleSidebarClick={handleSidebarClick}
        showEnglishFirst={showEnglishFirst}
      />
          <div className="word-content-container">
            <div className="word-display-area">
              <WordDisplay
                currentWord={currentWord}
                showEnglish={showEnglish}
                setShowEnglish={setShowEnglish}
                showBackgroundImage={showBackgroundImage}
                selectedLanguage={selectedLanguage}
                hoveredWordIndex={hoveredWordIndex}
                setHoveredWordIndex={setHoveredWordIndex}
                handleWordPartMouseMove={handleWordPartMouseMove}
                showText={showText} 
              />

              <LessonControls
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                handleRandom={handleRandom}
                currentLesson={currentLesson} 
                currentWord={currentWord} 
                playAudio={playAudio} 
              />
            </div>
          </div>
    </div>
  );
}

export default WordsList;