import React, { useState, useEffect } from 'react';

function Dashboard() {
    const [newsfeed, setNewsfeed] = useState([]);

    useEffect(() => {
        console.log('hello');

        async function getNewsfeed() {
            const data = await fetch('http://localhost:5500/api/news');

            console.log('data', data, data.status);
        }

        getNewsfeed();
    });

    return (
        <div>
            <h1 className='text-3xl font-bold mb-4'>Dashboard</h1>
        </div>
    );
}

export default Dashboard;
