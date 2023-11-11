const createURL = (path) => {
    return window.location.origin + path
}
export const getQuestion = async (messages) => {
    console.log("Stupid")
    console.log(messages)
    const url = createURL(`/api/question/`)
    const response = await fetch(
        new Request(url, { method: "POST", body: JSON.stringify({messages}) })
    )
    if(response.ok) {
        const data = await response.json()
        console.log(data)
        return data.data
    }
}