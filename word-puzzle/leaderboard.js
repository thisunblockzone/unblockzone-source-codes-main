YANDEX_LEADERBOARD = {

	forceScoreUpdate: false,

	callback: null,
	leaderboard: null,
	leaderboardTitle: null,
	overlay: null,
	data: null,

	settings: {
		player: {
			includeUser: true,
			quantityTop: 10,
			quantityAround: 5
		},
		noPlayer: {
			includeUser: false,
			quantityTop: 10
		}
	},

	getDescription: function(leaderboardName = null) {

		return new Promise(resolve => {

			const handleError = err => {
				SDK_INTERFACE.getDebugLevel() && console.log(err);
				resolve(null);
			};

			window.ysdk.getLeaderboards().then(lb => {
				lb.getLeaderboardDescription(leaderboardName || this.getLeaderboardName()).then(res => {
					resolve(res);
				}).catch(handleError);
			}).catch(handleError);
		});
	},

	getPlayer: function(leaderboardName = null) {

		return new Promise(resolve => {

			const handleError = err => {
				SDK_INTERFACE.getDebugLevel() && console.log(err);
				if(err.code === 'LEADERBOARD_PLAYER_NOT_PRESENT') {
					resolve({});
				} else {
					resolve(null);
				}
			};

			window.ysdk.isAvailableMethod("leaderboards.getLeaderboardPlayerEntry").then(res => {
				if(res) {
					window.ysdk.getLeaderboards().then(lb => {
						lb.getLeaderboardPlayerEntry(leaderboardName || this.getLeaderboardName()).then(res => {
							SDK_INTERFACE.getDebugLevel() && console.log(res);
							resolve(res);
						}).catch(handleError);
					}).catch(handleError);
				} else {
					resolve(null);
				}
			}).catch(handleError);
		});
	},

	getEntries: function(includePlayer = false, leaderboardName = null) {

		return new Promise(resolve => {

			const handleError = err => {
				SDK_INTERFACE.getDebugLevel() && console.log(err);
				resolve(null);
			};

			window.ysdk.getLeaderboards().then(lb => {

					lb.getLeaderboardEntries(leaderboardName || this.getLeaderboardName(), includePlayer ? this.settings.player : this.settings.noPlayer).then(res => {
						SDK_INTERFACE.getDebugLevel() && console.log(res);
						resolve(res);
					}).catch(handleError);
				
			}).catch(handleError);
		});
	},

	getData: function(leaderboardName = null) {

		let data = null;

		return new Promise(resolve => {

			this.getPlayer().then(res => {
				
				if(res !== null) {
					data = res;
				}

				this.getEntries(res !== null, leaderboardName).then(res => {

					if(res !== null) {
						data = { ...data, ...res };
					}

					resolve((data === null || Object.keys(data).length === 0) ? null : data);
				});
			});
		});
	},

	getLeaderboardName: function() {

		let name = "Famobi";

		const gameName = window.famobi_gameID || "Leaderboard";

		gameName.split("-").forEach(str => {
			str = str.toLowerCase();
			str = str.charAt(0).toUpperCase() + str.slice(1);
			name += str;
		});

		return name;
	},

	showLeaderboard(onHideCallback = () => {}, score = null, leaderboardName = null) {

		this.callback = onHideCallback;

		(score !== null ? this.setScore(score) : Promise.resolve()).then(() => {

			if(SDK_INTERFACE_SETTINGS.showLeaderboard) {
				this.getData(leaderboardName).then(data => {

					if(data === null || (Array.isArray(data.entries) && data.entries.length === 0)) {
						this.onHideLeaderboard();
						return;
					}
					
					this.data = data;
	
					this.getInstance();
					this.resetLeaderboard();
					this.createLoader();
					this.displayLeaderboard();
	
					this.onLeaderboardEntriesReceived(this.data);
				});
			} else {
				this.onHideLeaderboard();
			}
		});
	},

	setScore: function(score, leaderboardName = null) {

		return new Promise(resolve => {

			const handleError = err => {
				SDK_INTERFACE.getDebugLevel() && console.log(err);
				resolve();
			};

			if(!(Number.isInteger(score) && score > 0)) {
				SDK_INTERFACE.getDebugLevel() && console.log("Score must be an integer and > 0");
				resolve();
				return;
			}

			window.ysdk.isAvailableMethod("leaderboards.setLeaderboardScore").then(res => {
				if(res) {
					this.getPlayer(leaderboardName || this.getLeaderboardName()).then(data => {
						
						if(data === null) {
							resolve();
							return;
						}

						if(score <= data.score && !this.forceScoreUpdate) {
							SDK_INTERFACE.getDebugLevel() && console.log("Score must be greater than the previous one");
							resolve();
							return;
						}

						ysdk.getLeaderboards().then(lb => {
						    lb.setLeaderboardScore(leaderboardName || this.getLeaderboardName(), score).then(res => {
						    	SDK_INTERFACE.getDebugLevel() && console.log("setLeaderboardScore resolved");
						    	resolve();
						    }).catch(handleError);
						}).catch(handleError);
					});
				} else {
					SDK_INTERFACE.getDebugLevel() && console.log("setLeaderboardScore: not available!");
					resolve();
				}
			}).catch(handleError);
		});
	},

	getInstance: function() {

		if(this.overlay !== null) {
			return this.overlay;
		}

		// Create overlay element
		const overlay = document.createElement("div");
		overlay.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.75);
			z-index: 1;
		`;

		// Add overlay to body
		const parent = document.body;
		parent.appendChild(overlay);

		// Create leaderboard element
		const leaderboard = document.createElement("div");
		leaderboard.style.cssText = `
			position: absolute;
			top: 50%;
			left: 50%;
			width: 80%;
			transform: translate(-50%, -50%);
			max-width: 450px;

			padding: 20px;

			background-color: #ffffff;
			border-radius: 20px;
			text-align: center;
			
			max-height: 80%;
			overflow: auto;
		`;

		overlay.appendChild(leaderboard);

		// Add close button to leaderboard
		const closeButton = document.createElement('button');
		closeButton.innerText = 'X';
		closeButton.style.cssText = `
			position: absolute;
			width: 30px;
			height: 30px;
			right: 15px;
			top: 15px;

			font-size: 100%;
			font-weight: bold;
			color: white;
			background-color: #cccccc;
			border-radius: 100%;
			border: none;
			cursor: pointer;
		`;

		// Add event listener to close button
		closeButton.addEventListener('click', () => {
			this.hideLeaderboard();
		});

		leaderboard.appendChild(closeButton);

		// Add title element to leaderboard
		const leaderboardTitle = document.createElement("h1");
		leaderboardTitle.textContent = " ";
		leaderboardTitle.style.cssText = `
			color: black;
		`;

		leaderboard.appendChild(leaderboardTitle);

		// Add entry list to leaderboard
		const leaderboardList = document.createElement("ol");
		leaderboardList.style.cssText = `
			padding: 0;
			margin: 0;
			display: flex;
			flex-wrap: wrap;
			listStyle: none;
		`;

		leaderboard.appendChild(leaderboardList);

		// Hide overlay
		overlay.style.display = "none";
		this.visible = false;

		// Save references
		this.overlay = overlay;
		this.leaderboardTitle = leaderboardTitle;
		this.leaderboard = leaderboardList;

		return this.overlay;
	},

	hideLeaderboard: function() {

		let instance = this.getInstance();
		if(instance) {
			this.visible = false;
			instance.style.display = this.visible ? "block" : "none";
		}

		this.onHideLeaderboard();
	},

	createLoader: function() {

		if(this.leaderboard === null) {
			return;
		}

		const loader = document.createElement('div');
		loader.style.cssText = `
			border: 8px solid rgba(0, 0, 0, 0.1);
			border-top-color: #333333;
			border-radius: 50%;
			height: 50px;
			width: 50px;
			animation: spin 1s ease-in-out infinite;
		`;

		const spinnerKeyframes = `
		    @keyframes spin {
		        from {
		            transform: rotate(0deg);
		        }
		        to {
		            transform: rotate(360deg);
		        }
		    }
		`;

		const style = document.createElement('style');
		style.textContent = spinnerKeyframes;

		this.overlay.appendChild(style);

		let li = document.createElement('li');
		li.style.cssText = `
			position: relative;
			width: 100%;
			height: 50px;

			margin-bottom: 2px;
			display: flex;
			align-items: center;
			justify-content: center;
		`;

		li.appendChild(loader);

		this.leaderboard.appendChild(li);
	},

	displayLeaderboard: function() {
		let instance = this.getInstance();
		if(instance) {
			this.visible = true;
			instance.style.display = this.visible ? "block" : "none";
		}
	},

	resetLeaderboard: function() {
		if(this.leaderboard !== null) {
			this.leaderboard.innerHTML = "";
		}
	},

	onHideLeaderboard: function() {

		if(typeof this.callback === "function") {
			this.callback();
		}

		this.callback = null;
	},

	onLeaderboardEntriesReceived(data = null) {
		
		if(data === null) {
			SDK_INTERFACE.getDebugLevel() && console.log("onLeaderboardEntriesReceived: no data!");
			return;
		}

		SDK_INTERFACE.getDebugLevel() && console.log("onLeaderboardEntriesReceived", data);

		if(this.leaderboardTitle) {
			this.leaderboardTitle.innerHTML = data.leaderboard?.title[famobi.getCurrentLanguage()] || data.leaderboard?.title["ru"] || "Leaderboard";
		}

		this.updateOverlay();
	},

	updateOverlay: function() {

		this.resetLeaderboard();

		SDK_INTERFACE.getDebugLevel() && console.log("updateOverlay", this.data);

		let entries = this.data.entries || [];

		entries.forEach(entry => {
			entry.isPlayersEntry = entry.player.uniqueID == this.data.player?.uniqueID;
			this.createLeaderboardEntry(entry);
		});
	},

	createLeaderboardEntry(entryData = null) {

		if(entryData === null) {
			SDK_INTERFACE.getDebugLevel() && console.log("Invalid entry data!");
			return;
		}
		if(this.leaderboard === null) {
			SDK_INTERFACE.getDebugLevel() && console.log("Missing leaderboard element!");
			return;
		}

		const newEntry = document.createElement("li");
		newEntry.style.cssText = `
			width: 100%;
			height: 50px;

			margin-bottom: ${entryData.rank == 3 ? "12" : "2"}px;

			color: black;
			background-color: ${entryData.isPlayersEntry ? "#afeef4" : "#f2f2f2"};
			border-radius: 10px;
			font-weight: ${entryData.isPlayersEntry ? "bold" : "none"};

			display: flex;
			align-items: center;
			justifyContent: space-between;
		`;

		if(!entryData.player.publicName) {
			switch(famobi.getCurrentLanguage()) {
				case "ru":
					entryData.player.publicName = "Пользователь скрыт";
					break;
				default:
					entryData.player.publicName = "User hidden";
			}
		}

		newEntry.innerHTML = `
			<span style='flex: .2'>${entryData.rank}</span>
			<img src=${entryData.player.getAvatarSrc()} style='width: 50px; height: 50px; borderRadius: 50%; objectFit: cover;'/>
			<span style='flex: 1'>${entryData.player.publicName}</span>
			<span style='margin-left: auto%; flex: .35'>${entryData.formattedScore}</span>
		`;

		this.leaderboard.appendChild(newEntry);
	}
};