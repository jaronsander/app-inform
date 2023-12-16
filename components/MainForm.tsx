'use client'
import { useChat } from "ai/react";
import { useRef, useState, ReactElement } from "react";
import type { FormEvent } from "react";
import type { AgentStep } from "langchain/schema";
import { createSubmission, createThreadEntry, getQuestion, initialQuestion } from '@/util/api';
import Thread from './Thread';
import { load } from 'langchain/load';
import { ChatForm } from "@/components/ChatForm";
import { set } from "zod";

const MainForm = () => {
    const [loading, setLoading] = useState(false)
    const [lead, setLead] = useState({})
    const [submitted, setSubmitted] = useState(false)
    const [submissionId, setSubmissionId] = useState(0)
    const [intro, setIntro] = useState({})
    

    const handleFirstSubmit = async (e) => {
      e.preventDefault()
      
      setLoading(true)
      const formData = new FormData(e.currentTarget)
      const sub: any = {}
      formData.forEach((value, key) => {
        sub[key] = value;
      });
      console.log(sub)
      // Create submission
      const res = await createSubmission(sub)
      setSubmissionId(res.id)
      console.log(res)
      
      // Set lead and mark as submitted
      setLead(sub)


      const intro = await initialQuestion({lead: sub})
      console.log(intro)
      // Create initial thread entry
      const introMesg = {
        submissionId: res.id,
        role: 'assistant',
        message: intro.opening,
        model: 'testing'
      }
      setIntro(introMesg)
      const thread = await createThreadEntry(introMesg)
      setSubmitted(true)
      setLoading(false)
    }
    return (
      <div className="w-full overflow-y-scroll md:overflow-y-auto max-w-screen-lg mx-auto">
          
          {/* Form Section */}
        {/* <div className="flex justify-center items-center"> */}
        {!submitted ?
          <div className="w-full max-w-md flex flex-col border border-green-200 rounded-xl p-6 space-y-6 bg-white bg-opacity-25 mx-auto">
            <form onSubmit={handleFirstSubmit} className=" w-full flex flex-col space-y-4">
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
            </form> 
        {/* </div> */}
      </div>: <>
            <ChatForm formEntry={lead} submissionId={submissionId} introMessage={intro}></ChatForm>
            </>
            }
    </div>

    );
}
export default MainForm;