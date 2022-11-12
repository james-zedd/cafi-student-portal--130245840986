import React, { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function submit() {
        const data = {
            email: email,
            password: password,
        };

        console.log('data', data);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        fetch('http://localhost:5500/api/auth', options).then((res) =>
            console.log('res', res)
        );

        // console.log('fetch data', fetch);
    }

    return (
        <div className='flex flex-col justify-center items-center'>
            <div className='login__container mt-40 p-10 border border-black rounded-lg'>
                <h1 className='text-3xl font-bold mb-4'>CAFI Student Portal</h1>

                <div className='flex flex-col'>
                    <label htmlFor='email'>Email</label>
                    <input
                        type='text'
                        id='email'
                        name='email'
                        value={email}
                        className='border border-gray-700 p-1 bg-transparent mb-1'
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor='password'>Password</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        value={password}
                        className='border border-gray-700 p-1 bg-transparent mb-4'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                        onClick={submit}
                    >
                        Enter
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
