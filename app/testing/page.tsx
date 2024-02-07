import DynamicForm from "@/components/DynamicForm"

export default function Testing() {
    const person = {
        firstname: 'Jaron',
        lastname: 'Sander',
        email: 'jaron@test',
        title: 'Tester',
        website: 'Test',
        industry: 'test'
        }
    return (
        <div className='w-screen h-screen bg-black flex flex-col my-auto items-center'>
            <DynamicForm/>
        </div>
    )
}