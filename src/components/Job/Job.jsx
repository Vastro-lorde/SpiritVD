import React, { useContext } from 'react';
import style from './job.module.css';
import { ThemeContext } from '../../context/ThemeContext';

const Job = ({ experience }) => {
    const { theme } = useContext(ThemeContext);
    const { company, position, startDate, endDate, responsibilities } = experience;
    const formatDate = (dateString) => {
        if (!dateString) return 'Present';
        
        const date = new Date(dateString + '-01'); // Add day for valid date
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
        });
    };

    const duration = `${formatDate(startDate)} – ${formatDate(endDate)}`;
    return (
        <div className={theme ==='light'? style.jobDay : style.jobNight}>
            <div className={style.header}>
                <h3 className={style.position}>{position}</h3>
                <p className={theme === 'light' ? style.company : style.companyNight}>
                    {company}
                </p>
                <p className={theme === 'light' ? style.duration : style.durationNight}>
                    {duration}
                </p>
            </div>
            <ul className={style.responsibilities}>
                {responsibilities.map((responsibility, index) => (
                    <li 
                        key={index} 
                        className={theme === 'light' ? style.responsibility : style.responsibilityNight}
                    >
                        {responsibility}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Job;
