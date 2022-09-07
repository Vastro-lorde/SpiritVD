import React from 'react';
import style from './job.module.css';

const Job = (props) => {
    const theme = props.theme;
    return (
        <div className={theme ==='light'? style.JobDay : style.jobNight}>
            Job
        </div>
    );
}

export default Job;
