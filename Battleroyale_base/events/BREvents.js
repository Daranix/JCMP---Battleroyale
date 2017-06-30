jcmp.events.Add('battleroyale_updates', function () {

    //console.log("Im working");

    if (battleroyale.game.players.onlobby.length >= battleroyale.config.game.minPlayers && !battleroyale.game.toStart) {
        // Start a new interval
        battleroyale.game.toStart = true;
        battleroyale.utils.broadcastToLobby("The game is going to start in 2 minutes!");

        // Show and start timer and hide left players text on UI

        for(let player of battleroyale.game.players.onlobby) {
            jcmp.events.CallRemote('battleroyale_txt_timerStart', player, true);
            jcmp.events.CallRemote('battleroyale_txt_leftplayers_toggle', player, false);
        }

        battleroyale.game.StartTimer = setTimeout(function () {
            jcmp.events.Call('battleroyale_start_battle');
        }, battleroyale.config.game.timeToStart); // TODO: take the value of the minutes from the configuration file
    }

    if (battleroyale.game.players.onlobby.length < battleroyale.config.game.minPlayers && battleroyale.game.toStart) {
        // Delete timeout

        clearTimeout(battleroyale.game.StartTimer);

        // Hide and reset timer and show left players text on UI for players on the lobby

        for(let player of battleroyale.game.players.onlobby) {
            jcmp.events.CallRemote('battleroyale_txt_timerStart', player, false);
            jcmp.events.CallRemote('battleroyale_txt_leftplayers_toggle', player, true);
        }

        // --

        battleroyale.utils.broadcastToLobby("Need more players to start the game ... ");
        battleroyale.game.toStart = false;
        battleroyale.game.timeToStart = battleroyale.config.game.timeToStart;
    }

    if(battleroyale.game.toStart) {
        battleroyale.game.timeToStart -= 500;
    }


    try { // Possible errors when disconnect meanwhile is calling this
        
        for (let player of jcmp.players) {
            //console.log("Player on game");
            //console.log(player);
            
            // Update health bar
            jcmp.events.CallRemote('battleroyale_healthbar_update', player, JSON.stringify({
                health: player.health,
                maxHealth: 800
            }));

            if (player.ingame) {
                // This check if the player is in the area of the game for all tha players on the game
                if (!battleroyale.utils.IsPointInCircle(player.position, player.battleroyale.game.position, player.battleroyale.game.radius)) {
                    jcmp.events.Call('battleroyale_player_outarea', player);
                } else {

                    if (player.battleroyale.warning) {
                        // TODO: Disable warning for the player from UI

                        // TODO: Put all of this in a event could be a great idea for future changes

                        console.log("Player returned to the area!!!!!!!!!!!!!!!!")

                        player.battleroyale.warning = false;

                        // Timeout

                        if (player.battleroyale.warningTS != null) {
                            //clearTimeout(player.battleroyale.warningTS);
                            battleroyale.workarounds2.deleteTimer(player, player.battleroyale.warningTS)
                            player.battleroyale.warningTS = null;
                        }

                        // Interval

                        if (player.battleroyale.warningINTV != null) {
                            battleroyale.workarounds2.deleteTimer(player, player.battleroyale.warningINTV);
                            player.battleroyale.warningINTV = null;
                        }
                    } // Player has warning end
                } // Player in area end

            } else {
                // Players on lobby
            }



        } // For loop into players

    } catch (e) {
        console.log(e);
    }


});

jcmp.events.Add('battleroyale_start_battle', function () {

    battleroyale.utils.broadcastToLobby("Battle starting! ... ");
    battleroyale.game.toStart = false;
    battleroyale.game.timeToStart = battleroyale.config.game.timeToStart;


    const arenaIndex = battleroyale.utils.random(0, battleroyale.game.arenaList.length - 1);
    const battlePosition = battleroyale.game.arenaList[arenaIndex].position;

    let BRGame = new battleroyale.BRGame(
        battleroyale.game.games.length + 1,
        battlePosition,
        battleroyale.config.game.battle_StartRadius,
        battleroyale.game.players.onlobby
    );

    battleroyale.game.games.push(BRGame);
    BRGame.start();

    //console.log(BRGame);
});

jcmp.events.Add('battleroyale_update_area', function (BRGame) {


    console.log(BRGame);
    const rndIndex = battleroyale.utils.random(0, BRGame.players.length - 1);
    const randomPosition = BRGame.players[rndIndex].position;
    console.log(randomPosition);

    BRGame.position = randomPosition;

    if (BRGame.radius / 2 >= (BRGame.radius / (2 * 5))) {
        BRGame.radius = BRGame.radius / 2;
    } else {
        clearInterval(BRGame.closeArea);
    }

    console.log(BRGame);

});

jcmp.events.Add('battleroyale_end_battle', function (BRGame) {
    console.log("Battle end ID: " + BRGame.id);

    if (BRGame.players.length >= 1) {
        battleroyale.utils.broadcastToLobby("The winner of the battleroyale number" + BRGame.id + " is " + BRGame.players[0].escapedNametagName);
    }

    clearInterval(BRGame.closeArea);

});

jcmp.events.Add('battleroyale_player_leave_game', function (player, destroy) {

    // Destroy on TRUE = No put the player into de lobby again

    const BRGame = player.battleroyale.game;
    BRGame.players.removePlayer(player);
    battleroyale.game.players.ingame.removePlayer(player);

    if (BRGame.players.length <= 1) {
        jcmp.events.Call('battleroyale_end_battle', BRGame);
    }

    if (!destroy) {
        battleroyale.game.players.onlobby.push(player);
        player.battleroyale.ingame = false;
        player.Respawn();
        battleroyale.utils.showLobbyUI(player);
        jcmp.events.Call('battleroyale_update_needPlayers');
    }

});

jcmp.events.Add('battleroyale_player_outarea', function (player) {

    // TODO: Show warning to the player on UI

    if (!player.battleroyale.warning) { // If the played wasn't warned on a first time
        player.battleroyale.warning = true;
        battleroyale.chat.send(player, "Return to the battle zone, if you do not return in 60 seconds you will be considered a deserter!");

        player.battleroyale.warningTS = battleroyale.workarounds2.createTimeout(player, function () {
            player.battleroyale.warningINTV = battleroyale.workarounds2.createInterval(player, function () {
                console.log("Player loosing HP");
                player.health -= 20;
            }, 1000);
        }, 60000);
    }

    console.log(player.name + " is out of the area");
});

jcmp.events.Add('battleroyale_update_needPlayers', function() {
    let needPlayers = battleroyale.config.game.minPlayers - battleroyale.game.players.onlobby.length;
    jcmp.events.CallRemote('battleroyale_txt_needPlayers', null, needPlayers);
});

jcmp.events.AddRemoteCallable('battleroyale_txt_ready', function(player) {

    if(battleroyale.game.toStart) {
        jcmp.events.CallRemote('battleroyale_txt_updateTime', player, battleroyale.game.timeToStart);
        jcmp.events.CallRemote('battleroyale_txt_timeleft_toggle', true);
    } else {
        jcmp.events.CallRemote('battleroyale_txt_leftplayers_toggle', player, true);
    }

    let needPlayers = battleroyale.config.game.minPlayers - battleroyale.game.players.onlobby.length;
    jcmp.events.CallRemote('battleroyale_txt_needPlayers', player, needPlayers);
});