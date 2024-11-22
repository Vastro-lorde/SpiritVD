import React, { useContext } from 'react';
import Job from '../Job/Job';
import style from './experience.module.css';
import { ThemeContext } from '../../context/ThemeContext';
import { workExperience } from '../../helpers/Constants';

const Experience = () => {
    const { theme } =useContext(ThemeContext)
    return (// className={style.exp}
        <div className={theme ==='light'? 'sectionContainerDay' : 'sectionContainer' } id='Experience'> 
            <h2 className={theme ==='light'? 'h2Day' : 'h2Night'}>Experience</h2>
            <div className={style.jobList}>
                {workExperience.map((exp, index) => (
                        <Job key={index} experience={exp} />
                    ))}
            </div>
        </div>
    );
}

export default Experience;
