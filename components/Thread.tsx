import React from 'react';

const Thread = ({ thread }) => {
    return (
        <div className="flex flex-col items-start flex-grow overflow-y-auto py-4">
            {thread.map((message:any, index:number) => (
                <div
                    key={index}
                    className={message.type === 'bot' ? "border border-green-300 px-4 py-2 rounded-md bg-green-800 text-white mb-3" : "border border-gray-300 px-4 py-2 rounded-md bg-transparent text-white mb-3"}
                    
                >
                    <p className="text-white">{message.text}</p>
                </div>
            ))}
        </div>
    );
};

export default Thread;
