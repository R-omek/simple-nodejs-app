const express = require('express');
const fs = require('fs/promises');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

app.get('/all-wishes', async (req, res) => {
    try {
        // Read data from the JSON file
        const data = await fs.readFile('data.json', 'utf8');
        const jsonData = JSON.parse(data);

        // Send the data as a JSON response
        res.json(jsonData);
    } catch (error) {
        console.error('Error reading data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/update-wish', async (req, res) => {
    try {
        const data = await fs.readFile('data.json', 'utf8');
        const jsonData = JSON.parse(data);

        let index
        const selectedWish = {
            ...jsonData.find((el, i) => {
                index = i
                return el.id === req.body.id
            }),
            is_selected: req.body.is_selected
        }
        jsonData.splice(index, 1, selectedWish)

        await fs.writeFile('data.json', JSON.stringify(jsonData))

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});