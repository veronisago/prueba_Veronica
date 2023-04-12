const express = require('express');
const router = express.Router();
const pool = require('../db/db.js'); // conexión a la base de datos


exports.getCountry = async (req, res) => {
    const { country } = req.params;
    const client = await pool.connect();
    try {
        const query = `
        SELECT 
          s.id_state as state_id, s.name as state_name, 
          c.id_city as city_id, c.name as city_name, c.population as city_population 
        FROM 
          cities c 
          JOIN states s ON c.id_state = s.id_state 
          JOIN countries co ON s.id_country = co.id_country 
        WHERE 
          co.name = $1 
        ORDER BY 
          s.id_state, c.id_city`;
        const result = await pool.query(query, [country]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: `Country ${country} not found` });
        } else {
            const response = { country, states: [] };
            let currentState = null;
            result.rows.forEach(row => {
                if (currentState === null || currentState.id !== row.state_id) {
                    // Nuevo estado
                    const state = { id: row.state_id, name: row.state_name, cities: [] };
                    response.states.push(state);
                    currentState = state;
                }
                currentState.cities.push({ id: row.city_id, name: row.city_name, population: row.city_population });
            });
            res.status(200).json(response);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    } finally {
        client.release()
    }
}
