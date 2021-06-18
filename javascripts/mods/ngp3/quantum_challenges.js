var QCs = {
	setup() {
		QCs_save = {
			in: [],
			comps: 0,
			best: {}
		}
		return QCs_save
	},
	compile() {
		QCs_save = undefined
		if (!tmp.ngp3 || tmp.qu === undefined) return

		let data = tmp.qu.qc
		if (data === undefined) data = this.setup()
		QCs_save = data

		if (QCs_save.qc1 === undefined) this.reset()
		this.updateTmp()
		this.updateDisp()
	},
	reset() {
		QCs_save.qc1 = {boosts: 0, max: 0}
		QCs_save.qc2 = [0, 0]
		QCs_save.qc3 = undefined
		QCs_save.qc4 = undefined
		QCs_save.qc5 = 0
		QCs_save.qc6 = new Decimal(1) //Best-in-this-quantum replicantis
		QCs_save.qc7 = 0
		QCs_save.qc8 = undefined //Same as QC5
	},
	data: {
		max: 8,
		1: {
			unl: () => true,
			desc: () => "There are Replicated Compressors instead of Replicated Galaxies, and Mastery Study cost multipliers are higher.",
			goal: () => false,
			goalDisp: () => "(partly implemented)",
			goalMA: new Decimal("1e355"),
			rewardDesc: (x) => "You can keep Replicated Compressors.",
			rewardEff(str) {
				return 0.1
			},

			updateTmp() {
				delete QCs_tmp.qc1
				if (!QCs.in(1) && !QCs.done(1)) return

				let boosts = QCs_save.qc1.boosts
				let maxBoosts = QCs_save.qc1.max

				let data = {
					req: new Decimal("1e500000"),
					limit: new Decimal("1e10000000"),

					speedMult: Decimal.pow(2, -boosts / 4),
					scalingMult: 1 / (1 + maxBoosts / 40),
					scalingExp: 1 / Math.min(1 + boosts / 20, 2),

					effMult: 1 + maxBoosts / 40,
					effExp: Math.min(1 + boosts / 20, 2)
				}
				QCs_tmp.qc1 = data

				if (QCs.in(1)) {
					data.req = data.req.pow(0.01)
					data.limit = data.limit.pow(0.02)
					data.speedMult = data.speedMult.times(0.01)
				}

				let qc5 = QCs_tmp.qc5
				if (qc5) {
					data.limit = data.limit.pow(qc5.mult)
					data.speedMult = data.speedMult.pow(1 / qc5.mult)
				}
			},
			convert(x) {
				if (!QCs_tmp.qc1) return x
				let div = Math.log10(Number.MAX_VALUE) / Math.log10(1.01)
				x = Decimal.pow(10, Math.pow(x.log10() / div, QCs_tmp.qc1.effExp) * div * QCs_tmp.qc1.effMult).max(x)
				return x
			},

			can: () => QCs_tmp.qc1 && pH.can("eternity") && player.replicanti.amount.gte(QCs_tmp.qc1.req) && QCs_save.qc1.boosts < 20,
			boost() {
				if (!QCs.data[1].can()) return false

				QCs_save.qc1.boosts++
				player.replicanti.amount = Decimal.pow(10, Math.pow(player.replicanti.amount.log10(), 0.9))
				eternity(true)
				return true
			}
		},
		2: {
			unl: () => true,
			desc: () => "There is a limit on every Positronic Boost level.",
			goal: () => false,
			goalDisp: () => "(not implemented)",
			goalMA: new Decimal(1),
			rewardDesc: (x) => "Color charge multiplies color powers instead, at a really reduced rate. (not implemented)",
			rewardEff(str) {
				return 1
			}
		},
		3: {
			unl: () => true,
			desc: () => "There are only Meta Dimensions, but they also produce antimatter. Unlock a new set of Mastery Studies.",
			goal: () => false,
			goalDisp: () => "(partly implemented)",
			goalMA: new Decimal(1),
			rewardDesc: (x) => "You can keep that new set of Mastery Studies.",
			rewardEff(str) {
				return 1
			}
		},
		4: {
			unl: () => true,
			desc: () => "You must exclude one type of galaxy for non-dilation and dilation runs. Changing the exclusion requires a forced Eternity reset.",
			goal: () => false,
			goalDisp: () => "(not implemented)",
			goalMA: new Decimal(1),
			rewardDesc: (x) => "Dilated time timelapses Replicantis by 1 second per OoM.",
			rewardEff(str) {
				return
			}
		},
		5: {
			unl: () => true,
			desc: () => "Replicantis only produces Replicanti Energy, but you can’t gain Quantum Energy normally.",
			goal: () => false,
			goalDisp: () => "(not implemented)",
			goalMA: new Decimal(1),
			rewardDesc: (x) => "Replicated Galaxies contribute to Positronic Charge. (not implemented)",
			rewardEff(str) {
				return 1
			},

			updateTmp() {
				delete QCs_tmp.qc5
				if (!QCs.in(5) && !QCs.done(5)) return

				QCs_tmp.qc5 = {
					req: new Decimal(1),
					mult: QCs_save.qc5 / 4 + 1
				}
				QCs_tmp.qc5.req = QCs_tmp.qc5.req.pow(Math.sqrt(QCs_tmp.qc5.mult))
			},

			can: () => QCs_tmp.qc5 && pH.can("eternity") && player.replicanti.amount.gt(1) && player.replicanti.amount.lt(QCs_tmp.qc5.req),
			boost() {
				if (!QCs.data[5].can()) return false

				QCs_save.qc5++
				player.replicanti.amount = player.replicanti.amount.pow(1.25)
				eternity(true)
				return true
			}
		},
		6: {
			unl: () => true,
			desc: () => "Replicantis divide Dimensions instead, but each Replicated Galaxy divides the amount instead.",
			goal: () => false,
			goalDisp: () => "(not implemented)",
			goalMA: new Decimal(1),
			rewardDesc: (x) => "Replicanti Energy contributes to Positrons. (not implemented)",
			rewardEff(str) {
				return str
			}
		},
		7: {
			unl: () => true,
			desc: () => "Dilation gets more severe as you dilate time more.",
			goal: () => false,
			goalDisp: () => "(not implemented)",
			goalMA: new Decimal(1),
			rewardDesc: (x) => "The 3rd rebuyable dilation upgrade is 10% stronger, and unlock Paired Challenges.",
			rewardEff(str) {
				return 1
			}
		},
		8: {
			unl: () => true,
			desc: () => "QC4, but you can't change the exclusion.",
			goal: () => false,
			goalDisp: () => "(not implemented)",
			goalMA: new Decimal(1),
			rewardDesc: (x) => "???",
			rewardEff(str) {
				return 1
			}
		},
	},

	updateTmp() {
		let data = { unl: [], in: [], rewards: {} }
		QCs_tmp = data

		if (!this.unl()) return
		for (let x = 1; x <= this.data.max; x++) {
			if (this.data[x].unl()) {
				if (this.save.in.includes(x)) data.in.push(x)
				data.unl.push(x)
				if (!this.done(x)) break
			}
		}

		this.updateTmpOnTick()
	},
	updateTmpOnTick() {
		if (!this.unl()) return
		
		let data = QCs_tmp
		for (let x = this.data.max; x; x--) {
			if (data.unl.includes(x)) {
				data.rewards[x] = this.data[x].rewardEff(1)
			}
			if (this.data[x].updateTmp) this.data[x].updateTmp()
		}
	},

	unl() {
		return tmp.quActive && hasMTS("d8") && this.save !== undefined
	},
	in(x) {
		return QCs_tmp.in.includes(x)
	},
	inAny() {
		return QCs_tmp.in.length >= 1
	},
	done(x) {
		return this.unl() && this.save.comps >= x
	},
	isRewardOn(x) {
		return this.done(x) && QCs_tmp.rewards[x]
	},
	getGoal() {
		return QCs_tmp.in.length >= 2 ? true : this.data[QCs_tmp.in[0]].goal()
	},
	getGoalDisp() {
		return QCs_tmp.in.length >= 2 ? "" : " and " + this.data[QCs_tmp.in[0]].goalDisp()
	},
	getGoalMA() {
		return this.data[QCs_tmp.in[0]].goalMA
	},

	tp() {
		showTab("challenges")
		showChallengesTab("quantumchallenges")
	},
	start(x) {
		quantum(false, true, x)
	},

	setupDiv() {
		if (this.divInserted) return

		let html = ""
		for (let x = 1; x <= this.data.max; x++) html += (x % 2 == 1 ? "<tr>" : "") + this.divTemp(x) + ((x + 1) % 2 == 1 ? "</tr>" : "")
		getEl("qcs_div").innerHTML = html

		this.divInserted = true
	},
	divTemp: (x) =>
		'<td><div class="quantumchallengediv" id="qc_' + x + '_div">' +
		'<span id="qc_' + x + '_desc"></span><br><br>' +
		'<div class="outer"><button id="qc_' + x + '_btn" class="challengesbtn" onclick="this.start(' + x + ')">Start</button><br>' +
		'Goal: <span id="qc_' + x + '_goal"></span><br>' +
		'Reward: <span id="qc_' + x + '_reward"></span>' +
		'</div></div></td>',
	divInserted: false,

	updateDisp() {
		//In Quantum Challenges
		getEl("repCompress").style.display = QCs_tmp.qc1 ? "" : "none"
		getEl("repExpand").style.display = QCs_tmp.qc5 ? "" : "none"

		//Quantum Challenges
		let unl = this.divInserted && this.unl()
		if (!unl) return

		for (let qc = 1; qc <= this.data.max; qc++) {
			var cUnl = QCs_tmp.unl.includes(qc)

			getEl("qc_" + qc + "_div").style.display = cUnl ? "" : "none"
			if (cUnl) {
				getEl("qc_" + qc + "_desc").textContent = this.data[qc].desc()
				getEl("qc_" + qc + "_goal").textContent = shorten(this.data[qc].goalMA) + " meta-antimatter and " + this.data[qc].goalDisp()
				getEl("qc_" + qc + "_btn").textContent = this.in(qc) ? "Running" : this.done(qc) ? "Completed" : "Start"
				getEl("qc_" + qc + "_btn").className = this.in(qc) ? "onchallengebtn" : this.done(qc) ? "completedchallengesbtn" : "challengesbtn"
			}
		}

		//Paired Challenges
		/*
		assigned = []
		var assignedNums = {}
		getEl("pairedchallenges").style.display = player.masterystudies.includes("d9") ? "" : "none"
		getEl("respecPC").style.display = player.masterystudies.includes("d9") ? "" : "none"
		for (var pc = 1; pc <= 4; pc++) {
			var subChalls = tmp.qu.pairedChallenges.order[pc]
			if (subChalls) for (var sc = 0; sc < 2; sc++) {
				var subChall = subChalls[sc]
				if (subChall) {
					assigned.push(subChall)
					assignedNums[subChall] = pc
				}
			}
			if (player.masterystudies.includes("d9")) {
				var property = "pc" + pc
				var sc1 = tmp.qu.pairedChallenges.order[pc] ? tmp.qu.pairedChallenges.order[pc][0] : 0
				var sc2 = (sc1 ? tmp.qu.pairedChallenges.order[pc].length > 1 : false) ? tmp.qu.pairedChallenges.order[pc][1] : 0
				getEl(property+"desc").textContent = "Paired Challenge "+pc+": Both Quantum Challenge " + (sc1 ? sc1 : "?") + " and " + (sc2 ? sc2 : "?") + " are applied."
				getEl(property+"cost").textContent = "Cost: Still none. ;/"
				getEl(property+"goal").textContent = "Goal: " + (sc2 ? shortenCosts(Decimal.pow(10, this.getGoalMA(subChalls))) : "???") + " antimatter"
				getEl(property).textContent = pcFocus == pc ? "Cancel" : (tmp.qu.pairedChallenges.order[pc] ? tmp.qu.pairedChallenges.order[pc].length < 2 : true) ? "Assign" : tmp.qu.pairedChallenges.current == pc ? "Running" : tmp.qu.pairedChallenges.completed >= pc ? "Completed" : tmp.qu.pairedChallenges.completed + 1 < pc ? "Locked" : "Start"
				getEl(property).className = pcFocus == pc || (tmp.qu.pairedChallenges.order[pc] ? tmp.qu.pairedChallenges.order[pc].length < 2 : true) ? "challengesbtn" : tmp.qu.pairedChallenges.completed >= pc ? "completedchallengesbtn" : tmp.qu.pairedChallenges.completed + 1 <pc ? "lockedchallengesbtn" : tmp.qu.pairedChallenges.current == pc ? "onchallengebtn" : "challengesbtn"

				var sc1t = Math.min(sc1, sc2)
				var sc2t = Math.max(sc1, sc2)
				if (player.masterystudies.includes("d14")) {
					getEl(property + "br").style.display = ""
					getEl(property + "br").textContent = sc1t != 6 || sc2t != 8 ? "QC6 & 8" : tmp.qu.bigRip.active ? "Big Ripped" : tmp.qu.pairedChallenges.completed + 1 < pc ? "Locked" : "Big Rip"
					getEl(property + "br").className = sc1t != 6 || sc2t != 8 ? "lockedchallengesbtn" : tmp.qu.bigRip.active ? "onchallengebtn" : tmp.qu.pairedChallenges.completed + 1 < pc ? "lockedchallengesbtn" : "bigripbtn"
				} else getEl(property + "br").style.display = "none"
			}
		}
		*/

		//Big Rip
		getEl("bigrip").style.display = player.masterystudies.includes("d14") ? "" : "none"
		if (hasMTS("d14")) {
			var max = getMaxBigRipUpgrades()
			getEl("spaceShards").textContent = shortenDimensions(tmp.qu.bigRip.spaceShards)
			for (var u = 18; u <= 20; u++) getEl("bigripupg" + u).parentElement.style.display = u > max ? "none" : ""
			for (var u = 1; u <= max; u++) {
				getEl("bigripupg" + u).className = tmp.qu.bigRip.upgrades.includes(u) ? "gluonupgradebought bigrip" + (isBigRipUpgradeActive(u, true) ? "" : "off") : tmp.qu.bigRip.spaceShards.lt(bigRipUpgCosts[u]) ? "gluonupgrade unavailablebtn" : "gluonupgrade bigrip"
				getEl("bigripupg" + u + "cost").textContent = shortenDimensions(new Decimal(bigRipUpgCosts[u]))
			}
		}
	},
	updateDispOnTick() {
		if (!this.divInserted) return

		for (let qc = 1; qc <= this.data.max; qc++) {
			if (QCs_tmp.unl.includes(qc)) getEl("qc_" + qc + "_reward").textContent = this.data[qc].rewardDesc(QCs_tmp.rewards[qc])
		}
	},
	updateBest() {
		//Rework coming soon
	}
}
var QCs_save = undefined
var QCs_tmp = { unl: [], in: [], rewards: {} }

let QUANTUM_CHALLENGES = QCs