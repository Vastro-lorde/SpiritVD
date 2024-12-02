import React, { useContext } from 'react'
import style from './education.module.css';
import { educations } from '../../helpers/Constants'
import EducationCard from './EducationCard';
import { ThemeContext } from '../../context/ThemeContext';

const Education = () => {
    const { theme } = useContext(ThemeContext)
    return (
        <div className={theme ==='light'? 'sectionContainerDay' : 'sectionContainer' } id='Education'>
            <h2 className={theme ==='light'? 'h2Day' : 'h2Night'}>Education</h2>
            <div className={style.educations}>
                {educations.map((education,index)=> 
                    <EducationCard 
                        key={index}
                        school={education.school} 
                        schoolUrl={education.schoolUrl} 
                        schoolLogo={education.schoolLogo}
                        location={education.location} 
                        year={education.year} 
                        degree={education.degree} 
                    />
                
                )}
                
        </div>
        </div>
    )
}

export default Education;
