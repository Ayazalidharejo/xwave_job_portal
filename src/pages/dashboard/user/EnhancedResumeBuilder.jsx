import { useEffect, useState, useRef } from 'react'
import Save from '@mui/icons-material/Save'
import Add from '@mui/icons-material/Add'
import Delete from '@mui/icons-material/Delete'
import Edit from '@mui/icons-material/Edit'
import Download from '@mui/icons-material/Download'
import Person from '@mui/icons-material/Person'
import Email from '@mui/icons-material/Email'
import Phone from '@mui/icons-material/Phone'
import LocationOn from '@mui/icons-material/LocationOn'
import School from '@mui/icons-material/School'
import Work from '@mui/icons-material/Work'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import { setMyResume, setResumeLoading, setResumeError } from '../../../store/slices/resumeSlice'
import { resumeApi } from '../../../services/api'

// Default preview template (user ise apne hisaab se edit karke save karta hai)
const DEFAULT_RESUME_TEMPLATE = () => ({
  personalInfo: {
    fullName: 'Imrana Saif',
    title: 'UX/UI Designer',
    email: 'imranasaifwave92@gmail.com',
    phone: '+92-3095813292',
    location: '',
    summary: 'Professional UX/UI Designer with experience in user-friendly interfaces, wireframing, and prototyping.'
  },
  experience: [
    { id: Date.now() + 1, position: 'UX/UI Designer', company: 'RathiSoft Innovation', duration: 'Jul 2025 - Jan 2026', description: 'A Pakistan-based software development company. Tourism & Travel Booking Platform (12 Months). Contributed to UI/UX improvements, user-friendly layouts for tour listings, content clarity, and usability enhancements. Tools: Figma, Canva, Google Docs, Platform Admin Panel.' },
    { id: Date.now() + 2, position: 'UI Designer', company: 'MedSynk: Small Clinics Web App', duration: 'Jul 2025 - Sep 2025', description: 'Designed a healthcare management web app for appointments and patient records. Created intuitive interface, wireframes, user flows, style guide, and final UI screens.' },
    { id: Date.now() + 3, position: 'Design Intern', company: 'Dunya News Website Redesign', duration: 'Jan 2025 - March 2025', description: 'Redesign for usability, navigation, and visual appeal. Used Figma for high-fidelity design and auto layout.' },
    { id: Date.now() + 4, position: 'UI Designer', company: 'Fixify: Cars & Bikes Breakdown App', duration: 'Sep 2024 - Jan 2025', description: 'Smart service app for car and bike breakdowns. Connects users with nearby mechanics. Reliable, fast, and easy to use.' }
  ],
  education: [
    { id: Date.now() + 5, degree: 'Masters of Arts', institution: 'Government College Faisalabad, Pakistan', duration: 'Jun 2011 - Aug 2013', description: '' }
  ],
  skills: ['Figma', 'Canva', 'User research', 'Wireframing', 'Prototyping', 'Work With Components', 'Animation'],
  languages: [],
  certifications: [
    { id: Date.now() + 6, degree: 'UI/UX Course', institution: 'XWAVE', duration: 'Sep 2024 - Sep 2025', description: '12-months on-site UI/UX course; executed 3 portfolio projects using Figma, Wireframing and Prototyping.' }
  ]
})

const defaultResumeData = () => ({
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: []
})

