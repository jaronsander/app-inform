export default function Meeting(){
    return (
        <div className='w-screen h-screen bg-black flex flex-col my-auto items-center'>
            <iframe src="https://app.simplymeet.me/inform?is_widget=1&view=compact" className="w-full h-full"></iframe>
        </div>
    )
}