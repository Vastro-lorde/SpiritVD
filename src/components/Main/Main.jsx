import React from 'react';
import style from './main.module.css';
import Bio from '../Bio/Bio';
import { useState, useEffect } from 'react';

const Main = () => {
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
   
    return (
        <div className={theme === 'light'? style.Main : style.night}>
            <Bio />
        </div>
    );
}

export default Main;
