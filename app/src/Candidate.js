class Candidate {
	constructor(name, colors) {
		this.name = name;
		this.colors = colors;
		this.voteCount = 0;
		this.probVoteCounts = [0,0,0,0,0];

		if(colors[0] === colors[1] &&
			colors[0] === colors[2] &&
			colors[0] === colors[3] &&
			colors[0] === colors[4]) {
			this.singleColor = true;
		} else {
			this.singleColor = false;
		}
	}
};

class CandidateManager {
	static initCandidates() {
		CandidateManager.candidates = [];
		CandidateManager.candidates['Tossup'] = CandidateManager.TOSSUP;
	}

	static deleteCandidate() {
		closeAllPopups();
		var candidateid = document.getElementById('candidate-originalName').value;
		for(var index = 0; index < states.length; ++index) {
			var state = states[index];
			// set the candidate to tossup
			if(state.candidate === candidateid) {
				state.setColor('Tossup', 0);
			}
			state.delegates[candidateid] = undefined;
		}

		delete CandidateManager.candidates[candidateid];
		ChartManager.chart.generateLegend();
		countVotes();
		LegendManager.updateLegend();
		ChartManager.updateChart();
	}

	static setCandidate() {
		closeAllPopups();

		var oldname= document.getElementById('candidate-originalName').value;
		var newname = document.getElementById('candidate-name').value;
		var safeColor = document.getElementById('candidate-safe').value;
		var solidColor = document.getElementById('candidate-solid').value;
		var likelyColor = document.getElementById('candidate-likely').value;
		var leanColor = document.getElementById('candidate-lean').value;
		var tiltColor = document.getElementById('candidate-tilt').value;
			
		// only rename the property if the name changed
		if(newname !== oldname) {
			Object.defineProperty(CandidateManager.candidates, newname,
			Object.getOwnPropertyDescriptor(CandidateManager.candidates, oldname));
			delete CandidateManager.candidates[oldname];
		}

		var candidate = CandidateManager.candidates[newname];
		candidate.name = newname;
		candidate.colors[0] = safeColor;
		candidate.colors[1] = solidColor;
		candidate.colors[2] = likelyColor;
		candidate.colors[3] = leanColor;
		candidate.colors[4] = tiltColor;
		
		if(safeColor === solidColor &&
			safeColor === likelyColor &&
			safeColor === leanColor &&
			safeColor === tiltColor) {
			candidate.singleColor = true;
			candidate.probVoteCounts[0] += 
				candidate.probVoteCounts[1] +
				candidate.probVoteCounts[2] +
				candidate.probVoteCounts[3] +
				candidate.probVoteCounts[4];
			candidate.probVoteCounts[1] = 0;
			candidate.probVoteCounts[2] = 0;
			candidate.probVoteCounts[3] = 0;
			candidate.probVoteCounts[4] = 0;
		} else {
			candidate.singleColor = false;
		}
		
		for(var index = 0; index < states.length; ++index) {
			var state = states[index];
			if(state.candidate === newname) {
				state.setColor(newname, state.colorValue, {setDelegates: false});
				console.log(state.colorValue);
			} else if(state.candidate === oldname) {
				state.setColor(newname, state.colorValue, {setDelegates: false});
			
				state.delegates[newname] = state.delegates[oldname];
				state.delegates[oldname] = undefined;

			}	
		}

		ChartManager.chart.generateLegend();
		LegendManager.updateLegend();
		ChartManager.updateChart();
	}

