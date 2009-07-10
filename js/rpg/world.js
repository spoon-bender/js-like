/**
 * @namespace Game world
 */
RPG.World = {
	_actions: [],
	_running: false, /* is the engine running? */
	_lock: 0, /* lock level */
	_rounds: 0,
	_map: null,
	_scheduler: null,
	_pc: null
};

/**
 * Event dispatcher, static version
 */
RPG.World.dispatch = OZ.Class().prototype.dispatch;

/**
 * Add new actor
 * @param {RPG.Engine.ActorInterface} actor
 */
RPG.World.addActor = function(actor) {
	this._scheduler.addActor(actor);
}

/**
 * Remove given actor
 * @param {RPG.Engine.ActorInterface} actor
 */
RPG.World.removeActor = function(actor) {
	this._scheduler.removeActor(actor);
}

/**
 * Switch to a new map
 * @param {RPG.Engine.Map} map
 */
RPG.World.setMap = function(map) {
	this._map = map;
	this._scheduler.clearActors();

	var beings = this._map.getBeings();
	for (var i=0;i<beings.length;i++) { /* get all beings in map and assign them to scheduler */
		this.addActor(beings[i]);
	}
	
	RPG.UI.adjust(map);
}

RPG.World.getMap = function() {
	return this._map;
}

RPG.World.getPC = function() {
	return this._pc;
}

RPG.World.setPC = function(being) {
	this._pc = being;
}

/**
 * Enter main loop
 */
RPG.World.run = function() {
	if (this._lock) { return; }
	if (this._running) { return; }
	this._running = true;
	while (1) {
		if (!this._running) { break; }
		this._decide();
	}
}

/**
 * Add an action to be processed
 * @param {RPG.Actions.BaseAction} a
 */
RPG.World.action = function(a) {
	this._actions.push(a);
	this.run(); 
}


/**
 * Pause 
 */
RPG.World.lock = function() {
	this._lock++;
	this._running = false;
}

/**
 * Resume 
 */
RPG.World.unlock = function() {
	this._lock--;
	this.run();
}

/**
 * Number of elapsed game rounds
 */
RPG.World.getRounds = function() {
	return this._rounds;
}

/**
 * Act
 */ 
RPG.World._decide = function() {
	if (this._actions.length) { /* there are actions to process */
		/* get first action */
		var action = this._actions.shift(); 
		/* execute it */
		action.execute();
		/* if this action took some time, our actor's turn is over */
		if (action.tookTime()) { this._clearActor(); }
		/* let everyone know it happened */
		this.dispatch("action", action);
	} else if (!this._actor) { /* no actions and no actor - pick one */
		this._setActor();
	} else { /* no actions, actor selected - he is probably deciding */
		this._running = false;
	}
}

RPG.World._clearActor = function() {
	if (this._actor == this._pc) { 
		RPG.UI.setMode(RPG.UI_LOCKED); 
		this._rounds++;
	}
	this._actor = null;
}

RPG.World._setActor = function() {
	this._actor = this._scheduler.scheduleActor();

	if (this._actor == this._pc) { RPG.UI.setMode(RPG.UI_NORMAL); }
	
	if (this._actor) { 
		this._actor.yourTurn(); 
	} else { /* no actor available */
		this._running = false;
	}
}