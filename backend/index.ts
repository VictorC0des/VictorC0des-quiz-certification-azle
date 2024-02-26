import { Server, ic } from 'azle';
import cors from "cors";
import express from 'express';
import preguntas from './preguntas.json'; 

export default Server(() => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    
    app.get('/preguntas', (req, res) => {
        res.json(preguntas);
    });

    return app.listen();
});
