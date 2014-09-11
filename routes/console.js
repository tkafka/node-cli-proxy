var express = require('express');
var router = express.Router();
var getFreshJobs = require('../utils/getFreshJobs');

router.get('/:script?', function (req, res) {
	var jobs = getFreshJobs();

	var scriptKey = req.params.script;

	if (!jobs.hasOwnProperty(scriptKey)) {
		if (scriptKey) {
			res.render('error', {
				jobs: jobs,
				error: 'Script ' + scriptKey + ' doesn\'t exist in config.'
			});
		} else {
			res.render('index', {
				jobs: jobs,
				message: 'Pick from menu ...'
			});
		}
	} else {
		// 'real work'

		var job = jobs[scriptKey];
		job.key = scriptKey;

		res.render('console', {
			jobs: jobs,
			jobKey: job.key,
			jobVariants: job.variants
		});
	}
});

module.exports = router;
