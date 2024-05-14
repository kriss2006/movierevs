const sql = require('mssql');

module.exports = async function (context, req) {
    if (req.body && req.body.title && req.body.opinion && req.body.rating && req.body.date && req.body.author) {
        try {
            await sql.connect(process.env.DB_CONNECTION_STRING);
            await sql.query`
                INSERT INTO Ratings (Title, Opinion, Rating, Date, Author)
                VALUES (${req.body.title}, ${req.body.opinion}, ${req.body.rating}, ${req.body.date}, ${req.body.author})
            `;
            context.res = {
                status: 200,
                body: "Grade added successfully"
            };
        } catch (err) {
            context.res = {
                status: 500,
                body: "Server error when trying to insert into DB: " + err.message
            };
        } finally {
            sql.close();
        }
    } else {
        context.res = {
            status: 400,
            body: "Invalide arguments"
        };
    }
};
