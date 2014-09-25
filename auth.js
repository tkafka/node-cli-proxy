// http basic authentication
module.exports = {
	active: false,
	realm: 'Proxy tool',
	authFn: function(username, password, callback) {
		// provide your own auth here:
		// callback(username === "login" && password === "password");
		callback(true);
	}
};
