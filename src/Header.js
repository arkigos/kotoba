import React from 'react';

const Header = ({ languages, selectedLanguage, handleLanguageChange, lessons, currentLesson, handleLessonChange, menuOpen, toggleMenu, autoPlayAudio, setAutoPlayAudio, showEnglishFirst, setShowEnglishFirst, showBackgroundImage, toggleBackgroundImage, showText, setShowText }) => {
    return (
        <div className="header-container">
        {/* Language Dropdown */}
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

        {/* Lesson Dropdown */}
        <div className="lesson-dropdown">
            <label htmlFor="lesson-select">Lesson:</label>
            <select id="lesson-select" value={currentLesson} onChange={handleLessonChange}>
            {Object.entries(groupByLevel(lessons)).map(([level, levelLessons]) => (
                <optgroup key={level} label={level}>
                {levelLessons.map((lesson) => (
                    <option key={lesson.id} value={lesson.id}>
                    {lesson.name}
                    </option>
                ))}
                </optgroup>
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
                {/* Menu Items */}
                <label>
                <input type="checkbox" checked={autoPlayAudio} onChange={(e) => setAutoPlayAudio(e.target.checked)} />
                Play Audio Automatically
                </label>
                <label>
                <input type="checkbox" checked={showEnglishFirst} onChange={(e) => setShowEnglishFirst(e.target.checked)} />
                Show English First
                </label>
                <label>
                <input type="checkbox" checked={showBackgroundImage} onChange={toggleBackgroundImage} />
                Show Background Image
                </label>
                <label>
                <input type="checkbox" checked={showText} onChange={(e) => setShowText(e.target.checked)} />
                Show Text
                </label>
            </div>
            )}
        </div>
        </div>
    );
};

function groupByLevel(lessons) {
    return lessons.reduce((grouped, lesson) => {
        const level = lesson.params.level; 
        if (!grouped[level]) {
        grouped[level] = [];
        }
        grouped[level].push(lesson);
        return grouped;
    }, {});
}

export default Header;
