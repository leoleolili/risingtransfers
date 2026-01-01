"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, ArrowUp, Settings2, Mic, X, Check } from "lucide-react"

export default function ChatInput() {
    const [input, setInput] = useState("")
    const [isRecording, setIsRecording] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim()) {
            console.log("Submitted:", input)
            setInput("")
        }
    }

    const handleMicClick = () => {
        setIsRecording(true)
        setTimeout(() => {
            setIsRecording(false)
            setInput("When speech to text feature ?")
        }, 5000)
    }

    const handleCancelRecording = () => {
        setIsRecording(false)
    }

    const handleConfirmRecording = () => {
        setIsRecording(false)
        setInput("When speech to text feature ?")
    }

    const WaveAnimation = () => {
        const [animationKey, setAnimationKey] = useState(0)

        useEffect(() => {
            const interval = setInterval(() => {
                setAnimationKey((prev) => prev + 1)
            }, 100)
            return () => clearInterval(interval)
        }, [])

        const bars = Array.from({ length: 50 }, (_, i) => {
            const height = Math.random() * 20 + 4
            const delay = Math.random() * 2
            return (
                <div
                    key={`${i}-${animationKey}`}
                    className="bg-gray-400 rounded-sm animate-pulse"
                    style={{
                        width: "2px",
                        height: `${height}px`,
                        animationDelay: `${delay}s`,
                        animationDuration: "1s",
                    }}
                />
            )
        })

        return (
            <div className="flex items-center w-full gap-1">
                <div className="flex-1 border-t-2 border-dotted border-gray-500"></div>
                <div className="flex items-center gap-0.5 justify-center px-8">{bars}</div>
                <div className="flex-1 border-t-2 border-dotted border-gray-500"></div>
            </div>
        )
    }

    return (
        <div className="relative w-full">
            <form onSubmit={handleSubmit} className="relative">
                <div
                    className="border rounded-2xl p-5 md:p-6 relative transition-all duration-500 ease-in-out overflow-hidden bg-white border-slate-300/80 dark:bg-zinc-900/60 dark:border-zinc-700/50 shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] dark:shadow-[0_0_40px_-10px_rgba(6,182,212,0.4)] backdrop-blur-md"
                >
                    {isRecording ? (
                        <div className="flex items-center justify-between h-12 animate-in fade-in-0 slide-in-from-top-2 duration-500 w-full">
                            <WaveAnimation />
                            <div className="flex items-center gap-2 ml-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCancelRecording}
                                    className="h-8 w-8 p-0 text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:text-white dark:hover:text-white dark:hover:bg-zinc-700/50 rounded-lg transition-all duration-200 hover:scale-110"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask RT Assistant"
                                className="w-full bg-transparent resize-none border-none outline-none text-base leading-relaxed min-h-[24px] max-h-32 transition-all duration-200 text-slate-800 placeholder-slate-400 dark:text-gray-300 dark:placeholder-gray-500"
                                rows={1}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement
                                    target.style.height = "auto"
                                    target.style.height = `${target.scrollHeight}px`
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSubmit(e)
                                    }
                                }}
                            />
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-white dark:hover:text-white dark:hover:bg-zinc-700/50 rounded-lg transition-all duration-200 hover:scale-110"
                                    >
                                        <Plus className="h-5 w-5" />
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleMicClick}
                                        className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-white dark:hover:text-white dark:hover:bg-zinc-700/50 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 active:bg-red-600/20 active:text-red-400"
                                    >
                                        <Mic className="h-5 w-5 transition-transform duration-200" />
                                    </Button>
                                </div>

                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={!input.trim()}
                                    className="h-8 w-8 p-0 bg-cyan-600 text-white hover:bg-cyan-500 disabled:bg-slate-200 disabled:text-slate-400 dark:bg-cyan-600 dark:hover:bg-cyan-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500 rounded-lg transition-all duration-200 hover:scale-110 disabled:hover:scale-100"
                                >
                                    <ArrowUp className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}
