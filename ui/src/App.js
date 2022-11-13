import { Route, Routes } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Exams from './pages/Exams';
import Exam from './pages/Exam';
import NotFound from './pages/NotFound';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/exams'>
                <Route index element={<Exams />} />
                <Route path=':id' element={<Exam />} />
            </Route>
            <Route path='*' element={<NotFound />} />
        </Routes>
    );
}

export default App;
