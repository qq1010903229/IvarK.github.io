function getTickspeedBoostRequirement(bulk = 1) {
	let resets = player.tickspeedBoosts + bulk - 1
	let mult = 5
	if (player.currentChallenge != "postcngmm_1" && player.currentChallenge != "postc1") {
		if (hasGalUpg(34)) mult = 4
		if (player.infinityUpgrades.includes("postinfi52")) mult = 3
	}
	if (aarMod.newGame4MinusRespeccedVersion){
		  let amount = 30+10*resets;
		  
		  if (hasGalUpg(34)) {
			amount = 30+9*resets;
		  }
		  let prefix = ""
		  
		  if(resets>=getNGM4RTBScaling1()){
			  prefix = "Distant ";
			  amount += (resets-getNGM4RTBScaling1())*(resets-getNGM4RTBScaling1()+1);
		  }
		  
		  if(resets>=getNGM4RTBScaling2()){
			  prefix = "Further ";
			  amount += (resets-getNGM4RTBScaling2())*(resets-getNGM4RTBScaling2()+1)*4;
		  }
		  
		  if(resets>=getNGM4RTBScaling3()){
			  prefix = "Remote ";
			  amount = amount * Math.pow(1.002,resets-getNGM4RTBScaling3()+1);
		  }
		return {tier: 8, amount: amount, prefix: prefix}
	}
	return {tier: inNC(4) || player.pSac != undefined ? 6 : 8, amount: resets * mult + (inNC(15) && tmp.ngmX > 3 ? 10 : 30), mult: mult}
}

function tickspeedBoost(bulk) {
	player.tickspeedBoosts += bulk
	if(hasAch("r51") && aarMod.newGame4MinusRespeccedVersion){
		player.tickBoughtThisInf = updateTBTIonGalaxy()
		return;
	}
	if (!hasAch("r27") || player.tickspeedBoosts > (inNGM(5) ? 4 * player.galaxies : 5 * player.galaxies - 8)) player.tdBoosts = resetTDBoosts()
	softReset(hasAch("r27") && (inNGM(5) ? 4 * player.galaxies : 5 * player.galaxies - 8) > player.tickspeedBoosts ? 0 : -player.resets, true)
	player.tickBoughtThisInf = updateTBTIonGalaxy()
}

function resetTickspeedBoosts() {
	if (player.tickspeedBoosts != undefined) return 0
}

//v2.1
function getProductBoughtMult() {
	let mult = 1
	if (player.tickspeedBoosts != undefined && !aarMod.newGame4MinusRespeccedVersion) {
		mult = hasGalUpg(24) && player.currentChallenge != "postcngm3_4" ? galMults.u24() : 0.2
		if (inNC(13) || player.currentChallenge == "postc1") mult = Decimal.div(mult, 2)
	}
	return mult
}

function isTickspeedBoostPossible() {
	if (player.tickspeedBoosts == undefined) return
	if (inNC(5) || player.currentChallenge == "postcngm3_3") return
	if (tmp.ri) return
	return player.resets > 4 || player.tickspeedBoosts > 0 || player.galaxies > 0 || player.galacticSacrifice.times > 0 || player.infinitied > 0 || player.eternities != 0 || quantumed
}

el("challenge15").onclick = function () {
	startNormalChallenge(15)
}

el("buyerBtnTickspeedBoost").onclick = function () {
	buyAutobuyer(13);
}

function autoTickspeedBoostBoolean() {
	var req = getTickspeedBoostRequirement()
	var amount = getAmount(req.tier)
	if (!isTickspeedBoostPossible()) return false
	if (!player.autobuyers[13].isOn) return false
	if (player.autobuyers[13].ticks * 100 < player.autobuyers[13].interval) return false
	if (amount < req.amount) return false
	if (tmp.ngmX > 3 && inNC(14)) return false
	if (amount < getTickspeedBoostRequirement(player.autobuyers[13].bulk).amount) return false
	if (player.overXGalaxiesTickspeedBoost <= player.galaxies) return true
	if (player.autobuyers[13].priority < req.amount) return false
	return true
}

