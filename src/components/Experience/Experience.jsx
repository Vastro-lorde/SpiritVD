import React, { useContext } from 'react';
import Job from '../Job/Job';
import style from './experience.module.css';
import { ThemeContext } from '../../context/ThemeContext';

const Experience = () => {
    const { theme } =useContext(ThemeContext)
    return (
        <div className={style.exp} id='Experience'>
            <h2 className={theme ==='light'? 'h2Day' : 'h2Night'}>Experience</h2>
            <Job />
        </div>
    );
}

export default Experience;
