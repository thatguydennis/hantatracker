export default function NewsPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-7xl flex-col px-4 py-8 md:px-6 md:py-12">
      <h1 className="text-h1 font-semibold text-text-primary">News</h1>
      <p className="mt-3 max-w-2xl text-body text-text-secondary">
        The full archive of hantavirus news from official health agencies and
        major outlets. Coming soon.
      </p>
      <footer className="mt-auto pt-12 text-meta text-text-tertiary">
        Built with design-system.md
      </footer>
    </div>
  );
}