const EnhancedResumeBuilder = () => {
  const dispatch = useAppDispatch()
  const { myResume, loading } = useAppSelector((state) => state.resume)
  const [resumeData, setResumeData] = useState(defaultResumeData())
  const [isEditing, setIsEditing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    loadResume()
  }, [])

  const loadResume = async () => {
    dispatch(setResumeLoading(true))
    try {
      const { data } = await resumeApi.getMy()
      dispatch(setMyResume(data))
      if (data) {
        const normalized = data.personalInfo != null
          ? data
          : { ...defaultResumeData(), ...(data.data || {}) }
        const hasSavedContent = normalized.personalInfo?.fullName?.trim() ||
          (normalized.experience && normalized.experience.length > 0) ||
          (normalized.education && normalized.education.length > 0)
        if (hasSavedContent) {
          setResumeData(normalized)
        } else {
          setResumeData(DEFAULT_RESUME_TEMPLATE())
        }
      } else {
        setResumeData(DEFAULT_RESUME_TEMPLATE())
      }
    } catch (err) {
      dispatch(setResumeError(err.response?.data?.message || 'Failed to load resume'))
      setResumeData(DEFAULT_RESUME_TEMPLATE())
    } finally {
      dispatch(setResumeLoading(false))
    }
  }

  const saveResume = async () => {
    try {
      const { data } = await resumeApi.upsertMy(resumeData)
      dispatch(setMyResume(data))
      setIsEditing(false)
    } catch (err) {
      dispatch(setResumeError(err.response?.data?.message || 'Failed to save resume'))
    }
  }

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
  }

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now(),
        position: '',
        company: '',
        duration: '',
        description: ''
      }]
    }))
  }

  const updateExperience = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeExperience = (id) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }))
  }

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        id: Date.now(),
        degree: '',
        institution: '',
        duration: '',
        description: ''
      }]
    }))
  }

  const updateEducation = (id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const removeEducation = (id) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  const addSkill = () => {
    const skillInput = document.getElementById('new-skill')
    const skill = skillInput?.value?.trim()
    if (skill && !resumeData.skills.includes(skill)) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
      skillInput.value = ''
    }
  }

  const removeSkill = (skill) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const exportPDF = () => {
    // PDF export functionality
    window.print()
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Resume Preview</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="btn-secondary"
              >
                Back to Edit
              </button>
              <button
                onClick={exportPDF}
                className="btn-primary"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
          
          <div className="resume-template">
            {/* Resume Header */}
            <div className="resume-header">
              <div className="relative z-10">
                <h1 className="text-4xl font-bold mb-2">{resumeData.personalInfo.fullName}</h1>
                <p className="text-xl mb-4 opacity-90">{resumeData.personalInfo.title}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  {resumeData.personalInfo.email && (
                    <div className="flex items-center gap-2">
                      <Email className="h-4 w-4" />
                      {resumeData.personalInfo.email}
                    </div>
                  )}
                  {resumeData.personalInfo.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {resumeData.personalInfo.phone}
                    </div>
                  )}
                  {resumeData.personalInfo.location && (
                    <div className="flex items-center gap-2">
                      <LocationOn className="h-4 w-4" />
                      {resumeData.personalInfo.location}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Body */}
            <div className="resume-body">
              {/* Summary Section */}
              {resumeData.personalInfo.summary && (
                <div className="resume-section">
                  <h2 className="resume-section-title">Professional Summary</h2>
                  <p className="text-neutral-700 leading-relaxed">{resumeData.personalInfo.summary}</p>
                </div>
              )}

              {/* Experience Section */}
              {resumeData.experience.length > 0 && (
                <div className="resume-section">
                  <h2 className="resume-section-title">Professional Experience</h2>
                  {resumeData.experience.map((exp) => (
                    <div key={exp.id} className="resume-item">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="resume-item-title">{exp.position}</h3>
                          <p className="resume-item-subtitle">{exp.company}</p>
                        </div>
                        <span className="resume-item-date">{exp.duration}</span>
                      </div>
                      {exp.description && (
                        <p className="resume-item-description">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Education Section */}
              {resumeData.education.length > 0 && (
                <div className="resume-section">
                  <h2 className="resume-section-title">Education</h2>
                  {resumeData.education.map((edu) => (
                    <div key={edu.id} className="resume-item">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="resume-item-title">{edu.degree}</h3>
                          <p className="resume-item-subtitle">{edu.institution}</p>
                        </div>
                        <span className="resume-item-date">{edu.duration}</span>
                      </div>
                      {edu.description && (
                        <p className="resume-item-description">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Certifications Section */}
              {resumeData.certifications && resumeData.certifications.length > 0 && (
                <div className="resume-section">
                  <h2 className="resume-section-title">Certifications</h2>
                  {resumeData.certifications.map((cert) => (
                    <div key={cert.id} className="resume-item">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="resume-item-title">{cert.degree || cert.title}</h3>
                          <p className="resume-item-subtitle">{cert.institution}</p>
                        </div>
                        <span className="resume-item-date">{cert.duration}</span>
                      </div>
                      {cert.description && (
                        <p className="resume-item-description">{cert.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Skills Section */}
              {resumeData.skills.length > 0 && (
                <div className="resume-section">
                  <h2 className="resume-section-title">Skills</h2>
                  <div className="resume-skills">
                    {resumeData.skills.map((skill, index) => (
                      <span key={index} className="resume-skill">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-w-0 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 mb-1">Enhanced Resume Builder</h1>
          <p className="text-sm text-zinc-500">Create a professional resume with modern styling</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="btn-secondary"
          >
            Preview Resume
          </button>
          <button
            onClick={saveResume}
            disabled={loading}
            className="btn-primary"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Resume'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="card-advanced p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Person className="h-5 w-5" />
            Personal Information
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
              <input
                type="text"
                value={resumeData.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                className="input-saas"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Professional Title</label>
              <input
                type="text"
                value={resumeData.personalInfo.title}
                onChange={(e) => updatePersonalInfo('title', e.target.value)}
                className="input-saas"
                placeholder="Senior Software Engineer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
              <input
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                className="input-saas"
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Phone</label>
              <input
                type="tel"
                value={resumeData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                className="input-saas"
                placeholder="+1234567890"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Location</label>
              <input
                type="text"
                value={resumeData.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                className="input-saas"
                placeholder="New York, NY"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Professional Summary</label>
              <textarea
                value={resumeData.personalInfo.summary}
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                className="input-saas resize-y"
                rows={4}
                placeholder="Brief summary of your professional background..."
              />
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="card-advanced p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Work className="h-5 w-5" />
              Experience
            </h2>
            <button
              onClick={addExperience}
              className="btn-secondary text-sm"
            >
              <Add className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
          
          <div className="space-y-4">
            {resumeData.experience.map((exp) => (
              <div key={exp.id} className="border border-zinc-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">Experience</h3>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Delete className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    className="input-saas"
                    placeholder="Job Title"
                  />
                  
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="input-saas"
                    placeholder="Company Name"
                  />
                  
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                    className="input-saas"
                    placeholder="2020 - Present"
                  />
                  
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    className="input-saas resize-y"
                    rows={3}
                    placeholder="Job description..."
                  />
                </div>
              </div>
            ))}
            
            {resumeData.experience.length === 0 && (
              <p className="text-zinc-500 text-center py-8">No experience added yet</p>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="card-advanced p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <School className="h-5 w-5" />
              Education
            </h2>
            <button
              onClick={addEducation}
              className="btn-secondary text-sm"
            >
              <Add className="h-4 w-4 mr-1" />
              Add
            </button>
          </div>
          
          <div className="space-y-4">
            {resumeData.education.map((edu) => (
              <div key={edu.id} className="border border-zinc-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium">Education</h3>
                  <button
                    onClick={() => removeEducation(edu.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Delete className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="input-saas"
                    placeholder="Degree"
                  />
                  
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    className="input-saas"
                    placeholder="Institution"
                  />
                  
                  <input
                    type="text"
                    value={edu.duration}
                    onChange={(e) => updateEducation(edu.id, 'duration', e.target.value)}
                    className="input-saas"
                    placeholder="2016 - 2020"
                  />
                  
                  <textarea
                    value={edu.description}
                    onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                    className="input-saas resize-y"
                    rows={3}
                    placeholder="Education details..."
                  />
                </div>
              </div>
            ))}
            
            {resumeData.education.length === 0 && (
              <p className="text-zinc-500 text-center py-8">No education added yet</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="card-advanced p-6">
          <h2 className="text-lg font-semibold mb-4">Skills</h2>
          
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                id="new-skill"
                type="text"
                className="input-saas flex-1"
                placeholder="Add a skill..."
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              />
              <button
                onClick={addSkill}
                className="btn-primary"
              >
                <Add className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-primary-500 hover:text-primary-700"
                >
                  <Delete className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          
          {resumeData.skills.length === 0 && (
            <p className="text-zinc-500 text-center py-8">No skills added yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default EnhancedResumeBuilder
