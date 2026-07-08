import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCompletion } from '../context/CompletionContext';
import API from '../api/axios';
import { useToast } from '../components/Toast';
import { FormSkeleton } from '../components/LoadingSkeleton';

export default function CompanyProfile() {
    const { user } = useAuth();
    const { recheckCompletion } = useCompletion();
    const { addToast } = useToast();

    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isNew, setIsNew] = useState(false);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: '',
        description: '',
        industry: '',
        size: '',
        website: '',
        location: '',
        logoUrl: '',
    });

    useEffect(() => {
        const fetchCompany = async () => {
            if (!user?.userId) return;
            try {
                const res = await API.get(`/api/companies/employer/${user.userId}`);
                setCompany(res.data);
                setForm({
                    name: res.data.name || '',
                    description: res.data.description || '',
                    industry: res.data.industry || '',
                    size: res.data.size || '',
                    website: res.data.website || '',
                    location: res.data.location || '',
                    logoUrl: res.data.logoUrl || '',
                });
            } catch (err) {
                if (err.response?.status === 404 || err.response?.status === 500) {
                    setIsNew(true);
                    setEditing(true);
                } else {
                    addToast('Failed to load company profile.', 'error');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, [user, addToast]);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        // Ensure all fields are filled
        if (!form.name.trim() || !form.description.trim() || !form.industry.trim() || 
            !form.size || !form.website.trim() || !form.location.trim() || !form.logoUrl.trim()) {
            addToast('All fields are required.', 'error');
            return;
        }

        setSaving(true);
        try {
            const payload = {
                employerId: user.userId,
                name: form.name,
                description: form.description,
                industry: form.industry,
                size: form.size,
                website: form.website,
                location: form.location,
                logoUrl: form.logoUrl,
            };

            let res;
            if (isNew) {
                res = await API.post('/api/companies', payload);
                setIsNew(false);
            } else {
                res = await API.put(`/api/companies/${company.id}`, payload);
            }
            setCompany(res.data);
            setEditing(false);
            addToast('Company profile saved!');
            await recheckCompletion();
        } catch {
            addToast('Failed to save company profile.', 'error');
        } finally {
            setSaving(false);
        }
    };

    const inputClass = 'mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#b5621b] focus:ring-1 focus:ring-[#b5621b]/20 transition';

    if (loading) {
        return (
            <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
                <div className="max-w-2xl mx-auto px-6 py-8">
                    <FormSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isNew ? 'Set Up Your Company' : 'Company Profile'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {isNew ? 'Create your company profile to start posting jobs' : 'Manage your company information'}
                        </p>
                    </div>
                    {!isNew && !editing && (
                        <button
                            onClick={() => setEditing(true)}
                            className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                            Edit
                        </button>
                    )}
                </div>

                {editing ? (
                    /* Edit / Create Form */
                    <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm p-8 space-y-5">
                        <div>
                            <label className="text-sm font-medium text-gray-600">Company Name *</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your company name"
                                required
                                value={form.name}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Description *</label>
                            <textarea
                                name="description"
                                placeholder="What does your company do?"
                                required
                                value={form.description}
                                onChange={handleChange}
                                rows={4}
                                className={inputClass}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Industry *</label>
                                <input
                                    type="text"
                                    name="industry"
                                    placeholder="e.g. Technology, Finance"
                                    required
                                    value={form.industry}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Company Size *</label>
                                <select
                                    name="size"
                                    required
                                    value={form.size}
                                    onChange={handleChange}
                                    className={inputClass}
                                >
                                    <option value="">Select size</option>
                                    <option value="STARTUP">Startup</option>
                                    <option value="SME">SME</option>
                                    <option value="LARGE">Large</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="e.g. San Francisco, CA"
                                    required
                                    value={form.location}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Website *</label>
                                <input
                                    type="url"
                                    name="website"
                                    placeholder="https://yourcompany.com"
                                    required
                                    value={form.website}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Logo URL *</label>
                            <input
                                type="url"
                                name="logoUrl"
                                placeholder="https://yourcompany.com/logo.png"
                                required
                                value={form.logoUrl}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            {!isNew && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditing(false);
                                        // Reset form to saved values
                                        setForm({
                                            name: company?.name || '',
                                            description: company?.description || '',
                                            industry: company?.industry || '',
                                            size: company?.size || '',
                                            website: company?.website || '',
                                            location: company?.location || '',
                                            logoUrl: company?.logoUrl || '',
                                        });
                                    }}
                                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 py-3 bg-[#b5621b] text-white rounded-xl font-medium hover:bg-[#a0541a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Saving...
                                    </span>
                                ) : isNew ? 'Create Company' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                ) : (
                    /* View Mode */
                    <div className="bg-white rounded-3xl shadow-sm p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold text-gray-900">{company?.name}</h2>
                                    {company?.verified && (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-medium">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Verified
                                        </span>
                                    )}
                                </div>
                                {company?.industry && (
                                    <p className="text-sm text-[#b5621b] font-medium mt-1">{company.industry}</p>
                                )}
                            </div>
                            {company?.logoUrl && (
                                <img src={company.logoUrl} alt={company.name} className="w-16 h-16 rounded-2xl object-cover" />
                            )}
                        </div>

                        {company?.description && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">About</h3>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{company.description}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {company?.location && (
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-1">Location</p>
                                    <p className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                        </svg>
                                        {company.location}
                                    </p>
                                </div>
                            )}
                            {company?.website && (
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-1">Website</p>
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-[#b5621b] hover:underline flex items-center gap-1.5"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                        </svg>
                                        {company.website.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            )}
                            {company?.size && (
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-1">Company Size</p>
                                    <p className="text-sm font-medium text-gray-800">{company.size}</p>
                                </div>
                            )}
                            {company?.createdAt && (
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-500 mb-1">Member Since</p>
                                    <p className="text-sm font-medium text-gray-800">
                                        {new Date(company.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
