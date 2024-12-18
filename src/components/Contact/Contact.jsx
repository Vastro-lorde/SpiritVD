import React, {useState, useRef, useContext} from 'react';
import Resume from '../DownloadResume/Resume';
import style from './contact.module.css';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';

const Contact = () => {
    const [emailInput, setEmailInput] = useState('');
    const [fullnameInput, setFullnameInput] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const alertMessage = useRef(null);
    const { theme } =useContext(ThemeContext)

    const sendMessage = (e)=>{
        e.preventDefault();
        axios.post('https://formsubmit.co/ajax/686caa330a2a1838551c3cbadc2f4c3d',{
            name: fullnameInput,
            email: emailInput,
            message: messageInput
        }).then(()=>{
            alertMessage.current.style.display = "block";
        });
        
        setTimeout(()=>{
            alertMessage.current.style.display = 'none';
            setEmailInput('');
            setFullnameInput('');
            setMessageInput('');
        },5000)
    }

    return (
        <div className={theme ==='light'? 'sectionContainerDay' : 'sectionContainer'} id='Contact'>
            <h2 className={theme ==='light'? 'h2Day' : 'h2Night'}>Contact Me</h2>
            <div className={style.contactBody}>
                <div>
                    <p>Interested running a project with me? <br /> Drop a message.</p>
                    <Resume />
                </div>
                <div className={theme ==='light'? style.formContainer: style.formContainerNight} >
                    <form onSubmit={(e)=> sendMessage(e)}>
                        <input 
                            type="text" 
                            name="fullname" 
                            id="fullname" 
                            value={fullnameInput}
                            placeholder='Enter your Fullname'
                            onChange={(e)=> setFullnameInput(e.target.value)}
                            className={theme ==='light'? style.fullname: style.fullname} required/>
                        <input 
                            type="email" 
                            name="email" 
                            id="email" 
                            value={emailInput}
                            placeholder='Enter your email'
                            onChange={(e)=> setEmailInput(e.target.value)}
                            className={theme ==='light'? style.email: style.email} required />
                        <textarea 
                            name="message" 
                            id="message" 
                            cols="40" 
                            rows="5" 
                            placeholder='Type your message'
                            value={messageInput}
                            onChange={(e)=> setMessageInput(e.target.value)}
                            className={theme ==='light'? style.message: style.message} required>
                        </textarea>
                        <button 
                            type="submit" 
                            className={theme ==='light'? style.submit: style.submit}>
                                Send</button>
                        <p 
                            className={theme ==='light'? style.alert: style.alert}
                            ref ={alertMessage}>Message Sent</p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contact;
