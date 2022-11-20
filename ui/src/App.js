import { useState, useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { UserContext } from './context/UserContext';

import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Exams from './pages/Exams';
import Exam from './pages/Exam';
import StudentInquiries from './pages/StudentInquiries';
import StudentInquiry from './pages/StudentInquiry';
import ArticlesHanshi from './pages/ArticlesHanshi';
import ArticleForm from './pages/ArticleForm';
import Article from './pages/Article';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ isValid, children }) => {
    if (!isValid) {
        return <Navigate to='/' replace />;
    }

    return children;
};

function App() {
    const [isValidSession, setIsValidSession] = useState(true); // refresh page causes user to go to login screen
    const [userRoles, setUserRoles] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isHanshi, setIsHanshi] = useState(false);

    const location = useLocation();

    console.log('is valid session', isValidSession);

    function validateSession() {
        console.log('validate session ran');
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

    useEffect(() => {
        setIsAdmin(userRoles.includes('admin'));
        setIsHanshi(userRoles.includes('hanshi'));
    }, [userRoles]);

    return (
        <div>
            <UserContext.Provider value={{ setUserRoles, isAdmin, isHanshi }}>
                {isValidSession && <Header />}
                <main className='p-4'>
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
                        <Route path='/studentInquiries'>
                            <Route
                                index
                                element={
                                    <ProtectedRoute isValid={isValidSession}>
                                        <StudentInquiries />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path=':id'
                                element={
                                    <ProtectedRoute isValid={isValidSession}>
                                        <StudentInquiry />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                        <Route path='/articlesHanshi'>
                            <Route
                                index
                                element={
                                    <ProtectedRoute isValid={isValidSession}>
                                        <ArticlesHanshi />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path=':id'
                                element={
                                    <ProtectedRoute isValid={isValidSession}>
                                        <Article />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>
                        {isHanshi && (
                            <Route path='/article'>
                                <Route
                                    path='reply/:id'
                                    element={
                                        <ProtectedRoute
                                            isValid={isValidSession}
                                        >
                                            <ArticleForm action={'reply'} />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path='edit/:id'
                                    element={
                                        <ProtectedRoute
                                            isValid={isValidSession}
                                        >
                                            <ArticleForm action={'edit'} />
                                        </ProtectedRoute>
                                    }
                                />
                            </Route>
                        )}
                        <Route
                            path='*'
                            element={
                                <ProtectedRoute isValid={isValidSession}>
                                    <NotFound />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>
            </UserContext.Provider>
        </div>
    );
}

export default App;
