import { useState, useEffect } from 'react';

const useFetch = (url, options) => {
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(true);
    const [data, setData] = useState(null);

    console.log('url in useFetch', url);

    async function fetchData(url, options) {
        if (url === '') {
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(url, options);
            const data = await res.json();
            console.log('data in useFetch', data);
            setData(data);
        } catch (error) {
            setHasError(true);
            console.log('error', error);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchData(url, options);
    }, [url]);

    return { isLoading, hasError, data };
};

export default useFetch;
