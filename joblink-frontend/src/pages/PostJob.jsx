import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { useToast } from '../components/Toast';
import { FormSkeleton } from '../components/LoadingSkeleton';

export default function PostJob() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');

    const [form, setForm] = useState({
        title: '',
        description: '',
        location: '',
        salaryMin: '',
        salaryMax: '',
        category: '',
        skillsRequired: '',
        deadline: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [companyId, setCompanyId] = useState(null);
    const [fetchingCompany, setFetchingCompany] = useState(true);
    const [editLoading, setEditLoading] = useState(!!editId);

    // Fetch employer's company
    useEffect(() => {
        const fetchCompany = async () => {
            if (!user?.userId) return;
            try {
                const res = await API.get(`/api/companies/employer/${user.userId}`);
                setCompanyId(res.data.id);
            } catch {
                // No company — user should create one first
            } finally {
                setFetchingCompany(false);
            }
        };
        fetchCompany();
    }, [user]);

    // Fetch job details if editing
    useEffect(() => {
        const fetchJob = async () => {
            if (!editId) return;
            try {
                const res = await API.get(`/api/jobs/${editId}`);
                const job = res.data;
                setForm({
                    title: job.title || '',
                    description: job.description || '',
                    location: job.location || '',
                    salaryMin: job.salaryMin?.toString() || '',
                    salaryMax: job.salaryMax?.toString() || '',
                    category: job.category || '',
                    skillsRequired: Array.isArray(job.skillsRequired)
                        ? job.skillsRequired.join(', ')
                        : job.skillsRequired || '',
                    deadline: job.deadline ? job.deadline.split('T')[0] : '',
                });
            } catch {
                addToast('Failed to load job for editing.', 'error');
            } finally {
                setEditLoading(false);
            }
        };
        fetchJob();
    }, [editId, addToast]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!form.title.trim()) errs.title = 'Title is required';
        if (!form.description.trim()) errs.description = 'Description is required';
        if (form.salaryMin && form.salaryMax && Number(form.salaryMin) > Number(form.salaryMax)) {
            errs.salaryMax = 'Max salary must be ≥ min salary';
        }
        if (form.deadline) {
            const deadlineDate = new Date(form.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (deadlineDate < today) errs.deadline = 'Deadline cannot be in the past';
        }
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                employerId: user.userId,
                companyId: companyId,
                title: form.title,
                description: form.description,
                location: form.location || null,
                salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
                salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
                category: form.category || null,
                skillsRequired: form.skillsRequired || null,
                deadline: form.deadline || null,
            };

            if (editId) {
                await API.put(`/api/jobs/${editId}`, payload);
                addToast('Job updated successfully!');
            } else {
                await API.post('/api/jobs', payload);
                addToast('Job posted successfully!');
            }
            navigate('/my-jobs');
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to save job.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingCompany || editLoading) {
        return (
            <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
                <div className="max-w-2xl mx-auto px-6 py-8">
                    <FormSkeleton />
                </div>
            </div>
        );
    }

    if (!companyId) {
        return (
            <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
                <div className="bg-white rounded-3xl shadow-sm p-10 text-center max-w-md">
                    <p className="text-5xl mb-4">🏢</p>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Company Profile Required</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        You need to set up your company profile before posting jobs.
                    </p>
                    <button
                        onClick={() => navigate('/company')}
                        className="px-6 py-2.5 bg-[#b5621b] text-white rounded-xl text-sm font-medium hover:bg-[#a0541a] transition"
                    >
                        Set Up Company
                    </button>
                </div>
            </div>
        );
    }

    const inputClass = (field) =>
        `mt-1 w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition ${
            errors[field]
                ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-200'
                : 'border-gray-200 focus:border-[#b5621b] focus:ring-1 focus:ring-[#b5621b]/20'
        }`;

    return (
        <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
            <div className="max-w-2xl mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {editId ? 'Edit Job Posting' : 'Post a New Job'}
                </h1>
                <p className="text-gray-500 text-sm mb-6">
                    {editId ? 'Update the details of your job posting' : 'Fill in the details to attract the best candidates'}
                </p>

                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm p-8 space-y-5">
                    <div>
                        <label className="text-sm font-medium text-gray-600">Job Title *</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. Senior React Developer"
                            value={form.title}
                            onChange={handleChange}
                            className={inputClass('title')}
                        />
                        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Description *</label>
                        <textarea
                            name="description"
                            placeholder="Describe the role, responsibilities, and requirements..."
                            value={form.description}
                            onChange={handleChange}
                            rows={6}
                            className={inputClass('description')}
                        />
                        {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Location</label>
                            <input
                                type="text"
                                name="location"
                                placeholder="e.g. Remote, New York, NY"
                                value={form.location}
                                onChange={handleChange}
                                className={inputClass('location')}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Category</label>
                            <input
                                type="text"
                                name="category"
                                placeholder="e.g. Engineering, Design"
                                value={form.category}
                                onChange={handleChange}
                                className={inputClass('category')}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Min Salary ($)</label>
                            <input
                                type="number"
                                name="salaryMin"
                                placeholder="50000"
                                value={form.salaryMin}
                                onChange={handleChange}
                                min="0"
                                className={inputClass('salaryMin')}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-600">Max Salary ($)</label>
                            <input
                                type="number"
                                name="salaryMax"
                                placeholder="120000"
                                value={form.salaryMax}
                                onChange={handleChange}
                                min="0"
                                className={inputClass('salaryMax')}
                            />
                            {errors.salaryMax && <p className="text-xs text-red-500 mt-1">{errors.salaryMax}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Skills Required</label>
                        <input
                            type="text"
                            name="skillsRequired"
                            placeholder="e.g. React, Node.js, TypeScript (comma-separated)"
                            value={form.skillsRequired}
                            onChange={handleChange}
                            className={inputClass('skillsRequired')}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-600">Application Deadline</label>
                        <input
                            type="date"
                            name="deadline"
                            value={form.deadline}
                            onChange={handleChange}
                            className={inputClass('deadline')}
                        />
                        {errors.deadline && <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/my-jobs')}
                            className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-[#b5621b] text-white rounded-xl font-medium hover:bg-[#a0541a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Saving...
                                </span>
                            ) : editId ? 'Update Job' : 'Post Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
