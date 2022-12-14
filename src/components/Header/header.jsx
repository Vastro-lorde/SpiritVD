import React from 'react';
import style from "./header.module.css";
import day from '../../assets/day.svg';
import night from '../../assets/night.svg';
import { useState, useEffect } from 'react';
import Resume from '../DownloadResume/Resume';
import {GiHamburgerMenu} from 'react-icons/gi';
// import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [theme, setTheme] = useState('dark'||'light');
    const [menuDisplay, setMenuDisplay] = useState('none')
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
            <div className={style.menu} >
                <div className={style.menuIcon} onClick={()=> menuDisplay ==='none'? setMenuDisplay('block') : setMenuDisplay('none')}>
                    <GiHamburgerMenu/>
                </div>
                <div className={style.menuLinks} style={{display: menuDisplay}}>
                    <a href='#Contact' className={style.a}>Contact</a>
                    <a href='#About' className={style.a}>About</a>
                    <a href='#Experience' className={style.a}>Experience</a>
                    <Resume />
                </div>
                    {theme ==='light'? 
                    <div className={style.dayNigth} onClick={()=> toggleTheme()}>
                        <img src={day} alt='day time switch'/>
                    </div> : 
                    <div className={style.dayNigth} onClick={()=> toggleTheme()}>
                    <img src={night} alt='day time switch'/>
                    </div>}
            </div>
            <div className={style.links}>
                <a href='#Contact' className={style.a}>Contact</a>
                <a href='#About' className={style.a}>About</a>
                <a href='#Experience' className={style.a}>Experience</a>
                <Resume />
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
