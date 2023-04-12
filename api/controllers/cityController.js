const express = require('express');
const router = express.Router();
const pool = require('../db/db.js'); // conexión a la base de datos


exports.getCities = async (req, res) => {
    const { city } = req.params;
    const client = await pool.connect();
    try {
        const result = await pool.query(
            'SELECT population FROM cities WHERE name = $1',
            [city]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ message: `City ${city} not found` });
        } else {
            const population = result.rows[0].population;
            res.status(200).json({ population });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }finally{
        client.release()
    }
}

