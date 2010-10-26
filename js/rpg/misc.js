/**
 * @class Random value - generalized throwing dice
 */
RPG.Misc.RandomValue = OZ.Class();
RPG.Misc.RandomValue.prototype.init = function(mean, twosigma) {
	this.mean = mean;
	this.twosigma = twosigma;
}

RPG.Misc.RandomValue.prototype.toString = function() {
	return this.mean + "±" + this.twosigma;
}

/**
 * Roll the dice.
 */
RPG.Misc.RandomValue.prototype.roll = function() {
	var value = Math.round(this.mean + Math.randomNormal(this.twosigma/2));
	return Math.max(0, value);
}

/**
 * Add another random value
 */
RPG.Misc.RandomValue.prototype.add = function(rv) {
	var m = this.mean + rv.mean;
	var ts = Math.sqrt(this.twosigma*this.twosigma + rv.twosigma*rv.twosigma);
	return new this.constructor(m, ts);
}

/**
 * @class Coordinates
 */
RPG.Misc.Coords = OZ.Class();
RPG.Misc.Coords.fromString = function(str) {
	var parts = str.split(",");
	return new this(parseInt(parts[0]), parseInt(parts[1]));
}

RPG.Misc.Coords.prototype.init = function(x, y) {
	this.x = x;
	this.y = y;
	this.id = "";
	this.updateID();
}

RPG.Misc.Coords.prototype.toString = function() {
	return this.x+", "+this.y;
}

RPG.Misc.Coords.prototype.distance = function(coords) {
	var dx = Math.abs(this.x - coords.x);
	var dy = Math.abs(this.y - coords.y);
	return Math.max(dx, dy);
}

RPG.Misc.Coords.prototype.clone = function() {
	return new this.constructor(this.x, this.y);
}

RPG.Misc.Coords.prototype.plus = function(c) {
	this.x += c.x;
	this.y += c.y;
	this.updateID();
	return this;
}

RPG.Misc.Coords.prototype.minus = function(c) {
	this.x -= c.x;
	this.y -= c.y;
	this.updateID();
	return this;
}

RPG.Misc.Coords.prototype.updateID = function() {
	this.id = this.x + "," + this.y;
}

RPG.Misc.Coords.prototype.neighbor = function(dir) {
	return this.clone().plus(RPG.DIR[dir]);
}

/**
 * Direction to another coords
 * @param {RPG.Misc.Coords} c
 * @returns {int}
 */
RPG.Misc.Coords.prototype.dirTo = function(c) {
	if (c.x == this.x && c.y == this.y) { return RPG.CENTER; }
	var diff = c.clone().minus(this);
	for (var i=0;i<8;i++) {
		var dir = RPG.DIR[i];
		if (dir.x == diff.x && dir.y == diff.y) { return i; }
	}
	throw new Error("Cannot compute direction");
}

RPG.DIR[RPG.N] =  new RPG.Misc.Coords( 0, -1);
RPG.DIR[RPG.NE] = new RPG.Misc.Coords( 1, -1);
RPG.DIR[RPG.E] =  new RPG.Misc.Coords( 1,  0);
RPG.DIR[RPG.SE] = new RPG.Misc.Coords( 1,  1);
RPG.DIR[RPG.S] =  new RPG.Misc.Coords( 0,  1);
RPG.DIR[RPG.SW] = new RPG.Misc.Coords(-1,  1);
RPG.DIR[RPG.W] =  new RPG.Misc.Coords(-1,  0);
RPG.DIR[RPG.NW] = new RPG.Misc.Coords(-1, -1);
RPG.DIR[RPG.CENTER] =  new RPG.Misc.Coords( 0,  0);

/**
 * @class Modifier interface: everything that holds feat modifiers have this
 */
RPG.Misc.IModifier = OZ.Class();

/**
 * Return modifier for a given feat
 * @param {int} feat The feat we wish to modify, specified by its constant
 */
RPG.Misc.IModifier.prototype.getModifier = function(feat) {
	return this._modifiers[feat] || 0;
}

/**
 * Return all modified feats
 */
RPG.Misc.IModifier.prototype.getModified = function() {
	var arr = [];
	for (var p in this._modifiers) { arr.push(1*p); } /* 1*p converts to int to comply with RPG.FEAT_* constants */
	return arr;
}

/**
 * @class Weapon interface. Weapon items implement this, as well as some slots and spells.
 */
