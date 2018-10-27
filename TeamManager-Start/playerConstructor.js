function Player(name, position, offense, defense) {
  // player's properties
  this.name = name;
  this.position = position;
  this.offense = offense;
  this.defense = defense;

  // player's methods
  this.goodGame = function() {
    // run coinflip
    const coinflip = Math.floor(Math.random());

    // ternary operator
    // (condition) ? (run if true) : (run if false)
    (coinflip === 0) ? (this.offense++) : (this.defense++)

    /* 
    SAME AS THIS
    if (coinflip === 0) {
      this.offense++;
    }
    else {
      this.defense++;
    } 
    */

  }

  this.badGame = function () {
    // run coinflip
    const coinflip = Math.floor(Math.random());

    // ternary operator
    // (condition) ? (run if true) : (run if false)
    (coinflip === 0) ? (this.offense--) : (this.defense--)

    /* 
    SAME AS THIS
    if (coinflip === 0) {
      this.offense--;
    }
    else {
      this.defense--;
    } 
    */

  }

  this.printStats = function() {
    console.log(`

======= ${this.name.toUpperCase()} =======
Name: ${this.name}
Position: ${this.position}
Offense: ${this.offense}
Defense: ${this.defense}

`);
  }
}

// export Player constructor function
module.exports = Player;