'use client'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useState } from 'react'
import Image from 'next/image'

const slides = [
  {
    image: "https://www.gstatic.com/meet/user_edu_get_a_link_light_90698cd7b4ca04d3005c962a3756c42d.svg",
    title: "Get a link you can share",
    description: "Click New meeting to get a link you can send to people you want to meet with",
  },
  {
    image: "https://www.gstatic.com/meet/user_edu_scheduling_light_b352efa017e4f8f1ffda43e847820322.svg",
    title: "Plan ahead",
    description: "Click New meeting to schedule meetings in Google Calendar and send invites to participants",
  },
  {
    image: "https://www.gstatic.com/meet/user_edu_safety_light_e04a2bbb449524ef7e49ea36d5f25b65.svg",
    title: "Your meeting is safe",
    description: "No one can join a meeting unless invited or admitted by the host",
  },
]

function MeetingFeatures() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const { image, title, description } = slides[currentSlide]

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="relative">
        <Image
          src={image}
          alt="meeting feature"
          width={300}
          height={300}
          className="rounded-full w-40 h-40 md:w-64 md:h-64"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 left-[-40px] -translate-y-1/2"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-[-40px] -translate-y-1/2"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <h1 className="text-2xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">
        {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-center max-w-sm">
        {description}
      </p>

      <div className="flex justify-center items-center space-x-2 mt-4">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default MeetingFeatures
