import { 
  Code, Palette, Briefcase, Camera, GraduationCap, Heart, 
  Scale, Wrench, Building, TrendingUp, Users, Megaphone,
  Laptop, Smartphone, Database, Cloud, Shield, BarChart,
  Brush, Music, Video, PenTool, Gamepad2, Cpu,
  Stethoscope, Car, Plane, Zap, HardHat, TreePine
} from "lucide-react";

export const professions = [
  // Tech & Development
  { id: 'frontend-developer', name: 'Frontend Developer', icon: Code, layoutStyle: 'modern' },
  { id: 'backend-developer', name: 'Backend Developer', icon: Database, layoutStyle: 'minimal' },
  { id: 'fullstack-developer', name: 'Full Stack Developer', icon: Laptop, layoutStyle: 'modern' },
  { id: 'mobile-developer', name: 'Mobile Developer', icon: Smartphone, layoutStyle: 'modern' },
  { id: 'game-developer', name: 'Game Developer', icon: Gamepad2, layoutStyle: 'creative' },
  { id: 'devops-engineer', name: 'DevOps Engineer', icon: Cloud, layoutStyle: 'minimal' },
  { id: 'data-scientist', name: 'Data Scientist', icon: BarChart, layoutStyle: 'minimal' },
  { id: 'cybersecurity-expert', name: 'Cybersecurity Expert', icon: Shield, layoutStyle: 'minimal' },
  { id: 'ai-engineer', name: 'AI/ML Engineer', icon: Cpu, layoutStyle: 'modern' },
  
  // Design & Creative
  { id: 'ui-designer', name: 'UI Designer', icon: Palette, layoutStyle: 'creative' },
  { id: 'ux-designer', name: 'UX Designer', icon: PenTool, layoutStyle: 'creative' },
  { id: 'graphic-designer', name: 'Graphic Designer', icon: Brush, layoutStyle: 'creative' },
  { id: 'web-designer', name: 'Web Designer', icon: Palette, layoutStyle: 'creative' },
  { id: 'photographer', name: 'Photographer', icon: Camera, layoutStyle: 'creative' },
  { id: 'video-editor', name: 'Video Editor', icon: Video, layoutStyle: 'creative' },
  { id: 'music-producer', name: 'Music Producer', icon: Music, layoutStyle: 'creative' },
  
  // Business & Management
  { id: 'business-analyst', name: 'Business Analyst', icon: TrendingUp, layoutStyle: 'modern' },
  { id: 'project-manager', name: 'Project Manager', icon: Briefcase, layoutStyle: 'minimal' },
  { id: 'marketing-manager', name: 'Marketing Manager', icon: Megaphone, layoutStyle: 'modern' },
  { id: 'sales-manager', name: 'Sales Manager', icon: TrendingUp, layoutStyle: 'modern' },
  { id: 'hr-manager', name: 'HR Manager', icon: Users, layoutStyle: 'modern' },
  { id: 'consultant', name: 'Consultant', icon: Briefcase, layoutStyle: 'minimal' },
  
  // Healthcare & Education
  { id: 'doctor', name: 'Doctor', icon: Stethoscope, layoutStyle: 'minimal' },
  { id: 'nurse', name: 'Nurse', icon: Heart, layoutStyle: 'minimal' },
  { id: 'teacher', name: 'Teacher', icon: GraduationCap, layoutStyle: 'minimal' },
  { id: 'professor', name: 'Professor', icon: GraduationCap, layoutStyle: 'minimal' },
  { id: 'researcher', name: 'Researcher', icon: GraduationCap, layoutStyle: 'minimal' },
  
  // Legal & Finance
  { id: 'lawyer', name: 'Lawyer', icon: Scale, layoutStyle: 'minimal' },
  { id: 'accountant', name: 'Accountant', icon: BarChart, layoutStyle: 'minimal' },
  { id: 'financial-advisor', name: 'Financial Advisor', icon: TrendingUp, layoutStyle: 'modern' },
  
  // Engineering
  { id: 'mechanical-engineer', name: 'Mechanical Engineer', icon: Wrench, layoutStyle: 'minimal' },
  { id: 'civil-engineer', name: 'Civil Engineer', icon: Building, layoutStyle: 'minimal' },
  { id: 'electrical-engineer', name: 'Electrical Engineer', icon: Zap, layoutStyle: 'minimal' },
  { id: 'software-engineer', name: 'Software Engineer', icon: Code, layoutStyle: 'modern' },
  { id: 'automotive-engineer', name: 'Automotive Engineer', icon: Car, layoutStyle: 'minimal' },
  { id: 'aerospace-engineer', name: 'Aerospace Engineer', icon: Plane, layoutStyle: 'minimal' },
  { id: 'environmental-engineer', name: 'Environmental Engineer', icon: TreePine, layoutStyle: 'minimal' },
  { id: 'construction-manager', name: 'Construction Manager', icon: HardHat, layoutStyle: 'minimal' },
  
  // Other
  { id: 'architect', name: 'Architect', icon: Building, layoutStyle: 'creative' },
  { id: 'interior-designer', name: 'Interior Designer', icon: Palette, layoutStyle: 'creative' },
  { id: 'fashion-designer', name: 'Fashion Designer', icon: Brush, layoutStyle: 'creative' },
  { id: 'chef', name: 'Chef', icon: Heart, layoutStyle: 'creative' },
  { id: 'entrepreneur', name: 'Entrepreneur', icon: TrendingUp, layoutStyle: 'modern' },
  { id: 'freelancer', name: 'Freelancer', icon: Briefcase, layoutStyle: 'modern' },
];
