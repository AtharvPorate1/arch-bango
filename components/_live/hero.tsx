import { Inter } from "next/font/google"

// const inter = Inter({ subsets: ["latin"] })

export default function HeroSection() {
  return (
    <div className={`w-full max-w-6xl mx-auto px-4 py-8 dm-sans`}>
      <div className="flex items-center justify-center min-h-[208px] rounded-lg bg-[#EC762E] ">
        <h1 className="text-2xl md:text-4xl font-bold text-center text-white px-4">
          Predict the Future, Invest in Possibilities
        </h1>
      </div>
    </div>
  )
}

