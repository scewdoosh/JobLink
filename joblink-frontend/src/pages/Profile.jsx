import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompletion } from '../context/CompletionContext';
import API from '../api/axios';
import { useToast } from '../components/Toast';
import { FormSkeleton } from '../components/LoadingSkeleton';

export default function Profile() {
    const { user } = useAuth();
    const { recheckCompletion } = useCompletion();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isNew, setIsNew] = useState(false);
    const [existingResumeName, setExistingResumeName] = useState('');

    const [form, setForm] = useState({
        bio: '',
        location: '',
        skills: '',
        experiences: [],
        educations: []
    });
    
    const [resumeFile, setResumeFile] = useState(null);
    const [profilePicFile, setProfilePicFile] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [hasExistingProfilePic, setHasExistingProfilePic] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.userId) return;
            try {
                const res = await API.get(`/api/profiles/${user.userId}`);
                const data = res.data;
                setForm({
                    bio: data.bio || '',
                    location: data.location || '',
                    skills: data.skills || '',
                    experiences: data.experiences || [],
                    educations: data.educations || []
                });
                setExistingResumeName(data.resumeFileName || '');
                setHasExistingProfilePic(data.hasProfilePicture || false);
                if (data.hasProfilePicture) {
                    // Preview the existing picture
                    const picRes = await API.get(`/api/profiles/${user.userId}/picture`, { responseType: 'blob' });
                    setProfilePicPreview(window.URL.createObjectURL(picRes.data));
                }
            } catch (err) {
                if (err.response?.status === 404 || err.response?.status === 500) {
                    setIsNew(true);
                } else {
                    addToast('Failed to load profile.', 'error');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, addToast]);

    const handleFormChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== 'application/pdf') {
            addToast('Only PDF files are allowed for resume.', 'error');
            e.target.value = '';
            setResumeFile(null);
            return;
        }
        setResumeFile(file);
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                addToast('Only image files are allowed for profile picture.', 'error');
                e.target.value = '';
                setProfilePicFile(null);
                return;
            }
            setProfilePicFile(file);
            setProfilePicPreview(window.URL.createObjectURL(file));
        }
    };

    // Experience Handlers
    const addExperience = () => {
        setForm(prev => ({
            ...prev,
            experiences: [...prev.experiences, { company: '', role: '', startDate: '', endDate: '', description: '' }]
        }));
    };

    const removeExperience = (index) => {
        setForm(prev => ({
            ...prev,
            experiences: prev.experiences.filter((_, i) => i !== index)
        }));
    };

    const handleExperienceChange = (index, field, value) => {
        setForm(prev => {
            const newExp = [...prev.experiences];
            newExp[index][field] = value;
            return { ...prev, experiences: newExp };
        });
    };

    // Education Handlers
    const addEducation = () => {
        setForm(prev => ({
            ...prev,
            educations: [...prev.educations, { institution: '', degree: '', year: '' }]
        }));
    };

    const removeEducation = (index) => {
        setForm(prev => ({
            ...prev,
            educations: prev.educations.filter((_, i) => i !== index)
        }));
    };

    const handleEducationChange = (index, field, value) => {
        setForm(prev => {
            const newEdu = [...prev.educations];
            newEdu[index][field] = value;
            return { ...prev, educations: newEdu };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (form.educations.length === 0) {
            addToast('At least one education entry is required.', 'error');
            return;
        }
        if (isNew && !resumeFile) {
            addToast('Resume PDF is required.', 'error');
            return;
        }

        setSaving(true);
        try {
            const profileData = {
                userId: user.userId,
                bio: form.bio,
                location: form.location,
                skills: form.skills,
                experiences: form.experiences,
                educations: form.educations
            };

            const formData = new FormData();
            formData.append('profile', new Blob([JSON.stringify(profileData)], { type: 'application/json' }));
            
            // If editing and no new file selected, we could technically skip it if backend allows,
            // but the new endpoint expects a file. Assuming the backend accepts empty file if already has one,
            // or we must upload. If we must upload, we should enforce it. Let's send the file if exists, or an empty one.
            if (resumeFile) {
                formData.append('resume', resumeFile);
            } else {
                formData.append('resume', new Blob([]), 'empty.pdf');
            }

            if (profilePicFile) {
                formData.append('profilePicture', profilePicFile);
            } else {
                // If the backend requires it, send an empty blob, though checking content type might fail if not an image.
                // Wait, if it's already existing and they don't upload a new one, we might need a workaround. 
                // We'll send an empty blob with a dummy image name if required, or let backend handle empty. 
                formData.append('profilePicture', new Blob([], { type: 'image/jpeg' }), 'empty.jpg');
            }

            await API.post('/api/profiles/complete', formData);
            
            addToast('Profile saved successfully!');
            await recheckCompletion();
            navigate('/jobs');
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to save profile.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#b5621b] focus:ring-1 focus:ring-[#b5621b]/20 transition';

    if (loading) {
        return (
            <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
                <div className="max-w-3xl mx-auto px-6 py-8">
                    <FormSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)] py-8">
            <div className="max-w-3xl mx-auto px-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isNew ? 'Complete Your Profile' : 'Edit Your Profile'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {isNew ? 'Provide your details and resume to start applying to jobs.' : 'Update your information and resume.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-white rounded-3xl shadow-sm p-8 space-y-5">
                        <h2 className="text-lg font-semibold text-gray-900">Basic Info</h2>

                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-2">Profile Picture {isNew && '*'}</label>
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-gray-50 rounded-full border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center relative group">
                                    {profilePicPreview ? (
                                        <img src={profilePicPreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl text-gray-400">👤</span>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <input 
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfilePicChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        required={isNew}
                                    />
                                </div>
                                <div className="flex-1 text-sm text-gray-500">
                                    <p>Upload a clear photo of yourself to help employers put a face to your application.</p>
                                    <p className="mt-1 text-xs">JPG, PNG, WebP supported.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600 block mb-1">Resume (PDF only) {isNew && '*'}</label>
                            {existingResumeName && !resumeFile && (
                                <p className="text-xs text-gray-500 mb-2">Current file: {existingResumeName}</p>
                            )}
                            <input
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handleResumeChange}
                                className={inputClass}
                                required={isNew}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Bio</label>
                            <textarea
                                name="bio"
                                placeholder="Tell employers about yourself..."
                                value={form.bio}
                                onChange={handleFormChange}
                                rows={4}
                                className={`mt-1 ${inputClass}`}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Location</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. San Francisco, CA"
                                value={form.location}
                                onChange={handleFormChange}
                                className={`mt-1 ${inputClass}`}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Skills</label>
                            <input
                                type="text"
                                name="skills"
                                placeholder="e.g. React, Node.js, Python (comma-separated)"
                                value={form.skills}
                                onChange={handleFormChange}
                                className={`mt-1 ${inputClass}`}
                            />
                        </div>
                    </div>

                    {/* Experience Section */}
                    <div className="bg-white rounded-3xl shadow-sm p-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Experience <span className="text-sm font-normal text-gray-500">(Optional)</span></h2>
                            <button
                                type="button"
                                onClick={addExperience}
                                className="text-sm font-medium text-[#b5621b] hover:underline"
                            >
                                + Add Role
                            </button>
                        </div>
                        
                        {form.experiences.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No experience added yet.</p>
                        ) : (
                            <div className="space-y-6">
                                {form.experiences.map((exp, index) => (
                                    <div key={index} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl relative">
                                        <button
                                            type="button"
                                            onClick={() => removeExperience(index)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            <input
                                                type="text"
                                                placeholder="Company *"
                                                required
                                                value={exp.company}
                                                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                                className={inputClass}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Role *"
                                                required
                                                value={exp.role}
                                                onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                                                className={inputClass}
                                            />
                                            <input
                                                type="date"
                                                placeholder="Start Date"
                                                value={exp.startDate}
                                                onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                                                className={inputClass}
                                            />
                                            <input
                                                type="date"
                                                placeholder="End Date"
                                                value={exp.endDate}
                                                onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>
                                        <textarea
                                            placeholder="Description"
                                            value={exp.description}
                                            onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                                            rows={2}
                                            className={`mt-4 ${inputClass}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Education Section */}
                    <div className="bg-white rounded-3xl shadow-sm p-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Education <span className="text-sm font-normal text-red-500">(Required)</span></h2>
                            <button
                                type="button"
                                onClick={addEducation}
                                className="text-sm font-medium text-[#b5621b] hover:underline"
                            >
                                + Add Education
                            </button>
                        </div>
                        
                        {form.educations.length === 0 ? (
                            <p className="text-sm text-red-500 italic">Please add at least one education entry.</p>
                        ) : (
                            <div className="space-y-6">
                                {form.educations.map((edu, index) => (
                                    <div key={index} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl relative">
                                        <button
                                            type="button"
                                            onClick={() => removeEducation(index)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                            <input
                                                type="text"
                                                placeholder="Institution *"
                                                required
                                                value={edu.institution}
                                                onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                                className={inputClass}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Degree *"
                                                required
                                                value={edu.degree}
                                                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                                className={inputClass}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Year"
                                                value={edu.year}
                                                onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                                                className={inputClass}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-4 bg-[#b5621b] text-white rounded-2xl font-medium text-lg hover:bg-[#a0541a] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                        {saving ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Uploading & Saving...
                            </span>
                        ) : 'Save Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
}
