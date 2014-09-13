module.exports = {
	mobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()),
	ios: /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase())
};