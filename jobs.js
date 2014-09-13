var fs = require('fs');

module.exports = {
	showcase: {
		name: 'Showcase',
		description: '',
		cwd: fs.realpathSync(__dirname),
		variants: {
			eliza: {
				name: 'Eliza',
				description: 'Eliza chat bot. Isn\'t she awesome?',
				cwd: '~/eliza-cli',
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