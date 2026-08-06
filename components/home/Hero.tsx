export default function Hero() {
  return (
    <section className="flex min-h-screen items-center pt-32">
      <div className="mx-auto flex w-[95%] max-w-7xl flex-col items-center gap-16 md:flex-row">

        {/* Texto */}
        <div className="flex-1">

          <span className="mb-6 inline-block rounded-full border-4 border-black bg-[var(--cg-yellow)] px-5 py-2 font-black uppercase shadow-[6px_6px_0_#000]">
            Premium Design Studio
          </span>

          <h1 className="text-6xl font-black uppercase leading-none md:text-8xl">

            <span className="block text-[var(--cg-yellow)]">
              Future
            </span>

            <span className="block text-[var(--cg-yellow)]">
              Made
            </span>

            <span className="block text-[var(--cg-pink)]">
              Physical
            </span>

          </h1>

          <p className="mt-8 max-w-xl text-lg text-gray-600">
            Premium 3D Printing • Product Design • Custom Manufacturing
          </p>

          <div className="mt-10 flex gap-5">

            <button className="rounded-full border-4 border-black bg-[var(--cg-yellow)] px-8 py-4 font-black uppercase shadow-[6px_6px_0_#000] transition-all hover:-translate-y-1">
              Explore
            </button>

            <button className="rounded-full border-4 border-black bg-white px-8 py-4 font-black uppercase shadow-[6px_6px_0_#000] transition-all hover:-translate-y-1">
              Shop
            </button>

          </div>

        </div>

        {/* Aqui ficará a cena Three.js */}

        <div className="flex flex-1 items-center justify-center">

          <div className="flex h-[500px] w-[500px] items-center justify-center rounded-3xl border-4 border-dashed border-black bg-gray-50">

            <span className="text-center font-bold uppercase">
              HeroScene será adicionada aqui
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}