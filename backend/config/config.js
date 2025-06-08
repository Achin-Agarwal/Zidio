import dotenv from 'dotenv';
dotenv.config();

const config = {
    server: {
        port: process.env.PORT || 5000,
    },
    database: {
        uri: process.env.MONGO_URI,
    },
    auth: {
        tokenSecret: process.env.ACCESS_TOKEN_SECRET || 'thisbetterbeasecret',
        tokenExpiration: '6h',
    },
};

export default config;