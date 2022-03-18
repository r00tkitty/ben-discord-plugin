/**
 * @name ben
 * @version 0.5.9
 * @description Ben!
 * @invite YMqKjWEVxG
 * @author DuneDude#6191
 * @authorId 557388558017495046
 * @authorLink https://github.com/r00tkitty/
 * @source https://github.com/r00tkitty/ben-discord-plugin
 * @updateUrl https://github.com/r00tkitty/ben-discord-plugin
 */

 module.exports = (() => {
	
	/* Configuration */
	const config = {info: {name: "Ben", authors: [{name: "DuneDude#6191", discord_id: "557388558017495046", github_username: "r00tkitty", twitter_username: "dunedudeng"}], version: "beta", description: "ben?", github: "https://github.com/r00tkitty/ben-discord-plugin", github_raw: "https://github.com/r00tkitty/ben-discord-plugin"}, defaultConfig: [{id: "setting", name: "Sound Settings", type: "ben", collapsible: true, shown: true, settings: [{id: "LimitChan", name: "Limit to the current channel only.", note: "When enabled, sound effects will only play within the currently selected channel.", type: "switch", value: true}, {id: "delay", name: "Sound effect delay.", note: "The delay in miliseconds between each sound effect.", type: "slider", value: 200, min: 10, max: 1000, renderValue: v => Math.round(v) + "ms"}, {id: "volume", name: "Sound effect volume.", note: "How loud the sound effects will be.", type: "slider", value: 1, min: 0.01, max: 1, renderValue: v => Math.round(v*100) + "%"}]}], changelog: [{title: "New Stuff", items: ["simplified the code", "fixed oof and bruh sounds not playing", "fixed sound timings", "fixed sounds not being played in the order they are written", "fixed sound overlapping", "added volume slider in settings"]}]};

	/* Library Stuff */
	return !global.ZeresPluginLibrary ? class {
		constructor() { this._config = config; }
        getName() {return config.info.name;}
        getAuthor() {return config.info.authors.map(a => a.name).join(", ");}
        getDescription() {return config.info.description;}
        getVersion() {return config.info.version;}
		load() {BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {confirmText: "Download Now", cancelText: "Cancel", onConfirm: () => {require("request").get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (err, res, body) => {if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9"); await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));});}});}
		start() { }
		stop() { }
	} : (([Plugin, Api]) => {

		const plugin = (Plugin, Api) => { try {
			
			/* Constants */
			const {DiscordModules: {Dispatcher, SelectedChannelStore}} = Api;
			const sounds = [
				{re: /no/gmi, file: "no.wav", duration: 600},
				{re: /eugh/gmi, file: "eugh.wav", duration: 550},
                {re: /ugh/gmi, file: "eugh.wav", duration: 550},
                {re: /ughh/gmi, file: "eugh.wav", duration: 550},
                {re: /eughh/gmi, file: "eugh.wav", duration: 550},
				{re: /yes/gmi, file: "yes.wav", duration: 250},
				{re: /ho ho ho/gmi, file: "hohoho.wav", duration: 470},
                {re: /hohoho/gmi, file: "hohoho.wav", duration: 470}
			];

			/* Double message event fix */
			let lastMessageID = null;

			/* Meme Sounds Class */
			return class MemeSounds extends Plugin {
				constructor() {
					super();
				}

				getSettingsPanel() {
					return this.buildSettingsPanel().getElement();
				}
	
				onStart() {
					Dispatcher.subscribe("MESSAGE_CREATE", this.messageEvent);
				}
				
				messageEvent = async ({ channelId, message, optimistic }) => {
					if (this.settings.setting.LimitChan && channelId != SelectedChannelStore.getChannelId())
						return;

					if (!optimistic && lastMessageID != message.id) {
						lastMessageID = message.id;
						let queue = new Map();
						for (let sound of sounds) {
							for (let match of message.content.matchAll(sound.re))
								queue.set(match.index, sound);
						}
						for (let sound of [...queue.entries()].sort((a, b) => a[0] - b[0])) {
							let audio = new Audio("https://github.com/r00tkitty/ben-discord-plugin/tree/main/sound"+sound[1].file);
							audio.volume = this.settings.setting.volume;
							audio.play();
							await new Promise(r => setTimeout(r, sound[1].duration+this.settings.setting.delay));
						}
					}
					
				};
				
				onStop() {
					Dispatcher.unsubscribe("MESSAGE_CREATE", this.messageEvent);
				}
			}
		} catch (e) { console.error(e); }};
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
