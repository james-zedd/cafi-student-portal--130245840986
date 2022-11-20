import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Article() {
    const [isLoading, setIsLoading] = useState(false);
    const [article, setArticle] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    async function getArticle() {
        try {
            const res = await fetch(
                `http://localhost:5500/api/hanshiReply/${id}`,
                {
                    credentials: 'include',
                }
            );

            console.log('res', res);

            const json = await res.json();

            console.log('article', json.data);

            setArticle(json.data[0]);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        getArticle();
    }, []);

    if (isLoading) {
        <p>Loading ... </p>;
    }

    if (article) {
        return (
            <div>
                <div>
                    <h1 className='text-3xl font-bold mb-4'>{article.title}</h1>
                    <div className='flex flex-col'>
                        <p>{article.body}</p>
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

export default Article;
