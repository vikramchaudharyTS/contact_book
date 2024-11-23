import { Routes,Route, useLocation } from "react-router-dom";


const ProtectedRoutes = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
    // Protect routes only for authenticated users
    if (!isAuthenticated) return <Navigate to='/login' replace />;
    if (!user || !user.isVerified) return <Navigate to='/verify-email' replace />;
    return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation(); // Track current location

    // If user is authenticated and trying to access login or signup, redirect to dashboard
    if (isAuthenticated && user?.isVerified && (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/')) {
        return <Navigate to='/dashboard' replace />;
    }

    return children;
};

function routing{
    return (
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<RedirectAuthenticatedUser><LandingPage /></RedirectAuthenticatedUser>} />
          <Route path='/register' element={<RedirectAuthenticatedUser><Register /></RedirectAuthenticatedUser>} />
          <Route path='/login' element={<RedirectAuthenticatedUser><LoginPage /></RedirectAuthenticatedUser>} />
          

          {/* Protected routes with Layout */}
          <Route element={<ProtectedRoutes><Layout /></ProtectedRoutes>}>
            
          </Route>
        </Routes>
    );
}

export default routing;