import { Dispatch, SetStateAction, createContext } from "react";

export type ImageContextOpenpose = {id: string}
export type ImageContextHumanParser = {id: string}
export type ImageContextclothMask = {id: string}
export type ImageContextGenerative = {id: string}
export const ImageContext = createContext<{
    openpose: ImageContextOpenpose,
    setOpenpose: Dispatch<SetStateAction<ImageContextOpenpose>>    
    humanParser: ImageContextHumanParser,
    setHumanParser: Dispatch<SetStateAction<ImageContextHumanParser>>
    clothMask: ImageContextclothMask,
    setClothMask: Dispatch<SetStateAction<ImageContextclothMask>>
    generative: ImageContextGenerative,
    setGenerative: Dispatch<SetStateAction<ImageContextGenerative>>
}>({
    openpose: {id: ''}, setOpenpose: () => {},    
    humanParser: {id: ''}, setHumanParser: () => {},
    clothMask: {id: ''}, setClothMask: () => {},
    generative: {id: ''}, setGenerative: () => {},
});