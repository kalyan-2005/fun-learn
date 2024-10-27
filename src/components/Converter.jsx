'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Square, Sparkles, Loader2 } from "lucide-react"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from "@/components/ui/card"
import Markdown from "react-markdown"
import { motion, AnimatePresence } from 'framer-motion'

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY

export default function GeminiTTS({ currentUser }) {
  const [prompt, setPrompt] = useState("")
  const [displayContent, setDisplayContent] = useState("")
  const [simpleContent, setSimpleContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const audioRef = useRef(null)

  // const fetchVoices = async () => {
  //   try {
  //     const response = await fetch('https://api.elevenlabs.io/v1/voices', {
  //       headers: { 'xi-api-key': ELEVENLABS_API_KEY },
  //     })
  //     if (!response.ok) throw new Error('Failed to fetch voices')
  //     const data = await response.json()
  //     setVoices(data.voices)
  //     setSelectedVoice(data.voices[0]?.voice_id || '')
  //   } catch (err) {
  //     setError('Failed to load voices. Please check your API key.')
  //   }
  // }

  const generateContent = async () => {
    setIsLoading(true)
    setError("")
    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai")
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const result = await model.generateContent(`You are an excellent teacher teaching for in a school. Know explain  the topic ${prompt}`)
      const response = await result.response
      const text = response.text()
      setDisplayContent(text)

      const simpleResult = await model.generateContent(`Explain the topic in detail in simple words for school students: ${text}`)
      const simpleResponse = await simpleResult.response
      const simpleText = simpleResponse.text()
      setSimpleContent(simpleText)
    } catch (err) {
      console.error(err)
      setError("An error occurred while generating the content. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const speak = async () => {
    if (!selectedVoice || !simpleContent) return
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${currentUser.voiceid}`, {
        method: 'POST',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: simpleContent,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      })

      if (!response.ok) throw new Error('Text-to-speech conversion failed')

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)

      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
      }
    } catch (err) {
      console.error(err)
      setError('Failed to convert text to speech. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {!displayContent ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center space-y-6"
              >
                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
                  Discover Knowledge with AI
                </h1>
                <div className="relative w-full max-w-lg">
                  <Input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter a topic to explore..."
                    className="w-full pl-4 pr-12 py-3 text-lg rounded-full border-2 border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 bg-white dark:bg-gray-700 dark:border-gray-600 dark:focus:border-purple-400"
                  />
                  <Button
                    onClick={generateContent}
                    disabled={isLoading || !prompt}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 bg-purple-500 hover:bg-purple-600 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 transition-colors duration-200"
                  >
                    <Sparkles className="h-5 w-5 text-white" />
                  </Button>
                </div>
              </motion.div>
            ) : isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center space-y-4"
              >
                <Loader2 className="h-16 w-16 text-purple-500 animate-spin" />
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                  Generating amazing content for you...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">{prompt}</h2>
                  <ScrollArea className="h-[calc(100vh-300px)] border rounded-lg p-4 bg-white dark:bg-gray-700 shadow-inner">
                    <div className="pr-4">
                      <Markdown className="prose dark:prose-invert max-w-none">{displayContent}</Markdown>
                    </div>
                  </ScrollArea>
                </div>
                <div className="space-y-6 flex flex-col items-center">
                  <Image
                    width={200}
                    height={200}
                    src="https://i.pinimg.com/originals/17/b4/d7/17b4d75844d047a1ae585bda3c27b6ec.gif"
                    alt="AI Assistant"
                    className="rounded-full shadow-lg"
                  />
                  {/* <Select onValueChange={setSelectedVoice} value={selectedVoice}>
                    <SelectTrigger className="w-full max-w-xs">
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((voice) => (
                        <SelectItem key={voice.voice_id} value={voice.voice_id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select> */}
                  <div className="flex space-x-4 w-full max-w-xs">
                    <Button
                      onClick={speak}
                      disabled={isLoading || !simpleContent}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Read Aloud
                    </Button>
                    <Button
                      onClick={stopSpeaking}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Square className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-4 text-center"
            >
              {error}
            </motion.p>
          )}
        </CardContent>
      </Card>
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}