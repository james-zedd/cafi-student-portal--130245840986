import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TechniqueItem from '../components/TechniqueItem';

function Exam() {
    const [isLoading, setIsLoading] = useState(false);
    const [exam, setExam] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    async function getExam() {
        try {
            const res = await fetch(`http://localhost:5500/api/exams/${id}`, {
                credentials: 'include',
            });

            const exam = await res.json();

            console.log('exam', exam, exam.data[0]);

            setExam(exam.data[0]);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        console.log('use effect ran');
        getExam();
    }, []);

    if (isLoading) {
        return <p>Loading ... </p>;
    }

    if (exam) {
        return (
            <div>
                <div>
                    <h1 className='text-3xl font-bold mb-4'>
                        {exam.name.rankEng} - {exam.name.belt} Exam
                    </h1>
                    <div className='flex flex-col'>
                        {exam.techniques.map((tech) => (
                            <TechniqueItem key={tech._id} technique={tech} />
                        ))}
                    </div>
                </div>
                <button
                    className='mt-8 border border-black rounded px-2 py-1 bg-gray-300'
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
            </div>
        );
    }
}

export default Exam;
