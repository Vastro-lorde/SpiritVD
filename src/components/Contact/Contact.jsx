import React from 'react';
import Resume from '../DownloadResume/Resume';
import style from './contact.module.css';

const Contact = (props) => {
    const theme = props.theme
    return (
        <div className={style.contact} id='Contact'>
            <h2 className={theme ==='light'? 'h2Day' : 'h2Night'}>Contact Me</h2>
            <div className={theme ==='light'? style.contactBody: style.contactBodyNight}>
                <div>
                    <p>Interested running a project with me? <br /> Drop a message.</p>
                    <Resume />
                </div>
                <div className={theme ==='light'? style.formContainer: style.formContainerNight} >
                    <form action="" method="post">
                        <input 
                            type="text" 
                            name="fullname" 
                            id="fullname" 
                            placeholder='Enter your Fullname'
                            className={theme ==='light'? style.fullname: style.fullnameNight} />
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            placeholder='Enter your email'
                            className={theme ==='light'? style.email: style.emailNight} />
                        <textarea 
                            name="message" 
                            id="message" 
                            cols="40" 
                            rows="5" 
                            placeholder='Type your message'
                            className={theme ==='light'? style.message: style.messageNight}>
                        </textarea>
                        <button type="submit" className={theme ==='light'? style.submit: style.submitNight}>Send</button>
                        <p>message sent</p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contact;
