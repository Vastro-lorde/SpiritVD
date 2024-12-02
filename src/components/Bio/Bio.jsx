import React, { useContext, useCallback, useEffect, useMemo } from 'react';
import style from './bio.module.css';
import profileImg from '../../assets/profile-img.jpg';
import { MotionImg, MotionDiv, MotionH1, MotionH3, MotionP } from '../../helpers/motion';
import Particles, { initParticlesEngine } from "@tsparticles/react";

import { ThemeContext } from '../../context/ThemeContext';
import { socialMedias } from '../../helpers/Constants';
import SocialMediaLinks from './SocialMediaLinks';
import particlesOptions from '../../helpers/particlesOptions';

const Bio = () => {
    const { theme } = useContext(ThemeContext)
    useEffect(() => {
        initParticlesEngine(async (engine) => {
        }).then(() => {
          console.log("particles.js loaded");
        });
      }, []);
    const particlesLoaded = useCallback(async container => {
        await console.log(container);
    }, []);

    const options = useMemo(
        () => (
            {...particlesOptions}
        ),
        []
    );
    return (
        <div className={style.Bio} id="Bio">
            <Particles
                particlesLoaded={particlesLoaded}
                options={options}
            />
            <MotionDiv 
                className={style.info}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 17, duration: 1.0 }}
                initial={{ x: -100, opacity: 0, scale: 0.5, rotate: -30 }}
                animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
            >
                <MotionH1 
                    className={theme === 'light'? style.name : style.nameNight} 
                    animate={{ ease: [0.6, 0.01, -0.05, 0.9], opacity: 1, scale: 1 }}
                >Seun Daniel Omatsola</MotionH1>
                <MotionH3 className={theme ==='light'? style.job : style.jobNight}>A SOFTWARE ENGINEER (.NET/JS)</MotionH3>
                <MotionP className={style.summary}>I am a self-motivated and very proactive team player, Pro efficient in both written and spoken English. I an agile software developer using NodeJs, ReactJs, ASP.net Core. In my spare time, I love to play computer games and research new things</MotionP>
            </MotionDiv>
            <div className={style.profileImgContainer}>
                <div className={style.profileImg}>
                    <MotionImg 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    src={profileImg} alt='profile'
                    />
                </div>
                <div className={style.socialLinks}>
                    { socialMedias.map((socialMedia,index)=><SocialMediaLinks key={index} socialMedia={socialMedia} style={style}/>) }
                </div>
            </div>
        </div>
    );
}

export default Bio;
