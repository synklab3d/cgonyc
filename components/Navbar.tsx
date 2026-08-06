import Image from "next/image";
import Link from "next/link";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Shop", href: "#shop" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <nav className="mx-auto mt-5 flex w-[95%] max-w-7xl items-center justify-between rounded-2xl border-4 border-black bg-white/90 px-6 py-3 shadow-[6px_6px_0_#000] backdrop-blur-md">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="CGONYC"
            width={120}
            height={55}
            priority
            className="h-12 w-auto transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Menu Desktop */}
        <ul className="hidden items-center gap-10 md:flex">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="relative font-black uppercase tracking-wide transition-all duration-300 hover:text-pink-500"
              >
                {item.label}

                <span className="absolute -bottom-1 left-0 h-[3px] w-0 rounded-full bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Botão */}
        <button
          className="
            rounded-full
            border-4
            border-black
            bg-[#EFFF00]
            px-7
            py-3
            font-black
            uppercase
            shadow-[5px_5px_0px_#000]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:scale-105
            hover:bg-pink-500
            hover:text-white
            hover:shadow-[8px_8px_0px_#000]
          "
        >
          Get Started
        </button>
      </nav>
    </header>
  );
}