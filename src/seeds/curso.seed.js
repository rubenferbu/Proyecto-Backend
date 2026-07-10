require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Curso = require("../models/Curso.model");

const cursosDeEjemplo = [
  {
    titulo: "Introducción a Node.js",
    descripcion: "Curso básico de backend con Node y Express",
    categoria: "Backend",
    duracion: 20,
    nivel: "principiante",
    instructor: "Rubén Fernández",
    precio: 49.99,
  },
  {
    titulo: "MongoDB desde cero",
    descripcion: "Aprende a modelar y consultar bases de datos NoSQL",
    categoria: "Bases de datos",
    duracion: 15,
    nivel: "principiante",
    instructor: "Laura Gómez",
    precio: 39.99,
  },
  {
    titulo: "React avanzado",
    descripcion: "Hooks, Context API, optimización de rendimiento",
    categoria: "Frontend",
    duracion: 30,
    nivel: "avanzado",
    instructor: "Carlos Ruiz",
    precio: 79.99,
  },
  {
    titulo: "Autenticación con JWT",
    descripcion: "Seguridad, tokens y control de acceso en APIs REST",
    categoria: "Seguridad",
    duracion: 12,
    nivel: "intermedio",
    instructor: "Ana Martínez",
    precio: 44.99,
  },
  {
    titulo: "Fundamentos de Docker",
    descripcion: "Contenedores, imágenes y despliegue de aplicaciones",
    categoria: "DevOps",
    duracion: 18,
    nivel: "intermedio",
    instructor: "Javier López",
    precio: 54.99,
  },
  {
    titulo: "TypeScript para JavaScript devs",
    descripcion: "Tipado estático aplicado a proyectos reales",
    categoria: "Lenguajes",
    duracion: 22,
    nivel: "intermedio",
    instructor: "Marta Sánchez",
    precio: 49.99,
  },
  {
    titulo: "Testing con Jest",
    descripcion: "Pruebas unitarias y de integración en Node.js",
    categoria: "Testing",
    duracion: 14,
    nivel: "intermedio",
    instructor: "Pablo Díaz",
    precio: 34.99,
  },
  {
    titulo: "Arquitectura de microservicios",
    descripcion:
      "Diseño de sistemas distribuidos y comunicación entre servicios",
    categoria: "Arquitectura",
    duracion: 40,
    nivel: "avanzado",
    instructor: "Elena Torres",
    precio: 99.99,
  },
  {
    titulo: "Git y GitHub profesional",
    descripcion:
      "Control de versiones, ramas, pull requests y flujo de trabajo en equipo",
    categoria: "Herramientas",
    duracion: 10,
    nivel: "principiante",
    instructor: "Diego Romero",
    precio: 24.99,
  },
  {
    titulo: "Ciberseguridad para desarrolladores",
    descripcion: "Vulnerabilidades comunes en APIs y cómo prevenirlas",
    categoria: "Seguridad",
    duracion: 25,
    nivel: "avanzado",
    instructor: "Sofía Navarro",
    precio: 69.99,
  },
];

const ejecutarSeed = async () => {
    try{
        await connectDB();

        await Curso.deleteMany({});
        console.log('Cursos anteriores eliminados');

        const cursosCreados = await Curso.insertMany(cursosDeEjemplo);
        console.log(`${cursosCreados.length} cursos insertados correctamente`);

        await mongoose.connection.close();
        console.log('🔌 Conexión cerrada');
        process.exit(0);
    } catch (error) {
        console.error('Error al ejecutar la seed:', error.message);
        process.exit(1);
    }
};

ejecutarSeed();
