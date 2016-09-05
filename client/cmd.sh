#!/bin/sh

. ./settings.sh

REMOTE_USERNAME="mesher"
REMOTE_COMMAND="makenode"
IPK_OUTPUT="/tmp/makenode.ipk"

CMD="$SSH_CMD -K 10 -I 30 -i $CLIENT_KEY -l $REMOTE_USERNAME -p $SERVER_PORT $SERVER_HOSTNAME $REMOTE_COMMAND > $IPK_OUTPUT"

# dropbear client checks this file and it is hard-coded :/
KNOWN_HOSTS_FILE=~/.ssh/known_hosts

SERVER_KEY=$(awk '/ssh-/ { print $2 }' $SERVER_KEY_FILE)

# This string will equal e.g. "ssh-rsa"
SERVER_KEYTYPE=$(awk '/ssh-/ { print $1 }' $SERVER_KEY_FILE)

# if the server key has not been added to known hosts, add it
grep "$SERVER_HOSTNAME $SERVER_KEYTYPE $SERVER_KEY" $KNOWN_HOSTS_FILE > /dev/null

if [ "$?" -ne "0" ]; then

  echo "Host key not found in $KNOWN_HOSTS_FILE so adding it..."

  # Add server key to known hosts file
  echo "$SERVER_HOSTNAME $SERVER_KEYTYPE $SERVER_KEY" >> $KNOWN_HOSTS_FILE
fi

echo "Connecting to $SERVER_HOSTNAME on port $SERVER_PORT"
while : 
do
  echo $CMD
  echo '{"type": "ipk_request"}' | $CMD
  if [ "$?" -eq "0" ]; then
    break
  fi
  sleep 5
  echo "Reconnecting..."
done

echo "Installing IPK..."

# opkg install "$IPK_OUTPUT"

echo "[DEBUG] not actually installing"




