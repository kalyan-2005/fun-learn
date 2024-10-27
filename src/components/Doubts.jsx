"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, Loader2, Send, Play, Square } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Gemini({ currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(currentUser?.voiceid || "Xb7hH8MSUJpSbSDYk0k2");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      const response = await fetch("https://api.elevenlabs.io/v1/voices", {
        headers: { "xi-api-key": process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY },
      });
      if (!response.ok) throw new Error("Failed to fetch voices");
      const data = await response.json();
      setVoices(data.voices);
      setSelectedVoice(data.voices[0]?.voice_id || "");
    } catch (err) {
      setError("Failed to load voices. Please check your API key.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target.result;
        setImage(file);
        setImagePreview(imageDataUrl);
        addMessage("user", "Image uploaded", imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const addMessage = (role, content, imageUrl = null) => {
    setMessages((prev) => [...prev, { role, content, imageUrl }]);
  };

  const handleSend = async () => {
    if (!input.trim() && !image) return;

    if (image) {
      addMessage("user", input || "Image analysis request", imagePreview);
    } else {
      addMessage("user", input);
    }
    setInput("");

    setIsLoading(true);

    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY
      );
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",
      });

      const contentInput = [];
      if (input.trim()) contentInput.push(input);

      if (image) {
        const arrayBuffer = await image.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString("base64");
        contentInput.push({
          inlineData: {
            data: base64String,
            mimeType: image.type,
          },
        });
      }

      const result = await model.generateContent([
        "Please analyze the following input. If an image is provided, describe it in detail. Then, answer any questions or provide relevant information based on the input. Respond in 2-3 clear and concise sentences without using symbols like * or :",
        ...contentInput,
      ]);
      const generatedText = await result.response.text();
      addMessage("bot", generatedText);

      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      addMessage(
        "bot",
        "An error occurred while processing. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const speak = async () => {
    if (!selectedVoice || !messages.length) return;
    setIsLoading(true);
    setError("");

    try {
      const lastBotMessage = messages.filter((m) => m.role === "bot").pop();
      if (!lastBotMessage) throw new Error("No bot message to read");

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: lastBotMessage.content,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Text-to-speech conversion failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to convert text to speech. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      const scrollContainer = scrollArea.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="flex items-center p-10">
      <Card className="w-[700px] mx-auto h-[80vh] flex flex-col border-none">
        <CardHeader className="px-6 py-4 bg-blue-500 text-white rounded-t">
          <CardTitle className="text-lg font-semibold ">EduBot Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-0 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-4 z-10" />
          <ScrollArea className="h-full bg-white" ref={scrollAreaRef}>
            <div className="p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`flex items-start ${
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    } max-w-[80%]`}
                  >
                    <Avatar className="w-8 h-8 bg-slate-200 text-black">
                      <AvatarFallback>
                        {message.role === "user" ? "U" : "B"}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`mx-2 p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-slate-200 text-black"
                      }`}
                    >
                      {message.imageUrl && (
                        <div className="mb-2">
                          <Image
                            src={message.imageUrl}
                            alt="Uploaded image"
                            width={200}
                            height={200}
                            className="rounded-md"
                          />
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="flex items-end">
                    <Avatar className="w-8 h-8 bg-primary">
                      <AvatarFallback>B</AvatarFallback>
                    </Avatar>
                    <div className="max-w-xs mx-2 p-3 rounded-lg bg-muted">
                      <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="absolute bottom-0 left-0 right-0 h-4 z-10" />
        </CardContent>
        <CardFooter className="p-4 flex flex-col space-y-4 bg-blue-500 rounded-b">
          <div className="flex items-center w-full space-x-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 bg-white text-black"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-grow bg-white text-black"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading}
              size="icon"
              className="shrink-0 bg-white text-black"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      <div className="flex flex-col items-center justify-end gap-28 h-full w-1/3 ">
        <img
          width={220}
          height={220}
          src={currentUser.imgurl||"https://avatars.dicebear.com/api/identicon/123.svg"}
          alt="AI Assistant"
        />
        {/* <Select onValueChange={setSelectedVoice} value={selectedVoice}>
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
        </Select> */}
        <div className="flex space-x-2 w-full">
          <Button
            onClick={speak}
            disabled={isLoading || !messages.length}
            className="flex-1 bg-blue-500"
          >
            <Play className="mr-2 h-4 w-4 " />
            Read Aloud
          </Button>
          <Button onClick={stopSpeaking} className="flex-1 bg-red-700">
            <Square className="mr-2 h-4 w-4" />
            Stop
          </Button>
        </div>
        {error && <p className="text-destructive text-sm">{error}</p>}
        <audio ref={audioRef} className="hidden" />
      </div>
    </div>
  );
}
