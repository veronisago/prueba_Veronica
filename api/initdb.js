const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const {
    HOST, PORT, USER, PASSWORD, DATABASE
  } = process.env;

const pool = new Pool({
    host: HOST,
    port: PORT,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
});


async function createTablesAndPopulateData(client) {
  try {
    // Crear tablas
    await client.query(`
      CREATE TABLE IF NOT EXISTS countries (
        id_country SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS states (
        id_state SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        id_country INTEGER REFERENCES countries (id_country) 
      );

      CREATE TABLE IF NOT EXISTS cities (
        id_city SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        id_state INTEGER REFERENCES states (id_state),
        population INTEGER NOT NULL
      );
    `);

    console.log('Tablas creadas exitosamente');

    // Leer archivos CSV y poblar tablas
    const countriesData = fs.createReadStream(path.resolve(__dirname, './csv_files/countries.csv'));
    const statesData = fs.createReadStream(path.resolve(__dirname, './csv_files/states.csv'));
    const citiesData = fs.createReadStream(path.resolve(__dirname, './csv_files/cities.csv'));

    await populateTableFromCsv(client, 'countries', countriesData);
    await populateTableFromCsv(client, 'states', statesData);
    await populateTableFromCsv(client, 'cities', citiesData);

    console.log('Datos poblados exitosamente');
  } catch (err) {
    console.error(err);
  }
}

async function populateTableFromCsv(client, tableName, csvData) {
  return new Promise((resolve, reject) => {
    csv
      .parseStream(csvData, { headers: true })
      .on('error', (error) => reject(error))
      .on('data', async (row) => {
        const values = Object.values(row).map((value) => `'${value}'`).join(',');
        await client.query(`INSERT INTO ${tableName} VALUES (${values})`);
      })
      .on('end', () => {
        console.log(`Datos del archivo ${tableName}.csv insertados exitosamente`);
        resolve();
      });
  });
}


createTablesAndPopulateData(pool)


