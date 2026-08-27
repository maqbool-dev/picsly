const PANELS = [
  {
    title: "What stays on your device",
    body: "Every image you add, every compressed result, every filename, and every setting you choose.",
  },
  {
    title: "What we collect",
    body: "No accounts, no cookies for tracking, no image data. Our host records standard anonymous request logs, as every web host does.",
  },
];

const SECTIONS = [
  {
    title: "Where the work happens",
    body: "Decoding and encoding use the browser's own canvas pipeline. Files are held in memory for the length of your session and released the moment you clear them or close the tab.",
  },
  {
    title: "Third parties",
    body: "Picsly loads its fonts and its own code, and nothing else. There is no analytics vendor, no ad network, and no image processing API in the path.",
  },
  {
    title: "How to verify it",
    body: "Open your browser's network tab, compress something, and watch: no request carries your file. Or turn your wifi off after the page loads. It still works.",
  },
];

export default function PrivacyPage() {
  return (
    <main className="px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto flex max-w-[760px] flex-col gap-8 sm:gap-10">
        <div className="flex flex-col gap-3">
          <span className="eyebrow">Privacy</span>
          <h1 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[42px]">
            The short version: we never see your images.
          </h1>
          <p className="text-[15px] leading-relaxed text-muted sm:text-base">
            Picsly is a static page. When you drop a file in, it is read by your
            own browser, re-encoded on your own hardware, and handed back to you
            as a download. It never travels to a server, because there is no
            server to travel to.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {PANELS.map((p) => (
            <div key={p.title} className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-4">
              <div className="text-sm font-semibold text-ink">{p.title}</div>
              <p className="text-[13px] leading-relaxed text-muted">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-7">
          {SECTIONS.map((s) => (
            <div key={s.title} className="flex flex-col gap-2">
              <h2 className="text-base font-semibold tracking-[-0.01em]">{s.title}</h2>
              <p className="text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
