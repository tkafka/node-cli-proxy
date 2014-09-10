var fs = require('fs');

module.exports = {
	showcase: {
		name: 'Showcase',
		description: '',
		basePath: fs.realpathSync(__dirname),
		variants: {
			ls: {
				name: 'ls',
				description: 'Calls ls in app folder',
				script: 'ls',
				args: []
			},
			lsla: {
				name: 'ls -la',
				description: 'Calls ls -la in app folder',
				script: 'ls',
				args: ['-la']
			},
		}
	}
};