import React, { useContext } from 'react';
import style from './job.module.css';
import { ThemeContext } from '../../context/ThemeContext';

const Job = () => {
    const { theme } =useContext(ThemeContext)
    return (
        <div className={theme ==='light'? style.JobDay : style.jobNight}>
            Job
        </div>
    );
}

export default Job;
