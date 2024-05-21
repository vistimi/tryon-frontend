import { Dispatch, SetStateAction, createContext } from "react";

export type ImageContextOpenposeLabel = any | null
export type ImageContextOpenpose = Uint8Array | null
export type ImageContextHumanParser = Uint8Array | null
export type ImageContextClothParser = Uint8Array | null
export type ImageContextGenerative = Uint8Array | null
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