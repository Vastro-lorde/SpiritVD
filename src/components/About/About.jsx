import React from 'react';
import style from './about.module.css';
import Skill from '../skill/Skill.jsx';
import Education from '../Education/Education';
import Delsulogo from '../../assets/Delsu.png';

const About = (props) => {
    const theme = props.theme;
    // const navigate = useNavigate();
    const skills = [
        {name: 'C-Sharp', point: '7'},
        {name: 'Javascript', point: '8'},
        {name: '.NET', point: '8'},
        {name: 'NodeJs', point: '6'},
        {name: 'ReactJs', point: '6'},
        {name: 'VueJs', point: '4'},
        {name: 'HTML', point: '8'},
        {name: 'CSS', point: '8'},
        {name: 'Golang', point: '2'},
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
            <h2 className={theme ==='light'? style.titleDay : style.titleNight}>About me</h2>
            <div className={style.educations}>
                <h3>Education</h3>
                {educations.map((e)=> 
                <Education 
                school={e.school} 
                schoolUrl={e.schoolUrl} 
                schoolLogo={e.schoolLogo}
                location={e.location} 
                year={e.year} 
                degree={e.degree} 
                theme={theme}/>
                )}
                
            </div>
            <div className={style.skills}>
                <h3>Skills</h3>
                {skills.map((e)=> <Skill name={e.name} xp={e.point} theme={theme} />)}
            </div>
            <div className={style.skills}>
                <h3>Hobbies</h3>
                {hobbies.map((e)=> <Skill name={e.name} xp={e.point} theme={theme} />)}
            </div>
                <a href='https://docs.google.com/document/d/1ovLKuJhm-mmlTyFO_ZYnRSCyGDu2fdHU/edit?usp=sharing&ouid=109028705090515635870&rtpof=true&sd=true' target='_blank' rel="noopener noreferrer" className={style.a + " "+ style.resume}>Download Resume</a> 
        </div>
    );
}

export default About;