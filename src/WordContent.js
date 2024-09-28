import React from 'react';
import { AdvancedImage } from '@cloudinary/react';

const WordContent = ({ currentWord, showEnglish, setShowEnglish, myImage, showBackgroundImage, showText, hoveredWordIndex, setHoveredWordIndex, handleWordPartMouseMove, tooltipRef, playAudio, handleNext, handlePrevious, handleRandom, currentLesson, selectedLanguage }) => {
    return (
        <div className="word-content" style={{ backgroundColor: showBackgroundImage ? 'transparent' : 'black' }}>
            {showBackgroundImage && (
            <AdvancedImage className="word-image" cldImg={myImage} alt={currentWord.english} />
            )}

            {showText && (
            <div className="word-container" onClick={() => setShowEnglish(!showEnglish)}>
                {showEnglish ? (
                <h1 className="word">{currentWord.english}</h1>
                ) : (
                currentWord.line.map((wordPart, wordIndex) => (
                    <span
                    key={wordIndex}
                    className={`word-part ${hoveredWordIndex === wordIndex ? 'highlighted' : ''}`}
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

        {/* Buttons Container */}
        <div className="buttons-container">
            <button className="previous-button" onClick={handlePrevious}> 
                Previous
            </button>
            <button className="replay-button" onClick={() => playAudio(currentLesson, currentWord.id, selectedLanguage)}>
                Replay Audio
            </button>
            <button className="next-button" onClick={handleNext}>
                Next
            </button>
            <button className="random-button" onClick={handleRandom}>
                Random
            </button>
            </div>

            {showText && (
            <p className="fact-text">
                <i>{currentWord.fact}</i>
            </p>
            )}
        </div>
    );
};

export default WordContent;