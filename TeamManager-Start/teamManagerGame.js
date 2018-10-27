// require our dependencies
const inquirer = require("inquirer");

// import our Player constructor
const Player = require("./playerConstructor");

// make array to hold team
const teamArray = [];

// create recursive function to prompt users and create players for team
const teamCreate = async(count) => {
  // if count equals 3, then our team is filled
  if (count === 3) {
    // loop over our team and run printStats() method on each player
    teamArray.forEach(player => player.printStats());

    return playGame(1, 0);
  }

  // prompt user for information about new player
  const playerInfo = await createPlayerPrompt();

  // take information from prompt and run through constructor
  const newPlayer = new Player(playerInfo.name, playerInfo.position, playerInfo.offense, playerInfo.defense);

  // check if we already have two starters
  if (teamArray.length === 2) {
    newPlayer.isStarter = false;
  } else {
    newPlayer.isStarter = true;
  }

  // push new player into team array
  teamArray.push(newPlayer);

  // increase count by one and run function again
  count++;
  teamCreate(count);
}

// play game function
const playGame = async(roundNumber, currentScore) => {

  // if roundNumber <= 5 keep playing game
  if (roundNumber <= 5) {

    // Two random numbers between 1 and 20 are rolled and compared against the
    // starters' offensive and defensive stats
    const randomOffense = Math.floor(Math.random() * 20) + 1;
    const randomDefense = Math.floor(Math.random() * 20) + 1;

    // get starting offense and defense totals
    const teamOffense = teamArray
      .filter(player => player.isStarter)
      .reduce((totalOffense, starterObject) => {
        return totalOffense += parseInt(starterObject.offense);
      }, 0);

    const teamDefense = teamArray
      .filter(player => player.isStarter)
      .reduce((totalDefense, starterObject) => {
        return totalDefense += parseInt(starterObject.defense);
      }, 0);

    // let teamOffense = 0; for (let i = 0; i < team.length; i++) {   if
    // (team[i].isStarter) {     teamOffense += parseInt(team[i].offense);   } }

    if (randomOffense < teamOffense) {
      currentScore++;
    }
    if (randomDefense > teamDefense) {
      currentScore--;
    }

    // let user know how they fared in round
    console.log(`====== ROUND ${roundNumber} OVER ======
Your Score: ${currentScore}
============================
`);

    // ask user if they want to make a substitution
    const {confirmSub} = await confirmSubPrompt();

    // if we don't want to make a sub, then start next round
    if (confirmSub === false) {
      roundNumber++;
      playGame(roundNumber, currentScore);
    } else {
      // if we DO want to make a sub, let's prompt user for a starter to take out of
      // the game
      const {subPlayerName} = await subStarterPrompt();

      // take response.subPlayer and change status for isStarter to false and other
      // players to true
      teamArray.forEach(player => {
        if (player.name === subPlayerName) {
          player.isStarter = false;
        } else {
          player.isStarter = true;
        }
      })

      // increase round number and play next round
      roundNumber++;
      playGame(roundNumber, currentScore);

    }

  } else {
    // else run the logic for end of the game
    console.log(`======== GAME OVER! ========
Your score: ${currentScore}
${ (currentScore > 0)
      ? ("You won!")
      : ("You lost or tied!")}
================
`);
    // if currentScore > 0, run goodGame for starters
    if (currentScore > 0) {
      teamArray.forEach(player => {
        player.isStarter
          ? player.goodGame()
          : false;
      });
    }

    // if you lose, players lose points
    if (currentScore < 0) {
      teamArray.forEach(player => {
        player.isStarter
          ? player.badGame()
          : false;
      });
    }
    // run newGamePrompt
    newGamePrompt();
  }
}

// ask user if they want to play again
const newGamePrompt = () => {
  inquirer
    .prompt([
    {
      name: "confirm",
      type: "confirm",
      message: "Do you want to play again?",
      default: true
    }
  ])
    .then(response => {

      (response.confirm)
        ? (playGame(1, 0))
        : (false);

    })
}

// function to prompt for create player
const createPlayerPrompt = () => {
  return inquirer.prompt([
    {
      name: "name",
      type: "input",
      message: "What is the player's name?",
      default: "Bodie"
    }, {
      name: "position",
      type: "input",
      message: "What position?",
      default: "Small Forward"
    }, {
      name: "offense",
      type: "input",
      message: "Offensive Stat (Between 1 - 10)",
      default: 6,
      validate: function (offenseInput) {
        if (!isNaN(offenseInput) && offenseInput >= 1 && offenseInput <= 10) {
          return true;
        } else {
          console.log("Enter a number between 1 - 10!");
          return false;
        }
      }
    }, {
      name: "defense",
      type: "input",
      message: "Defensive Stat (Between 1 - 10)",
      default: 6,
      validate: function (defenseInput) {
        if (!isNaN(defenseInput) && defenseInput >= 1 && defenseInput <= 10) {
          return true;
        } else {
          console.log("Enter a number between 1 - 10!");
          return false;
        }
      }
    }
  ]);
}

// prompt to ask if user wants to make sub
const confirmSubPrompt = () => {
  return inquirer.prompt([
    {
      name: "confirmSub",
      message: "Do you want to make a substitution?",
      type: "confirm",
      default: false
    }
  ]);
}

// prompt to sub starter by picking name
const subStarterPrompt = () => {
  return inquirer.prompt([
    {
      name: "subPlayerName",
      message: "Who do you want to take out of the game?",
      type: "list",
      choices: teamArray
        .filter(player => player.isStarter)
        .map(starter => starter.name)
    }
  ]);
}

teamCreate(0);