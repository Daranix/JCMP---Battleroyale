'use strict';

module.exports = class BRGame {
  constructor(id, position, radius, players) {
    this.id = id;
    this.position = position;
    this.radius = radius;
    this.players = players;
    this.aliveStarted = players.length;
    /*this.playerSpawnPoints = psp;
    this.barrelSpawnPoints = wsp;*/

  }

  start() {

    battleroyale.game.players.onlobby = [];
    
    for(let player of this.players) {

      jcmp.events.CallRemote('battleroyale_txt_timerStart', player, false);
      jcmp.events.CallRemote('battleroyale_txt_leftplayers_toggle', false);

      player.battleroyale.game = this;
      player.battleroyale.ingame = true;
      
      player.dimension = this.id;
      player.position = battleroyale.utils.randomSpawn(this.position, this.radius / 2);
    }

    battleroyale.game.players.ingame.push(...this.players);

    console.log(battleroyale.game.players.ingame);

    // TODO: Close more faster the area depending of the time elapsed in the game
    const time = battleroyale.utils.MinToMs(2);
    let self = this;
    this.closeArea = setInterval(function() {
      jcmp.events.Call('battleroyale_update_area', self);
    }, time);

  }

  broadcast(msg, color) {
    for(let player of this.players) {
      battleroyale.chat.send(player, msg, color);
    }
  }


}
