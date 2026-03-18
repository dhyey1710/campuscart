import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  try {
    const { params: routeParams } = await params

    // Route: /api/messages/:senderId/:receiverId/:itemId
    if (routeParams.length === 3) {
      const [senderId, receiverId, itemId] = routeParams

      const messages = await prisma.message.findMany({
        where: {
          itemId: parseInt(itemId),
          OR: [
            { senderId: parseInt(senderId), receiverId: parseInt(receiverId) },
            { senderId: parseInt(receiverId), receiverId: parseInt(senderId) },
          ],
        },
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
        },
        orderBy: { createdAt: 'asc' },
      })

      return NextResponse.json(messages)
    }

    // Route: /api/messages/inbox/:userId
    if (routeParams.length === 2 && routeParams[0] === 'inbox') {
      const userId = routeParams[1]

      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: parseInt(userId) },
            { receiverId: parseInt(userId) },
          ],
        },
        include: {
          sender: { select: { id: true, name: true, avatar: true } },
          receiver: { select: { id: true, name: true, avatar: true } },
          item: { select: { id: true, title: true, image: true, price: true } },
        },
        orderBy: { createdAt: 'desc' },
        distinct: ['itemId'],
      })

      return NextResponse.json(messages)
    }

    return NextResponse.json({ error: 'Invalid route' }, { status: 400 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST a new message (for polling-based chat)
export async function POST(req: NextRequest) {
  try {
    const { senderId, receiverId, itemId, content } = await req.json()

    const message = await prisma.message.create({
      data: {
        content,
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        itemId: itemId ? parseInt(itemId) : null,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
