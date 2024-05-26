import { Dispatch, SetStateAction, createContext } from "react";

export type ImageContextOpenposeLabel = any | null
export type ImageContextOpenpose = number[] | null
export type ImageContextHumanParser = number[] | null
export type ImageContextClothParser = number[] | null
export type ImageContextGenerative = number[] | null
export const ImageContext = createContext<{
    openposeLabel: ImageContextOpenposeLabel,
    setOpenposeLabel: Dispatch<SetStateAction<ImageContextOpenposeLabel>>
    openpose: ImageContextOpenpose,
    setOpenpose: Dispatch<SetStateAction<ImageContextOpenpose>>    
    humanParser: ImageContextHumanParser,
    setHumanParser: Dispatch<SetStateAction<ImageContextHumanParser>>
    clothParser: ImageContextClothParser,
    setClothParser: Dispatch<SetStateAction<ImageContextClothParser>>
    generative: ImageContextGenerative,
    setGenerative: Dispatch<SetStateAction<ImageContextGenerative>>
}>({
    openposeLabel: null, setOpenposeLabel: () => {},
    openpose: null, setOpenpose: () => {},    
    humanParser: null, setHumanParser: () => {},
    clothParser: null, setClothParser: () => {},
    generative: null, setGenerative: () => {},
});