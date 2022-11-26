import React from 'react';
import style from './main.module.css';
import Bio from '../Bio/Bio';
import { useState, useEffect, useRef } from 'react';
import About from '../About/About.jsx';
// import Experience from '../Experience/Experience';
import Contact from '../Contact/Contact';

const Main = () => {
    const [theme, setTheme] = useState('dark'||'light');
    const scrollUp = useRef(0);
    const scrollDown = useRef(0);
    // const navigate = useNavigate();

    
    useEffect(() => {
        const newTheme = localStorage.getItem('theme');
        if (newTheme === null) {
          setTheme('light');
        } else {
          setTheme(newTheme);
        }
      }, []);

      window.onscroll = (e)=>{
        scrollUp.current.style.display = 'block';
        scrollDown.current.style.display = 'block';
        setTimeout(() => {
          scrollUp.current.style.display = 'none';
          scrollDown.current.style.display = 'none';
        }, 10000);
      }
      
      const scrollU = ()=>{
        window.scroll({
          top: window.scrollY - 1000, 
          left: 0, 
          behavior: 'smooth' 
         });
      }
      const scrollB = ()=>{
        window.scroll({
          top: window.scrollY + 500, 
          left: 0, 
          behavior: 'smooth' 
         });
      }
    return (
        <div className={theme === 'light'? style.main : style.night}>
          {/* <a href="#header" > */}
            <div 
            className={theme === 'light'? style.up : style.upNight} 
            ref={scrollUp}
            onClick={()=>scrollU()}
            >
              Top
            </div>
            <div 
            className={theme === 'light'? style.down : style.downNight} 
            ref={scrollDown}
            onClick={()=>scrollB()}
            >
              Bottom
            </div>
          {/* </a> */}
            <Bio theme={theme} />
            <About theme={theme} />
            {/* <Experience theme={theme} /> */}
            <Contact theme={theme}/>
        </div>
    );
}

export default Main;
