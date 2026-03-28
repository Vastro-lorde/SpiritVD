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
    email: "admin@protfolio.com",
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

  // Seed experiences
  await db.collection("experiences").deleteMany({});
  const experiences = [
    {
      company: "Yanot Consultants, Lagos",
      position: "Software Engineer (Team Lead)",
      startDate: "2023-03",
      endDate: null,
      currentlyWorking: true,
      description: "",
      responsibilities: [
        "Refactored legacy applications from .NET MVC to Blazor WASM.",
        "Developed .NET background services for Electronic Funds Transfer (EFT) and email notifications, integrating with ICG ERP.",
        "Led a team to build REST APIs and directed application testing and deployment, achieving 30% faster response times.",
      ],
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      company: "Alphacrunch/Cambio, Lagos",
      position: "Software Engineer (Team Lead)",
      startDate: "2022-11",
      endDate: "2024-10",
      currentlyWorking: false,
      description: "",
      responsibilities: [
        "Built and deployed the Cambio.ng platform using the MERN stack, implementing CI/CD pipelines on Render and Netlify.",
        "Created and maintained product entity diagrams, working with leadership to shape project requirements.",
      ],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      company: "Seven-Up/Pepsi, Lagos",
      position: ".NET Software Engineer",
      startDate: "2022-10",
      endDate: "2023-03",
      currentlyWorking: false,
      description: "",
      responsibilities: [
        "Built RESTful APIs using ASP.NET Web API and created front-end interfaces with React and TypeScript.",
        "Designed clean, decoupled architecture and entity diagrams to optimize scalability and maintainability.",
      ],
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      company: "Decagon, Lagos",
      position: ".NET Software Engineer",
      startDate: "2021-10",
      endDate: "2022-10",
      currentlyWorking: false,
      description: "",
      responsibilities: [
        "Developed full-stack applications in .NET and React, creating microservices with ASP.NET Core and designing RESTful APIs.",
        "Implemented robust code practices and clean architecture to ensure maintainable and efficient solutions.",
      ],
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      company: "Africinnovate, Akwa-Ibom",
      position: "Software Engineer",
      startDate: "2020-01",
      endDate: "2021-09",
      currentlyWorking: false,
      description: "",
      responsibilities: [
        "Collaborated with other engineers to implement technical designs and project requirements.",
        "Built RESTful APIs with Node.js and ASP.NET Web API, Dockerizing applications for ease of deployment.",
        "Developed UI interfaces using Vue.js, supporting end-to-end functionality from Figma designs.",
      ],
      order: 4,
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

  // Seed sample projects
  await db.collection("projects").deleteMany({});
  await db.collection("projects").insertMany([
    {
      title: "Nexus Analytics Dashboard",
      slug: "nexus-analytics-dashboard",
      description:
        "A real-time analytics dashboard built with React, featuring interactive charts, data visualization, and responsive design for monitoring key business metrics.",
      coverImage: "",
      galleryImages: [],
      techStack: ["React", "TypeScript", "Tailwind", "D3.js"],
      services: ["Backend Development", "AI Implementation"],
      category: "Personal Project",
      year: "2025",
      liveUrl: "",
      githubUrl: "",
      featured: true,
      status: "published",
      viewCount: 1200,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "FinFlow Personal Finance",
      slug: "finflow-personal-finance",
      description:
        "A personal finance management application with budget tracking, expense categorization, and financial goal setting.",
      coverImage: "",
      galleryImages: [],
      techStack: ["React", "Node.js", "MongoDB"],
      services: ["Full Stack Development"],
      category: "Personal Project",
      year: "2024",
      liveUrl: "",
      githubUrl: "",
      featured: true,
      status: "published",
      viewCount: 845,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
    {
      title: "Luxe E-Commerce Redesign",
      slug: "luxe-ecommerce-redesign",
      description:
        "A modern e-commerce platform redesign with focus on user experience, performance optimization, and mobile-first design.",
      coverImage: "",
      galleryImages: [],
      techStack: ["Next.js", "Stripe", "Prisma"],
      services: ["Frontend Development", "UI/UX"],
      category: "Freelance",
      year: "2024",
      liveUrl: "",
      githubUrl: "",
      featured: false,
      status: "draft",
      viewCount: 0,
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    },
  ]);
  console.log("Seeded: Projects");

  // Seed sample blogs
  await db.collection("blogs").deleteMany({});
  await db.collection("blogs").insertMany([
    {
      title: "Mastering Server Components in Next.js 14",
      slug: "mastering-server-components-nextjs-14",
      subtitle: "A deep dive into React Server Components",
      description:
        "A deep dive into React Server Components change the paradigm of fetching data and building scalable architectures on the web, with practical examples from a production migration.",
      content:
        "<p>React Server Components change the paradigm of fetching data and building scalable architectures on the web.</p>",
      coverImage: "",
      status: "published",
      source: "local",
      mediumUrl: "",
      viewCount: 845,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      title:
        "Perplexity AI CEO Aravind Srinivas agrees that Computer Science is gradually returning to the domain of...",
      slug: "perplexity-ai-ceo-computer-science",
      subtitle: "",
      description:
        "Aravind Srinivas, CEO of Perplexity AI, added his weight to a growing conversation about what AI is doing to software engineering.",
      content:
        '<p>Aravind Srinivas, CEO of Perplexity AI, added his weight to a growing conversation about what AI is doing to software engineering. On March 13, he quote-tweeted a post by physics and AI/ML student @TheVishal with two words: "Well said."</p>',
      coverImage: "",
      status: "published",
      source: "local",
      mediumUrl: "",
      viewCount: 620,
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  ]);
  console.log("Seeded: Blogs");

  await mongoose.disconnect();
  console.log("Seed completed successfully!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
