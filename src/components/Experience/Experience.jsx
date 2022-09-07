import React from 'react';
import Job from '../Job/Job';
import style from './experience.module.css';

const Experience = (props) => {
    const theme = props.theme
    return (
        <div className={style.exp} id='Experience'>
            <h2 className={theme ==='light'? 'h2Day' : 'h2Night'}>Experience</h2>
            <Job
            theme={theme}
             />
        </div>
    );
}

export default Experience;
