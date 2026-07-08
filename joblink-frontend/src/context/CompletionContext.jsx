import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import API from '../api/axios';

const CompletionContext = createContext();

export const CompletionProvider = ({ children }) => {
    const { user, isAuthenticated, isCandidate, isEmployer } = useAuth();
    
    const [profileComplete, setProfileComplete] = useState(false);
    const [companyComplete, setCompanyComplete] = useState(false);
    const [completionLoading, setCompletionLoading] = useState(true);

    const checkCompletion = useCallback(async () => {
        if (!isAuthenticated() || !user?.userId) {
            setProfileComplete(false);
            setCompanyComplete(false);
            setCompletionLoading(false);
            return;
        }

        setCompletionLoading(true);
        try {
            if (isCandidate()) {
                const res = await API.get(`/api/profiles/${user.userId}`);
                const profile = res.data;
                // Complete if it exists and has at least one education
                if (profile && profile.educations && profile.educations.length > 0) {
                    setProfileComplete(true);
                } else {
                    setProfileComplete(false);
                }
            } else if (isEmployer()) {
                const res = await API.get(`/api/companies/employer/${user.userId}`);
                if (res.data && res.data.id) {
                    setCompanyComplete(true);
                } else {
                    setCompanyComplete(false);
                }
            }
        } catch (err) {
            // 404 means incomplete
            if (isCandidate()) setProfileComplete(false);
            if (isEmployer()) setCompanyComplete(false);
        } finally {
            setCompletionLoading(false);
        }
    }, [user, isAuthenticated, isCandidate, isEmployer]);

    // Check completion on mount and when user auth state changes
    useEffect(() => {
        checkCompletion();
    }, [checkCompletion]);

    return (
        <CompletionContext.Provider value={{
            profileComplete,
            companyComplete,
            completionLoading,
            recheckCompletion: checkCompletion
        }}>
            {children}
        </CompletionContext.Provider>
    );
};

export const useCompletion = () => useContext(CompletionContext);
