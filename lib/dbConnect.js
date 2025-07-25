import mongoose, { mongo } from "mongoose"
const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
    throw new Error("please define mongodb uri in env")
}
let cached = global.mongoose
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}
async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }
    if (!cached.promise) {
        const object = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
        }
        cached.promise = mongoose.connect(MONGODB_URI, object).then(mongoose => {
            return mongoose
        })
        try {
            cached.conn = await cached.promise
        } catch (error) {
            cached.promise = null
            throw Error;
        }
    }
    return cached.conn
}
export default dbConnect