//v2.2
function manualTickspeedBoost() {
	if (!isTickspeedBoostPossible()) return
	if (cantReset()) return
	let req=getTickspeedBoostRequirement()
	let amount=getAmount(req.tier)
	if (!(amount >= req.amount)) return
	if ((player.infinityUpgrades.includes("bulkBoost") || hasAch("r28")) && (!inNC(14) || tmp.ngmX <= 3)) tickspeedBoost(doBulkSpent(getAmount(getTickspeedBoostRequirement(1).tier), function(x){return getTickspeedBoostRequirement(x+1).amount}, 0, true, 1/0).toBuy)
	else tickspeedBoost(1)
	if (inNGM(5)) giveAchievement("TICK OVERDRIVE")
	if (aarMod.newGame4MinusRespeccedVersion) giveAchievement("Fake News")
}

//v3.2
function divideTickspeedIC5() {
	if (player.currentChallenge != "postc5" || player.tickspeedBoosts == undefined) return
	player.tickspeed = player.tickspeed.div(Decimal.pow(2, Math.pow(player.tickspeedBoosts, 1.5)))
}

function getInitPostC3Power(){
	if(aarMod.newGame4MinusRespeccedVersion)return 0;
	var ic3Power = 0
	if (player.tickspeedBoosts != undefined && player.currentChallenge != "postc5") {
		let mult = 30
		if ((inNC(14) && tmp.ngmX == 3) || player.currentChallenge == "postcngm3_3") mult = 20
		else if (hasGalUpg(14)) mult = 32
		if (inNC(6, 2)) mult *= Math.min(player.galaxies / 30, 1)
		let ic3PowerTB = player.tickspeedBoosts * mult
		let softCapStart = 1024
		let frac = 8
		if (player.currentChallenge=="postcngm3_1" || player.currentChallenge=="postc1") softCapStart = 0
		if (player.challenges.includes("postcngm3_1")) frac = 7
		if (ic3PowerTB > softCapStart) ic3PowerTB = Math.sqrt((ic3PowerTB - softCapStart) / frac + 1024) * 32 + softCapStart - 1024
		if (inNC(15) || player.currentChallenge == "postc1" || player.currentChallenge == "postcngm3_3") ic3PowerTB *= tmp.ngmX > 3 ? .2 : Math.max(player.galacticSacrifice.galaxyPoints.div(1e3).add(1).log(8),1)
		else if (player.challenges.includes("postcngm3_3")) ic3PowerTB *= Math.max(Math.sqrt(player.galacticSacrifice.galaxyPoints.max(1).log10()) / 15 + .6, 1)
		if (hasAch("r67")) {
			let x = tmp.cp
			if (x > 4) x = Math.sqrt(x - 1) + 2
			ic3PowerTB *= x * .15 + 1
		}
		ic3Power += ic3PowerTB
	}
	if ((inNC(15) || player.currentChallenge == "postc1" || player.currentChallenge == "postcngm3_3") && tmp.ngmX > 3) ic3Power -= (player.resets + player.tdBoosts) * 10
	return ic3Power
}

function getNGM4RTBPower(){
	if (inNC(16) && aarMod.newGame4MinusRespeccedVersion)return 0;
	return Math.pow(player.tickspeedBoosts,0.9)*100;
}

function getNGM4RTBScaling1(){
	if(player.currentChallenge === "postcngm3_1")return 0;
	let ret=20;
	if(player.challenges.includes("postcngm3_1"))ret = ret + 10;
	return ret;
}

function getNGM4RTBScaling2(){
	let ret=50;
	if(player.challenges.includes("postc7"))ret = ret + 10;
	return ret;
}

function getNGM4RTBScaling3(){
	let ret=100;
	return ret;
}