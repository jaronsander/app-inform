import MainForm from '@/components/MainForm'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="bg-black text-white py-20">
      <div className="text-center">
      <h1 className="text-5xl font-bold my-16">📯 inForm</h1>
      <p className="text-lg mb-8">Forms with tailored chat to reduce sales friction by providing relevant context to sales reps and leads prior to calls.</p>
      <p className="text-lg mb-8">Meant to replace open ended text input fields that no one ready anyways.</p>
      <p className="text-gray-300 mb-10">Currently prompted to be a sales rep for a "Growth Agency"</p>
      </div>
      {/* AI-Powered Form Call-to-Action */}
      <MainForm />
    </div>
  )
}
