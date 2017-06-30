'use strict';

module.exports = ({ Command, manager }) => {
  manager.category('debug', 'commands for debug purposes')
  
  .add(new Command('startbattle').description('Start a battle').handler(function(player) {

    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not allowed to use this command");
    }
    jcmp.events.Call('battleroyale_start_battle');
    battleroyale.chat.send(player, "Battle Start");

  }))

  .add(new Command('gotolobby').description('Teleport the player to the lobby').handler(function(player) {

    if(!battleroyale.utils.isAdmin(player)) {
      return battleroyale.chat.send(player, "You're not allowed to use this command!");
    }

    player.position = battleroyale.config.game.lobby.pos;
    battleroyale.chat.send(player, "You've teleported to the lobby position");

  }))

  .add(new Command('showmyinfo').description('Shows player object to the console').handler(function(player) {
    console.log(player);
  }))

  .add(new Command('distancetogame').description('Shows the distance to the game').handler(function(player) {
    battleroyale.chat.send(player, battleroyale.utils.GetDistanceBetweenPointsXY(player.position, player.battleroyale.game.position))
  }))

  .add(new Command('timertype').description('testing the workaround2').handler(function(player) {
    /*var timer = setTimeout(function() {}, 60000);
    console.log(timer);*/

    var timer = battleroyale.workarounds2.createInterval(player, function() {
      console.log("Prueba");
    }, 10000);

    console.log(timer);

    battleroyale.workarounds2.deleteTimer(player, timer);

  }))

  .add(new Command('setx').parameter('z','number','Z axis').handler(function(player, x) {
    console.log(player.position);
    player.position = new Vector3f(x,player.position.y, player.position.z);
    console.log(player.position);
  }))

  .add(new Command('playerscacheshow').handler(function(player) {
    jcmp.events.CallRemote('battleroyale_cachelist', player);
  }))

  .add(new Command('getrotandpos').handler(function(player) {
    console.log(player.position);
    console.log(player.rotation);
  }))

  .add(new Command('setminplayers').parameter('minplayers', 'number', 'minplayers').handler(function(player, minplayers) {
      battleroyale.config.game.minPlayers = minplayers;
      battleroyale.chat.send(player, 'Min players set to ' + battleroyale.config.game.minPlayers);
  }))

}
