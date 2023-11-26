'use client'
import { useState, useEffect } from 'react';
import { createSubmission, createThreadEntry, getQuestion } from '@/util/api';
import Thread from './Thread';
import { load } from 'langchain/load';

const MainForm = () => {
    const [loading, setLoading] = useState(false)
    const [score, setScore] = useState(0)
    const [reason, setReason] = useState('')
    const [chat, setChat] = useState([])
    const [lead, setLead] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [textchat, setTextChat] = useState('')
    

    const handleFirstSubmit = async (e) => {
      e.preventDefault()
      
      setLoading(true)
      const formData = new FormData(e.currentTarget)
      const sub: any = {}
      for (var pair of formData.entries()) {
        sub[pair[0]] = pair[1]
      }
      console.log(sub)
      const res = await createSubmission(sub)
      console.log(res)
      setLead(sub)
      setSubmitted(true)
      var data: any = {}
      data['lead'] = sub
      const mesg: any = {type: 'bot', text: `Hi ${sub.firstname}, what prompted you  to fill out this form?`}
      const thread = await createThreadEntry({
        submissionId: res.id,
        type: mesg.type,
        text: mesg.text,
        model: 'testing'
      })
      console.log(thread)
      data['messages'] = [mesg]
      chat.push(mesg)
      setLoading(false)
    }
    const handleSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
      chat.push({type: 'human', text: e.target[0].value})
      const data = {
        lead: lead,
        messages: chat
      }
      const res = await getQuestion(data)
      console.log(res)
      chat.push({type: 'bot', text: res.question})
      setScore(res.score)
      setReason(res.reason)
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
          <div className="flex flex-col space-y-2">
            <p className="text-lg text-white">Score Reason</p>
            <p className="text-md text-white">{reason}</p>
          </div>
        </div>

      </div>
  <div className="flex justify-center items-center">
    <div className="w-full max-w-md flex flex-col border border-gray-200 rounded-md p-8 space-y-6 bg-white bg-opacity-25">
      {!submitted &&
    <form onSubmit={handleFirstSubmit} className="w-full flex flex-col space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="firstname" className="text-sm">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            className="border border-gray-300 px-4 py-2 rounded-md bg-transparent text-white"
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="lastname" className="text-sm">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
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
          <label htmlFor="website" className="text-sm">
            Website
          </label>
          <input
            type="text"
            id="website"
            name="website"
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
      {loading && <p className="border border-gray-300 px-4 py-2 text-lg rounded-md bg-transparent text-white">Loading...</p>}
      <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-4">
       
        <div className="flex flex-col space-y-2">
          <textarea
            id="message"
            name="message"
            className="resize-none border border-gray-300 px-4 py-2 text-lg rounded-md bg-transparent text-white"
            rows="4"
            value={textchat}
            onChange={(e) => setTextChat(e.target.value)}
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