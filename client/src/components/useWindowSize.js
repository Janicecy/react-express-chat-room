import React, { useState, useEffect } from 'react'

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

    const updateWindowSize = () => {
        setWindowSize( { width: window.innerWidth, height: window.innerHeight })
    }

    useEffect(() => {
        window.addEventListener('resize', updateWindowSize)
        return () => window.removeEventListener('resize', updateWindowSize) //perfrom cleanup 
    }, [])
    return windowSize;
}




