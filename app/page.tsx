import MainForm from '@/components/MainForm'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="bg-black text-white py-20">
      <div className="text-center">
      <h1 className="text-5xl font-bold my-16">📯 inForm</h1>
      <p className="text-lg mb-8">Unlock actionable insights, build resilience, and optimize processes with inForm's holistic approach</p>
      <p className="text-gray-300 mb-10"></p>
      </div>
      {/* AI-Powered Form Call-to-Action */}
      <MainForm />
    </div>
  )
}
