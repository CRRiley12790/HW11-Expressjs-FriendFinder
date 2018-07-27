console.log('API Route Connected Successfully');


// Link to Friends Data
var friendsHIMYM = require('../data/friends.js');


//Two Routes
function apiRoutes(app) {

    //Get Route with the url /api/friends. Used to display a JSON of all possible friends.
    app.get('/api/friends', function (req, res) {
        res.json(friendsHIMYM);
    });

    //POST routes /api/friends. This will be used to handle incoming survey results.
    app.post('/api/friends', function (req, res) {

        //Parse new friend input to get integers
        var newFriend = {
            name: req.body.name,
            photo: req.body.photo,
            scores: []
        };
        var scoresArray = [];
        for (var i = 0; i < req.body.scores.length; i++) {
            scoresArray.push(parseInt(req.body.scores[i]))
        }
        newFriend.scores = scoresArray;


        //Cross check the new friend entry with the existing ones
        var scoreComparisionArray = [];
        for (var i = 0; i < friendsHIMYM.length; i++) {

            //Check each friend's scores/difference in points
            var currentComparison = 0;
            for (var j = 0; j < newFriend.scores.length; j++) {
                currentComparison += Math.abs(newFriend.scores[j] - friendsHIMYM[i].scores[j]);
            }

            //Push each comparison between friends
            scoreComparisionArray.push(currentComparison);
        }

        //Determine the best match using the postion of best match in the friendsData array
        var bestMatchPosition = 0;
        for (var i = 1; i < scoreComparisionArray.length; i++) {

            //Lower number = better match
            if (scoreComparisionArray[i] <= scoreComparisionArray[bestMatchPosition]) {
                bestMatchPosition = i;
            }

        }

        //If the 2 friends have the same comparison, then the NEWEST entry in the friendsData array is chosen
        var bestFriendMatch = friendsHIMYM[bestMatchPosition];



        //Reply with a JSON object of the best match
        res.json(bestFriendMatch);



        //Push the new friend to the friends data array for storage
        friendsHIMYM.push(newFriend);
    });
}
//Export for use in server.js file
module.exports = apiRoutes;