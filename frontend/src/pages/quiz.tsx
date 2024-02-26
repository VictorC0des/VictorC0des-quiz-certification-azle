import React, { useState, useEffect } from 'react';
import './page.css';
import { useRestActor } from "@bundly/ic-react";

interface Pregunta {
    categoria: string;
    pregunta: string;
    opciones: string[];
    respuestaCorrecta: string;
}

export default function IcConnectPage() {
    const backend = useRestActor("backend");
    const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
    const [preguntaActual, setPreguntaActual] = useState<Pregunta | null>(null);
    const [puntuacion, setPuntuacion] = useState(0);
    const [contador, setContador] = useState(0);

    const obtenerPregunta = () => {
        if (preguntas.length === 0) {
            setPreguntaActual(null);
            return;
        }

        const index = Math.floor(Math.random() * preguntas.length);
        const pregunta = preguntas[index];
        setPreguntaActual(pregunta);
        console.log(pregunta);
    }

    const reiniciarJuego = async () => {
        try {
            const response = await backend.get("/preguntas");
            const data: Pregunta[] = response.data as Pregunta[]; 
            setPreguntas(data);
            setPuntuacion(0);
            setContador(0);
            
        } catch (error) {
            console.error({ error });
        }
    }

    useEffect(() => {
        reiniciarJuego();
    }, []);

    const manejarRespuesta = (opcion: string) => {
        if (opcion === preguntaActual?.respuestaCorrecta) {
            setPuntuacion((prevPuntuacion) => prevPuntuacion + 1);
        }

        setContador((prevContador) => prevContador + 1);
        const nuevasPreguntas = preguntas.filter((pregunta) => pregunta !== preguntaActual);
        setPreguntas(nuevasPreguntas);
    };

    useEffect(() => {
        obtenerPregunta();
    }, [preguntas]);

    return (
        <div className='app'>
            
            {contador < 10 ? (
                preguntaActual ? (
                    <div className='pregunta'>
                        <h2>Categoría: {preguntaActual.categoria}</h2>
                        <h1>{preguntaActual.pregunta}</h1>
                        {preguntaActual.opciones.map((opcion) => (
                            <button key={opcion} onClick={() => manejarRespuesta(opcion)}>{opcion}</button>
                        ))}
                    </div>
                ) : (
                    <div>Cargando pregunta...</div>
                )
            ) : (
                <div className='resultado'>
                    <h1>Tu puntuación final fue {puntuacion}</h1>
                    <button onClick={reiniciarJuego}>Jugar de nuevo</button>
                </div>
            )}
        </div>
    );
}