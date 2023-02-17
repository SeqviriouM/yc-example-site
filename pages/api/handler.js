import fs from 'fs';

import {Pool} from 'pg';

const PG_CONFIG = {
    user: 'user',
    host: 'rc1b-3y4pbno8x78gqlf4.mdb.yandexcloud.net',
    database: 'competition',
    password: process.env.PG_PASSWORD,
    port: 6432,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(process.env.CRT_PATH).toString(),
    },
};

const pool = new Pool(PG_CONFIG);

export default async function handler(req, res) {
    const {name, score} = req.body;

    if (!name) {
        return res.status(400).send({status: 'error', message: 'Поле "имя" не может быть пустым.'});
    }

    if (!score) {
        return res
            .status(400)
            .send({status: 'error', message: 'Поле "Результат" не может быть пустым.'});
    }

    if (!parseInt(score, 10)) {
        return res
            .status(400)
            .send({status: 'error', message: 'Поле "Результат" должно быть числовым.'});
    }

    const client = await pool.connect();

    try {
        const text = 'INSERT INTO competition(name, score) VALUES($1, $2) RETURNING *';
        const values = [name, parseInt(score)];

        await client.query(text, values);

        await client.end();

        res.status(200).send({
            status: 'success',
            message: 'Ваша результат успешно отправлен!',
        });
    } catch (error) {
        console.error('pg error', error);

        res.status(500).send({
            status: 'error',
            message: 'Произошла непредвиденная ошибка. Попробуйте повторить запрос.',
        });
    } finally {
        client.release();
    }
}
