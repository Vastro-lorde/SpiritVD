import React from 'react'

export default function SocialMediaLinks({style, socialMedia}) {
    return (
        <div className={style.social}>
            <a href={socialMedia?.link} target='_blank' rel="noopener noreferrer"><img src={socialMedia?.logo} alt={socialMedia?.name}/></a>
        </div>
    )
}
