import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function Article() {
    const [isLoading, setIsLoading] = useState(false);
    const [article, setArticle] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { isHanshi } = useContext(UserContext);

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

    async function handleDeleteArticle() {
        console.log('delete article fired');
        if (window.confirm('Do you really want to delete this article?')) {
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            };

            const res = await fetch(
                `http://localhost:5500/api/hanshiReply/${id}`,
                options
            );

            const json = await res.json();

            if (json.status === 200) {
                navigate('/dashboard');
            }
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
                {isHanshi && (
                    <div>
                        <button
                            className='mt-8 border border-blue-900 rounded px-2 py-1 bg-blue-500 hover:bg-blue-700 text-white font-bold'
                            onClick={() => navigate(`/article/edit/${id}`)}
                        >
                            Edit this article
                        </button>
                        <button
                            className='mt-8 ml-2 border border-red-900 rounded px-2 py-1 bg-red-500 hover:bg-red-700 text-white font-bold'
                            onClick={() => handleDeleteArticle()}
                        >
                            Delete this article
                        </button>
                    </div>
                )}
            </div>
        );
    }
}

export default Article;
