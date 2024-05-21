import { Dispatch, SetStateAction, createContext } from "react";

export type SwipingContextState = {
    idxImage: number
    idxCloth: number
}
export const SwipingContext = createContext<{
    swiping: SwipingContextState,
    setSwiping: Dispatch<SetStateAction<SwipingContextState>>
}>({ swiping: { idxImage: 0, idxCloth: 0 }, setSwiping: () => { } });