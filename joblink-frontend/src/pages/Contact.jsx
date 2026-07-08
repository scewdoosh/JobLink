import { useState } from 'react';
import { useToast } from '../components/Toast';

export default function Contact() {
    const { addToast } = useToast();
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            addToast('Please fill in all required fields.', 'error');
            return;
        }
        setSending(true);
        // Simulate sending (no backend endpoint for contact yet)
        setTimeout(() => {
            addToast('Message sent! We\'ll get back to you shortly.');
            setForm({ name: '', email: '', subject: '', message: '' });
            setSending(false);
        }, 1000);
    };

    const inputClass = 'mt-1 w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#b5621b] focus:ring-1 focus:ring-[#b5621b]/20 transition';

    return (
        <div className="bg-[#f5f0eb] min-h-[calc(100vh-64px)]">
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Have a question, suggestion, or need help? We'd love to hear from you.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="text-2xl mb-2">📧</div>
                            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                            <p className="text-sm text-gray-500">support@joblink.com</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="text-2xl mb-2">📍</div>
                            <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                            <p className="text-sm text-gray-500">123 Innovation Drive<br />San Francisco, CA 94102</p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="text-2xl mb-2">🕐</div>
                            <h3 className="font-semibold text-gray-900 mb-1">Hours</h3>
                            <p className="text-sm text-gray-500">Mon–Fri: 9 AM – 6 PM PST</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm p-8 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="What is this about?"
                                    value={form.subject}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-600">Message *</label>
                                <textarea
                                    name="message"
                                    placeholder="Tell us what's on your mind..."
                                    value={form.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className={inputClass}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full py-3 bg-[#b5621b] text-white rounded-xl font-medium hover:bg-[#a0541a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {sending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Sending...
                                    </span>
                                ) : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