RPG.Misc.IWeapon = OZ.Class();
RPG.Misc.IWeapon.prototype.setHit = function(rv) {
	this._hit = rv;
}
RPG.Misc.IWeapon.prototype.setDamage = function(rv) {
	this._damage = rv;
}
RPG.Misc.IWeapon.prototype.getHit = function() {
	return this._hit;
}
RPG.Misc.IWeapon.prototype.getDamage = function() {
	return this._damage;
}

/**
 * @class Interface for flying objects
 * @augments RPG.Misc.IWeapon
 */
RPG.Misc.IProjectile = OZ.Class()
						.implement(RPG.Misc.IWeapon);

RPG.Misc.IProjectile.prototype._initProjectile = function() {
	this._range = 5;
	this._flying = false;
	
	this._flight = {
		index: -1,
		coords: [],
		chars: [],
		images: []
	}
	
	this._baseImage = "";

	this._chars = {};
	this._chars[RPG.N]  = "|";
	this._chars[RPG.NE] = "/";
	this._chars[RPG.E]  = "–";
	this._chars[RPG.SE] = "\\";
	this._chars[RPG.S]  = "|";
	this._chars[RPG.SW] = "/";
	this._chars[RPG.W]  = "–";
	this._chars[RPG.NW] = "\\";
	
	this._suffixes = {};
	this._suffixes[RPG.N]  = "n";
	this._suffixes[RPG.NE] = "ne";
	this._suffixes[RPG.E]  = "e";
	this._suffixes[RPG.SE] = "se";
	this._suffixes[RPG.S]  = "s";
	this._suffixes[RPG.SW] = "sw";
	this._suffixes[RPG.W]  = "w";
	this._suffixes[RPG.NW] = "nw";
}

RPG.Misc.IProjectile.prototype.getRange = function() {
	return this._range;
}

/**
 * Launch this projectile
 * @param {RPG.Misc.Coords} source
 * @param {RPG.Misc.Coords} target
 * @param {RPG.Map} map
 */
RPG.Misc.IProjectile.prototype.launch = function(source, target, map) {
	this.computeTrajectory(source, target, map);
	this._flying = true;
	RPG.Game.getEngine().lock();
	var interval = 75;
	this._interval = setInterval(this.bind(this._step), interval);
}

/**
 * Flying...
 * @returns {bool} still in flight?
 */
RPG.Misc.IProjectile.prototype._fly = function() {
	var coords = this._flight.coords[this._flight.index];
	RPG.UI.map.addProjectile(coords, this);
}

/**
 * Preview projectile's planned trajectory
 * @param {RPG.Misc.Coords} source
 * @param {RPG.Misc.Coords} target
 * @param {RPG.Map} map
 */
RPG.Misc.IProjectile.prototype.showTrajectory = function(source, target, map) {
	this.computeTrajectory(source, target, map);
	var pc = RPG.Game.pc;
	
	RPG.UI.map.removeProjectiles();
	for (var i=0;i<this._flight.coords.length;i++) {
		var coords = this._flight.coords[i];
		
		if (!pc.canSee(coords)) { continue; }
		
		var mark = (i+1 == this._flight.coords.length ? RPG.Misc.IProjectile.endMark : RPG.Misc.IProjectile.mark);
		RPG.UI.map.addProjectile(coords, mark);
	}
}

RPG.Misc.IProjectile.prototype._step = function() {
	this._flight.index++;
	var index = this._flight.index;
	
	if (index == this._flight.coords.length) { 
		clearInterval(this._interval); 
		this._done();
		return;
	}
	
	this.setVisual({ch:this._flight.chars[index], image:this._flight.images[index]});
	this._fly(this._flight.coords[index]);
}

RPG.Misc.IProjectile.prototype._done = function() {
	this._flying = false;
	RPG.UI.map.removeProjectiles();
	RPG.Game.getEngine().unlock();
}

/**
 * Precompute trajectory + its visuals. Stop at first non-free coords.
 * @param {RPG.Misc.Coords} source
 * @param {RPG.Misc.Coords} target
 * @param {RPG.Map} map
 */
