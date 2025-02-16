require("dotenv").config();
const { Sequelize } = require("sequelize");
const { Client } = require("pg");

const createDatabaseIfNotExists = async () => {
    const client = new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: "postgres"
    });

    try {
        await client.connect();
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);
        
        if (res.rowCount === 0) {
            console.log(`Criando banco de dados ${process.env.DB_NAME}...`);
            await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
            console.log("Banco de dados criado com sucesso.");
        } else {
            console.log("Banco de dados já existe.");
        }
    } catch (error) {
        console.error("Erro ao verificar/criar o banco de dados:", error);
    } finally {
        await client.end();
    }
};

// ✅ Criando a instância do Sequelize FORA da função assíncrona
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT
    }
);

// ✅ Função de inicialização sem alterar a exportação
const startSequelize = async () => {
    await createDatabaseIfNotExists();

    try {
        await sequelize.authenticate();
        console.log("Conexão com o banco de dados estabelecida com sucesso.");

        await sequelize.sync({ alter: true });
        console.log("Banco de dados sincronizado.");
    } catch (error) {
        console.error("Erro ao conectar ou sincronizar o banco de dados:", error);
    }
};

// 🔥 Exportação correta
module.exports = { sequelize, startSequelize };

// 🔥 Iniciar a conexão após exportar
startSequelize();
