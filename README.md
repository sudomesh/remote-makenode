WORK IN PROGRESS. NOTHING WORKS.

Newly flashed nodes will make an ssh connection to the makenode server. The user enters basic node configuration info (address, email, shared bandwidth) via a web form and as soon as the node is connected and the form has been filled, the server will generate the per-node ipk with makenode, send it to the node and the node will install it. 

It doesn't matter if the form is filled before or after the node is first connected. The node will keep the connection open (and re-connect if necessary) until it gets an ipk.

Client is written as a shell script that calls the dropbear client.

Server is a node.js app that uses the node ssh2 module and matches the client based on MAC address.

Currently [a bug in ssh2](https://github.com/mscdex/ssh2/issues/463) prevents the server from working.
