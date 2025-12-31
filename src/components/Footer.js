import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-slate-900/60 backdrop-blur-xl">
      <div className="page-shell py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-300">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-400 text-white font-extrabold text-lg">F</span>
          <div>
            <p className="font-semibold text-white">Fareed Bookshop</p>
            <p className="text-slate-400">Read boldly. Shop beautifully.</p>
          </div>
        </div>
        <p className="text-slate-400">© {new Date().getFullYear()} All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
