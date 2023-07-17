import React, { useContext } from 'react';
import style from './about.module.css';
import Skill from '../skill/Skill.jsx';
import Education from '../Education/Education';
import Delsulogo from '../../assets/Delsu.png';
import { ThemeContext } from '../../context/ThemeContext';

const About = (props) => {
    const { theme } =useContext(ThemeContext)
    // const navigate = useNavigate();
    const skills = [
        {name: 'C#', point: '7'},
        {name: 'C', point: '5'},
        {name: 'C++', point: '2'},
        {name: 'Javascript', point: '8'},
        {name: '.NET', point: '7'},
        {name: 'NodeJs', point: '8'},
        {name: 'ReactJs', point: '8'},
        {name: 'VueJs', point: '4'},
        {name: 'HTML', point: '8'},
        {name: 'CSS', point: '8'},
        {name: 'Golang', point: '6'},
        {name: 'Agile', point: '9'},
        {name: 'Graphics', point: '9'},
        {name: 'Photography', point: '7'},
    ]

    const hobbies = [
        {name: 'Poetry'},
        {name: 'Singing'},
        {name: 'Games'},
        {name: 'Researching'},
        {name: 'Photography'},
        {name: 'Drawing'},
        {name: 'Reading'}
    ]

    const educations =[
        {
            school: 'Delta State University',
            schoolUrl: 'https://delsu.org/',
            schoolLogo: Delsulogo,
            degree: 'Bachelor of Science, Mathematics',
            location: 'Abraka',
            year: '2016'
        }
    ]
    
    return (
        <div className={theme ==='light'? style.AboutDay : style.About } id='About'>
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