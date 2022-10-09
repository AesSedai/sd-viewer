import { KeyboardEvent, useEffect, useState } from "react"

export const useKeyPress = (targetKey: KeyboardEvent["key"]) => {
    const [keyPressed, setKeyPressed] = useState(false)

    useEffect(() => {
        const downHandler = (event: globalThis.KeyboardEvent) => {
            if (event.key === targetKey) {
                console.log("downHandler", event.key, targetKey)
                setKeyPressed(true)
            }
        }

        const upHandler = (event: globalThis.KeyboardEvent) => {
            if (event.key === targetKey) {
                console.log("upHandler", event.key, targetKey)
                setKeyPressed(false)
            }
        }

        window.addEventListener("keydown", downHandler)
        window.addEventListener("keyup", upHandler)

        return () => {
            window.removeEventListener("keydown", downHandler)
            window.removeEventListener("keyup", upHandler)
        }
    }, [targetKey])

    return keyPressed
}
