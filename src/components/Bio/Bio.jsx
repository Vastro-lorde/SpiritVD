import React from 'react';
import style from './bio.module.css';
import profileImg from '../../assets/profile-img.jpeg';
import facebook from '../../assets/facebook.svg';
import github from '../../assets/github.svg';
import linkedin from '../../assets/linkedin.svg';
import twitter from '../../assets/twitter.svg';

const Bio = () => {
    return (
        <div className={style.Bio}>
            <div className={style.info}>
                <h2 className={style.myName}>MY NAME IS:</h2>
                <h1 className={style.name} >Seun Daniel Omatsola</h1>
                <h3 className={style.job}>A SOFTWARE ENGINEER (.NET/JS)</h3>
                <p className={style.summary}>With over 3 years experience in commercial application development, I have built innovative and cutting edge business solutions for the impressive suite of clients within its global reach. In previous roles, I slashed downtime by 25% and ensured 98% on-time project completion. Also identified and dealt with a significant process bottleneck that boosted coding efficiency by 35% when resolved.</p>
            </div>
            <div className={style.profileImgContainer}>
                <div className={style.profileImg}>
                    <img src={profileImg} alt='profile'/>
                </div>
                <div className={style.socialLinks}>
                    <div className={style.facebook + ' ' + style.social}>
                        <a href='https://www.facebook.com/omatsolaseun'><img src={facebook} alt='facebook'/></a>
                    </div>
                    <div className={style.twitter  + ' ' + style.social}>
                        <a href='/'><img src={twitter} alt='twitter'/></a>
                    </div>
                    <div className={style.linkedin  + ' ' + style.social}>
                        <a href='https://www.linkedin.com/in/seun-omatsola-429a69166'><img src={linkedin} alt='linkedin'/></a>
                    </div>
                    <div className={style.github  + ' ' + style.social}>
                        <a href='https://github.com/Vastro-lorde'><img src={github} alt='github'/></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Bio;
