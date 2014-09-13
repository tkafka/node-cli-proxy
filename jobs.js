module.exports = {
	showcase: {
		name: 'Showcase',
		description: '',
		cwd: __dirname,
		variants: {
			eliza: {
				name: 'Eliza',
				description: 'Eliza chat bot. Isn\'t she awesome?',
				cwd: '/home/dokku/eliza-cli',
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