RPG.Misc.IProjectile.prototype.computeTrajectory = function(source, target, map) {
	this._flight.index = -1;
	this._flight.coords = [];
	this._flight.chars = [];
	this._flight.images = [];

	var coords = map.getCoordsInLine(source, target);
	var max = Math.min(this.getRange()+1, coords.length);

	for (var i=1;i<max;i++) {
		var c = coords[i];
		var prev = coords[i-1];

		this._flight.coords.push(c);
		var dir = prev.dirTo(c);
		this._flight.chars.push(this._chars[dir]);
		var image = this._baseImage;
		if (this._suffixes[dir]) { image += "-" + this._suffixes[dir]; }
		this._flight.images.push(image);

		if (map.blocks(RPG.BLOCKS_MOVEMENT, c)) { break; }
	}
	
	return this._flight;
}

/**
 * @class Projectile mark
 * @augments RPG.Visual.IVisual
 */
RPG.Misc.IProjectile.Mark = OZ.Class().implement(RPG.Visual.IVisual);
RPG.Misc.IProjectile.Mark.prototype.init = function() {
	this.setVisual({ch:"*", color:"white", image:"crosshair"});
}

/**
 * @class Projectile end mark
 * @augments RPG.Visual.IVisual
 */
RPG.Misc.IProjectile.EndMark = OZ.Class().implement(RPG.Visual.IVisual);
RPG.Misc.IProjectile.EndMark.prototype.init = function() {
	this.setVisual({ch:"X", color:"white", image:"crosshair-end"});
}

/**
 * @class Actor interface
 */
RPG.Misc.IActor = OZ.Class();
RPG.Misc.IActor.prototype.getSpeed = function() {};
/**
 * World asks actor to perform an action
 */ 
RPG.Misc.IActor.prototype.yourTurn = function() {
	return RPG.ACTION_TIME;
}

/**
 * @class Dialog interface
 */
RPG.Misc.IDialog = OZ.Class();

RPG.Misc.IDialog.prototype.getDialogText = function(being) {
	return null;
}

RPG.Misc.IDialog.prototype.getDialogSound = function(being) {
	return null;
}

RPG.Misc.IDialog.prototype.getDialogOptions = function(being) {
	return [];
}

/**
 * @returns {bool} Should the conversation continue?
 */
RPG.Misc.IDialog.prototype.advanceDialog = function(optionIndex, being) {
	return false;
}

/**
 * @class Interface for enterable objects (cells, areas, maps)
 * @augments RPG.Misc.IModifier
 */
RPG.Misc.IEnterable = OZ.Class()
						.extend(RPG.Misc.IModifier);

/**
 * Called only when from != this
 * @param {RPG.Beings.BaseBeing} being Someone who just came here
 */
RPG.Misc.IEnterable.prototype.entering = function(being) {
	being.addModifiers(this);
};

/**
 * Called only when to != this
 * @param {RPG.Beings.BaseBeing} being Someone who is just leaving
 */
RPG.Misc.IEnterable.prototype.leaving = function(being) {
	being.removeModifiers(this);
};

/**
 * @class Generic object factory
 */ 
RPG.Misc.Factory = OZ.Class();
RPG.Misc.Factory.prototype.init = function() {
	this._classList = [];
}
RPG.Misc.Factory.prototype.add = function(ancestor) {
	for (var i=0;i<OZ.Class.all.length;i++) {
		var ctor = OZ.Class.all[i];
		if (ctor.factory.ignore) { continue; }
		if (this._hasAncestor(ctor, ancestor)) { 
			this._classList.push(ctor); 
		}
	}
	return this;
}

/**
 * Return a random class
 */ 
RPG.Misc.Factory.prototype.getClass = function(danger) {
	var len = this._classList.length;
	if (len == 0) { throw new Error("No available classes"); }

	var avail = [];
	var total = 0;
	
	for (var i=0;i<this._classList.length;i++) {
		ctor = this._classList[i];
		if (ctor.factory.danger > danger) { continue; } 
		total += ctor.factory.frequency;
		avail.push(ctor);
	}
	var random = Math.floor(Math.random()*total);
	
	var sub = 0;
	var ctor = null;
	for (var i=0;i<avail.length;i++) {
		ctor = avail[i];
		sub += ctor.factory.frequency;
		if (random < sub) { return ctor; }
	}
}

/**
 * Return a random instance
 */ 
RPG.Misc.Factory.prototype.getInstance = function(danger) {
	var ctor = this.getClass(danger);
	if (ctor.factory.method) {
		return ctor.factory.method.call(ctor, danger);
	} else {
		return new ctor(); 
	}
}

