#!/bin/sh

. ./settings.sh

REMOTE_USERNAME="mesher"
REMOTE_COMMAND="makenode"
IPK_OUTPUT="/tmp/makenode.ipk"

KEEPALIVE="5"
TIMEOUT="10"
TIMEOUT_OPENSSH="2" # same as timeout but expressed in multiples of KEEPALIVE

HWADDR=$(cat /sys/class/net/eth0/address)

if [ "$CLIENT_TYPE" = "dropbear" ]; then
    CMD="$SSH_CMD -K $KEEPALIVE -I $TIMEMOUT -i $CLIENT_KEY -l $REMOTE_USERNAME -p $SERVER_PORT $SERVER_HOSTNAME $REMOTE_COMMAND $HWADDR"
elif [ "$CLIENT_TYPE" = "openssh" ]; then
    CMD="$SSH_CMD -o ServerAliveInterval=$KEEPALIVE -o ServerAliveCountMax=$TIMEOUT_OPENSSH -i $CLIENT_KEY -l $REMOTE_USERNAME -p $SERVER_PORT $SERVER_HOSTNAME $REMOTE_COMMAND $HWADDR"
else
  echo "Wrong CLIENT_TYPE '${CLIENT_TYPE}'" >&2
  exit 1
fi

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
#  echo $CMD
  echo '{"type": "ipk_request"}' | $CMD > $IPK_OUTPUT
  if [ "$?" -eq "0" ]; then
    break
  fi
  sleep 5
  echo "Reconnecting..."
done

echo "Installing IPK..."

# opkg install "$IPK_OUTPUT"

echo "[DEBUG] not actually installing"





