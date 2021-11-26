var rug = require('random-username-generator');
console.log(rug)
rug.setNames(['heart', 'spade', 'diamond', 'clover']);
// rug.setAdjectives(['new adjective']);
rug.setSeperator('_');
 
function generateUsername () {
}

  var new_username = rug.generate();
console.log(new_username)