	static addCandidate(name, safe, solid, likely, leaning, tilting) {

		if(name === undefined) {
			const nameHTML = document.getElementById('name');
			if(nameHTML !== null) {
				name = nameHTML.value;
			} else {
				name = "Error";
			}
		}

		// ignore white space candidates
		if(name.trim() === '') {
			return;
		}

		if(safe === undefined) {
			const safeHTML = document.getElementById('safe');
			if(safeHTML !== null) {
				safe = safeHTML.value;
			} else {
				safe = '#000000';
			}
		}

		if(solid === undefined) {
			const solidHTML = document.getElementById('solid');
			if(solidHTML !== null) {
				solid = solidHTML.value;
			} else {
				solid = '#000000';
			}
		}

		if(likely === undefined) {
			const likelyHTML = document.getElementById('likely');
			if(likelyHTML !== null) {
				likely = likelyHTML.value;
			} else {
				likely = '#000000';
			}
		}

		if(leaning === undefined) {
			const leaningHTML = document.getElementById('leaning');
			if(leaningHTML !== null) {
				leaning = leaningHTML.value;
			} else {
				leaning = '#000000';
			}
		}

		if(tilting === undefined) {
			const tiltingHTML = document.getElementById('tilting');
			if(tiltingHTML !== null) {
				tilting = tiltingHTML.value;
			} else {
				tilting = '#000000';
			}
		}
		
		const candidate = new Candidate(name, [safe, solid, likely, leaning, tilting]);
		CandidateManager.candidates[name] = candidate;

		verifyPaintIndex();
		ChartManager.chart.generateLegend();
		ChartManager.updateChart();
		LegendManager.updateLegend();
	}
	
	static saveCustomColors() {
		const name = document.getElementById('custom-color-name').value;
		const safe = document.getElementById("safecustom").value;
		CookieManager.appendCookie(name + "safe", safe);
		const solid = document.getElementById("solidcustom").value;
		CookieManager.appendCookie(name + "solid", solid);	
		const likely = document.getElementById("likelycustom").value;
		CookieManager.appendCookie(name + "likely", likely);	
		const leaning = document.getElementById("leaningcustom").value;
		CookieManager.appendCookie(name + "leaning", leaning);	
		const tilting = document.getElementById("tiltingcustom").value;
		CookieManager.appendCookie(name + "tilting", tilting);
		CandidateManager.setColors(name);
	}

	static setColors(palette) {
		const safe = document.getElementById('safe');
		const solid = document.getElementById('solid');
		const likely = document.getElementById('likely');
		const leaning =  document.getElementById('leaning');
		const tilting = document.getElementById('tilting');

		if(palette === 'red') {
			safe.value = '#bf1d29';
			solid.value = '#111111';
			likely.value = '#ff5865';
			leaning.value = '#ff8b98';
			tilting.value ='#cf8980';
		} else if(palette === 'blue') {
			safe.value = '#1c408c';
			solid.value = '#222222';
			likely.value = '#577ccc';
			leaning.value = '#8aafff';
			tilting.value = '#949bb3';
		} else if(palette === 'green') {
			safe.value = '#1c8c28';
			solid.value = '#000000';
			likely.value = '#50c85e';
			leaning.value = '#8aff97';
			tilting.value = '#7a997e';
		} else if(palette === 'yellow') {
			safe.value = '#e6b700';
			solid.value = '#000000';
			likely.value = '#e8c84d';
			leaning.value = '#ffe78a';
			tilting.value = '#b8a252';
		} else if(palette === 'blue-light') {
			safe.value = '#5555ff';
			solid.value = '#000000';
			likely.value = '#8080ff';
			leaning.value = '#aaaaff';
			tilting.value = '#d5d5ff';
		} else if(palette === 'red-light') {
			safe.value = '#ff5555';
			solid.value = '#000000';
			likely.value = '#ff8080';
			leaning.value = '#ffaaaa';
			tilting.value = '#ffd5d5';
		} else if(palette === 'blue-dark') {
			safe.value = '#302e80';
			solid.value = '#000000';
			likely.value = '#444cc5';
			leaning.value = '#817ffb';
			tilting.value = '#cdd3f7';
		} else if(palette === 'red-dark') {
			safe.value = '#80302e';
			solid.value = '#000000';
			likely.value = '#cb4b40';
			leaning.value = '#fb817f';
			tilting.value = '#f5c8c4';
		} else {
			safe.value = CookieManager.cookies[palette + 'safe'];
			solid.value = CookieManager.cookies[palette + 'solid'];
			likely.value = CookieManager.cookies[palette + 'likely'];
			leaning.value = CookieManager.cookies[palette + 'leaning'];
			tilting.value = CookieManager.cookies[palette + 'tilting'];
		}
	}
}

CandidateManager.candidates = [];
CandidateManager.tossupColor = 2;
CandidateManager.TOSSUP = new Candidate('Tossup', ['#000000', '#696969', '#ffffff', '#696969', '#000000']);
