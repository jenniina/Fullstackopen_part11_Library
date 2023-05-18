import { useState, useEffect } from "react"
import useEventListener from "./useEventListener"


export default function useMediaQuery(mediaQuery: string) {
    const [isMatch, setIsMatch] = useState(false)
    const [mediaQueryList, setMediaQueryList] = useState<MediaQueryList>()

    useEffect(() => {
        const list = window.matchMedia(mediaQuery)
        setMediaQueryList(list)
        setIsMatch(list.matches)
    }, [mediaQuery])

    // useEventListener("change", (e: MediaQueryList) => setIsMatch(e.matches), mediaQueryList, window)
    useEventListener("change", (e: MediaQueryList) => setIsMatch(e.matches))

    return isMatch
} 
