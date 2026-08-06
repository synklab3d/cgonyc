export default function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-32 bg-white">
      <div className="mx-auto flex w-[95%] max-w-7xl flex-col items-center gap-16 md:flex-row">

        {/* Texto */}
        <div className="flex-1">

          <span className="mb-6 inline-block rounded-full border-4 border-black bg-yellow-300 px-5 py-2 font-bold uppercase shadow-[4px_4px_0_#000]">
            ● Design Studio • NYC
          </span>

          <h1 className="leading-none">

            <span className="block text-7xl font-black uppercase text-yellow-300 [text-shadow:4px_4px_0_#000]">
              Future
            </span>

            <span className="block text-7xl font-black uppercase text-yellow-300 [text-shadow:4px_4px_0_#000]">
              Made
            </span>

            <span className="block text-7xl font-black uppercase text-pink-500 [text-shadow:4px_4px_0_#000]">
              Physical
            </span>

          </h1>

          <p className="mt-8 max-w-xl text-xl text-gray-600">
            Premium 3D Printing • Design • Custom Manufacturing
          </p>

          <div className="mt-10 flex gap-5">

            <button className="rounded-full border-4 border-black bg-yellow-300 px-8 py-4 font-bold shadow-[4px_4px_0_#000] transition hover:-translate-y-1">
              Explore
            </button>

            <button className="rounded-full border-4 border-black bg-white px-8 py-4 font-bold shadow-[4px_4px_0_#000] transition hover:-translate-y-1">
              Shop Now
            </button>

          </div>

        </div>

        {/* Impressora */}

        <div className="flex flex-1 justify-center">

          <img
            src="/images/printer.png"
            alt="3D Printer"
            className="w-full max-w-md"
          />

        </div>

      </div>
    </section>
  );
}