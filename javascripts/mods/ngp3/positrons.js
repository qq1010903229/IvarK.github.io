var pos = {
	setup() {
		pos_save = {
			amt: 0,
			eng: 0,
			boosts: 0
		}
		return pos_save
	},
	compile() {
		pos_save = undefined
		if (!tmp.ngp3 || tmp.qu === undefined) return

		let data = tmp.qu.pos
		if (data === undefined) data = this.setup()
		pos_save = data

		if (!data.on) {
			data.amt = 0
			data.eng = 0
		}
		if (!data.boosts) data.boosts = 0
		if (!data.gals) data.gals = {
			ng: {sac: 0, qe: 0, pc: 0},
			rg: {sac: 0, qe: 0, pc: 0},
			eg: {sac: 0, qe: 0, pc: 0},
			tg: {sac: 0, qe: 0, pc: 0}
		}

		if (data.consumedQE) delete data.consumedQE
		if (data.sacGals) delete data.sacGals
		if (data.sacBoosts) delete data.sacBoosts
	},
	unl() {
		return tmp.quActive && pos_save && hasMTS("d7")
	},
	on() {
		return this.unl() && pos_save.on
	},
	toggle() {
		pos_save.on = !pos_save.on
		quantum(false, true)
	},
	maxSacMult() {
		return 0.25
	},
	types: {
		ng: {
			galName: "Antimatter Galaxies",
			pow(x) {
				return x / 4
			},
			sacGals(x) {
				return Math.min(player.galaxies / 4, x)
			},
			basePcGain(x) {
				return Math.sqrt(x / 30)
			}
		},
		rg: {
			galName: "base Replicated Galaxies",
			pow(x) {
				return 0
			},
			sacGals(x) {
				return 0
			},
			basePcGain(x) {
				return x
			}
		},
		eg: {
			galName: "extra Replicated Galaxies",
			pow(x) {
				return 0
			},
			sacGals(x) {
				return 0
			},
			basePcGain(x) {
				return x
			}
		},
		tg: {
			galName: "Tachyonic Galaxies",
			pow(x) {
				return 0
			},
			sacGals(x) {
				return 0
			},
			basePcGain(x) {
				return x
			}
		}
	},
	updateTmp() {
		let data = {}
		save_tmp = data
		if (pos_save === undefined) return

		//Meta Dimension Boosts or Quantum Energy -> Positrons
		pos_save.eng = 0
		if (this.on()) {
			let mdbStart = 0
			let mdbMult = 0.25

			data.sac_mdb = Math.floor(Math.max(player.meta.resets - mdbStart, 0) * mdbMult)
			data.sac_qe = tmp.qu.quarkEnergy / (tmp.ngp3_mul ? 9 : 3)
			pos_save.amt = Math.floor(Math.min(Math.pow(data.sac_mdb, 2), data.sac_qe) * 100)
		} else {
			data.sac_mdb = 0
			data.sac_qe = 0
			pos_save.amt = 0
		}

		//Galaxies -> Charge
		let types = ["ng", "rg", "eg", "tg"]
		let pcSum = 0
		for (var i = 0; i < types.length; i++) {
			var type = types[i]
			var save_data = pos_save.gals[type]

			data["pow_" + type] = this.types[type].pow(pos_save.amt)
			save_data.sac = Math.floor(this.types[type].sacGals(data["pow_" + type]))
			save_data.pc = this.types[type].basePcGain(save_data.sac)
			pcSum += save_data.pc
		}
		pos_save.eng = Math.pow(pcSum, 4)
	},
	updateTab() {
		enB.update("pos")
		enB.updateOnTick("pos")

		getEl("pos_formula").textContent = getFullExpansion(save_tmp.sac_mdb) + " Meta Dimension Boosts + " + shorten(save_tmp.sac_qe) + " Quantum Energy ->"
		getEl("pos_toggle").textContent = pos_save.on ? "ON" : "OFF"
		getEl("pos_amt").textContent = getFullExpansion(pos_save.amt)

		let types = ["ng", "rg", "eg", "tg"]
		let msg = []
		for (var i = 0; i < types.length; i++) {
			var type = types[i]
			var gals = pos_save.gals[type].sac
			if (gals > 0 || type == "ng") msg.push(getFullExpansion(gals) + " sacrificed " + this.types[type].galName)
		}

		getEl("pos_charge_formula").innerHTML = wordizeList(msg, false, " +<br>", false) + " -> "
	
		if (enB.has("pos", 3)) getEl("enB_pos3_exp").textContent = "^" + (1 / tmp_enB.pos3).toFixed(Math.floor(3 + Math.log10(tmp_enB.pos3)))
	}
}
var pos_save = undefined
var pos_tmp = {}

let POSITRONS = pos