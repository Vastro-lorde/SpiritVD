import React, { useContext } from 'react';
import style from './skill.module.css';
import { ThemeContext } from '../../context/ThemeContext';
import { MotionDiv } from '../../helpers/motion';

const Skill = (props) => {
    const { theme } =useContext(ThemeContext)
    const skillPrint = ( xp )=>{
        let skillPoints = [];
        for (let i = 0; i < parseInt(xp); i++) {
            skillPoints.push(1);
        }
        return skillPoints;
    }
    const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    return (
        <MotionDiv 
            className={theme ==='light'? style.Skill : style.SkillNight} 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 2.0 }}
            initial={{ x: -100, opacity: 0, scale: 0.8, rotate: -randomNumber(0, 360) }}
            animate={{ x: 0, opacity: 1, scale: 1, rotate: 0, ease: [0.6, 0.01, -0.05, 0.9] }}
            transition={{ type: "spring", stiffness: 100, damping: 100, duration: 2.0 }}
        >
            {props.xp === undefined? 
            <p className={theme === 'light'? style.skillName+ ' ' +style.hobbies: style.skillNameNight+ ' ' +style.hobbies}
                
            >{props.name}</p> : 
            <p
            >{props.name}</p>}
            
            {
                props.xp === undefined ? ' ': 
                <div className={style.xp}>
                {skillPrint(props.xp).map((e,index)=> <div className={style.skillPoint} key={index}></div>)}
            </div>
            }
            
        </MotionDiv>
    );
}

export default Skill;
