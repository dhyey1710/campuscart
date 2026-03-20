const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

// GET /api/messages/:roomId
// Fetch all messages for a chat room (defined by senderId, receiverId, itemId)
router.get('/:senderId/:receiverId/:itemId', async (req, res) => {
  const { senderId, receiverId, itemId } = req.params

  try {
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

    res.json(messages)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// GET /api/messages/inbox/:userId
// Get all conversations for a user
router.get('/inbox/:userId', async (req, res) => {
  const { userId } = req.params

  try {
    // Get latest message per conversation
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

    res.json(messages)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch inbox' })
  }
})

module.exports = router
