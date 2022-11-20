import React from 'react';
import { useNavigate } from 'react-router-dom';

// const navigate = useNavigate();

const resStatusCheck = (res) => {
    console.log('res status', res.status);

    switch (res.status) {
        case 401:
            console.log('res status 401', res.status);
            // return navigate('/');
            break;
        case 403:
            console.log('res status 403');
            // return navigate('/');
            break;
        default:
            return res;
    }
};

export default resStatusCheck;
