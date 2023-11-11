'use client'
import { useState, useEffect } from 'react';
import { getQuestion } from '@/util/api';
import Thread from './Thread';

const MainForm = () => {
    const [loading, setLoading] = useState(false)
    const [score, setScore] = useState(0)
    const [chat, setChat] = useState([])
    
    const getq = async () => {
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        chat.push({lead: e.target[0].value})
    
        const res = await getQuestion(chat)
        console.log(res)
        chat.push({Bot: res.question})
        setScore(res.score)
        setLoading(false)
    }
    return (
        <div className='w-3/4 flex flex-col justify-center items-center items-start'>
        <h1>Score: {score}</h1>
        <Thread thread={chat}/>
        {loading && <p>Loading...</p>}
        <form onSubmit={handleSubmit}>
            <input type="text" className=' bg-black border border-gray-300 backgroun px-4 py-2 text-lg rounded-lg'/>
            <button 
            disabled={loading}
            type='submit' 
            className='px-4 py-2 rounded-lg text-lg border border-gray-300'>Submit</button>
        </form>
        </div>
        
    );
}
export default MainForm;