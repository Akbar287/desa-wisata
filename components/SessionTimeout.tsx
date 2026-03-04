"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"

const TIMEOUT = 30 * 60 * 1000

export default function SessionTimeout() {
    useEffect(() => {
        let timeout: NodeJS.Timeout

        const resetTimer = () => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                signOut({ callbackUrl: "/login" })
            }, TIMEOUT)
        }

        const events = ["mousemove", "keydown", "click", "scroll"]

        events.forEach((event) =>
            window.addEventListener(event, resetTimer)
        )

        resetTimer()

        return () => {
            clearTimeout(timeout)
            events.forEach((event) =>
                window.removeEventListener(event, resetTimer)
            )
        }
    }, [])

    return null
}