import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

function FullScreenLoader() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F7F5]">
            <div className="w-16 h-16 bg-[#C8550A]/10 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-[#C8550A] animate-spin" />
            </div>
            <p className="text-[#2D2418] font-medium animate-pulse">Loading Maa Ki Rasoi...</p>
        </div>
    );
}

export function ProtectedRoute({ children }) {
    const { user, loading } = useAuthContext();

    if (loading) return <FullScreenLoader />;
    if (!user) return <Navigate to="/login" replace />;

    return children;
}
