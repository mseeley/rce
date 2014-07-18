## rce: remote code execution util

Quick hack to enable remote execution of synchronous code.

You enter commands in a terminal window. These commands are requested by
the client. The client executes the command and posts the result back to the
server.

It's not fancy but it is functional.

## Usage

* Start the command server: `node rce.js`. Note the server IP and port.
* Add the `rce-client.js` file to your HTML document.
* In your HTML document call `rce.start(IP:PORT)` with the IP and port of your server.
  * Server is CORS enabled
* Type commands into the server terminal window.
  * Hitting enter sends the commands
  * You can type as many commands as you want
* `> COMMAND` is displayed when a command is sent to the client
* `< COMMAND = RESULT` is displayed when a commands result is sent to the server.

## Example

```
Matts-MacBook-Pro-2:rce (master) mseeley$ node rce
Server running at http://10.0.1.238:8000/
navigator.userAgent
> navigator.userAgent
< navigator.userAgent = Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36
```