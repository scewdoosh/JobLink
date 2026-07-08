import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hydrate from cookies on mount
    useEffect(() => {
        const storedToken = Cookies.get('token');
        const storedUser = Cookies.get('user');
        if (storedToken && storedUser) {
            try {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            } catch {
                // Corrupted cookie — clear everything
                Cookies.remove('token');
                Cookies.remove('user');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, jwtToken) => {
        // Decode JWT to extract userId (and any other claims)
        let userId = userData.userId || null;
        try {
            const decoded = jwtDecode(jwtToken);
            userId = decoded.userId || userId;
        } catch {
            // If decode fails, fall back to whatever was passed
        }

        const fullUser = {
            userId,
            name: userData.name || null,
            email: userData.email,
            role: userData.role,
        };

        setUser(fullUser);
        setToken(jwtToken);
        Cookies.set('token', jwtToken, { expires: 1, secure: true, sameSite: 'strict' });
        Cookies.set('user', JSON.stringify(fullUser), { expires: 1, secure: true, sameSite: 'strict' });
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        Cookies.remove('token');
        Cookies.remove('user');
    };

    const isAuthenticated = () => !!token;
    const isEmployer = () => user?.role === 'EMPLOYER';
    const isCandidate = () => user?.role === 'CANDIDATE';

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            logout,
            isAuthenticated,
            isEmployer,
            isCandidate
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);