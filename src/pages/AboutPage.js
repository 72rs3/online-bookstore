import React from 'react';

const AboutPage = () => {
  return (
    <div className="page-shell space-y-10">
      <section className="card">
        <div className="pill mb-4">Our story</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Built for readers who want more than a store.</h1>
        <p className="text-slate-300 text-lg leading-relaxed max-w-3xl">
          Fareed Bookshop is a curated home for modern readers. We spotlight titles that move people,
          build collections with intention, and deliver a boutique experience from search to checkout.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Titles curated', value: '4,200+' },
          { label: 'Happy readers', value: '18k+' },
          { label: 'Avg. delivery', value: '48h' }
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <p className="text-3xl font-black text-white">{stat.value}</p>
            <p className="text-slate-400 mt-2">{stat.label}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-3">What we believe</h2>
          <ul className="text-slate-300 space-y-3">
            <li>Curated over crowded. Every shelf is intentional.</li>
            <li>Fast, reliable delivery with clear tracking.</li>
            <li>Support that feels human, not automated.</li>
          </ul>
        </div>
        <div className="card">
          <h2 className="text-2xl font-bold text-white mb-3">How we work</h2>
          <p className="text-slate-300 leading-relaxed">
            We combine expert curation with smart technology so you can discover, decide, and check out
            quickly. Every order is packed with care and backed by responsive support.
          </p>
        </div>
      </section>

      <section className="card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Ready to explore?</p>
          <h3 className="text-2xl font-bold text-white">Find your next favorite book today.</h3>
        </div>
        <a href="/" className="btn-primary">Browse the collection</a>
      </section>
    </div>
  );
};

export default AboutPage;
