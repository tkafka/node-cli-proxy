var counter = 0;

setInterval(function() {
	if (Math.random() < 0.05) {
		if (counter % 2 == 0)
			process.stdout.write('\n');
		else
			process.stderr.write('\n');
	} else {
		if (counter % 2 == 0)
			process.stdout.write('o');
		else
			process.stderr.write('e');
	}
	counter++;
}, 500);
