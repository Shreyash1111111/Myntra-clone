const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { getStoredItems, storeItems } = require('./data/items');

const app = express();

// Enable CORS
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
  })
);

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Myntra Backend Running');
});

app.get('/items', async (req, res) => {
  try {
    const storedItems = await getStoredItems();
    res.json({ items: storedItems });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});

app.get('/items/:id', async (req, res) => {
  try {
    const storedItems = await getStoredItems();
    const item = storedItems.find((item) => item.id === req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ item });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch item' });
  }
});

app.post('/items', async (req, res) => {
  try {
    const existingItems = await getStoredItems();

    const newItem = {
      ...req.body,
      id: Math.random().toString(),
    };

    const updatedItems = [newItem, ...existingItems];

    await storeItems(updatedItems);

    res.status(201).json({
      message: 'Stored new item.',
      item: newItem,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to store item' });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});