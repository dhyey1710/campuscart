const express = require('express')
const router = express.Router()
const prisma = require('../lib/prisma')

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query
    const items = await prisma.item.findMany({
      where: {
        sold: false,
        ...(category && category !== 'All' ? { category } : {}),
        ...(search ? { OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
        ]} : {}),
      },
      include: {
        seller: { select: { id: true, name: true, major: true, joined: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(items)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch items' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const item = await prisma.item.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { seller: { select: { id: true, name: true, major: true, joined: true } } },
    })
    if (!item) return res.status(404).json({ error: 'Item not found' })
    res.json(item)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item' })
  }
})

router.post('/', async (req, res) => {
  const { title, price, category, condition, description, image, sellerId } = req.body
  try {
    const item = await prisma.item.create({
      data: {
        title, price, category, condition,
        description: description || '',
        image: image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000',
        sellerId: sellerId ? parseInt(sellerId) : 1,
      },
      include: { seller: { select: { id: true, name: true } } },
    })
    res.status(201).json(item)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create item' })
  }
})

router.patch('/:id/sold', async (req, res) => {
  try {
    const item = await prisma.item.update({ where: { id: parseInt(req.params.id) }, data: { sold: true } })
    res.json(item)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await prisma.item.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' })
  }
})

module.exports = router
