import React from 'react';
import style from './resume.module.css'

const Resume = () => {
    return (
        <a href='https://docs.google.com/document/d/1ovLKuJhm-mmlTyFO_ZYnRSCyGDu2fdHU/edit?usp=sharing&ouid=109028705090515635870&rtpof=true&sd=true' 
                    target='_blank' rel="noopener noreferrer" 
                    className={style.a + " "+ style.resume}>
                        Download Resume</a>
    );
}

export default Resume;
