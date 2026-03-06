import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const items = await prisma.item.findMany({
      where: {
        sold: false,
        ...(category && category !== 'All' ? { category } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' as const } },
                { category: { contains: search, mode: 'insensitive' as const } },
              ],
            }
          : {}),
      },
      include: {
        seller: { select: { id: true, name: true, major: true, joined: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(items)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, price, category, condition, description, image, sellerId } = await req.json()

    const item = await prisma.item.create({
      data: {
        title,
        price,
        category,
        condition,
        description: description || '',
        image:
          image ||
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000',
        sellerId: sellerId ? parseInt(sellerId) : 1,
      },
      include: { seller: { select: { id: true, name: true } } },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}
