import { interviewCovers } from "@/constants"

export const getRandomInterviewCover =()=>{
    const randomeIndex = Math.floor(Math.random() * interviewCovers.length)
    return `/covers${interviewCovers[randomeIndex]}`
}