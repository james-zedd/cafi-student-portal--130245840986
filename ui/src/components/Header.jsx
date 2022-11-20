import React, { useState, useEffect } from 'react';
// import { useRoles } from '../hooks/useRoles';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const [menuItems, setMenuItems] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // const [roles, setRoles] = useRoles();

    const navigate = useNavigate();

    async function getHeader() {
        try {
            const res = await fetch('http://localhost:5500/api/auth/header', {
                credentials: 'include',
            });

            console.log('header res', res);

            const json = await res.json();

            console.log('header data', json, json.data.menuItems);

            // setRoles(json.data.roles);
            setMenuItems(json.data.menuItems);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleLogout() {
        console.log('logout should fire');
        try {
            const res = await fetch('http://localhost:5500/api/auth/logout', {
                credentials: 'include',
            });

            const json = await res.json();

            if (json.status === 200) {
                return navigate('/');
            }
        } catch (error) {
            console.log(error);
        }
    }

    function handleMenuClick() {
        console.log('menu click');
        document.getElementById('navigation').classList.toggle('left-0');
        document.body.classList.toggle('overflow-hidden');
    }

    useEffect(() => {
        getHeader();
    }, []);

    return (
        <div className='relative'>
            <header>
                <div className='flex justify-between p-2 bg-gray-300'>
                    <button
                        className='flex flex-col justify-center border border-black rounded px-2 py-1 bg-gray-300'
                        onClick={() => handleMenuClick()}
                    >
                        <div className='w-5 h-1 bg-white border border-slate-800'></div>
                        <div className='w-5 h-1 my-1 bg-white border border-slate-800'></div>
                        <div className='w-5 h-1 bg-white border border-slate-800'></div>
                    </button>
                    <button
                        className='border border-black rounded px-2 py-1 bg-gray-300'
                        onClick={() => handleLogout()}
                    >
                        Logout
                    </button>
                </div>
            </header>
            <nav
                id='navigation'
                className='w-[100vw] h-[100vh] lg:w-96 z-10 transition-all absolute top-0 left-[-100vw] bg-stone-700'
            >
                <ul className='flex flex-col justify-center items-center h-full max-h-[420px] font-bold text-white'>
                    {menuItems.map((item) => (
                        <li className='cursor-pointer my-4' key={item.name}>
                            <Link
                                to={`/${item.path}`}
                                onClick={() => handleMenuClick()}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                    <li
                        className='cursor-pointer my-4'
                        onClick={() => handleMenuClick()}
                    >
                        Close
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Header;
