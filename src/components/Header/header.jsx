import React from 'react';
import style from "./header.module.css";
// import {Link} from 'react-router-dom'

const Header = () => {
    return (
        <div className={style.Header}>
            <div>
                <a href='/'><p className={style.logo}>Seun Daniel Omatsola</p></a>
            </div>
            <div>
                <a href='#Contact' className={style.a}>Contact</a>
                <a href='#About' className={style.a}>About</a>
                <a href='#Experience' className={style.a}>Experience</a>
                <a href='https://drive.google.com/u/0/uc?id=1Jz3WdrYTpVIS6ozDD_zYfxnmF5VO5woB&export=download' className={style.a + " "+ style.resume}>Download Resume</a> 
            </div>
        </div>
    );
}

export default Header;
