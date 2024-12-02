import React, { useContext, useRef, useEffect, useState, useMemo } from 'react';
import style from './main.module.css';
import Bio from '../Bio/Bio';
import About from '../About/About.jsx';
import Contact from '../Contact/Contact';
import { ThemeContext } from '../../context/ThemeContext';
import Experience from '../Experience/Experience.jsx';
import Education from '../Education/Education.jsx';
import { MotionDiv } from '../../helpers/motion.js';


const Main = () => {
    const { theme } = useContext(ThemeContext);
    const scrollUp = useRef(null);
    const scrollDown = useRef(null);
    const [currentSection, setCurrentSection] = useState(0);

    // References for each section
     // Initialize refs for each section
     const sections = {
      bio: useRef(null),
      about: useRef(null),
      experience: useRef(null),
      education: useRef(null),
      contact: useRef(null),
  };

  // Memoize sectionOrder to prevent unnecessary recalculations
  const sectionOrder = useMemo(() => ['bio', 'about', 'experience', 'education', 'contact'], []);

    useEffect(() => {
        let timeout;
        const handleScroll = () => {
            // Show scroll buttons
            if (scrollUp.current && scrollDown.current) {
                scrollUp.current.style.display = 'block';
                scrollDown.current.style.display = 'block';

                // Clear any existing timeout
                clearTimeout(timeout);

                // Set new timeout
                timeout = setTimeout(() => {
                    if (scrollUp.current && scrollDown.current) {
                        scrollUp.current.style.display = 'none';
                        scrollDown.current.style.display = 'none';
                    }
                }, 3000);
            }

            // Update current section based on scroll position
            const currentPos = window.scrollY + window.innerHeight / 3;
            let newSection = 0;

            sectionOrder.forEach((section, index) => {
                if (sections[section].current) {
                    const sectionTop = sections[section].current.offsetTop;
                    if (currentPos >= sectionTop) {
                        newSection = index;
                    }
                }
            });

            setCurrentSection(newSection);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timeout);
        };
    });

    const scrollToSection = (direction) => {
        const newSection = direction === 'up' 
            ? Math.max(0, currentSection - 1)
            : Math.min(sectionOrder.length - 1, currentSection + 1);

        const targetSection = sections[sectionOrder[newSection]].current;
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
            setCurrentSection(newSection);
        }
    };

    return (
        <MotionDiv 
            className={theme === 'light' ? style.main : style.night}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            backdropFilter={theme === 'light' ? 'blur(10px)' : 'blur(0px)'}
            
        >
            
            <div 
                className={theme === 'light' ? style.up : style.upNight} 
                ref={scrollUp}
                onClick={() => scrollToSection('up')}
            >
                {currentSection > 0 ? sectionOrder[currentSection - 1].charAt(0).toUpperCase() + sectionOrder[currentSection - 1].slice(1) : 'Top'}
            </div>
            <div 
                className={theme === 'light' ? style.down : style.downNight} 
                ref={scrollDown}
                onClick={() => scrollToSection('down')}
            >
                {currentSection < sectionOrder.length - 1 ? sectionOrder[currentSection + 1].charAt(0).toUpperCase() + sectionOrder[currentSection + 1].slice(1) : 'Bottom'}
            </div>

            <div ref={sections.bio}>
                <Bio />
            </div>
            <div ref={sections.about}>
                <About />
            </div>
            <div ref={sections.experience}>
                <Experience theme={theme} />
            </div>
            <div ref={sections.education}>
                <Education />
            </div>
            <div ref={sections.contact}>
                <Contact />
            </div>
        </MotionDiv>
    );
}

export default Main;