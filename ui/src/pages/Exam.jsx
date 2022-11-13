import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Exam() {
    const [exam, setExam] = useState(null);
    const { id } = useParams();

    async function getExam() {
        try {
            const res = await fetch(`http://localhost:5500/api/exams/${id}`, {
                credentials: 'include',
            });

            const exam = await res.json();

            console.log('exam', exam, exam.data[0]);

            return setExam(exam.data[0]);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getExam();
    }, []);

    return (
        <div>
            <h1 className='text-3xl font-bold mb-4'>
                {exam.name.rankEng} - {exam.name.belt} Exam
            </h1>
            <ol>
                {exam.techniques.map((tech) => (
                    <li key={tech.techId}>{tech.name.english}</li>
                ))}
            </ol>
        </div>
    );
}

export default Exam;
