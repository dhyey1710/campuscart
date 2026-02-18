import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-xl bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
              </div>
              <span className="text-base font-black">Campus<span className="text-primary">Cart</span></span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              The marketplace built for students, by students.
            </p>
          </div>

          {[
            { title: 'Marketplace', links: ['Browse Items', 'Sell an Item', 'Categories', 'New Arrivals'] },
            { title: 'Support', links: ['Help Center', 'Safety Tips', 'Report Issue', 'Contact Us'] },
            { title: 'Company', links: ['About', 'Blog', 'Privacy Policy', 'Terms of Service'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400">© 2025 CampusCart. All rights reserved.</p>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            Made for students everywhere
          </div>
        </div>
      </div>
    </footer>
  )
}
