const config = {
    app: {
        port: process.env.PORT || 8080,
        superSecret: 'AdminApiApp',
    },
    db: {
        connectionString: 'mongodb+srv://admin:tqtu130891@cluster0.m1jdu.mongodb.net/newsdata?retryWrites=true&w=majority',
    }
}
module.exports = config;