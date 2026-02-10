import { useState, useCallback } from 'react'

/**
 * Hook to sync state with a URL search parameter (no React Router needed)
 * Supports string, number, boolean, and object values
 *
 * @param key The URL search param key
 * @param defaultValue Default value if the param is missing
 * @returns [state, setState] tuple
 */
function useParamState<T extends string | number | boolean | object>(
    key: string,
    defaultValue: T
): [T, (newValue: T | Partial<T>) => void] {
    // Initialize state from URL or default
    const [state, setState] = useState<T>(() => {
        const params = new URLSearchParams(window.location.search)
        const val = params.get(key)

        if (val === null) return defaultValue

        try {
            // Try parsing JSON (for objects, numbers, booleans)
            return JSON.parse(val) as T
        } catch {
            // If parsing fails, fallback to string
            return val as unknown as T
        }
    })

    // Setter function
    const setParamState = useCallback(
        (newValue: T | Partial<T>) => {
            // Merge if object, otherwise replace
            const updatedValue =
                typeof newValue === 'object' && !Array.isArray(newValue) && typeof state === 'object'
                    ? { ...(state as object), ...newValue }
                    : newValue

            setState(updatedValue as T)

            // Update URL
            const params = new URLSearchParams(window.location.search)
            params.set(key, JSON.stringify(updatedValue))
            const newUrl = `${window.location.pathname}?${params.toString()}`
            window.history.replaceState({}, '', newUrl)
        },
        [key, state]
    )

    return [state, setParamState]
}

export default useParamState
