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
				cwd: '/home/www/node-cli-proxy-demo/zork',
				command: '/home/www/node-cli-proxy-demo/frotz/dfrotz',
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
						: '/home/www/node-cli-proxy-demo/eliza-cli',
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