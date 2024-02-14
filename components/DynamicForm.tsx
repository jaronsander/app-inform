'use client'
import React, { useState, FC, useEffect } from 'react';
import { getQuestion, createSubmission, createThreadEntry, analyze } from '@/util/api';

interface LeadData {
  email: string;
  title: string;
}

interface QuestionData {
  question: string;
  suggestions: string[];
  analysis: string;
}

const companies = [{value: 'dataworks', label: 'DataWorks Services', description:"DataWorks is a data agency providing digital data services for small to medium-sized businesses. They specialize in data analytics, data management, and data visualization, offering tailored solutions to help businesses harness the power of their data. DataWorks is dedicated to empowering companies with actionable insights, enabling informed decision-making and sustainable growth."},{value: "nextgen", label: "NextGen AI Solutions", description: "NextGen AI Solutions is an innovative tech startup specializing in artificial intelligence and machine learning tools designed to empower small businesses. By offering cutting-edge, accessible AI technologies, they aim to help these businesses streamline operations, enhance decision-making, and unlock new growth opportunities. Their commitment lies in bridging the technology gap, ensuring small enterprises can leverage AI to compete effectively in today's digital economy."},{value: 'connectwork', label: 'ConnectWork Hub', description: "ConnectWork Hub is a premier online community platform, dedicated to connecting innovative companies with exceptional talent through a specialized job board. Businesses of all sizes can pay to post their job vacancies, gaining access to a pool of motivated and skilled professionals across various industries. The platform distinguishes itself by offering an engaging environment where members can explore career opportunities, share insights, and participate in professional development initiatives. It prioritizes a seamless and trustworthy recruitment process, ensuring that each job posting is meticulously vetted to align with the community's high standards. ConnectWork Hub stands as a beacon for companies and job seekers alike, fostering meaningful connections and facilitating the pursuit of career excellence."},{value: 'cloudsync', label: 'CloudSync Technologies', description:"CloudSync Technologies specializes in providing cloud-based solutions that enhance collaboration and productivity for remote teams and enterprises. With a suite of intuitive project management and communication tools, they are at the forefront of facilitating efficient and effective remote work environments. CloudSync's mission is to drive innovation in how teams collaborate, ensuring businesses of all sizes can achieve their goals with greater agility and resilience in the evolving workplace landscape."}]

