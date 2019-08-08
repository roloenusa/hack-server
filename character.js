const gameData = require('./game-data.js');

module.exports = class Character {
    constructor(name, id, icon, strength, weakness, element) {
        //Clone the base stats into a stats property
        this.id = id;
        this.lastAttack = 0;
        this.lastHealthTick = 0;
        this.stats = Object.assign({}, gameData.basestats);
        this.element = element;
        this.name = name;
        this.icon = icon;

        //Apply the effects to the character's stats
        this.strength = strength;
        this.weakness = weakness;
        this.applyEffect(strength);
        this.applyEffect(weakness);

        this.totals = {
            dmg: 0,
        };

        //Set the actual hp from the maxhp
        //This is the actual life of the character
        this.hp = this.stats.maxhp;

        if(this.hp > 0) this.alive = true;
    }

    //Given an effect, we will modify the character stats.
    //property - the property that is affected
    //amount   - How much in percentage
    //multiply - if set then the property will be increased by the percentage of the current value
    //           if not set then the amount will simply be added to the property value             
    applyEffect(effectData) {
        const effect = effectData.effect;
        let statAmount = this.stats[effect.property];
        if(effect.multiply){
           statAmount += this._percentOf(effect.amount, statAmount);
        } else {
           statAmount += effect.amount;
        }
        //Ensure we never use a minus value
        this.stats[effect.property] = Math.max(0, statAmount );
    }

    sendAttack(enemy){
        let dmg = this.stats.dmg;

        //TODO: calculate element amplification
        
        //Caculate crit chance and crit damage
        const didCrit = this._getChance(this.stats.critrate);
        if(didCrit) dmg += this._percentOf(this.stats.critdmg, dmg);

        const adjustedAttack = enemy.receiveAttack({ from: this, dmg: dmg, didCrit: didCrit });

        if(!adjustedAttack.didEvade) {
            //increase hp for any life steal which is calculated after damage reduction
            this.hp += this._percentOf(this.stats.lifesteal, adjustedAttack.dmg);
        }

        this.totals.dm += adjustedAttack.dmg;
        return adjustedAttack;
    }

    //Decides how much damage to actually take from an attack
    receiveAttack(attack) {
        const enemy = attack.from;
        let dmg = attack.dmg;
        let originalDmg = dmg;

        //Reduce the damage ensuring to amplify the original dmg amount
        dmg += this._percentOf(this.stats.dmgreduction, originalDmg);

        //Amplify the damage ensuring to amplify the original dmg amount
        dmg += this._percentOf(this.stats.amplify, originalDmg);

        //No evading damage reflection
        const didEvade = !attack.reflect && this._getChance(this.stats.evasion);

        //caclulate damage reflection
        const reflect = this._percentOf(this.stats.reflect, dmg);
        let reflected = 0;

        //Reflect the damage to the attacker as long as this is not a reflected attack
        if(reflect > 0 && !attack.reflect) {
            reflected = reflect;
            enemy.receiveAttack({from: this, dmg: reflect, reflect: true, didCrit: false});
        }

        //Damage reduction
        dmg -= this._percentOf(this.stats.dmgreduction, dmg);

        //Reduce hp if this wasn't evaded
        if(!didEvade) this.hp -= dmg;

        if(this.hp <= 0) {
          this.hp = 0;
          this.alive = false;
        } 

        return { type: 'atk', from: enemy.id, to: this.id, didEvade: didEvade, dmg: dmg, reflected: reflected }
    }

    //give a percent and an amount returns a percent of that number
    _percentOf(percent, amount){
        if(percent === 0 || amount === 0) return 0;
        return percent / 100 * amount;
    }

    //given a percent, returns true or false to indicate a chance happening
    //example _getChance(20) will return true 20% of the time
    _getChance(percent) {
        if(percent >= 100) return true;
        if(percent <= 0) return false;
        const rand = Math.random() * 100;
        return percent < rand;
    }

    //Returns a random element from a provided array
    _randomElement(list){
        return list[Math.floor(Math.random()*list.length)];
    }

    //Calling tick at an interval will run attacks and life cycle for the character
    //tick returns any attack instances.
    _tick(enemies, milliseconds) {
        const events = [];
        this.lastAttack += milliseconds;
        this.lastHealthTick += milliseconds;

        //Check if we should attack
        if(this.lastAttack >= this.stats.atkspd) {
            this.lastAttack = 0;
            const enemy = this._randomElement(enemies);
            events.push(this.sendAttack(enemy));
        }

        //Check if we should regen or bleed
        if(this.lastHealthTick >= 1000) {
            const bleed = this._percentOf(this.stats.bleed, this.stats.maxhp);
            const regen = this._percentOf(this.stats.regen, this.stats.maxhp);

            const healthTick = regen - bleed;
            this.hp += healthTick;
        }

        return events;
    }

};
