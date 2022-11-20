import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function StudentInquiry() {
    const [isLoading, setIsLoading] = useState(false);
    const [inquiry, setInquiry] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { isHanshi } = useContext(UserContext);

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
                {isHanshi && (
                    <div>
                        <button
                            className='mt-8 border border-blue-900 rounded px-2 py-1 bg-blue-500 hover:bg-blue-700 text-white font-bold'
                            onClick={() =>
                                navigate(
                                    `/article/reply/${id}?inquirerId=${inquiry.inquirer._id}`
                                )
                            }
                        >
                            Reply to Question
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default StudentInquiry;
