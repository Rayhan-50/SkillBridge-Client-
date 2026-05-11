"use client";

// Infinite auto-scrolling marquee — no external deps needed
const brands = [
  { name: "Harvard University", emoji: "🏛️" },
  { name: "MIT OpenCourseWare", emoji: "🔬" },
  { name: "Google", emoji: "🎯" },
  { name: "Microsoft", emoji: "💻" },
  { name: "Khan Academy", emoji: "📚" },
  { name: "Coursera", emoji: "🎓" },
  { name: "Stanford", emoji: "⭐" },
  { name: "Oxford", emoji: "🦉" },
  { name: "IBM", emoji: "🤖" },
  { name: "Meta", emoji: "🌐" },
];

// Duplicate for seamless infinite scroll
const doubled = [...brands, ...brands];

export default function TrustedBy() {
  return (
    <section className="py-12 border-y border-slate-100 dark:border-emerald-950/20 bg-[#f8fafc] dark:bg-[#0a232f] overflow-hidden">
      <p className="text-center text-xs uppercase tracking-widest text-slate-500 font-semibold mb-8">
        Trusted by learners from top institutions
      </p>

      {/* Marquee track */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#f8fafc] dark:from-[#0a232f] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#f8fafc] dark:from-[#0a232f] to-transparent z-10 pointer-events-none" />

        <div
          className="flex gap-10 w-max"
          style={{ animation: "marquee 28s linear infinite" }}
        >
          {doubled.map((brand, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-slate-200 dark:border-emerald-950/40 bg-white dark:bg-[#0c2a37] backdrop-blur-sm whitespace-nowrap select-none animate-none"
            >
              <span className="text-xl">{brand.emoji}</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
