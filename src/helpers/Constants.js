import Delsulogo from '../assets/Delsu.png';
import facebook from '../assets/facebook.svg';
import github from '../assets/github.svg';
import linkedin from '../assets/linkedin.svg';
import twitter from '../assets/twitter.svg';
export const skills = [
    {name: 'C#'},
    {name: 'Javascript'},
    {name: '.NET'},
    {name: 'NodeJs'},
    {name: 'ReactJs'},
    {name: 'Golang'},
    {name: 'Python'},
    {name: 'Git'},
    {name: 'Azure'},
    {name: 'SQL'},
    {name: 'MongoDB'},
    {name: 'Azure DevOps'},
    {name: 'Docker'},
    {name: 'Nginx'},
    {name: 'Linux'},
    {name: 'Postman'},
    {name: 'Windows'},
    {name: 'C'},
    {name: 'C++'},
    {name: 'VueJs'},
    {name: 'HTML'},
    {name: 'CSS'},
    {name: 'Agile'},
    {name: 'Graphics'},
    {name: 'Photography'},
]

export const hobbies = [
    {name: 'Poetry'},
    {name: 'Singing'},
    {name: 'Games'},
    {name: 'Researching'},
    {name: 'Photography'},
    {name: 'Drawing'},
    {name: 'Reading'}
]

export const educations =[
    {
        school: 'Delta State University',
        schoolUrl: 'https://delsu.org/',
        schoolLogo: Delsulogo,
        degree: 'Bachelor of Science, Mathematics',
        location: 'Abraka',
        year: '2016'
    }
]

export const socialMedias = [
    {
        name: 'Facebook',
        link: 'https://www.facebook.com/omatsolaseun',
        logo: facebook
    },
    {
        name: 'Twitter',
        link: 'https://twitter.com/vastroLord',
        logo: twitter
    },
    {
        name: 'LinkedIn',
        link: 'https://www.linkedin.com/in/seundanielomatsola/',
        logo: linkedin
    },
    {
        name: 'Github',
        link: 'https://github.com/Vastro-lorde',
        logo: github
    }
]

export const workExperience = [
    {
        company: "Yanot Consultants, Lagos",
        position: "Software Engineer (Team Lead)",
        startDate: "2023-03",
        endDate: null, // null indicates present
        responsibilities: [
            "Refactored legacy applications from .NET MVC to Blazor WASM.",
            "Developed .NET background services for Electronic Funds Transfer (EFT) and email notifications, integrating with ICG ERP.",
            "Led a team to build REST APIs and directed application testing and deployment, achieving 30% faster response times."
        ]
    },
    {
        company: "Alphacrunch/Cambio, Lagos",
        position: "Software Engineer (Team Lead)",
        startDate: "2022-11",
        endDate: "2024-10",
        responsibilities: [
            "Built and deployed the Cambio.ng platform using the MERN stack, implementing CI/CD pipelines on Render and Netlify.",
            "Created and maintained product entity diagrams, working with leadership to shape project requirements."
        ]
    },
    {
        company: "Seven-Up/Pepsi, Lagos",
        position: ".NET Software Engineer",
        startDate: "2022-10",
        endDate: "2023-03",
        responsibilities: [
            "Built RESTful APIs using ASP.NET Web API and created front-end interfaces with React and TypeScript.",
            "Designed clean, decoupled architecture and entity diagrams to optimize scalability and maintainability."
        ]
    },
    {
        company: "Decagon, Lagos",
        position: ".NET Software Engineer",
        startDate: "2021-10",
        endDate: "2022-10",
        responsibilities: [
            "Developed full-stack applications in .NET and React, creating microservices with ASP.NET Core and designing RESTful APIs.",
            "Implemented robust code practices and clean architecture to ensure maintainable and efficient solutions."
        ]
    },
    {
        company: "Africinnovate, Akwa-Ibom",
        position: "Software Engineer",
        startDate: "2020-01",
        endDate: "2021-09",
        responsibilities: [
            "Collaborated with other engineers to implement technical designs and project requirements.",
            "Built RESTful APIs with Node.js and ASP.NET Web API, Dockerizing applications for ease of deployment.",
            "Developed UI interfaces using Vue.js, supporting end-to-end functionality from Figma designs."
        ]
    }
];
  

export const resumeUrl = 'https://docs.google.com/document/d/1qwQuZRXuvnhf8U88p9S-aSAhW3t-AinwNQAUgCkgSo8/edit?usp=sharing'