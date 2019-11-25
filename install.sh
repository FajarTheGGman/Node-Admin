echo "[!] installing depencies...";
sleep 1
apt-get update -y
apt-get install nodejs -y && npm install mysql ora express express-session body-parser colors chalk jsome inquirer boxen
node index.js