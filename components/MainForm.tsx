'use client'
import { useState, useEffect } from 'react';
import { getQuestion } from '@/util/api';
import Thread from './Thread';

const MainForm = () => {
    const [loading, setLoading] = useState(false)
    const [score, setScore] = useState(0)
    const [need, setNeed] = useState('')
    const [chat, setChat] = useState([])
    const [lead, setLead] = useState({})
    const [submitted, setSubmitted] = useState(false)
    
    const getq = async () => {
    }
    const handleFirstSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
      const formData = new FormData(e.currentTarget)
      // setLead(formData)
      // console.log(lead.entries().length)
      for (var pair of formData.entries()) {
        lead[pair[0]] = pair[1]
        console.log(pair[0]+ ', ' + pair[1]);
        }
      console.log(lead)
      setSubmitted(true)
      setLoading(false)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        chat.push({type: 'human', message: e.target[0].value})
    
        const res = await getQuestion(chat)
        console.log(res)
        chat.push({type: 'bot', message: res.question})
        setScore(res.score)
        setLoading(false)
    }
    return (
        <div className="w-full h-screen overflow-y-scroll md:overflow-y-auto max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      <div className="flex flex-col space-y-8">
        <h1 className="text-5xl text-center font-semibold text-white">📯 inForm</h1>
        <h2 className="text-2xl text-center text-green-200">
          Personalized forms that decrease sales friction by surfacing relevant information to all users.
        </h2>
        <div className="flex flex-col border border-green-200 rounded-xl p-6 space-y-6 bg-white bg-opacity-25">
          <div className="flex justify-between items-center">
            <p className="text-lg text-white">Lead Score</p>
            <p className="text-lg font-semibold text-white">{score}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg text-white">Lead Need</p>
            <p className="text-lg font-semibold text-white">{need}</p>
          </div>
        </div>
      </div>
  <div className="flex justify-center items-center">
    <div className="w-full max-w-md flex flex-col border border-gray-200 rounded-md p-8 space-y-6 bg-white bg-opacity-25">
      {!submitted &&
    <form onSubmit={handleFirstSubmit} className="w-full flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="firstName" className="text-sm">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="border border-gray-300 px-4 py-2 rounded-md bg-transparent text-white"
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="lastName" className="text-sm">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="border border-gray-300 px-4 py-2 rounded-md bg-transparent text-white"
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="border border-gray-300 px-4 py-2 rounded-md bg-transparent text-white"
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="title" className="text-sm">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="border border-gray-300 px-4 py-2 rounded-md bg-transparent text-white"
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="seniority" className="text-sm">
            Seniority
          </label>
          <input
            type="text"
            id="seniority"
            name="seniority"
            className="border border-gray-300 px-4 py-2 rounded-md bg-transparent text-white"
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="industry" className="text-sm">
            Industry
          </label>
          <input
            type="text"
            id="industry"
            name="industry"
            className="border border-gray-300 px-4 py-2 rounded-md bg-transparent text-white"
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="companySize" className="text-sm">
            Company Size
          </label>
          <input
            type="text"
            id="companySize"
            name="companySize"
            className="border border-gray-300 px-4 py-2 rounded-md bg-transparent text-white"
            required
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="px-4 py-2 rounded-md text-lg text-white bg-green-500 hover:bg-green-600 transition duration-300"
        >
          Submit
        </button>
      </form>}
      {submitted &&
      <div>
      {chat.length > 0 && <Thread thread={chat} />}
      <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4">
       
        <div className="flex flex-col space-y-2">
          <textarea
            id="message"
            name="message"
            className="resize-none border border-gray-300 px-4 py-2 text-lg rounded-md bg-transparent text-white"
            rows="4"
            placeholder="Type your message..."
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="px-4 py-2 rounded-md text-lg text-white bg-green-500 hover:bg-green-600 transition duration-300"
        >
          Submit
        </button>
      </form>
      </div>
}
    </div>
  </div>
</div>

    );
}
export default MainForm;