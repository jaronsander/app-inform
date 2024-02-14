import exp from "constants"
import { create } from "domain"

const createURL = (path) => {
    return window.location.origin + path
}
export const analyze = async (data) => {
    const url = createURL(`/api/analyze/`)
    // console.log(data)
    const response = await fetch(
        new Request(url, { method: "POST", body: JSON.stringify({body: data}) })
    )
    if(response.ok) {
        const data = await response.json()
        console.log(data)
        return data
    }
}

export const getQuestion = async (data) => {
    const url = createURL(`/api/question/`)
    console.log(data)
    const response = await fetch(
        new Request(url, { method: "POST", body: JSON.stringify({body: data}) })
    )
    console.log(response)
    if(response.ok) {
        const data = await response.json()
        console.log(data)
        return data
    }
}
export const initialQuestion = async (data) => {
    const url = createURL(`/api/introduction/`)
    // console.log(data)
    const response = await fetch(
        new Request(url, { method: "POST", body: JSON.stringify({body: data}) })
    )
    if(response.ok) {
        const data = await response.json()
        // console.log(data)
        return data
    }
}

export const createSubmission = async (data) => {
    const url = createURL(`/api/submission`)
    // console.log(url)
    const response = await fetch(
        new Request(url, { method: "POST", body: JSON.stringify({body: data}) })
    )
    if(response.ok) {
        const data = await response.json()
        // console.log(data)
        return data.data
    }
}

export const createThreadEntry = async (id, data) => {
    const url = createURL(`/api/submission/${id}`)
    console.log(url)
    const response = await fetch(
        new Request(url, { method: "POST", body: JSON.stringify({body: data}) })
    )
    if(response.ok) {
        const data = await response.json()
        // console.log(data)
        return data.data
    }
}