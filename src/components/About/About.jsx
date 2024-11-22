import React, { useContext } from 'react';
import style from './about.module.css';
import Skill from '../skill/Skill.jsx';
import { ThemeContext } from '../../context/ThemeContext';
import { hobbies, skills } from '../../helpers/Constants.js';

const About = (props) => {
    const { theme } =useContext(ThemeContext)
    // const navigate = useNavigate();
    
    return (
        <div className={theme ==='light'? 'sectionContainerDay' : 'sectionContainer' } id='About'>
            <h2 className={theme ==='light'? 'h2Day' : 'h2Night'}>About me</h2>
            <div>
                <h3>Skills</h3>
                <div className={style.skills}>
                    {skills.map((skill,index)=> <div key={index}><Skill name={skill.name} xp={skill.point}/></div>)}
                </div>
            </div>
            <div>
                <h3>Hobbies</h3>
                <div className={style.skills}>
                    {hobbies.map((hobby, index)=> <div key={index}><Skill name={hobby.name} xp={hobby.point} /></div>)}
                </div>
            </div>
        </div>
    );
}

export default About;