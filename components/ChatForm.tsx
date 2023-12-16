'use client';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useChat } from "ai/react";
import { useRef, useState, ReactElement } from "react";
import type { FormEvent } from "react";
import { ChatMessageBubble } from "@/components/ChatMessageBubble";
import { analyze, createThreadEntry } from '@/util/api';


export function ChatForm(props: {
    formEntry: object
    submissionId: number,
    introMessage: object,
}) {
    const { formEntry, submissionId, introMessage } = props;
    const messageContainerRef = useRef<HTMLDivElement | null>(null);

    const endpoint = 'api/chat'

    const [stage, setStage] = useState('Unqualified')
    const [reason, setReason] = useState('No messages yet')


    const { messages, input, handleInputChange, handleSubmit, isLoading: chatEndpointIsLoading } =
        useChat({
        api: endpoint,
        initialMessages: [{id: 0, role: 'assistant', content: introMessage.message, model: 'testing'}],
        onFinish(response) {
            console.log(response);
            const thread = {
                role: response.role,
                message: response.content,
                submissionId: submissionId,
                model: 'testing'
            }
            createThreadEntry(thread)

        },
        onError: (e) => {
            toast(e.message, {
            theme: "dark"
            });
        },
        body: {
            lead: formEntry
        }
        });

    async function sendMessage(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (messageContainerRef.current) {
        messageContainerRef.current.classList.add("grow");
        }
        console.log('Form event:')
        console.log(e)
        const mesg = (e.currentTarget.elements[0] as HTMLInputElement).value
        const thread = {
            role: 'assistant',
            message: mesg,
            submissionId: submissionId,
            model: 'testing'
        }
        createThreadEntry(thread)
        handleSubmit(e);
        await new Promise(resolve => setTimeout(resolve, 300));
        console.log('Waited 300ms')
        // console.log(messages)
        // console.log(formEntry)
        
        const analysis = await analyze({
            lead: formEntry,
            messages: messages
        })
        console.log('Analysis')
        console.log(analysis)
        setStage(analysis.stage)
        setReason(analysis.reason)
    }

    return (
        <div className="grid md:grid-cols-5 gap-4 grid-cols-1">
            {/* Left Column - Scorecard */}
            <div className="col-span-2 p-4 md:p-8 flex flex-col border rounded gap-4 h-fitl">
                <div className=''>
                <h2><b>Lead Stage</b>: <span className='bg-white bg-opacity-25 p-1 border border-green-200 rounded-md'>{stage}</span></h2>
                </div>
                {/* Add your lead stage content */}
                <div className=''>
                <h2><b>Reason</b>:</h2>
                {/* Add your reason content */}
                <div className='bg-white bg-opacity-25 w-full h-full border border-green-200 rounded-md p-1'>
                    <p>{reason}</p>
                </div>
                </div>
            </div>
            <div className={`col-span-3 flex flex-col items-center p-4 md:p-8 rounded grow overflow-hidden border`}>
            <div
                className="flex flex-col-reverse w-full mb-4 overflow-auto transition-[flex-grow] ease-in-out max-h-[50vh]"
                ref={messageContainerRef}
            >
                {messages.length > 0 ? (
                [...messages]
                    .reverse()
                    .map((m, i) => {
                    const sourceKey = (messages.length - 1 - i).toString();
                    return (<ChatMessageBubble key={sourceKey} message={m} aiEmoji='📯'></ChatMessageBubble>)
                    })
                ) : (
                ""
                )}
            </div>


            <form onSubmit={sendMessage} className="flex w-full flex-col">
                <div className="flex w-full mt-4">
                <input
                    className="grow mr-8 p-4 rounded bg-transparent border border-gray-300 text-white"
                    value={input}
                    placeholder="Type here..."
                    onChange={handleInputChange}
                />
                <button type="submit" className="shrink-0 px-8 py-4  bg-green-500 hover:bg-green-600 transition duration-300 rounded w-28">
                    <div role="status" className={`${(chatEndpointIsLoading) ? "" : "hidden"} flex justify-center`}>
                    <svg aria-hidden="true" className="w-6 h-6 text-white animate-spin dark:text-white fill-sky-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    <span className="sr-only">Loading...</span>
                    </div>
                    <span className={(chatEndpointIsLoading ) ? "hidden" : ""}>Send</span>
                </button>
                </div>
            </form>
            <ToastContainer/>
            </div>
        </div>
    );
}
