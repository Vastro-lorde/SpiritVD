import React from 'react';
import style from './bio.module.css';
import profileImg from '../../assets/profile-img.jpeg';
import facebook from '../../assets/facebook.svg';
import github from '../../assets/github.svg';
import linkedin from '../../assets/linkedin.svg';
import twitter from '../../assets/twitter.svg';

const Bio = (props) => {
    const theme = props.theme
    return (
        <div className={style.Bio} id="Bio">
            <div className={style.info}>
                <h2 className={style.myName}>MY NAME IS:</h2>
                <h1 className={theme === 'light'? style.name : style.nameNight} >Seun Daniel Omatsola</h1>
                <h3 className={theme ==='light'? style.job : style.jobNight}>A SOFTWARE ENGINEER (.NET/JS)</h3>
                <p className={style.summary}>I am a self-motivated and very proactive team player, Pro efficient in both written and spoken English. I an agile software developer using NodeJs, ReactJs, ASP.net Core. In my spare time, I love to play computer games and research new things</p>
            </div>
            <div className={style.profileImgContainer}>
                <div className={style.profileImg}>
                    <img src={profileImg} alt='profile'/>
                </div>
                <div className={style.socialLinks}>
                    <div className={style.facebook + ' ' + style.social}>
                        <a href='https://www.facebook.com/omatsolaseun' target='_blank' rel="noopener noreferrer"><img src={facebook} alt='facebook'/></a>
                    </div>
                    <div className={style.twitter  + ' ' + style.social}>
                        <a href='https://twitter.com/vastroLord' target='_blank' rel="noopener noreferrer"><img src={twitter} alt='twitter'/></a>
                    </div>
                    <div className={style.linkedin  + ' ' + style.social}>
                        <a href='https://www.linkedin.com/in/seun-omatsola-429a69166' target='_blank' rel="noopener noreferrer"><img src={linkedin} alt='linkedin'/></a>
                    </div>
                    <div className={style.github  + ' ' + style.social}>
                        <a href='https://github.com/Vastro-lorde' target='_blank' rel="noopener noreferrer"><img src={github} alt='github'/></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Bio;
