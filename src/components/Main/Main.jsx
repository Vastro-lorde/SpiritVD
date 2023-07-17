import React, { useContext } from 'react';
import style from './main.module.css';
import Bio from '../Bio/Bio';
import { useRef } from 'react';
import About from '../About/About.jsx';
// import Experience from '../Experience/Experience';
import Contact from '../Contact/Contact';
import { ThemeContext } from '../../context/ThemeContext';

const Main = () => {
    const { theme } =useContext(ThemeContext)
    const scrollUp = useRef(0);
    const scrollDown = useRef(0);
    // const navigate = useNavigate();

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
            <Bio />
            <About />
            {/* <Experience theme={theme} /> */}
            <Contact />
        </div>
    );
}

export default Main;
