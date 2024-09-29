import React from 'react';

const Sidebar = ({ displayedWords, currentIndex, handleSidebarClick, showEnglishFirst }) => {
    return (
        <div className="sidebar">
        <ul>
            {displayedWords.map((word, index) => (
            <li
                key={word.id}
                className={index === currentIndex ? 'active' : ''}
                onClick={() => handleSidebarClick(index)}
            >
                {showEnglishFirst ? word.english : word.line.join('')} 
            </li>
            ))}
        </ul>
        </div>
    );
};

export default Sidebar;
