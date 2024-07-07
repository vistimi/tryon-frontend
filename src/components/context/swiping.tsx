import { Dispatch, SetStateAction, createContext } from "react";

export type SwipingContextState = {
    idxHuman: number
    idxCloth: number
    clothFile?: string
    humanFile?: string
}
export const SwipingContext = createContext<{
    swiping: SwipingContextState,
    setSwiping: Dispatch<SetStateAction<SwipingContextState>>
}>({ swiping: { idxHuman: 0, idxCloth: 0 }, setSwiping: () => { } });