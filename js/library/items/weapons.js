/**
 * @class Generic weapon
 * @augments RPG.Items.BaseItem
 * @augments RPG.Misc.IWeapon
 */
RPG.Items.Weapon = OZ.Class().extend(RPG.Items.BaseItem).implement(RPG.Misc.IWeapon);
RPG.Items.Weapon.factory.ignore = true;
RPG.Items.Weapon.prototype.init = function(hit, damage) {
	this.parent();
	this.setHit(hit);
	this.setDamage(damage);
	this._dualHand = false;
	this._char = ")";
	this._color = "lightgray";
}

RPG.Items.Weapon.prototype.isDualHand = function() {
	return this._dualHand;
}

RPG.Items.Weapon.prototype._describeModifiers = function() {
	var mods = this.parent();
	return "(" + this._hit.toString() + ", " + this._damage.toString() + ")" + (mods ? " "+mods : "");
}

/**
 * @class Dagger
 * @augments RPG.Items.Weapon
 */
RPG.Items.Dagger = OZ.Class().extend(RPG.Items.Weapon)
RPG.Items.Dagger.prototype.init = function() {
	this.parent(new RPG.Misc.RandomValue(4, 1), new RPG.Misc.RandomValue(5, 3));
	this._image = "dagger";
	this._description = "dagger";
}

/**
 * @class Dagger
 * @augments RPG.Items.Weapon
 */
RPG.Items.OrcishDagger = OZ.Class().extend(RPG.Items.Weapon)
RPG.Items.OrcishDagger.prototype.init = function() {
	this.parent(new RPG.Misc.RandomValue(6, 1), new RPG.Misc.RandomValue(5, 3));
	this._image = "orcish-dagger";
	this._description = "orcish dagger";
}

/**
 * @class Club
 * @augments RPG.Items.Weapon
 */
RPG.Items.Club = OZ.Class().extend(RPG.Items.Weapon)
RPG.Items.Club.prototype.init = function() {
	this.parent(new RPG.Misc.RandomValue(4, 1), new RPG.Misc.RandomValue(7, 3));
	this._color = "brown";
	this._image = "club";
	this._description = "club"; 
}

/**
 * @class Short sword
 * @augments RPG.Items.Weapon
 */
RPG.Items.ShortSword = OZ.Class().extend(RPG.Items.Weapon)
RPG.Items.ShortSword.prototype.init = function() {
	this.parent(new RPG.Misc.RandomValue(6, 1), new RPG.Misc.RandomValue(4, 2));
	
	this._color = "darkgray";
	this._image = "short-sword";
	this._description = "short sword"; 
}

/**
 * @class Long sword
 * @augments RPG.Items.Weapon
 */
RPG.Items.LongSword = OZ.Class().extend(RPG.Items.Weapon)
RPG.Items.LongSword.prototype.init = function() {
	this.parent(new RPG.Misc.RandomValue(6, 1), new RPG.Misc.RandomValue(6, 2));
	this._color = "darkgray";
	this._image = "long-sword";
	this._description = "long sword"; 
}

/**
 * @class Axe
 * @augments RPG.Items.Weapon
 */
RPG.Items.Axe = OZ.Class().extend(RPG.Items.Weapon)
RPG.Items.Axe.prototype.init = function() {
	this.parent(new RPG.Misc.RandomValue(6, 1), new RPG.Misc.RandomValue(6, 2));
	this._color = "brown";
	this._image = "axe";
	this._description = "axe"; 
}

/**
 * @class Hammer
 * @augments RPG.Items.Weapon
 */
RPG.Items.Hammer = OZ.Class().extend(RPG.Items.Weapon)
RPG.Items.Hammer.prototype.init = function() {
	this.parent(new RPG.Misc.RandomValue(6, 1), new RPG.Misc.RandomValue(7, 1));
	
	this._color = "darkgray";
	this._image = "hammer";   
	this._description = "hammer"; 
	this._dualHand = true;
}

/**
 * @class Staff
 * @augments RPG.Items.Weapon
 */
RPG.Items.Staff = OZ.Class().extend(RPG.Items.Weapon)
RPG.Items.Staff.prototype.init = function() {
	this.parent(new RPG.Misc.RandomValue(4, 1), new RPG.Misc.RandomValue(4, 2));

	this._color = "brown";
	this._image = "staff";
	this._description = "staff"; 
	this._dualHand = true;
}

/**
 * @class Broom
 * @augments RPG.Items.Weapon
 */
RPG.Items.Broom = OZ.Class().extend(RPG.Items.Weapon)
RPG.Items.Broom.prototype.init = function() {
	this.parent(new RPG.Misc.RandomValue(4, 1), new RPG.Misc.RandomValue(2, 4));
	
	this._color = "brown";
	this._image = "broom";
	this._description = "broom"; 
	this._dualHand = true;
}

/**
 * @class Torch
 * @augments RPG.Items.Weapon
 */
RPG.Items.Torch = OZ.Class().extend(RPG.Items.Weapon)
RPG.Items.Torch.prototype.init = function() {
	this.parent(new RPG.Misc.RandomValue(4, 2), new RPG.Misc.RandomValue(4, 3));
	this._color = "gray";
	this._image = "torch";
	this._description = "torch"; 
	this._descriptionPlural = "torches"; 
	
	this._modifiers[RPG.FEAT_SIGHT_RANGE] = 1;
}

/**
 * @class Klingon Ceremonial Sword
 * @augments RPG.Items.Weapon
 */
