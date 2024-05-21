import { Dispatch, SetStateAction, createContext } from "react";

export type LoadingContextState = boolean
export const LoadingContext = createContext<{
    loading: LoadingContextState,
    setLoading: Dispatch<SetStateAction<LoadingContextState>>
}>({
    loading: false, setLoading: () => { }
});