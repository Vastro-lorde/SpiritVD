import React from 'react';
import style from './resume.module.css'
import { resumeUrl } from '../../helpers/Constants';

const Resume = () => {
    return (
        <a href= {resumeUrl}
                    target='_blank' rel="noopener noreferrer" 
                    className={style.a + " "+ style.resume}>
                        Download Resume</a>
    );
}

export default Resume;
