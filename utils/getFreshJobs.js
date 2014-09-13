module.exports = function() {
	// refresh jobs
	delete require.cache[require.resolve('../jobs')];
	var jobs = require('../jobs');
	return jobs;
};