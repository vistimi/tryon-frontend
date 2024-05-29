'use client'

import { useState, useEffect, useMemo, SetStateAction, Dispatch } from 'react';
import { readLocalStorage, setLocalStorage } from '@/util/localstorage';

export default function usePersistState<T>(value: T, id: string, expiresInSeconds: number = 2592000): [T,  Dispatch<SetStateAction<T>>] {
    // Set initial value
    const _value = useMemo(() => {
        return readLocalStorage<T>(id) || value;
    }, []);

    const [state, setState] = useState<T>(_value);

    useEffect(() => {
        setLocalStorage(id, state, expiresInSeconds);
    }, [state]);

    return [state, setState];
}
