import { useState, useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Exams from './pages/Exams';
import Exam from './pages/Exam';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ isValid, children }) => {
    if (!isValid) {
        return <Navigate to='/' replace />;
    }

    return children;
};

function App() {
    const [isValidSession, setIsValidSession] = useState(false);
    const location = useLocation();

    function validateSession() {
        const sessionExpire = Cookies.get('cafiStudentSessionExp');

        if (!sessionExpire) {
            console.log('No token.');
            setIsValidSession(false);
            return false;
        }

        const currentDate = new Date();

        if (sessionExpire < currentDate.getTime()) {
            console.log('Token expired.');
            setIsValidSession(false);
            return false;
        } else {
            console.log('Valid token.');
            setIsValidSession(true);
            return true;
        }
    }

    useEffect(() => {
        console.log('location', location);
        validateSession();
    }, [location]);

    return (
        <Routes>
            <Route
                path='/'
                element={<Login sendValidation={validateSession} />}
            />
            <Route
                path='/dashboard'
                element={
                    <ProtectedRoute isValid={isValidSession}>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route path='/exams'>
                <Route
                    index
                    element={
                        <ProtectedRoute isValid={isValidSession}>
                            <Exams />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path=':id'
                    element={
                        <ProtectedRoute isValid={isValidSession}>
                            <Exam />
                        </ProtectedRoute>
                    }
                />
            </Route>
            <Route
                path='*'
                element={
                    <ProtectedRoute isValid={isValidSession}>
                        <NotFound />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
