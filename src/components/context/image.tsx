import { Dispatch, SetStateAction, createContext } from "react";

export type ImageContextOpenpose = {id: string, timestamp: string} | null
export type ImageContextHumanParser = {id: string, timestamp: string} | null
export type ImageContextClothParser = {id: string, timestamp: string} | null
export type ImageContextGenerative = {id: string, timestamp: string} | null
export const ImageContext = createContext<{
    openpose: ImageContextOpenpose,
    setOpenpose: Dispatch<SetStateAction<ImageContextOpenpose>>    
    humanParser: ImageContextHumanParser,
    setHumanParser: Dispatch<SetStateAction<ImageContextHumanParser>>
    clothParser: ImageContextClothParser,
    setClothParser: Dispatch<SetStateAction<ImageContextClothParser>>
    generative: ImageContextGenerative,
    setGenerative: Dispatch<SetStateAction<ImageContextGenerative>>
}>({
    openpose: null, setOpenpose: () => {},    
    humanParser: null, setHumanParser: () => {},
    clothParser: null, setClothParser: () => {},
    generative: null, setGenerative: () => {},
});