import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0c0c0c] text-white py-4">
      <div className="container mt-32 mx-auto px-4 md:w-[85%]">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="flex flex-col items-center md:items-start space-y-2 w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <div className="w-48 h-48 translate-y-5 flex items-center justify-center">
                <Image src="/plogo.png" alt='logo' height={10} width={200} />
              </div>
              {/* <span className="text-xl font-bold">predictr.Market</span> */}
            </div>
            <div className="text-sm">
              @predictr.Market All Right Reserved 2024
            </div>
          </div>
          <div className="text-xs text-center md:text-right mt-4 md:mt-0 w-full md:w-auto">
            <p>This Site Is Protected By ReCAPTCHA</p>
            <Link href="/terms" className="">
            <span className='underline'>Terms Of Service </span>    Apply
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}