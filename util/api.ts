const createURL = (path) => {
    return window.location.origin + path
}
export const getQuestion = async (data) => {
    console.log(data['lead'])
    console.log(data['messages'])
    const url = createURL(`/api/question/`)
    const response = await fetch(
        new Request(url, { method: "POST", body: JSON.stringify({data}) })
    )
    if(response.ok) {
        const data = await response.json()
        console.log(data)
        return data.data
    }
}