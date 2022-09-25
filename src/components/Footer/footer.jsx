import React, {useState} from 'react';
import style from './footer.module.css';

const Footer = () => {
    
    const runtime=()=>{
        setTimeout(() => {
            setTime(new Date(Date.now()).toLocaleString())
            runtime();
        }, 100);
    }
    const [time, setTime] = useState(runtime);
    
    return (
        <div className={style.Footer}>
            {time}
        </div>
    );
}

export default Footer;
