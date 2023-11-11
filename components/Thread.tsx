import React from 'react';

const Thread = ({ thread }) => {
    return (
        <div className="flex flex-col items-start">
            {thread.map((message:any, index:number) => (
                <div
                    key={index}
                    className="rounded-lg border border-gray-300 p-2 my-2"
                >
                    <p className="text-white">{JSON.stringify(message)}</p>
                </div>
            ))}
        </div>
    );
};

export default Thread;
