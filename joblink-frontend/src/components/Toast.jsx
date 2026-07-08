import { useState, useEffect, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, exiting: false }]);

        setTimeout(() => {
            setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 300);
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg text-sm font-medium max-w-sm ${
                            toast.type === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-emerald-600 text-white'
                        }`}
                        style={{
                            animation: toast.exiting
                                ? 'toast-slide-out 0.3s ease-in forwards'
                                : 'toast-slide-in 0.3s ease-out',
                        }}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
