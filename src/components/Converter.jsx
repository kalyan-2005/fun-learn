'use client'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Square } from "lucide-react"
import { RiAiGenerate } from "react-icons/ri"
import { PiCursorClickFill } from "react-icons/pi"
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent} from "@/components/ui/card"
import Markdown from "react-markdown"

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY
const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY

export default function GeminiTTS() {
  const [prompt, setPrompt] = useState("")
  const [displayContent, setDisplayContent] = useState("")
  const [simpleContent, setSimpleContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('')
  const audioRef = useRef(null)

  useEffect(() => {
    fetchVoices()
  }, [])

  const fetchVoices = async () => {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: { 'xi-api-key': ELEVENLABS_API_KEY },
      })
      if (!response.ok) throw new Error('Failed to fetch voices')
      const data = await response.json()
      setVoices(data.voices)
      setSelectedVoice(data.voices[0]?.voice_id || '')
    } catch (err) {
      setError('Failed to load voices. Please check your API key.')
    }
  }

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
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`, {
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
    <div className="mx-auto p-4 space-y-8">
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter a topic here"
                  className="w-full"
                />
                <Button 
                  onClick={generateContent} 
                  disabled={isLoading || !prompt}
                  className="w-12 h-12 rounded-full"
                >
                  {isLoading ? <RiAiGenerate className="h-6 w-6 animate-spin" /> : <PiCursorClickFill className="h-6 w-6" />}
                </Button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {displayContent && (
                <div>
                  <h2 className="text-lg font-semibold my-3">{prompt}</h2>
                  <ScrollArea className="h-[calc(100vh-300px)] border rounded-md p-4">
                    <div className="pr-4">
                      <Markdown>{displayContent}</Markdown>
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {displayContent && (
                <div className="flex flex-col items-center space-y-4">
                  <Image 
                    width={150} 
                    height={150} 
                    src="https://i.pinimg.com/originals/17/b4/d7/17b4d75844d047a1ae585bda3c27b6ec.gif" 
                    alt="AI Assistant"
                  />
                  <Select onValueChange={setSelectedVoice} value={selectedVoice}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((voice) => (
                        <SelectItem key={voice.voice_id} value={voice.voice_id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex space-x-2 w-full">
                    <Button onClick={speak} disabled={isLoading || !simpleContent} className="flex-1">
                      <Play className="mr-2 h-4 w-4" />
                      Read Aloud
                    </Button>
                    <Button onClick={stopSpeaking} className="flex-1">
                      <Square className="mr-2 h-4 w-4" />
                      Stop
                    </Button>
                  </div>
                  {/* <pre>{JSON.stringify(voices)}</pre> */}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}