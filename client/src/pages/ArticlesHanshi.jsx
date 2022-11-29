import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ArticlesHanshi() {
    const [isLoading, setIsLoading] = useState(false);
    const [articles, setArticles] = useState([]);

    function handleClickArticle() {
        console.log('article click');
    }

    async function getArticles() {
        try {
            const res = await fetch('http://localhost:5500/api/hanshiReply', {
                credentials: 'include',
            });

            console.log('res', res);

            const json = await res.json();

            console.log('articles', json.data);

            setArticles(json.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        getArticles();
    }, []);

    if (isLoading) {
        return <p>Loading ... </p>;
    }

    return (
        <div>
            <h1 className='text-3xl font-bold mb-4'>
                Articles from Blok Hanshi
            </h1>
            <div className='flex flex-col lg:flex-row lg:flex-wrap'>
                {articles.map((article) => (
                    <div key={article._id} className='basis-1/2 px-4 py-2'>
                        <Link to={`/articlesHanshi/${article._id}`}>
                            <div
                                className='flex flex-col justify-center items-center w-5/6 h-20 mx-auto border border-gray-900 cursor-pointer'
                                onClick={() => handleClickArticle(article)}
                            >
                                <p className='text-xl font-bold'>
                                    {article.title}
                                </p>
                                <p className='text-sm mt-4'>
                                    Posted on {article.createdAt.split('T')[0]}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ArticlesHanshi;
