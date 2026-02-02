import React, { useEffect, useState } from 'react';
import { 
  Mail, Phone, MapPin, Github, Linkedin, 
  ExternalLink, Briefcase, GraduationCap, User, Code, Sparkles,
  Download, Eye, Heart
} from "lucide-react";
import { professions } from "../data/professions";

const professionLayouts = {
  'frontend-developer': 'dark-tech',
  'backend-developer': 'minimal', 
  'fullstack-developer': 'modern',
  'ui-designer': 'creative',
  'ux-designer': 'creative',
  'graphic-designer': 'creative',
  'web-designer': 'modern',
  'mobile-developer': 'dark-tech',
  'game-developer': 'neon',
  'data-scientist': 'minimal',
  'cybersecurity-expert': 'dark-tech',
  'doctor': 'corporate',
  'lawyer': 'corporate',
  'teacher': 'minimal',
  'architect': 'creative',
  'photographer': 'creative',
  'marketing-manager': 'modern',
  'business-analyst': 'corporate'
};

const PortfolioPreview = ({ data }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const profession = professions.find(p => p.id === data.profession);
  const layoutStyle = professionLayouts[data.profession] || 'modern';

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const baseStyles = {
    fontFamily: data.theme.fontFamily,
    backgroundColor: data.theme.backgroundColor,
    color: data.theme.textColor,
  };

  const accentStyles = {
    color: data.theme.accentColor,
    borderColor: data.theme.accentColor,
  };

  const gradientStyles = {
    background: `linear-gradient(135deg, ${data.theme.accentColor}15, ${data.theme.accentColor}05)`,
  };

  // Dark Tech Layout (for developers)
  const renderDarkTechLayout = () => (
    <div id="portfolio-preview" className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" style={baseStyles}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/10 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold" style={accentStyles}>Portfolio.</div>
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="hover:text-cyan-400 transition-colors">Home</a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Portfolio</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-between px-6 lg:px-20 pt-20">
        <div className={`flex-1 ${data.isAnimated ? 'animate-fade-in' : ''}`}>
          <p className="text-lg mb-4 opacity-80">Hello, It's Me</p>
          <h1 className="text-5xl lg:text-7xl font-bold mb-4">
            {data.fullName}
          </h1>
          <h2 className="text-2xl lg:text-3xl mb-6">
            And I'm a <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              {profession?.name || data.profession}
            </span>
          </h2>
          <p className="text-lg mb-8 opacity-80 max-w-lg leading-relaxed">
            {data.aboutMe}
          </p>
          <div className="flex space-x-4 mb-8">
            {data.github && (
              <a href={data.github} className="p-3 rounded-full border border-cyan-400 hover:bg-cyan-400 hover:text-black transition-all">
                <Github className="h-5 w-5" />
              </a>
            )}
            {data.linkedin && (
              <a href={data.linkedin} className="p-3 rounded-full border border-cyan-400 hover:bg-cyan-400 hover:text-black transition-all">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {data.email && (
              <a href={`mailto:${data.email}`} className="p-3 rounded-full border border-cyan-400 hover:bg-cyan-400 hover:text-black transition-all">
                <Mail className="h-5 w-5" />
              </a>
            )}
          </div>
          <button className="bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-semibold px-8 py-3 rounded-full hover:shadow-lg hover:shadow-cyan-400/25 transition-all">
            <Download className="h-4 w-4 mr-2" />
            Download CV
          </button>
        </div>
        
        {data.profileImage && (
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-cyan-400 to-purple-400 p-1 rounded-3xl">
                <img
                  src={data.profileImage}
                  alt={data.fullName}
                  className="w-80 h-80 object-cover rounded-3xl"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Skills Section */}
      {data.skills.length > 0 && (
        <section id="skills" className="py-20 px-6 lg:px-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Skills & Expertise
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {data.skills.map((skill, index) => (
                <div
                  key={index}
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105 ${data.isAnimated ? 'animate-fade-in' : ''}`}
                  style={{ animationDelay: data.isAnimated ? `${index * 0.1}s` : '0s' }}
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="font-semibold text-lg">{skill}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {data.projects.length > 0 && (
        <section id="projects" className="py-20 px-6 lg:px-20" style={gradientStyles}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.projects.map((project, index) => (
                <div
                  key={index}
                  className={`group hover:shadow-2xl transition-all duration-300 border-2 bg-white/5 backdrop-blur-sm ${data.isAnimated ? 'animate-fade-in' : ''}`}
                  style={{
                    borderColor: `${data.theme.accentColor}20`,
                    animationDelay: data.isAnimated ? `${index * 0.2}s` : '0s'
                  }}
                >
                  <div className="p-6">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <h3 className="text-xl font-bold mb-3 text-cyan-400">
                      {project.title}
                    </h3>
                    <p className="text-sm opacity-80 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    {project.liveLink && (
                      <button
                        className="border-2 hover:shadow-lg transition-all border-cyan-400 text-cyan-400 px-4 py-2 rounded text-sm"
                        onClick={() => window.open(project.liveLink, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2 inline" />
                        View Project
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section */}
      {data.experience.length > 0 && (
        <section className="py-20 px-6 lg:px-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Professional Experience
            </h2>
            <div className="space-y-8">
              {data.experience.map((exp, index) => (
                <div
                  key={index}
                  className={`border-l-4 bg-white/5 backdrop-blur-sm ${data.isAnimated ? 'animate-fade-in' : ''}`}
                  style={{
                    borderLeftColor: data.theme.accentColor,
                    animationDelay: data.isAnimated ? `${index * 0.3}s` : '0s'
                  }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-cyan-400">
                          {exp.position}
                        </h3>
                        <p className="text-lg opacity-80">{exp.company}</p>
                      </div>
                      <span className="border border-cyan-400 text-cyan-400 px-2 py-1 rounded text-sm">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="opacity-80 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {data.education.length > 0 && (
        <section className="py-20 px-6 lg:px-20" style={gradientStyles}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Education
            </h2>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div
                  key={index}
                  className={`${data.isAnimated ? 'animate-fade-in' : ''} border-2 bg-white/5 backdrop-blur-sm`}
                  style={{
                    borderColor: `${data.theme.accentColor}20`,
                    animationDelay: data.isAnimated ? `${index * 0.2}s` : '0s'
                  }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-cyan-400">
                          {edu.degree}
                        </h3>
                        <p className="text-lg opacity-80">{edu.institution}</p>
                      </div>
                      <span className="border border-cyan-400 text-cyan-400 px-2 py-1 rounded text-sm">
                        {edu.year}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="opacity-80">{edu.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Get In Touch
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="flex flex-col items-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 group bg-white/5 backdrop-blur-sm"
              >
                <Mail className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform text-cyan-400" />
                <span className="font-medium">{data.email}</span>
              </a>
            )}
            {data.phone && (
              <a
                href={`tel:${data.phone}`}
                className="flex flex-col items-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 group bg-white/5 backdrop-blur-sm"
              >
                <Phone className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform text-cyan-400" />
                <span className="font-medium">{data.phone}</span>
              </a>
            )}
            {data.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 group bg-white/5 backdrop-blur-sm"
              >
                <Linkedin className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform text-cyan-400" />
                <span className="font-medium">LinkedIn</span>
              </a>
            )}
            {data.github && (
              <a
                href={data.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 group bg-white/5 backdrop-blur-sm"
              >
                <Github className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform text-cyan-400" />
                <span className="font-medium">GitHub</span>
              </a>
            )}
          </div>
          {data.location && (
            <div className="mt-8 flex items-center justify-center gap-2 text-lg opacity-80">
              <MapPin className="h-5 w-5 text-cyan-400" />
              {data.location}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 text-center opacity-60 bg-black/20">
        <p>&copy; 2024 {data.fullName}. All rights reserved.</p>
        <p className="text-sm mt-2">Created with Professional Portfolio Generator</p>
      </footer>
    </div>
  );

  // Modern Layout (default)
  const renderModernLayout = () => (
    <div id="portfolio-preview" className="min-h-screen overflow-hidden" style={baseStyles}>
      {/* Hero Section */}
      <section className="relative py-20 px-8 text-center">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at 30% 70%, ${data.theme.accentColor}40, transparent 70%),
                        radial-gradient(circle at 70% 30%, ${data.theme.accentColor}30, transparent 70%)`
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          {data.profileImage && (
            <img
              src={data.profileImage}
              alt={data.fullName}
              className="w-32 h-32 rounded-full mx-auto mb-6 border-4 shadow-xl object-cover"
              style={{ borderColor: data.theme.accentColor }}
            />
          )}
          <h1 className={`text-5xl font-bold mb-4 ${data.isAnimated ? 'animate-fade-in' : ''}`}>
            {data.fullName}
          </h1>
          <p className="text-2xl mb-6 opacity-80" style={accentStyles}>
            {profession?.name || data.profession}
          </p>
          {data.aboutMe && (
            <p className="text-lg max-w-2xl mx-auto leading-relaxed opacity-90">
              {data.aboutMe}
            </p>
          )}
        </div>
      </section>

      {/* Skills Section */}
      {data.skills.length > 0 && (
        <section className="py-16 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8" style={accentStyles} />
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`px-6 py-3 text-lg font-medium rounded-full ${data.isAnimated ? 'animate-scale-in' : ''}`}
                  style={{
                    backgroundColor: `${data.theme.accentColor}20`,
                    color: data.theme.accentColor,
                    border: `2px solid ${data.theme.accentColor}30`,
                    animationDelay: data.isAnimated ? `${index * 0.1}s` : '0s'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {data.projects.length > 0 && (
        <section className="py-16 px-8" style={gradientStyles}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3">
              <Code className="h-8 w-8" style={accentStyles} />
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.projects.map((project, index) => (
                <div
                  key={index}
                  className={`group hover:shadow-2xl transition-all duration-300 border-2 rounded-lg ${data.isAnimated ? 'animate-fade-in' : ''}`}
                  style={{
                    backgroundColor: data.theme.backgroundColor,
                    borderColor: `${data.theme.accentColor}20`,
                    animationDelay: data.isAnimated ? `${index * 0.2}s` : '0s'
                  }}
                >
                  <div className="p-6">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <h3 className="text-xl font-bold mb-3" style={accentStyles}>
                      {project.title}
                    </h3>
                    <p className="text-sm opacity-80 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    {project.liveLink && (
                      <button
                        className="border-2 hover:shadow-lg transition-all px-4 py-2 rounded text-sm"
                        style={{ borderColor: data.theme.accentColor, color: data.theme.accentColor }}
                        onClick={() => window.open(project.liveLink, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2 inline" />
                        View Project
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 flex items-center justify-center gap-3">
            <User className="h-8 w-8" style={accentStyles} />
            Get In Touch
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.email && (
              <a
                href={`mailto:${data.email}`}
                className="flex flex-col items-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 group"
                style={gradientStyles}
              >
                <Mail className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform" style={accentStyles} />
                <span className="font-medium">{data.email}</span>
              </a>
            )}
            {data.phone && (
              <a
                href={`tel:${data.phone}`}
                className="flex flex-col items-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 group"
                style={gradientStyles}
              >
                <Phone className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform" style={accentStyles} />
                <span className="font-medium">{data.phone}</span>
              </a>
            )}
            {data.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 group"
                style={gradientStyles}
              >
                <Linkedin className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform" style={accentStyles} />
                <span className="font-medium">LinkedIn</span>
              </a>
            )}
            {data.github && (
              <a
                href={data.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 group"
                style={gradientStyles}
              >
                <Github className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform" style={accentStyles} />
                <span className="font-medium">GitHub</span>
              </a>
            )}
          </div>
          {data.location && (
            <div className="mt-8 flex items-center justify-center gap-2 text-lg opacity-80">
              <MapPin className="h-5 w-5" style={accentStyles} />
              {data.location}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 text-center opacity-60" style={{ backgroundColor: `${data.theme.accentColor}05` }}>
        <p>&copy; 2024 {data.fullName}. All rights reserved.</p>
        <p className="text-sm mt-2">Created with Professional Portfolio Generator</p>
      </footer>
    </div>
  );

  // Render based on profession layout
  switch (layoutStyle) {
    case 'dark-tech':
      return renderDarkTechLayout();
    default:
      return renderModernLayout();
  }
};

export default PortfolioPreview;
