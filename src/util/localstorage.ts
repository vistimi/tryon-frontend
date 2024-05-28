interface StorageSchema<T> {
    value: T,
    expires: string
}

export const setLocalStorage = <T>(id: string, value: T, expiresInSeconds: number = 2592000): void => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined'){
        return;
    }
    const tokenData: StorageSchema<T> = {
        value: value,
        expires: new Date(Date.now() + expiresInSeconds * 1000).toISOString()
    }
    const tokenDataString = JSON.stringify(tokenData);
    localStorage.setItem('state:' + id, tokenDataString)
}

export const readLocalStorage = <T>(id: string): T | null => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined'){
        return null;
    }
    const tokenData = localStorage.getItem('state:' + id);
    if (tokenData) {
        const parsedTokenData: StorageSchema<T>  = JSON.parse(tokenData)
        if (parsedTokenData.expires > new Date().toISOString()) {
            return parsedTokenData.value
        }
    }
    removeLocalStorage(id);
    return null;
}

export const removeLocalStorage = (id: string) => {
    localStorage.removeItem(id)
}