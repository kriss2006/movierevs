const sql = require('mssql');

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        context.log('Late trigger');
    }

    try {
        await sql.connect(process.env.DB_CONNECTION_STRING);
        const result = await sql.query`
            UPDATE Films
            SET AverageRating = (SELECT AVG(Rating) FROM Ratings WHERE Ratings.Title = Films.Title)
        `;
        context.log('Calculation completed.');
    } catch (err) {
        context.log.error('Error: ' + err.message);
    } finally {
        sql.close();
    }

    context.log('JavaScript functions successful');
};
