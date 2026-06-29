import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { Cloudinary } from '@cloudinary/url-gen';
import WordContent from './components/WordContent';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
function App() {
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

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'hgcstx3uy'
    }
  });

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
        setCurrentIndex(0);
        setShowEnglish(showEnglishFirst);

        if (autoPlayAudio && data.length > 0) {
          playAudio(currentLesson, data[0].id, langCode);
        }
      })
      .catch((error) => console.error('Error fetching lesson:', error));
  }, [autoPlayAudio, showEnglishFirst]);

  const playAudio = (lessonId, wordId, langCode) => {
    const myAudio = `https://res.cloudinary.com/hgcstx3uy/raw/upload/${langCode}/audio/audio_${lessonId}_${wordId}.mp3`;
    new Audio(myAudio).play().catch((error) => console.error('Audio play blocked:', error));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lessonsResponse = await fetch(`/api/${selectedLanguage}/lessons.json`);
        const lessonsData = await lessonsResponse.json();

        const languagesResponse = await fetch('/server/data/languages.json');
        const languagesData = await languagesResponse.json();

        setLessons(lessonsData.lessons);
        setLanguages(languagesData);

        if (lessonsData.lessons.length > 0) {
          const firstLesson = lessonsData.lessons[0];
          setCurrentLesson(firstLesson.id);
          loadLesson(firstLesson.id, selectedLanguage);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedLanguage, loadLesson]);

  const handleLessonChange = (e) => {
    const selectedLesson = parseInt(e.target.value, 10);
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
    if (autoPlayAudio) {
      playAudio(currentLesson, words[nextIndex].id, selectedLanguage);
    }
  };

  const handlePrevious = () => {
    const prevIndex = (currentIndex - 1 + words.length) % words.length;
    setCurrentIndex(prevIndex);
    if (autoPlayAudio) {
      playAudio(currentLesson, words[prevIndex].id, selectedLanguage);
    }
  };

  const handleRandom = () => {
    const randIndex = Math.floor(Math.random() * words.length);
    setCurrentIndex(randIndex);
    if (autoPlayAudio) {
      playAudio(currentLesson, words[randIndex].id, selectedLanguage);
    }
  };

  const handleSidebarClick = (index) => {
    setCurrentIndex(index);
    if (autoPlayAudio) {
      playAudio(currentLesson, words[index].id, selectedLanguage);
    }
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

  if (words.length === 0) {
    return <div>Loading...</div>;
  }

  const currentWord = words[currentIndex];
  const myImage = cld.image(
    `${selectedLanguage}/images/image_${currentLesson}_${currentWord.id}`
  );

  return (
    <div className="container">
      <Header
        languages={languages}
        selectedLanguage={selectedLanguage}
        handleLanguageChange={handleLanguageChange}
        lessons={lessons}
        currentLesson={currentLesson}
        handleLessonChange={handleLessonChange}
        menuOpen={menuOpen}
        toggleMenu={toggleMenu}
        autoPlayAudio={autoPlayAudio}
        setAutoPlayAudio={setAutoPlayAudio}
        showEnglishFirst={showEnglishFirst}
        setShowEnglishFirst={setShowEnglishFirst}
        showBackgroundImage={showBackgroundImage}
        toggleBackgroundImage={toggleBackgroundImage}
        showText={showText}
        setShowText={setShowText}
      />

      <Sidebar
        displayedWords={words}
        currentIndex={currentIndex}
        handleSidebarClick={handleSidebarClick}
        showEnglishFirst={showEnglishFirst}
      />

      <WordContent
        currentWord={currentWord}
        showEnglish={showEnglish}
        setShowEnglish={handleWordContainerClick}
        myImage={myImage}
        showBackgroundImage={showBackgroundImage}
        showText={showText}
        hoveredWordIndex={hoveredWordIndex}
        setHoveredWordIndex={setHoveredWordIndex}
        playAudio={playAudio}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        handleRandom={handleRandom}
        currentLesson={currentLesson}
        selectedLanguage={selectedLanguage}
        autoPlayAudio={autoPlayAudio}
      />
    </div>
  );
}

export default App;