import React, { useContext } from 'react';
import style from "./header.module.css";
import day from '../../assets/day.svg';
import night from '../../assets/night.svg';
import { useState } from 'react';
import Resume from '../DownloadResume/Resume';
import {GiHamburgerMenu} from 'react-icons/gi';
import { ThemeContext } from '../../context/ThemeContext';
// import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { theme, setTheme } =useContext(ThemeContext)
    const [menuDisplay, setMenuDisplay] = useState('none')
    // const navigate = useNavigate();
   
    const toggleTheme = ()=>{
        if (theme === 'light') {
            localStorage.setItem('theme','dark');
            setTheme('dark');
        }else{
            localStorage.setItem('theme', 'light');
            setTheme('light');
        }
    }
    return (
        <div className={theme === 'light'? style.Header +' '+ style.day : style.Header +' '+ style.night} id="header">
            
            <div className={style.menu} >
                
                <div>
                        <a href='/'><p className={style.logo}>SpiritVD</p></a>
                </div> 
                <div className={style.logoAndTheme}>
                    {theme ==='light'? 
                        <div className={style.dayNigth} onClick={()=> toggleTheme()}>
                            <img src={day} alt='day time switch'/>
                        </div> : 
                        <div className={style.dayNigth} onClick={()=> toggleTheme()}>
                        <img src={night} alt='day time switch'/>
                        </div>
                    }
                    <div className={style.menuIcon} onClick={()=> menuDisplay ==='none'? setMenuDisplay('flex') : setMenuDisplay('none')}>
                        <GiHamburgerMenu/>
                    </div>
                </div>
                
            </div>
            <div className={style.links} style={{display: menuDisplay}}>
                <a href='#Contact' className={style.a}>Contact</a>
                <a href='#About' className={style.a}>About</a>
                <a href='#Experience' className={style.a}>Experience</a>
                <Resume />
                
            </div>
            <div className={style.largMenu}>
                <div>
                        <a href='/'><p className={style.logo}>SpiritVD</p></a>
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
        </div>
    );
}

export default Header;
