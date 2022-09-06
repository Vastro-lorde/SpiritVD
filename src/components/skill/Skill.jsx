import React from 'react';
import style from './skill.module.css';

const Skill = (props) => {

    const skillPrint = ( xp )=>{
        let skillPoints = [];
        for (let i = 0; i < parseInt(xp); i++) {
            skillPoints.push(1);
        }
        return skillPoints;
    }
    return (
        <div className={props.theme ==='light'? style.Skill : style.SkillNight}>
            {props.xp === undefined? <p className={props.theme === 'light'? style.skillName+ ' ' +style.hobbies: style.skillNameNight+ ' ' +style.hobbies}>{props.name}</p> : <p className={props.theme === 'light'? style.skillName: style.skillNameNight}>{props.name}</p>}
            
            {
                props.xp === undefined ? ' ': 
                <div className={style.xp}>
                {/* {[...Array(parseInt(props.xp))].map((e)=> <div className={style.skillPoint}></div>)} */}
                {skillPrint(props.xp).map((e)=> <div className={style.skillPoint}></div>)}
            </div>
            }
            
        </div>
    );
}

export default Skill;
