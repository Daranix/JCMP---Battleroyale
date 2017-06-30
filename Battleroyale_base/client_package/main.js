
// HEALTHBAR ---

var healthBarUI = new WebUIWindow("Battleroyale Healthbar", "package://battleroyale/ui/healthbar.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
healthBarUI.autoResize = true;

jcmp.events.AddRemoteCallable('battleroyale_healthbar_update', function(data) {
    jcmp.ui.CallEvent('battleroyale_healthbar_update', data);
});

// INFO TEXT ---

var infoTextUI = new WebUIWindow("Battleroyale screen text", "package://battleroyale/ui/inscreenText.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
infoTextUI.autoResize = true;

jcmp.events.AddRemoteCallable('battleroyale_txt_leftplayers_toggle', function(status) {
    jcmp.ui.CallEvent('battleroyale_txt_leftplayers_toggle', status);
});

jcmp.events.AddRemoteCallable('battleroyale_txt_timeleft_toggle', function(status) {
    jcmp.ui.CallEvent('battleroyale_txt_timeleft_toggle', status);
    
});

jcmp.events.AddRemoteCallable('battleroyale_txt_timerStart', function(start) {
    jcmp.ui.CallEvent('battleroyale_txt_timerStart', start);
})

jcmp.events.AddRemoteCallable('battleroyale_txt_needPlayers', function(need) {
    jcmp.ui.CallEvent('battleroyale_txt_needPlayers', need);
});

jcmp.events.AddRemoteCallable('battleroyale_txt_updateTime', function(ms) {
    jcmp.ui.CallEvent('battleroyale_txt_updateTime', ms);
});

jcmp.ui.AddEvent('battleroyale_txt_ready', function() {
    jcmp.events.CallRemote('battleroyale_txt_ready');
});

// DEATH UI ---

var deathUI = new WebUIWindow("Battleroyale deathui", "package://battleroyale/ui/deathui.html", new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
deathUI.autoResize = true;

jcmp.events.AddRemoteCallable('battleroyale_deathui_show', function(killerName) {
    jcmp.ui.CallEvent('battleroyale_deathui_show', killerName);
});