import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0c0c0c] text-white py-4">
      <div className="container md:mt-32 mx-auto px-4 md:w-[85%]">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center flex-col space-x-4">
            <div className="w-48 h-24 flex items-center justify-center">
              <Image src="/footerlogo.png" alt="logo" height={200} width={200} />
            </div>
            <div className="text-sm">@predictr.Market All Right Reserved 2024</div>
          </div>
          {/* reCAPTCHA and Terms Section */}
          <div className="text-xs text-center md:text-right mt-4 md:mt-0">
            <p>This Site Is Protected By reCAPTCHA</p>
            <Link href="/terms">
              <span className="underline">Terms Of Service</span> Apply
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
