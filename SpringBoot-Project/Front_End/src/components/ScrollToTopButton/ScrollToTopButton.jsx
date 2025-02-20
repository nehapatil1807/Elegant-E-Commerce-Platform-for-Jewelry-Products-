import React, { useState, useEffect } from 'react';
import './ScrollToTopButton.css';
import { debounce } from './debounce'; 
import { FaArrowUp } from 'react-icons/fa'; 

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Determine button visibility based on scroll position
    const toggleVisibility = () => {
        const threshold = window.innerWidth < 768 ? 200 : 300; 
        if (window.scrollY > threshold) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Adjust button position dynamically to avoid footer overlap
    const adjustPosition = () => {
        const footer = document.querySelector('footer');
        if (footer) {
            const footerTop = footer.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            const button = document.querySelector('.scroll-to-top');
            if (button) {
                if (footerTop < windowHeight) {
                    button.style.bottom = `${windowHeight - footerTop + 20}px`;
                } else {
                    button.style.bottom = '50px';
                }
            }
        }
    };

    // Scroll to the top of the page
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    // Attach event listeners with debouncing
    useEffect(() => {
        const debouncedToggle = debounce(() => {
            toggleVisibility();
            adjustPosition();
        }, 100);

        window.addEventListener('scroll', debouncedToggle);
        return () => {
            window.removeEventListener('scroll', debouncedToggle);
        };
    }, []);

    return (
        <div className="scroll-to-top-container">
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
                    aria-label="Scroll to top"
                >
                    <FaArrowUp />
                </button>
            )}
            <span className="tooltip">Back to Top</span>
        </div>
    );
};

export default ScrollToTopButton;
