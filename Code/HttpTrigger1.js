const sql = require('mssql');

module.exports = async function (context, req) {
    if (req.method === 'GET') {
        // Handle GET request
        context.res = {
            status: 200,
            body: "This is a GET request. Please send a POST request with film data."
        };
    } else if (req.method === 'POST') {
        // Handle POST request
        try {
            if (req.body && req.body.title && req.body.year && req.body.genre && req.body.description && req.body.director && req.body.actors) {
                await sql.connect(process.env.DB_CONNECTION_STRING);
                await sql.query`
                    INSERT INTO Films (Title, Year, Genre, Description, Director, Actors)
                    VALUES (${req.body.title}, ${req.body.year}, ${req.body.genre}, ${req.body.description}, ${req.body.director}, ${req.body.actors})
                `;
                context.res = {
                    status: 200,
                    body: "Film added successfully"
                };
            } else {
                context.res = {
                    status: 400,
                    body: "Invalid arguments"
                };
            }
        } catch (err) {
            context.res = {
                status: 500,
                body: "Server error: " + err.message
            };
        } finally {
            sql.close();
        }
    } else {
        context.res = {
            status: 405,
            body: "Method Not Allowed"
        };
    }
};
