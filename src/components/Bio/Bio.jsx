import React, { useContext } from 'react';
import style from './bio.module.css';
import profileImg from '../../assets/profile-img.jpg';

import { ThemeContext } from '../../context/ThemeContext';
import { socialMedias } from '../../helpers/Constants';
import SocialMediaLinks from './SocialMediaLinks';

const Bio = () => {
    const { theme } =useContext(ThemeContext)
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
                    { socialMedias.map((socialMedia,index)=><SocialMediaLinks key={index} socialMedia={socialMedia} style={style}/>) }
                </div>
            </div>
        </div>
    );
}

export default Bio;
