import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TechniqueItem from '../components/TechniqueItem';

function Exam() {
    const [isLoading, setIsLoading] = useState(true);
    const [exam, setExam] = useState();
    const { id } = useParams();

    async function getExam() {
        try {
            const res = await fetch(`http://localhost:5500/api/exams/${id}`, {
                credentials: 'include',
            });

            const exam = await res.json();

            console.log('exam', exam, exam.data[0]);

            setExam(exam.data[0]);

            return setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getExam();
    }, []);

    return (
        <div>
            {isLoading ? (
                <p>loading ...</p>
            ) : (
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
            )}
        </div>
    );
}

export default Exam;
