import DynamicForm from '@/components/DynamicForm'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="bg-amber-50 text-stone-700 pt-20 min-h-screen">
      <div className="text-center">
      <h1 className="text-5xl font-bold my-16">📯 inForm</h1>
      <p className="text-lg mb-8">AI powered forms built to reduce sales friction by providing relevant context to sales reps and leads prior to calls.</p>
      
      </div>
      {/* AI-Powered Form Call-to-Action */}
      <DynamicForm />
    </div>
  )
}
