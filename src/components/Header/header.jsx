import React, { useContext } from 'react';
import style from "./header.module.css";
import day from '../../assets/day.svg';
import night from '../../assets/night.svg';
import { useState } from 'react';
import Resume from '../DownloadResume/Resume';
import {GiHamburgerMenu} from 'react-icons/gi';
import { ThemeContext } from '../../context/ThemeContext';
import { MotionDiv } from '../../helpers/motion';
// import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { theme, setTheme } = useContext(ThemeContext)
    const [menuDisplay, setMenuDisplay] = useState('none')
    // const navigate = useNavigate();
    const boxVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
      }
   
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
            
            <MotionDiv 
                className={style.largMenu}
                variants={boxVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ skew: 1.1 }}
                transition={{ duration: 0.5 }}
            >
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
                
            </MotionDiv>
        </div>
    );
}

export default Header;
