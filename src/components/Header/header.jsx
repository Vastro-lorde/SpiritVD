import React from 'react';
import style from "./header.module.css";
import day from '../../assets/day.svg'
// import {Link} from 'react-router-dom'

const Header = () => {
    return (
        <div className={style.Header}>
            <div>
                <a href='/'><p className={style.logo}>SpiritVD</p></a>
            </div>
            <div className={style.links}>
                <a href='#Contact' className={style.a}>Contact</a>
                <a href='#About' className={style.a}>About</a>
                <a href='#Experience' className={style.a}>Experience</a>
                <a href='https://drive.google.com/u/0/uc?id=1Jz3WdrYTpVIS6ozDD_zYfxnmF5VO5woB&export=download' className={style.a + " "+ style.resume}>Download Resume</a> 
                <div className={style.dayNigth}>
                    <img src={day} alt='day time switch'/>
                </div>
            </div>
        </div>
    );
}

export default Header;
