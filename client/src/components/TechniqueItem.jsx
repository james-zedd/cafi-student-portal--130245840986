import React from 'react';

function TechniqueItem({ technique }) {
    return (
        <div className='flex mb-2 max-w-3xl'>
            <p className='basis-1/6'>{technique.orderVisible})</p>
            <div className='basis-5/6'>
                <p className='font-bold'>{technique.name.romanji}</p>
                <p>{technique.name.english}</p>
                {technique.variants.length > 0 && (
                    <div>
                        {technique.variants.map((variant) => (
                            <div key={variant._id}>
                                <p className='font-bold'>
                                    {variant.name.romanji}
                                </p>
                                <p>{variant.name.english}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TechniqueItem;
