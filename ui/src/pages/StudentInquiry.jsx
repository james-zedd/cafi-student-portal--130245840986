import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function StudentInquiry() {
    const [isLoading, setIsLoading] = useState(false);
    const [inquiry, setInquiry] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    async function getInquiry() {
        try {
            const res = await fetch(
                `http://localhost:5500/api/hanshiAsk/allQuestions/${id}`,
                {
                    credentials: 'include',
                }
            );

            console.log('res', res);

            const inquiry = await res.json();

            console.log('inquiry', inquiry);

            setInquiry(inquiry.data[0]);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        console.log('use effect ran');
        setIsLoading(true);
        getInquiry();
    }, []);

    if (isLoading) {
        <p>Loading ... </p>;
    }

    if (inquiry) {
        return (
            <div>
                <div>
                    <h1 className='text-3xl font-bold mb-4'>
                        Student Question
                    </h1>
                    <div className='flex flex-col'>{inquiry.body}</div>
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

export default StudentInquiry;
