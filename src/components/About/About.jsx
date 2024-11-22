import React, { useContext } from 'react';
import style from './about.module.css';
import Skill from '../skill/Skill.jsx';
import Education from '../Education/Education';
import { ThemeContext } from '../../context/ThemeContext';
import { educations, hobbies, skills } from '../../helpers/Constants.js';

const About = (props) => {
    const { theme } =useContext(ThemeContext)
    // const navigate = useNavigate();
    
    return (
        <div className={theme ==='light'? 'sectionContainerDay' : 'sectionContainer' } id='About'>
            <h2 className={theme ==='light'? 'h2Day' : 'h2Night'}>About me</h2>
            <div className={style.educations}>
                <h3>Education</h3>
                {educations.map((education,index)=> 
                <div key={index}>
                    <Education 
                        school={education.school} 
                        schoolUrl={education.schoolUrl} 
                        schoolLogo={education.schoolLogo}
                        location={education.location} 
                        year={education.year} 
                        degree={education.degree} 
                    />
                </div>
                
                )}
                
            </div>
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