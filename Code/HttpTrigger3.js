const sql = require('mssql');

module.exports = async function (context, req) {
    try {
        await sql.connect(process.env.DB_CONNECTION_STRING);
        let query = `SELECT Films.*, AVG(Ratings.Rating) AS AverageRating, COUNT(Ratings.Rating) AS NumberOfRatings FROM Films LEFT JOIN Ratings ON Films.Title = Ratings.Title`;
        if (req.query.search) {
            query += ` WHERE Films.Title LIKE '%${req.query.search}%'`;
        }
        query += ` GROUP BY Films.Title, Films.Year, Films.Genre, Films.Description, Films.Director, Films.Actors`;
        const result = await sql.query(query);
        context.res = {
            status: 200,
            body: result.recordset
        };
    } catch (err) {
        context.res = {
            status: 500,
            body: "Error: " + err.message
        };
    } finally {
        sql.close();
    }
};
