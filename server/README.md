
Server for remote makenode. 

Accepts incoming ssh connections from remote makenode client.

# Setup

Install latest stable node.js

Install node libraries:

```
npm install
```

Generate key pair:

```
ssh-keygen -t rsa -N "" -f keys/id_rsa
```

Create settings.js from template and edit to taste:

```
cp settings.js.example settings.js
```

# Running

```
npm start
```

