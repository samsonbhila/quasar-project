const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Function to send updated data
  const sendData = () => {
    const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'pieChart.json'), 'utf8'));
    ws.send(JSON.stringify(data));
  };

  // Send initial data
  sendData();

  // Update data every 5 seconds
  setInterval(() => {
    const dataPath = path.join(__dirname, 'public', 'pieChart.json');
    
    // Re-read the data from the file each time
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Simulate random updates to the data
    data.data = data.data.map(() => Math.floor(Math.random() * 20));

    // Write the updated data back to the file
    fs.writeFileSync(dataPath, JSON.stringify(data));

    // Send updated data to the connected client
    sendData();
  }, 5000);

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