RPG.Items.KlingonSword = OZ.Class().extend(RPG.Items.Weapon)
RPG.Items.KlingonSword.factory.ignore = true;
RPG.Items.KlingonSword.prototype.init = function() {
	this.parent(new RPG.Misc.RandomValue(10, 3), new RPG.Misc.RandomValue(10, 3));
	this._modifiers[RPG.FEAT_DV] = 1;
	this._modifiers[RPG.FEAT_PV] = 1;
	this._modifiers[RPG.FEAT_STRENGTH] = 2;
	this._dualHand = true;
	this._color = "gold";
	this._image = "klingon-sword";
	this._description = "Klingon ceremonial sword";
}

/**
 * @class Projectile weapon
 * @augments RPG.Items.Weapon
 * @augments RPG.Misc.IProjectile
 */
RPG.Items.Projectile = OZ.Class()
						.extend(RPG.Items.Weapon)
						.implement(RPG.Misc.IProjectile);
RPG.Items.Projectile.factory.ignore = true;
RPG.Items.Projectile.prototype.init = function(hit, damage) {
	this.parent(hit, damage);
	this._initProjectile();
	this._weapon = null;
	this._baseChar = "";
}

RPG.Items.Projectile.prototype.getHit = function() {
	if (!this._flying) { return this._hit; }
	
	var addedHit = new RPG.Misc.RandomValue(this._owner.getFeat(RPG.FEAT_HIT), 0);
	var launcher = this.getLauncher();
	if (launcher) { addedHit = addedHit.add(launcher.getHit()); }
	
	return this._hit.add(addedHit);
}

RPG.Items.Projectile.prototype.getDamage = function() {
	if (!this._flying) { return this._damage; }
	
	var addedDamage = new RPG.Misc.RandomValue(this._owner.getFeat(RPG.FEAT_DAMAGE), 0);
	var launcher = this.getLauncher();
	if (launcher) { addedDamage = addedDamage.add(launcher.getDamage()); }

	return this._damage.add(addedDamage);
}

RPG.Items.Projectile.prototype.isLaunchable = function() {
	if (!this._weapon) { return true; } /* can be launched as-is */
	var w = this._owner.getSlot(RPG.SLOT_WEAPON).getItem();
	return (w && (w instanceof this._weapon));
}

RPG.Items.Projectile.prototype.getLauncher = function() {
	if (!this._weapon) { return null; }
	return this._owner.getSlot(RPG.SLOT_WEAPON).getItem();
}

RPG.Items.Projectile.prototype.getRange = function() {
	var r = this._range;
	var l = this.getLauncher();
	if (l) { r += l.getRange(); }
	return r;
}

RPG.Items.Projectile.prototype._fly = function() {	
	RPG.UI.map.removeProjectiles();
	RPG.Misc.IProjectile.prototype._fly.call(this);
}

RPG.Items.Projectile.prototype._done = function() {
	this._char = this._baseChar;
	this._image = this._baseImage;

	var coords = this._flight.coords[this._flight.coords.length-1];
	var map = this._owner.getMap();
	var b = map.getBeing(coords);
	var f = map.getFeature(coords);
	var dropPossible = false;
	
	if (b) {
		this._owner.attackRanged(b, this);
	} else {
		if (map.isFree(coords)) { 
			if (RPG.Rules.isProjectileRecovered(this)) {
				map.addItem(this, coords);
				var pc = RPG.Game.pc;
				RPG.UI.map.redrawCoords(coords);
			}
		} else {
			var f = (map.getFeature(coords) || map.getCell(coords));
			var s = RPG.Misc.format("%A hits %a.", this, f);
			RPG.UI.buffer.message(s);
		}
	}

	RPG.Misc.IProjectile.prototype._done.call(this);
}

/**
 * @class Rock
 * @augments RPG.Items.Projectile
 */
RPG.Items.Rock = OZ.Class().extend(RPG.Items.Projectile);
RPG.Items.Rock.prototype.init = function() {
	this.parent(new RPG.Misc.RandomValue(2, 1), new RPG.Misc.RandomValue(2, 1));
	var ch = "*";
	this._baseImage = "rock";
	this._baseChar = ch;
	this._color = "gray";
	for (var dir in RPG.DIR) { 
		this._chars[dir] = ch; 
		this._suffixes[dir] = ""; 
	}
	this._image = this._baseImage;
	this._char = ch;
	this._description = "rock";
}

/**
 * @class Arrow
 * @augments RPG.Items.Projectile
 */
RPG.Items.Arrow = OZ.Class().extend(RPG.Items.Projectile);
RPG.Items.Arrow.factory.method = function(danger) {
	var amount = 10*(1 + Math.round(Math.random() * danger * 1.5));
	return new this(amount);
}
RPG.Items.Arrow.prototype.init = function(amount) {
	this.parent(new RPG.Misc.RandomValue(2, 1), new RPG.Misc.RandomValue(2, 1));
	this._baseImage = "arrow";
	this._baseChar = "/";
	this._char = this._baseChar;
	this._image = this._baseImage;
	this._color = "brown";
	this._description = "arrow";
	this._amount = amount;
	
	this._weapon = RPG.Items.Bow;
}

/**
 * @class Bow
 * @augments RPG.Items.Weapon
 */
RPG.Items.Bow = OZ.Class().extend(RPG.Items.Weapon);
RPG.Items.Bow.factory.ignore = true;
RPG.Items.Bow.prototype.init = function(hit, damage) {
	this.parent(hit, damage);
	this._range = 4;
}

RPG.Items.Bow.prototype.getRange = function() {
	return this._range;
}

/**
 * @class Short bow
 * @augments RPG.Items.Bow
 */
RPG.Items.ShortBow = OZ.Class().extend(RPG.Items.Bow);
RPG.Items.ShortBow.prototype.init = function() {
	this.parent(new RPG.Misc.RandomValue(3, 1), new RPG.Misc.RandomValue(3, 1));
	this._description = "short bow";
	this._char = "}";
	this._image = "short-bow"; 
}

