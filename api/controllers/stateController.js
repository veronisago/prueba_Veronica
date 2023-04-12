const express = require('express');
const router = express.Router();
const pool = require('../db/db.js'); // conexión a la base de datos


exports.getState = async (req, res) => {
    const { state } = req.params;
    const client = await pool.connect();
    try {
        await pool.connect();
        const result = await pool.query(
            'SELECT cities.name, cities.population FROM cities JOIN states ON cities.id_state = states.id_state WHERE states.name = $1',
            [state]
        );
        if (result.rows.length === 0) {
            res.status(404).json({ message: `State ${state} not found` });
        } else {
            const cities = result.rows.map(row => ({ name: row.name, population: row.population }));
            res.status(200).json([{ name: state, cities }]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release()
    }
}
