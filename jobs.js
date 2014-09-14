var os = require("os");

module.exports = {
	showcase: {
		name: 'Showcase',
		description: '',
		cwd: __dirname,
		variants: {
			eliza: {
				name: 'Eliza',
				description: 'Eliza chat bot. Isn\'t she awesome?',
				cwd:
					os.hostname().match(/\.local$/)
						? '/Users/tk/eliza-cli'
						: '/home/dokku/eliza-cli',
				command: 'node',
				args: ['eliza']
			},
			zork: {
				name: 'Zork',
				description: 'Wanna be eaten by grue?',
				cwd: '/home/dokku/zork',
				command: '/usr/games/frotz',
				args: [ './ZORK1.DAT', '-p', '-w 80' ],
				uid: 1000,
				gid: 1000
			},
			ls: {
				name: 'ls',
				description: 'Calls ls in app folder',
				command: 'ls',
				args: []
			},
			lsla: {
				name: 'ls -la',
				description: 'Calls ls -la in app folder',
				command: 'ls',
				args: ['-la']
			}
		}
	}
};