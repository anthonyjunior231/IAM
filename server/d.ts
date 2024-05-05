declare module 'bcrypt'
declare module 'helmet'
declare module 'pg'
declare module 'jsonwebtoken'
declare module 'express-session' {
    interface SessionData {
        user: any; // Or a more specific type if you know the user object structure
    }
}