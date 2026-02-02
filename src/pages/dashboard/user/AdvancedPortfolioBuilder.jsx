import React, { useState, useEffect } from 'react';
import { 
  Download, Eye, Save, Trash2, Plus, X, Upload, 
  Github, Linkedin, Mail, Phone, MapPin, Calendar,
  Palette, Type, Sparkles, Code, Briefcase, GraduationCap
} from "lucide-react";
import PortfolioPreview from "../../../components/PortfolioPreview";
import ThemeCustomizer from "../../../components/ThemeCustomizer";
import { professions } from "../../../data/professions";
import { themes } from "../../../data/themes";
import { fonts } from "../../../data/fonts";

const AdvancedPortfolioBuilder = () => {
  const [portfolioData, setPortfolioData] = useState({
    fullName: '',
    profession: '',
    profileImage: '',
    aboutMe: '',
    skills: [],
    projects: [],
    education: [],
    experience: [],
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    location: '',
    theme: {
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'Inter',
      accentColor: '#3b82f6'
    },
    isAnimated: false
  });

  const [savedPortfolios, setSavedPortfolios] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentSkill, setCurrentSkill] = useState('');
  const [showThemePanel, setShowThemePanel] = useState(false);

  // Load saved portfolios from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedPortfolios');
    if (saved) {
      setSavedPortfolios(JSON.parse(saved));
    }
    
    // Load current portfolio from localStorage
    const current = localStorage.getItem('currentPortfolio');
    if (current) {
      setPortfolioData(JSON.parse(current));
    }
  }, []);

  // Save current portfolio to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentPortfolio', JSON.stringify(portfolioData));
  }, [portfolioData]);

  const updatePortfolioData = (field, value) => {
    setPortfolioData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateTheme = (themeUpdates) => {
    setPortfolioData(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...themeUpdates
      }
    }));
  };

  const updateAnimation = (animated) => {
    setPortfolioData(prev => ({
      ...prev,
      isAnimated: animated
    }));
  };

  const handleImageUpload = (event, type, index) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (type === 'profile') {
          updatePortfolioData('profileImage', e.target?.result);
        } else if (type === 'project' && index !== undefined) {
          const updatedProjects = [...portfolioData.projects];
          updatedProjects[index].image = e.target?.result;
          updatePortfolioData('projects', updatedProjects);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !portfolioData.skills.includes(currentSkill.trim())) {
      updatePortfolioData('skills', [...portfolioData.skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    updatePortfolioData('skills', portfolioData.skills.filter(skill => skill !== skillToRemove));
  };

  const addProject = () => {
    const newProject = {
      title: '',
      description: '',
      liveLink: '',
      technologies: []
    };
    updatePortfolioData('projects', [...portfolioData.projects, newProject]);
  };

  const updateProject = (index, field, value) => {
    const updatedProjects = [...portfolioData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    updatePortfolioData('projects', updatedProjects);
  };

  const removeProject = (index) => {
    updatePortfolioData('projects', portfolioData.projects.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    const newEducation = {
      degree: '',
      institution: '',
      year: '',
      description: ''
    };
    updatePortfolioData('education', [...portfolioData.education, newEducation]);
  };

  const updateEducation = (index, field, value) => {
    const updatedEducation = [...portfolioData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    updatePortfolioData('education', updatedEducation);
  };

  const removeEducation = (index) => {
    updatePortfolioData('education', portfolioData.education.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    const newExperience = {
      position: '',
      company: '',
      duration: '',
      description: ''
    };
    updatePortfolioData('experience', [...portfolioData.experience, newExperience]);
  };

  const updateExperience = (index, field, value) => {
    const updatedExperience = [...portfolioData.experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    updatePortfolioData('experience', updatedExperience);
  };

  const removeExperience = (index) => {
    updatePortfolioData('experience', portfolioData.experience.filter((_, i) => i !== index));
  };

  const savePortfolio = () => {
    if (!portfolioData.fullName || !portfolioData.profession) {
      alert('Please fill in name and profession');
      return;
    }

    const portfolioToSave = {
      ...portfolioData,
      id: portfolioData.id || Date.now().toString()
    };

    const existingIndex = savedPortfolios.findIndex(p => p.id === portfolioToSave.id);
    let updatedPortfolios;

    if (existingIndex >= 0) {
      updatedPortfolios = [...savedPortfolios];
      updatedPortfolios[existingIndex] = portfolioToSave;
    } else {
      updatedPortfolios = [...savedPortfolios, portfolioToSave];
    }

    setSavedPortfolios(updatedPortfolios);
    localStorage.setItem('savedPortfolios', JSON.stringify(updatedPortfolios));
    setPortfolioData(portfolioToSave);
    alert('Portfolio saved successfully!');
  };

  const loadPortfolio = (portfolio) => {
    setPortfolioData(portfolio);
    alert('Portfolio loaded!');
  };

  const deletePortfolio = (id) => {
    const updatedPortfolios = savedPortfolios.filter(p => p.id !== id);
    setSavedPortfolios(updatedPortfolios);
    localStorage.setItem('savedPortfolios', JSON.stringify(updatedPortfolios));
    alert('Portfolio deleted!');
  };

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setPreviewMode(false)}
            className="bg-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Exit Preview
          </button>
          <button
            onClick={savePortfolio}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
        <PortfolioPreview data={portfolioData} />
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Advanced Portfolio Builder</h1>
          <p className="text-sm text-zinc-500">Create a professional portfolio with customizable themes and layouts</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowThemePanel(!showThemePanel)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Palette className="h-4 w-4" />
            Customize Theme
          </button>
          <button
            onClick={() => setPreviewMode(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button
            onClick={savePortfolio}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        </div>
      </div>

      {/* Theme Customizer Panel */}
      {showThemePanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ThemeCustomizer
              theme={portfolioData.theme}
              isAnimated={portfolioData.isAnimated}
              onThemeChange={updateTheme}
              onAnimationChange={updateAnimation}
              onClose={() => setShowThemePanel(false)}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Code className="h-5 w-5" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={portfolioData.fullName}
                  onChange={(e) => updatePortfolioData('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Profession</label>
                <select
                  value={portfolioData.profession}
                  onChange={(e) => updatePortfolioData('profession', e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a profession</option>
                  {professions.map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-zinc-700 mb-1">About Me</label>
              <textarea
                value={portfolioData.aboutMe}
                onChange={(e) => updatePortfolioData('aboutMe', e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-zinc-700 mb-1">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'profile')}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {portfolioData.profileImage && (
                <img
                  src={portfolioData.profileImage}
                  alt="Profile"
                  className="mt-2 w-24 h-24 rounded-lg object-cover"
                />
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Skills
            </h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1 px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a skill..."
              />
              <button
                onClick={addSkill}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {portfolioData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:text-blue-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Code className="h-5 w-5" />
                Projects
              </h2>
              <button
                onClick={addProject}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </button>
            </div>
            
            <div className="space-y-4">
              {portfolioData.projects.map((project, index) => (
                <div key={index} className="border border-zinc-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium">Project {index + 1}</h3>
                    <button
                      onClick={() => removeProject(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => updateProject(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Project title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Live Link</label>
                      <input
                        type="url"
                        value={project.liveLink}
                        onChange={(e) => updateProject(index, 'liveLink', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Project description..."
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Project Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'project', index)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="mt-2 w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Experience
              </h2>
              <button
                onClick={addExperience}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </button>
            </div>
            
            <div className="space-y-4">
              {portfolioData.experience.map((exp, index) => (
                <div key={index} className="border border-zinc-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium">Experience {index + 1}</h3>
                    <button
                      onClick={() => removeExperience(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Position</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Job title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Company name"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 2020-2023"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Job description..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </h2>
              <button
                onClick={addEducation}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Education
              </button>
            </div>
            
            <div className="space-y-4">
              {portfolioData.education.map((edu, index) => (
                <div key={index} className="border border-zinc-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium">Education {index + 1}</h3>
                    <button
                      onClick={() => removeEducation(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Degree title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Institution name"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Year</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(index, 'year', e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 2020"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => updateEducation(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Education details..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                <input
                  type="email"
                  value={portfolioData.email}
                  onChange={(e) => updatePortfolioData('email', e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={portfolioData.phone}
                  onChange={(e) => updatePortfolioData('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={portfolioData.linkedin}
                  onChange={(e) => updatePortfolioData('linkedin', e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">GitHub</label>
                <input
                  type="url"
                  value={portfolioData.github}
                  onChange={(e) => updatePortfolioData('github', e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-zinc-700 mb-1">Location</label>
              <input
                type="text"
                value={portfolioData.location}
                onChange={(e) => updatePortfolioData('location', e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Saved Portfolios */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Saved Portfolios</h2>
            
            <div className="space-y-2">
              {savedPortfolios.length === 0 ? (
                <p className="text-zinc-500 text-sm">No saved portfolios yet</p>
              ) : (
                savedPortfolios.map((portfolio) => (
                  <div key={portfolio.id} className="border border-zinc-200 rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{portfolio.fullName}</h3>
                        <p className="text-zinc-500 text-xs">{portfolio.profession}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => loadPortfolio(portfolio)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deletePortfolio(portfolio.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            
            <div className="space-y-2">
              <button
                onClick={() => setPreviewMode(true)}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview Portfolio
              </button>
              
              <button
                onClick={savePortfolio}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Portfolio
              </button>
              
              <button
                onClick={() => setShowThemePanel(true)}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
              >
                <Palette className="h-4 w-4" />
                Customize Theme
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedPortfolioBuilder;
