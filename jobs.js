var os = require("os");

module.exports = {
	showcase: {
		name: 'Showcase',
		description: '',
		cwd: __dirname,
		variants: {
			zork: {
				name: 'Zork',
				description: 'Wanna be eaten by grue?',
				cwd: '~/node-cli-demo/zork',
				command: '~/node-cli-demo/frotz/dfrotz',
				args: [ 'ZORK1.DAT' ],
				uid: 1000,
				gid: 1000
			},
			eliza: {
				name: 'Eliza',
				description: 'Eliza chat bot. Isn\'t she awesome?',
				cwd:
					os.hostname().match(/\.local$/)
						? '/Users/tk/eliza-cli'
						: '~/node-cli-demo/eliza-cli',
				command: 'node',
				args: ['eliza']
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