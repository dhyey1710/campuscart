import Link from 'next/link'
import { notFound } from 'next/navigation'
import ContactButton from '@/components/ContactButton'

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let product
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/items/${id}`, { cache: 'no-store' })
    if (!res.ok) notFound()
    product = await res.json()
  } catch {
    notFound()
  }

  const seller = product.seller || {}
  const joinedYear = seller.joined ? new Date(seller.joined).getFullYear() : '2024'

  return (
    <div className="max-w-5xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary transition-colors mb-6 group"
      >
        <span className="material-symbols-outlined text-lg group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        Back to Marketplace
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row">
        {/* Image */}
        <div className="w-full md:w-1/2 relative min-h-[280px] md:min-h-[520px] bg-slate-100 dark:bg-slate-800 shrink-0">
          <img
            src={product.image}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="w-full md:w-1/2 p-7 md:p-10 flex flex-col">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {product.category}
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold">
              {product.condition}
            </span>
            {product.sold && (
              <span className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-xs font-bold border border-rose-100">
                Sold
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3 leading-tight">
            {product.title}
          </h1>

          <div className="text-4xl font-black text-primary mb-6">{product.price.startsWith('₹') || product.price.startsWith('$') ? product.price : `₹${product.price}`}</div>

          {product.description && (
            <div className="mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Seller */}
          <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Seller</h3>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg shrink-0">
                {(seller.name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">{seller.name || 'Anonymous'}</div>
                <div className="text-xs text-slate-500">
                  {seller.major ? `${seller.major} · ` : ''}Joined {joinedYear}
                </div>
              </div>
            </div>

            <ContactButton
              sellerId={seller.id || 1}
              sellerName={seller.name || 'Seller'}
              phone={seller.phone}
              itemId={product.id}
              itemTitle={product.title}
              itemImage={product.image}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
