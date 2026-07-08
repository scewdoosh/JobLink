import { useState, useEffect } from 'react';
import API from '../api/axios';

export default function CandidateAvatar({ userId, name, className = "w-10 h-10 text-base" }) {
    const [imageUrl, setImageUrl] = useState(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!userId) return;

        let objectUrl = null;
        let isMounted = true;

        const fetchImage = async () => {
            try {
                const res = await API.get(`/api/profiles/${userId}/picture`, {
                    responseType: 'blob'
                });
                
                if (isMounted) {
                    objectUrl = window.URL.createObjectURL(res.data);
                    setImageUrl(objectUrl);
                    setFailed(false);
                }
            } catch (err) {
                if (isMounted) {
                    setFailed(true);
                }
            }
        };

        fetchImage();

        return () => {
            isMounted = false;
            if (objectUrl) {
                window.URL.revokeObjectURL(objectUrl);
            }
        };
    }, [userId]);

    if (!imageUrl || failed) {
        const displayName = name || 'User';
        const initial = displayName.charAt(0).toUpperCase();
        return (
            <div className={`bg-[#f5f0eb] rounded-full flex items-center justify-center text-[#b5621b] font-semibold shrink-0 border border-[#b5621b]/20 ${className}`}>
                {initial}
            </div>
        );
    }

    return (
        <img 
            src={imageUrl} 
            alt={`${name}'s profile`} 
            className={`rounded-full object-cover shrink-0 border border-gray-200 ${className}`} 
        />
    );
}
