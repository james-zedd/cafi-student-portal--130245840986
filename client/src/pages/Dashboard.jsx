import React, { useState, useEffect, useContext } from 'react';
import NewsItem from '../components/NewsItem';
import resStatusCheck from '../hooks/resStatusCheck';
import { UserContext } from '../context/UserContext';

function Dashboard() {
    const [newsfeed, setNewsfeed] = useState([]);
    const [postNews, setPostNews] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { isAdmin } = useContext(UserContext);

    async function submitNewsItem() {
        const input = {
            body: postNews,
        };

        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(input),
            };

            await fetch('http://localhost:5500/api/news', options);

            setPostNews('');
            getNewsfeed();
        } catch (error) {
            console.log(error);
        }
    }

    async function getNewsfeed() {
        try {
            const res = await fetch('http://localhost:5500/api/news', {
                credentials: 'include',
            });

            if (res.status == 401) {
                console.log('res status is 401', res.status);
                throw Error;
            }

            console.log('res', res);

            resStatusCheck(res);

            const newsItems = await res.json();

            console.log('news items', newsItems, newsItems.data);

            setNewsfeed(newsItems.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error.message);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        getNewsfeed();
    }, []);

    if (isLoading) {
        <p>Loading ... </p>;
    }

    return (
        <div>
            <h1 className='text-3xl font-bold mb-4'>Dashboard</h1>
            <div className='newsfeed flex flex-col px-4'>
                {isAdmin && (
                    <div className='flex flex-col w-full max-w-lg mx-auto mb-8'>
                        <h2 className='font-bold text-xl mb-3'>
                            Publish to News Feed
                        </h2>
                        <textarea
                            name='news'
                            id='news'
                            value={postNews}
                            className='mb-2 bg-transparent border border-gray-700 rounded p-1'
                            onChange={(e) => setPostNews(e.target.value)}
                        ></textarea>
                        <button
                            className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                            onClick={submitNewsItem}
                        >
                            Enter
                        </button>
                    </div>
                )}
                {newsfeed.map((newsItem) => (
                    <NewsItem key={newsItem._id} item={newsItem} />
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
