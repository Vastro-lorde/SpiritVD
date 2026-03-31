import {
  ProjectStatus,
  BlogStatus,
  BlogSource,
  UserRole,
  EmploymentType,
  SocialPlatform,
} from "@/enums";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  bio: string;
  title: string;
  profileImage: string;
  resumeUrl: string;
  interests: string[];
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject {
  _id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  galleryImages: string[];
  techStack: string[];
  services: string[];
  category: string;
  year: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  status: ProjectStatus;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  content: string;
  coverImage: string;
  status: BlogStatus;
  source: BlogSource;
  mediumUrl: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExperience {
  _id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  currentlyWorking: boolean;
  description: string;
  responsibilities: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISocialLink {
  _id: string;
  platform: SocialPlatform;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEducation {
  _id: string;
  school: string;
  degree: string;
  location: string;
  year: string;
  logo: string;
  schoolUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

export interface DashboardStats {
  projectCount: number;
  blogCount: number;
  experienceCount: number;
  totalViews: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  updated_at: string;
}

export interface GitHubProfile {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
}

export interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  thumbnail: string;
  categories: string[];
}