RPG.Misc.Factory.prototype._hasAncestor = function(ctor, ancestor) {
	var current = ctor;
	while (current) {
		if (current == ancestor) { return true; }
		current = current._extend;
	}
	return false;
}

/**
 * @class
 */
RPG.Misc.CellFactory = OZ.Class();
RPG.Misc.CellFactory.prototype.init = function() {
	this._instances = [];
}

RPG.Misc.CellFactory.prototype.get = function(ctor) {
	for (var i=0;i<this._instances.length;i++) {
		var inst = this._instances[i];
		if (inst.constructor == ctor) { return inst; }
	}
	var inst = new ctor();
	this._instances.push(inst);
	return inst;
}

/**
 * @class Speed-based scheduler
 */
RPG.Misc.Scheduler = OZ.Class();
RPG.Misc.Scheduler.prototype.init = function() {
	this._actors = [];
	this._current = [];
	this._maxSpeed = 0;
}

RPG.Misc.Scheduler.prototype.toJSON = function(handler) {
	var current = [];
	for (var i=0;i<this._current.length;i++) {
		current.push(this._actors.indexOf(this._current[i]));
	}
	
	return handler.toJSON(this, {
		exclude:["_current"], 
		include:{"_current": current}
	});
}

RPG.Misc.Scheduler.prototype.revive = function() {
	for (var i=0;i<this._current.length;i++) {
		this._current[i] = this._actors[this._current[i]];
	}
}


RPG.Misc.Scheduler.prototype.addActor = function(actor) {
	var o = {
		actor: actor,
		bucket: 0,
		speed: 0
	}
	this._actors.push(o);
	return this;
}

RPG.Misc.Scheduler.prototype.clearActors = function() {
	this._actors = [];
	this._current = [];
	return this;
}

RPG.Misc.Scheduler.prototype.removeActor = function(actor) {
	var a = null;
	for (var i=0;i<this._actors.length;i++) {
		a = this._actors[i];
		if (a.actor == actor) { 
			this._actors.splice(i, 1); 
			break;
		}
	}
	
	var index = this._current.indexOf(a);
	if (index != -1) { this._current.splice(index, 1); }

	return this;
}

RPG.Misc.Scheduler.prototype.scheduleActor = function() {
	if (!this._actors.length) { return null; }

	/* if there is a set of pre-scheduled actors */
	if (this._current.length) {
		var a = this._current.shift();
		a.bucket -= this._maxSpeed;
		return a.actor;
	}
	
	/* update speeds */
	this._maxSpeed = 0;
	for (var i=0;i<this._actors.length;i++) {
		var obj = this._actors[i];
		obj.speed = obj.actor.getSpeed();
		if (obj.speed > this._maxSpeed) { this._maxSpeed = obj.speed; }
	}
	
	/* increase buckets and determine those eligible for a turn */
	do {
		for (var i=0;i<this._actors.length;i++) {
			var obj = this._actors[i];
			obj.bucket += obj.speed;
			if (obj.bucket >= this._maxSpeed) { this._current.push(obj); }
		}
	}  while (!this._current.length);
	
	/* sort eligible actors by their buckets */
	var actors = this._actors;
	this._current.sort(function(a,b) {
		return b.bucket - a.bucket;
	});
	
	/* recurse */
	return arguments.callee.apply(this, arguments);
	
}

/**
 * Format a string in a printf-like fashion
 * @param {string} formatStr Formatting string to be substituted
 */
RPG.Misc.format = function(formatStr) {
	var args = arguments;
	var index = 0;
	return formatStr.replace(/%([a-zA-Z]+)/g, function(match, what) {
		if (index+1 < args.length) { index++; }
		var obj = args[index];
		var str = what;
		switch (what.toLowerCase()) {
			case "a": str = obj.describeA(); break;
			case "the": str = obj.describeThe(); break;
			case "d": str = obj.describe(); break;
			case "he": str = obj.describeHe(); break;
			case "him": str = obj.describeHim(); break;
			case "his": str = obj.describeHis(); break;
			case "is": str = obj.describeIs(); break;
			case "s": str = obj; break;
		}
		
		if (what.charAt(0) != what.charAt(0).toLowerCase()) { str = str.capitalize(); }
		return str;
	});
}

RPG.Misc.verb = function(verb, who) {
	return (who == RPG.Game.pc ? verb : verb+"s");
}

