import MainForm from '@/components/MainForm'
import Image from 'next/image'

export default function Home() {
  return (
    <div className='w-screen h-screen bg-black flex justify-center items-center text-white'>
      <MainForm />
    </div>
  )
}
