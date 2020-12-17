const db = require('../../data/db-config');

const addTotalPointsToChildren = async () => {
    const derivedTable = await db
                            .select('Children.ID', 'Children.Total_Points')
                            .sum('Faceoffs.Points')
                            .from('Children')
                            .join('Submissions', 'Children.ID', '=', 'Submissions.ChildID')
                            .join('Faceoffs', 'Submissions.ID', '=', 'Faceoffs.Winner')
                            .groupBy('Children.ID')

    for (const child of derivedTable) {
        const ID = child.ID;
        const sum = child.sum;
        const totalPoints = child.Total_Points;
        db('Children').where({ ID }).update({ Total_Points: totalPoints + sum })
    }
}

const getWinningTeam = async () => {
        const winningTeam = await db
                                .select('T.ID')
                                .count('*')
                                .from('Votes as V')
                                .join('Members as M', 'V.Vote', '=', 'M.ID')
                                .join('Teams as T', 'T.ID', '=', 'M.ID')
                                .groupBy('T.ID')
                                .orderBy('T.count', 'desc')
                                .limit(1)
        console.log("winner:", winningTeam)
}

const getLosingTeam = async () => {
    const losingTeams = await db
                                .select('T.ID')
                                .count('*')
                                .from('Votes as V')
                                .join('Members as M', 'V.Vote', '=', 'M.ID')
                                .join('Teams as T', 'T.ID', '=', 'M.ID')
                                .groupBy('T.ID')
                                .orderBy('T.count', 'desc')
                                .offset(1)
        console.log("loser:", losingTeams)
}

module.exports = {
    addTotalPointsToChildren,
    getWinningTeam,
    getLosingTeam
}