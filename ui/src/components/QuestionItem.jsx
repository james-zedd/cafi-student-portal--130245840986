import React from 'react';

function QuestionItem({ item }) {
    return (
        <div className='flex border border-gray-700 rounded mb-4 mx-auto p-4 w-full max-w-lg'>
            <div>
                <p className='font-bold text-sm text-gray-700 mb-1'>
                    {item.publisher.name}
                </p>
                <p>{item.body}</p>
                <p className='mt-4 text-xs text-gray-500'>
                    Posted on {item.createdAt.split('T')[0]}
                </p>
            </div>
        </div>
    );
}

export default QuestionItem;
