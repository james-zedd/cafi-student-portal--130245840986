import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function StudentInquiries() {
    const [isLoading, setIsLoading] = useState(false);
    const [questions, setQuestions] = useState([]);

    function handleClickQuestion(question) {
        console.log('question clicked', question);
    }

    async function getQuestions() {
        try {
            const res = await fetch(
                'http://localhost:5500/api/hanshiAsk/allQuestions',
                {
                    credentials: 'include',
                }
            );

            console.log('res', res);

            const questions = await res.json();

            console.log('questions', questions.data);

            setQuestions(questions.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        console.log('use effect ran');
        setIsLoading(true);
        getQuestions();
    }, []);

    if (isLoading) {
        return <p>Loading ... </p>;
    }

    return (
        <div>
            <h1 className='text-3xl font-bold mb-4'>
                Questions for Blok Hanshi
            </h1>
            <div className='flex flex-col lg:flex-row lg:flex-wrap'>
                {questions.map((question) => (
                    <div key={question._id} className='basis-1/2 px-4 py-2'>
                        <Link to={`/studentInquiries/${question._id}`}>
                            <div
                                className='flex flex-col justify-center items-center w-5/6 h-20 mx-auto border border-gray-900 cursor-pointer'
                                onClick={() => handleClickQuestion(question)}
                            >
                                <p className='text-xl font-bold'>
                                    {question.body}
                                </p>
                                <p className='text-sm mt-4'>
                                    Posted on {question.createdAt.split('T')[0]}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StudentInquiries;
