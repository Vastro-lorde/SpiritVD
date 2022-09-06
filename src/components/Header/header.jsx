import React from 'react';
import style from "./header.module.css";
import day from '../../assets/day.svg';
import night from '../../assets/night.svg';
import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [theme, setTheme] = useState('dark'||'light');
    // const navigate = useNavigate();

    useEffect(() => {
        const newTheme = localStorage.getItem('theme');
        if (newTheme === null) {
          setTheme('light');
        } else {
          setTheme(newTheme);
        }
      }, []);
   
    const toggleTheme = ()=>{
        if (theme === 'light') {
            localStorage.setItem('theme','dark');
            setTheme('dark');
            window.location.reload(false);
        }else{
            localStorage.setItem('theme', 'light');
            setTheme('light');
            window.location.reload(false);
        }
    }
    return (
        <div className={theme === 'light'? style.Header +' '+ style.day : style.Header +' '+ style.night} id="header">
            <div>
                <a href='/'><p className={style.logo}>SpiritVD</p></a>
            </div>
            <div className={style.links}>
                <a href='#Contact' className={style.a}>Contact</a>
                <a href='#About' className={style.a}>About</a>
                <a href='#Experience' className={style.a}>Experience</a>
                <a href='https://docs.google.com/document/d/1ovLKuJhm-mmlTyFO_ZYnRSCyGDu2fdHU/edit?usp=sharing&ouid=109028705090515635870&rtpof=true&sd=true'  target='_blank' rel="noopener noreferrer" className={style.a + " "+ style.resume}>Download Resume</a> 
                {theme ==='light'? <div className={style.dayNigth} onClick={()=> toggleTheme()}>
                    <img src={day} alt='day time switch'/>
                </div> : <div className={style.dayNigth} onClick={()=> toggleTheme()}>
                <img src={night} alt='day time switch'/>
            </div>}
            </div>
        </div>
    );
}

export default Header;
