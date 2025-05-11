'use client'

import {useEffect, useState} from 'react'

type Theme = 'light' | 'dark'

export function useTheme(): [Theme, (theme: Theme) => void] {
    const [theme, setThemeState] = useState<Theme>('light')

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme | null
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
        setThemeState(initialTheme)
        document.documentElement.classList.toggle('dark', initialTheme === 'dark')
    }, [])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem('theme', newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
        document.documentElement.classList.remove(newTheme === 'dark' ? 'light' : 'dark')
        document.documentElement.classList.add(newTheme)
    }

    return [theme, setTheme]
}
