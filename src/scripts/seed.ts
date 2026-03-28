import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI env variable is required");
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db!;

  // Seed admin user
  const passwordHash = await bcrypt.hash("admin123", 12);
  await db.collection("users").deleteMany({});
  await db.collection("users").insertOne({
    name: "Seun Denial Omatsola",
    email: "omatsolaseund@gmail.com",
    passwordHash,
    bio: "I am a passionate software engineer with over 5 years of professional experience building modern web applications. My journey started with front-end development, but I quickly transitioned into full-stack engineering to architect robust systems from end to end. Currently, I am focused on creating highly performant SaaS platforms, contributing to open-source tools, and continuously exploring emerging technologies like AI integrations and edge computing.",
    title: "Software Engineer (.NET/JS)",
    profileImage: "",
    resumeUrl:
      "https://docs.google.com/document/d/1qwQuZRXuvnhf8U88p9S-aSAhW3t-AinwNQAUgCkgSo8/edit?usp=sharing",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("Seeded: User");

  // Seed social links
  await db.collection("sociallinks").deleteMany({});
  await db.collection("sociallinks").insertMany([
    {
      platform: "twitter",
      url: "https://twitter.com/vastroLord",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/in/seundanielomatsola/",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      platform: "github",
      url: "https://github.com/Vastro-lorde",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log("Seeded: Social Links");

  // Seed experiences (from LinkedIn)
  await db.collection("experiences").deleteMany({});
  const experiences = [
    {
      company: "Int+ Technology, Lagos",
      position: "Chief Technology Officer",
      startDate: "2024-11",
      endDate: null,
      currentlyWorking: true,
      description: "",
      responsibilities: [],
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      company: "Zenith Bank Plc, Lagos",
      position: "Software Engineer",
      startDate: "2024-06",
      endDate: "2025-05",
      currentlyWorking: false,
      description: "",
      responsibilities: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      company: "Yanot Consultants Limited, Lagos",
      position: "Programming Team Lead",
      startDate: "2023-03",
      endDate: "2024-06",
      currentlyWorking: false,
      description: "",
      responsibilities: [
        "Refactored old project from .NET MVC to Blazor WASM.",
        "Created .NET Background workers for Electronic Funds Transfer integration and email notification with ICG ERP.",
        "Built REST APIs for integrating ICG ERP with external services for business clients.",
        "Created product Entity Relations Diagrams with Draw.io.",
        "Worked with MD to structure the project's core requirements and set up wireframe prototypes.",
        "Directed team on developing, designing, and testing applications integrated with ICG ERP.",
      ],
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      company: "Seven Up Bottling Company, Lagos",
      position: ".NET Engineer",
      startDate: "2022-10",
      endDate: "2023-03",
      currentlyWorking: false,
      description: "",
      responsibilities: [
        "Worked on in-house vendor management system from bottom up.",
        "Ensured the software adheres to the company's high level of technical standards.",
        "Built end-to-end applications using Entity Framework coding workflow to build models.",
        "Collaborated with other engineers to implement technical designs and requirements.",
        "Used React.js and ASP.NET Web API to build RESTful APIs.",
        "Created visually appealing user interfaces with React.js from Figma designs.",
        "Created robust, clean, and maintainable code.",
      ],
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      company: "Decagon, Lagos",
      position: "Software Engineer",
      startDate: "2021-10",
      endDate: "2022-10",
      currentlyWorking: false,
      description: "",
      responsibilities: [
        "Delivered technical content to students in a structured, self-learning approach, reinforcing and evaluating knowledge.",
        "Installed and configured software applications and tested solutions for effectiveness.",
        "Documented and maintained software functionalities.",
        "Facilitated training on acing interviews for software engineers.",
        "Collaborated with other engineers to implement technical designs and requirements.",
        "Worked with project managers, developers, quality assurance, and customers to resolve technical issues.",
        "Improved and worked on existing codebases and effectively managed software functionalities.",
        "Mentored developers (Beginner/Intermediate).",
      ],
      order: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      company: "AfricInnovate, Eket, Akwa Ibom",
      position: "Full Stack Engineer",
      startDate: "2020-06",
      endDate: "2021-09",
      currentlyWorking: false,
      description: "",
      responsibilities: [
        "Ensured the software adheres to the company's high level of technical standards.",
        "Built end-to-end applications using Entity Framework coding workflow to build models.",
        "Collaborated with other engineers to implement technical designs and requirements.",
        "Used Node.js and ASP.NET Web API to build RESTful APIs and Dockerized some.",
        "Created visually appealing user interfaces with Vue.js from Figma designs.",
        "Implemented decoupled and clean architecture for applications.",
        "Debugged and fixed code and git errors in team members' code.",
        "Deployment and CI/CD support for new and running apps.",
      ],
      order: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      company: "AfricInnovate, Eket, Akwa Ibom",
      position: "Intern",
      startDate: "2020-01",
      endDate: "2020-06",
      currentlyWorking: false,
      description: "",
      responsibilities: [
        "Discovered areas of improvement by periodically monitoring various company systems.",
        "Developed an application to manage all company clients' reports and provide self-services.",
        "Enhanced the company tracking system middleware to support integration with newer technologies.",
        "Collaborated in agile front-end projects.",
        "Designed web page layouts from client conception to industry standard UI designs.",
        "Debugged and fixed code and git errors in team members' code.",
      ],
      order: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await db.collection("experiences").insertMany(experiences);
  console.log("Seeded: Experiences");

  // Seed education
  await db.collection("educations").deleteMany({});
  await db.collection("educations").insertOne({
    school: "Delta State University",
    degree: "Bachelor of Science, Mathematics",
    location: "Abraka",
    year: "2016",
    logo: "",
    schoolUrl: "https://delsu.org/",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("Seeded: Education");

  // Seed projects (from LinkedIn)
  await db.collection("projects").deleteMany({});
  await db.collection("projects").insertMany([
    {
      title: "Lagos State Infrastructure & Asset Management (LASIAMA)",
      slug: "lasiama-infrastructure-asset-management",
      description:
        "Complete Infrastructure & Asset Management Platform — comprehensive tracking, maintenance scheduling, issue management, and analytics for all Lagos State government properties and assets.",
      coverImage: "",
      galleryImages: [],
      techStack: [".NET", "React", "TypeScript", "SQL Server"],
      services: ["Full Stack Development"],
      category: "Professional",
      year: "2025",
      liveUrl: "",
      githubUrl: "",
      featured: true,
      status: "published",
      viewCount: 0,
      createdAt: new Date("2025-08-01"),
      updatedAt: new Date("2026-01-31"),
    },
    {
      title: "School Management ERP",
      slug: "school-management-erp",
      description:
        "A modern, intuitive, and powerful platform to manage your educational institution — from student records and payments to timetables and assessments.",
      coverImage: "",
      galleryImages: [],
      techStack: [".NET", "React", "TypeScript", "SQL Server"],
      services: ["Full Stack Development"],
      category: "Professional",
      year: "2025",
      liveUrl: "",
      githubUrl: "",
      featured: true,
      status: "published",
      viewCount: 0,
      createdAt: new Date("2025-10-01"),
      updatedAt: new Date("2025-12-31"),
    },
    {
      title: "Believers Tech Network",
      slug: "believers-tech-network",
      description:
        "Creating platforms, products, and, most importantly, cultivating individuals whose primary goal is to advance the Kingdom and share the gospel of Christ within the tech space.",
      coverImage: "",
      galleryImages: [],
      techStack: ["Next.js", "React", "Node.js", "MongoDB"],
      services: ["Full Stack Development"],
      category: "Personal Project",
      year: "2024",
      liveUrl: "",
      githubUrl: "",
      featured: true,
      status: "published",
      viewCount: 0,
      createdAt: new Date("2024-11-01"),
      updatedAt: new Date("2024-12-31"),
    },
    {
      title: "CAMBIO",
      slug: "cambio",
      description:
        "A single destination for giftcard and crypto exchange. An awesome place to trade securely with no worries or delay.",
      coverImage: "",
      galleryImages: [],
      techStack: ["React", "Node.js", "MongoDB", "Express"],
      services: ["Full Stack Development"],
      category: "Professional",
      year: "2022",
      liveUrl: "",
      githubUrl: "",
      featured: true,
      status: "published",
      viewCount: 0,
      createdAt: new Date("2022-11-01"),
      updatedAt: new Date("2024-01-31"),
    },
    {
      title: "Spirit Quiz",
      slug: "spirit-quiz",
      description:
        "CBT test platform for testing your knowledge in certain categories. Won Best Project at the Open Source Challenge by BuildWithVee / GDG Benin.",
      coverImage: "",
      galleryImages: [],
      techStack: ["Golang", "React", "REST API"],
      services: ["Full Stack Development"],
      category: "Personal Project",
      year: "2023",
      liveUrl: "https://spirit-quiz.netlify.app/",
      githubUrl: "",
      featured: true,
      status: "published",
      viewCount: 0,
      createdAt: new Date("2023-05-01"),
      updatedAt: new Date("2023-05-31"),
    },
    {
      title: "Scorecard",
      slug: "scorecard",
      description:
        "An in-house app for devs to check their weekly performance and take tests.",
      coverImage: "",
      galleryImages: [],
      techStack: [".NET", "React", "TypeScript"],
      services: ["Full Stack Development"],
      category: "Professional",
      year: "2022",
      liveUrl: "",
      githubUrl: "https://github.com/Vastro-lorde/scorecard-portal",
      featured: false,
      status: "published",
      viewCount: 0,
      createdAt: new Date("2022-07-01"),
      updatedAt: new Date("2022-08-31"),
    },
    {
      title: "Vast-Personality",
      slug: "vast-personality",
      description:
        "An API for checking your personality using your Day, Month, Year, and time of birth.",
      coverImage: "",
      galleryImages: [],
      techStack: ["Node.js", "REST API", "Vercel"],
      services: ["Backend Development"],
      category: "Personal Project",
      year: "2022",
      liveUrl: "https://spirit-personality-lnsq.vercel.app/",
      githubUrl: "",
      featured: false,
      status: "published",
      viewCount: 0,
      createdAt: new Date("2022-01-01"),
      updatedAt: new Date("2022-02-28"),
    },
    {
      title: "Mater Dei Catholic School Rest API",
      slug: "mater-dei-catholic-school-rest-api",
      description:
        "A REST API for school management.",
      coverImage: "",
      galleryImages: [],
      techStack: [".NET", "ASP.NET Web API", "SQL Server"],
      services: ["Backend Development"],
      category: "Personal Project",
      year: "2021",
      liveUrl: "",
      githubUrl: "https://github.com/Vastro-lorde/mds-api",
      featured: false,
      status: "published",
      viewCount: 0,
      createdAt: new Date("2021-11-01"),
      updatedAt: new Date("2022-02-28"),
    },
    {
      title: "Mater Dei Catholic School Frontend",
      slug: "mater-dei-catholic-school-frontend",
      description:
        "Mater Dei college catholic school frontend website, built with Vue.js.",
      coverImage: "",
      galleryImages: [],
      techStack: ["Vue.js", "JavaScript", "CSS"],
      services: ["Frontend Development"],
      category: "Personal Project",
      year: "2021",
      liveUrl: "",
      githubUrl: "https://github.com/Vastro-lorde/mds-frontend",
      featured: false,
      status: "published",
      viewCount: 0,
      createdAt: new Date("2021-11-01"),
      updatedAt: new Date("2022-01-31"),
    },
    {
      title: "URL Shortener",
      slug: "url-shortener",
      description:
        "Web API for shortening URLs using Node.js and EJS.",
      coverImage: "",
      galleryImages: [],
      techStack: ["Node.js", "Express", "EJS"],
      services: ["Full Stack Development"],
      category: "Personal Project",
      year: "2021",
      liveUrl: "",
      githubUrl: "https://github.com/Vastro-lorde/Url-shortner",
      featured: false,
      status: "published",
      viewCount: 0,
      createdAt: new Date("2021-10-01"),
      updatedAt: new Date("2021-10-31"),
    },
    {
      title: "Find-My-Blood Rest API",
      slug: "find-my-blood-rest-api",
      description:
        "Get blood provides progressive ways to locate blood easily, accessible on mobile and online for everyone.",
      coverImage: "",
      galleryImages: [],
      techStack: ["Node.js", "React", "REST API"],
      services: ["Full Stack Development"],
      category: "Personal Project",
      year: "2021",
      liveUrl: "https://find-my-blood.netlify.app",
      githubUrl: "",
      featured: false,
      status: "published",
      viewCount: 0,
      createdAt: new Date("2021-08-01"),
      updatedAt: new Date("2021-09-30"),
    },
  ]);
  console.log("Seeded: Projects");

  // Seed sample blogs
  await db.collection("blogs").deleteMany({});
  await db.collection("blogs").insertMany([
    {
      title: "How to Ask Chat-GPT Complex Questions: A Guide for Programmers",
      slug: "how-to-ask-chat-gpt-complex-questions",
      subtitle: "Optimizing AI interactions for better code solutions",
      description: "As a programmer, asking complex questions requires a specific structure. This guide breaks down how to get the best assistance from AI models.",
      content: "<p>As a programmer, you may be faced with complex problems that require the assistance of Chat-GPT. However, asking complex questions can be a skill in itself...</p>",
      coverImage: "",
      status: "published",
      source: "medium",
      mediumUrl: "https://omatsolaseund.medium.com/how-to-ask-chat-gpt-complex-questions-a-guide-for-programmers-4b3605a96495",
      viewCount: 1050,
      createdAt: new Date("2023-05-04"),
      updatedAt: new Date("2023-05-04"),
    },
    {
      title: "Object-Oriented Programming (OOP) Concepts",
      slug: "object-oriented-programming-concepts",
      subtitle: "Understanding the four pillars of modern programming",
      description: "A breakdown of the key concepts of OOP: Encapsulation, Inheritance, Polymorphism, and Abstraction.",
      content: "<p>OOP is a concept of modern programming language that allows programmers to organize entities and objects...</p>",
      coverImage: "",
      status: "published",
      source: "medium",
      mediumUrl: "https://omatsolaseund.medium.com/object-oriented-programming-oop-899450a80d74",
      viewCount: 820,
      createdAt: new Date("2022-03-15"),
      updatedAt: new Date("2022-03-15"),
    },
    {
      title: "Async and Await in C#",
      slug: "async-and-await-in-csharp",
      subtitle: "Simplifying Asynchronous Programming",
      description: "Exploring why asynchronous programming is vital for UI responsiveness and how C# makes it easy with async/await.",
      content: "<p>Nowadays, Asynchronous programming is very popular with the help of the async and await keywords in C#...</p>",
      coverImage: "",
      status: "published",
      source: "medium",
      mediumUrl: "https://omatsolaseund.medium.com/async-and-await-6b0f023c7b3c",
      viewCount: 940,
      createdAt: new Date("2022-03-10"),
      updatedAt: new Date("2022-03-10"),
    },
    {
      title: "Vi / Vim Parrot Linux Terminal Shortcuts",
      slug: "vi-vim-parrot-linux-shortcuts",
      subtitle: "Mastering navigation in the terminal",
      description: "A quick reference guide for essential Vi/Vim shortcuts used in Parrot Linux and other Debian-based systems.",
      content: "<p>Mastering terminal navigation is essential for security-focused OS users. Here are the core shortcuts for Vi/Vim...</p>",
      coverImage: "",
      status: "published",
      source: "medium",
      mediumUrl: "https://omatsolaseund.medium.com/vi-vim-parrot-linux-terminal-shortcuts-9a0d8c0f5f9a",
      viewCount: 1200,
      createdAt: new Date("2022-08-23"),
      updatedAt: new Date("2022-08-23"),
    }
  ]);
  console.log("Seeded: Blogs");

  await mongoose.disconnect();
  console.log("Seed completed successfully!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
