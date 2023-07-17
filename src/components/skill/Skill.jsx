import React, { useContext } from 'react';
import style from './skill.module.css';
import { ThemeContext } from '../../context/ThemeContext';

const Skill = (props) => {
    const { theme } =useContext(ThemeContext)
    const skillPrint = ( xp )=>{
        let skillPoints = [];
        for (let i = 0; i < parseInt(xp); i++) {
            skillPoints.push(1);
        }
        return skillPoints;
    }
    return (
        <div className={theme ==='light'? style.Skill : style.SkillNight} >
            {props.xp === undefined? <p className={theme === 'light'? style.skillName+ ' ' +style.hobbies: style.skillNameNight+ ' ' +style.hobbies}>{props.name}</p> : <p className={theme === 'light'? style.skillName: style.skillNameNight}>{props.name}</p>}
            
            {
                props.xp === undefined ? ' ': 
                <div className={style.xp}>
                {skillPrint(props.xp).map((e,index)=> <div className={style.skillPoint} key={index}></div>)}
            </div>
            }
            
        </div>
    );
}

export default Skill;
