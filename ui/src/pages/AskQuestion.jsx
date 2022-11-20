import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

function AskQuestion() {
    const [body, setBody] = useState('');
    const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
    const navigate = useNavigate();

    async function submitQuestion(e) {
        e.preventDefault();
        setDisableSubmitBtn(true);
        console.log('submit question fired');

        try {
            const data = {
                body: body,
            };

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data),
            };

            const res = await fetch(
                'http://localhost:5500/api/hanshiAsk',
                options
            );

            console.log('res', res);

            const json = await res.json();

            if (json.status === 201) {
                toast.success('Successfully asked question. Redirecting ...');
                setTimeout(() => navigate('/studentInquiries'), 7000);
            } else {
                toast.error('Something went wrong. Please try again later.');
                setDisableSubmitBtn(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1 className='text-3xl font-bold mb-4'>Ask a Question</h1>
            <form>
                <div>
                    <label htmlFor='body'>Body</label>
                    <textarea
                        name='body'
                        id='body'
                        value={body}
                        className='block w-full border border-gray-700 p-1 bg-transparent mb-1'
                        onChange={(e) => setBody(e.target.value)}
                    ></textarea>
                </div>
                <button
                    type='submit'
                    className='mt-8 border border-black rounded px-2 py-1 bg-gray-300 disabled:bg-gray-100 disabled:text-gray-500'
                    onClick={(e) => submitQuestion(e)}
                    disabled={disableSubmitBtn}
                >
                    Submit
                </button>
            </form>
            <button
                className='mt-8 border border-black rounded px-2 py-1 bg-gray-300'
                onClick={() => navigate(-1)}
            >
                Back
            </button>
            <ToastContainer />
        </div>
    );
}

export default AskQuestion;
