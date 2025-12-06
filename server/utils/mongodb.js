import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI || ''
const options = {}

let client
let clientPromise

if (!uri) {
  console.warn('MONGODB_URI no está configurado. Las funciones de base de datos no funcionarán.')
} else {
  if (process.env.NODE_ENV === 'development') {
    // En desarrollo, usar una variable global para que el valor
    // se preserve entre recargas del módulo causadas por HMR (Hot Module Replacement).
    const globalWithMongo = global

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // En producción, siempre crear un nuevo cliente.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

export async function getDatabase() {
  if (!clientPromise) {
    console.warn('MongoDB no está configurado. Por favor, agrega MONGODB_URI a .env')
    return null
  }
  
  try {
    const client = await clientPromise
    const dbName = process.env.MONGODB_DB || 'qr-menu'
    return client.db(dbName)
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    return null
  }
}

export default clientPromise

