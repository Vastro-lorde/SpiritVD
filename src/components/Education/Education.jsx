import React from 'react';
import style from './education.module.css';

const Education = (props) => {
    const theme = props.theme;
    return (
        <div className={theme === 'light'? style.education : style.educationNight}>
            <div className={theme === 'light'? style.schoolLogoDay : style.schoolLogoNight}>
                <a href={props.schoolUrl} target='_blank' rel="noopener noreferrer">
                    <img src={props.schoolLogo} alt="" />
                </a>
            </div>
            <div>
                <p>{props.degree}</p>
                <a href={props.schoolUrl} target='_blank' rel="noopener noreferrer" className={theme === 'light'? style.school : style.schoolNight} >{props.school}</a>
                <span>, {props.location}</span>
                <p><i>{props.year}</i></p>
            </div>
        </div>
    );
}

export default Education;
