Node.js web frontend for interactive cli programs
---

Define server-side jobs, and let users run them and interact with their stdin through web browser.

Try the [showcase](/showcase), I recommend playing Zork or talking to [Eliza](https://github.com/tkafka/eliza-cli) :).

![Talking to Eliza](http://tmskfk.com:3999/images/eliza-cli.png)

This is very useful for all kinds of automation, as you don't have to develop web frontend for your scripts and programs.

Uses [socket.io](http://socket.io/) to keep the link with server while job is running, kills job on server when user closes browser to prevent resource leaking.
Jobs file is reloaded on every request, so feel free to edit it on the go.

Made in Prague by [@keff85](http://twitter.com/keff85).

Source at [github.com/tkafka/node-cli-proxy](https://github.com/tkafka/node-cli-proxy).

### Actual [jobs.js](https://github.com/tkafka/node-cli-proxy/blob/master/jobs.js) file:
