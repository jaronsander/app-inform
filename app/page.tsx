import DynamicForm from '@/components/DynamicForm'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="bg-amber-50 text-stone-700 pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto text-center space-y-6">
    <h1 className="text-5xl font-bold my-16">📯 inForm</h1>
    <p className="text-lg mb-8">AI powered forms built to reduce sales friction by providing relevant context to sales reps and leads prior to calls.</p>
    <p className="text-md leading-relaxed">
      <span className="font-semibold">Form Configuration Panel:</span> This panel allows you to modify the form purpose and the company description that is the input to the form. In a real use case, this would be behind a login and hidden from the end user.
    </p>
    <p className="text-md leading-relaxed">
      <span className="font-semibold">Dynamic Form Interaction:</span> This form will dynamically generate a question per stage and possible answers to that question. Once a certain amount of questions have been answered, a summary of the form submission is generated. Since this is a demo, the generation of questions is fairly slow and is something that will be optimised in the future.
    </p>
  </div>
      {/* AI-Powered Form Call-to-Action */}
      <div className="mt-8">
      <DynamicForm/>
      </div>
    </div>
  )
}