const DynamicForm = () => {
  const [lead, setLead] = useState<LeadData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentStage, setCurrentStage] = useState(0);
  const totalStages = 5;
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<string[]>([]);
  const [subId, setSubId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState('')
  const [formPurpose, setFormPurpose] = useState('Gather information')
  const [summary, setSummary] = useState('')
  const [questions, setQuestions] = useState([]);
  const [questionInput, setQuestionInput] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(companies[0].value);

  // Handler for when the select option changes
  const compChange = (event) => {
    setSelectedCompany(event.target.value);
  };
  const selectedOption = companies.find(option => option.value === selectedCompany);

  const addItem = () => {
    if (questionInput.trim() !== '' && questions.length < 3) {
      console.log('Adding question:', questionInput);
      setQuestions([...questions, questionInput]);
      setQuestionInput(''); // Clear input field after adding
    }
  };

  const handleChange = (event) => {
    setQuestionInput(event.target.value);
  };
  
  useEffect(() => {
    if (currentStage > totalStages) {
      const formData = {
        lead: lead,
        purpose: formPurpose,
        company: selectedOption.description,
        messages: submissions,
      };
      
      setLoading(true); // Indicate loading state
      analyze(formData)
        .then(result => {
          // Handle result here
          // console.log(result);
          // Possibly update state with the result of the analysis
          setSummary(result.summary);
        })
        .catch(error => {
          // Handle error here
          console.error("Error during analysis:", error);
        })
        .finally(() => setLoading(false)); // Reset loading state
    }
  }, [currentStage, totalStages]); // Add dependencies as needed

  
  
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  const changePurpose = (event) => {
    setFormPurpose(event.target.value);
  }


  const handleInitialDataSubmit = async (data: LeadData) => {
    setLead(data);
    // Fetch the first question using the API
    const questionResponse: QuestionData = await getQuestion({
        leadFormSubmission: data,
        previousResponses: [],
        formPurpose: formPurpose,
        companyDescription: selectedOption.description,
        questions: questions
    })
    // console.log(questionResponse)
    setCurrentQuestion(questionResponse.question);
    setSuggestions(questionResponse.suggestions);
    const date = new Date();
    const subRes = await createSubmission({
      createdAt: date,
      updatedAr: date,
      thread:[{
        createdAt: date,
        type: 'question', 
        content: questionResponse.question,
        suggestions: questionResponse.suggestions
      }],
      context: data
    })
    const subId = subRes.insertedId;
    // console.log('Submission: '+ subId);
    setSubId(subId);
  };

  const handleQuestionResponseSubmit = async (response: string) => {
    // Handle the response and potentially fetch the next question
    const nextQuestionResponse: QuestionData = await getQuestion({
        leadFormSubmission: lead,
        previousResponses: [...submissions, currentQuestion, response],
        formPurpose: formPurpose,
        companyDescription: selectedOption.description,
        questions: questions
    })
    // console.log(nextQuestionResponse)
    setSubmissions([...submissions, currentQuestion, response]);
    setCurrentQuestion(nextQuestionResponse.question);
    setSuggestions(nextQuestionResponse.suggestions);
    const thread = [
      {
        createdAt: new Date(),
        type: 'response',
        content: response
      },
      {
        createdAt: new Date(),
      type: 'question',
      content: nextQuestionResponse.question,
      suggestions: nextQuestionResponse.suggestions
    }]
    const sub = await createThreadEntry(subId, thread);
    // console.log(sub)
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // console.log('Form event:')
    setCurrentStage(currentStage + 1);
    if (currentStage === 0) {
      // Extract lead data from the form and call handleInitialDataSubmit
      const formData = new FormData(e.currentTarget);
      const sub: LeadData = {
        email: formData.get('email') as string,
        title: formData.get('title') as string
      };
      // console.log(sub)
      await handleInitialDataSubmit(sub);
    } else {
        
      // Use selectedAnswer if set, else extract response data from the form
      const answer = selectedAnswer ?? new FormData(e.currentTarget).get('custom-answer');
      console.log(answer);
      await handleQuestionResponseSubmit(answer as string);

    }
    setInputValue('');
    setLoading(false);
    setSelectedAnswer(null); // Reset selected answer for the next stage
  };
  
  const handleSuggestionSubmit = async (suggestion: string) => {
    setLoading(true);
    // console.log(suggestion)
    setCurrentStage(currentStage + 1);
    await handleQuestionResponseSubmit(suggestion);
    setLoading(false);
  };


  return (
    <div className="w-full max-w-screen-lg mx-auto">
    <div className="grid md:grid-cols-2 md:gap-4 grid-cols-1">
    <div className="col-span-1 bg-white bg-opacity-25 p-4 md:p-8 flex flex-col border border-green-600 rounded-md gap-4 h-fit w-full">
      {(<>
    <label htmlFor="form-purpose" className="text-sm font-semibold">Form Purpose</label>
    <select id="form-purpose" name="form-purpose" className="border rounded-md p-2" onChange={changePurpose} disabled={currentStage > 0}>
        <option value="gather-information">Gather information</option>
        <option value="prequalification">Prequalification</option>
    </select>
    <label htmlFor="company-select" className="block text-sm font-semibold">Choose a Company:</label>
        <select
          id="company-select"
          value={selectedCompany}
          onChange={compChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {companies.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
    <label htmlFor="company-description" className="text-sm font-semibold">Company Description</label>
    {selectedOption && (
        <div className="mt-4 p-4 w-full bg-green-50 border-l-4 border-green-500 text-green-700">
          <h2 className="text-lg font-semibold">{selectedOption.label}</h2>
          <p className="mt-1 text-sm">{selectedOption.description}</p>
        </div>
      )}
    <label htmlFor="questions" className="text-sm font-semibold">Sample Questions</label>
    <div className="flex items-center space-x-2 mb-4">
  <input
    id="questions"
    type="text"
    onChange={handleChange}
    placeholder="Add a question"
    className="flex-grow p-2 border-gray-300 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
  />
  <button
    onClick={addItem}
    disabled={questions.length >= 3 || currentStage > 0}
    className="py-2 px-4 bg-green-500 text-white font-semibold rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
  >
    Add Question
  </button>
</div>
<ul className="list-none pl-0">
  {questions.map((item, index) => (
    <li key={index} className="bg-gray-100 p-2 rounded mb-2 shadow">
      {item}
    </li>
  ))}
</ul>
          </>)}
    </div>
    <div className="col-span-1 w-full max-w-md flex flex-col border-2 border-green-600 rounded-xl p-6 space-y-6 bg-amber-200 bg-opacity-25  mx-auto">

    <form onSubmit={handleSubmit}>
      {currentStage === 0 && (
        <div className='space-y-6'>
            <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="text-sm">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="border border-gray-300 px-4 py-2 rounded-md"
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
                  className="border border-gray-300 px-4 py-2 rounded-md"
                  required
                />
            </div>
        </div>
        // Render fields for initial data collection
      )}
      {currentStage >= 1 && currentQuestion && (
        // Render the current question and suggestions
        <>
        {/* <p>{currentStage}</p> */}
        {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `min(${(currentStage / totalStages) * 100}%, 100%)` }}></div>
          </div>
          {currentStage > totalStages ? (
            <>
            <div className="text-lg font-semibold mb-2">Thank you for your submission!</div>
            <div className="text-lg font-semibold mb-2">Summary:</div>
            <div className="text-md mb-2">{summary}</div>
            </>
            ):
            
            (
              <div className="my-4">
            <div className="text-lg font-semibold mb-2">{currentQuestion}</div>
            <div className="flex flex-wrap space-x-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="mb-2 px-4 py-2 bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleSuggestionSubmit(suggestion)}
              >
                {suggestion}
              </button>
            ))}
            </div>
            <div className="flex items-center mb-2">
              <label htmlFor="custom-answer" className='w-full'>
                <input 
                  type="text" 
                  name='custom-answer'
                  placeholder="Write your own answer" 
                  className="w-full border border-gray-300 px-4 py-2 rounded-md"
                  value={inputValue}
                  onChange={handleInputChange}
                />
              </label>
            </div>
          </div>
            )}
          
        </>
      )}
      <SubmitButton isLoading={loading} disable={!(currentStage === 0 || inputValue.length > 5)}/>
    </form>
    </div>
    </div>
    </div>
  );
};

const SubmitButton: FC<{ isLoading: boolean, disable: boolean}> = ({ isLoading, disable }) => (
    <button disabled={disable} type="submit" className="shrink-0 px-8 py-4 mt-6 bg-green-500 hover:bg-green-600 transition duration-300 rounded w-28">
    <div role="status" className={`${(isLoading) ? "" : "hidden"} flex justify-center`}>
    <svg aria-hidden="true" className="w-6 h-6 text-white animate-spin dark:text-white fill-sky-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span className="sr-only">Loading...</span>
    </div>
    <span className={(isLoading ) ? "hidden" : ""}>Next</span>
</button>
);

export default DynamicForm;