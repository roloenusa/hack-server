const names = [
  "Kunal",
  "Timmie",
  "Zach",
  "Kate",
  "Carol",
  "Juan",
  "Shawn",
  "Kenny",
  "Allen",
  "Chris",
  "Calvin"
];

const prefix = [
  "Headmaster",
  "Minister",
  "Lord",
  "Lady",
  "Eminence",
  "Duke",
  "Master",
  "Curator",
  "Guardian",
  "Mage"
]

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function getNames() {
  return shuffle(names.slice(0, names.length-1));
}

function getPrefix() {
  return prefix[Math.floor(Math.random()*prefix.length)]
}

module.exports.getNames = getNames;
module.exports.getPrefix = getPrefix;
