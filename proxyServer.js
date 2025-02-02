/*
import http from 'http';
import net from 'net';
import httpProxy from 'http-proxy';
import express from 'express';
import LinksModel from './db/models/links.js';
import blockedDomains from './blockedDomain.js';
import { WebSocketServer } from 'ws'; 

const proxy = httpProxy.createProxyServer({});
const app = express();
app.use(express.json());



// Middleware to analyze manually directed HTTP traffic
app.use(async (req, res, next) => {
  try {
    if (!req.headers.host) return next();

    const fullUrl = new URL(req.url, `http://${req.headers.host}`);
    const domain = fullUrl.hostname;

    console.log(`Manually Directed HTTP Request to: ${domain}`);

    if (blockedDomains.has(domain)) {
      console.log(`🚫 Blocked Domain: ${domain}`);
      return res.status(403).send('Access Denied');
    }

    const linkData = await LinksModel.findOne({ url: domain });
    if (linkData) {
        console.log(`✅ Result: ${linkData.url} is ${linkData.category}`);
    } else {
      console.log(`❌ Domain not found in database: ${domain}`);
    }
  } catch (error) {
    console.error('Error processing manual request:', error);
  }

  next();
});

// Proxy middleware for manually directed traffic
app.use((req, res) => {
  if (!req.headers.host) {
    return res.status(400).send('Bad Request: No host header');
  }

  const host = req.headers.host.replace(/^(?:https?:\/\/)?/, '');
  if (blockedDomains.has(host)) {
    console.log(`🚫 Blocked Domain: ${host}`);
    return res.status(403).send('Access Denied');
  }

  const protocol = req.socket.encrypted ? 'https' : 'http';
  const target = `${protocol}://${host}`;

  console.log(`Manually Proxying request to: ${target}${req.url}`);

  proxy.web(req, res, { target, changeOrigin: true }, (err) => {
    console.error('Proxy error:', err.message);
    res.status(500).send('Internal Server Error');
  });
});

// HTTPS Proxy: Handles manually directed CONNECT requests
const server = http.createServer(app);

server.on('connect', async (req, clientSocket, head) => {
  const [host, port] = req.url.split(':');
  console.log(`Manually Directed HTTPS Request to: ${host}:${port || 443}`);

  if (blockedDomains.has(host)) {
    console.log(`🚫 Blocked Domain: ${host}`);
    clientSocket.end('HTTP/1.1 403 Forbidden\r\n\r\n');
    return;
  }

  try {
    const linkData = await LinksModel.findOne({ url: host });
    if (linkData) {
      console.log(`✅ Result: ${linkData.url} is ${linkData.category}`);
    } else {
      console.log(`❌ Domain not found in database: ${host}`);
    }
  } catch (error) {
    console.error('Error querying database:', error);
  }

  const serverSocket = net.connect(port || 443, host, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });

  serverSocket.on('error', (err) => {
    console.error('Error in forwarding HTTPS request:', err.message);
    clientSocket.end();
  });

  clientSocket.on('error', (err) => {
    console.error('Client Socket Error:', err.message);
  });
});

export const sharedData = { host: '' };

const PORT = process.env.PROXY_PORT || 8080;
server.listen(PORT, () => {
  console.log(`Manual Proxy server running on port ${PORT}`);
});

export default sharedData;


fhdnwjgflgwrmklgmwmfwelkmfwm
*/

// import http from 'http';
// import net from 'net';
// import httpProxy from 'http-proxy';
// import express from 'express';
// import LinksModel from './db/models/links.js';
// import blockedDomains from './blockedDomain.js';
// import admin from 'firebase-admin';
// import { initializeApp } from 'firebase/app';
// import serviceAccount from './config/proxy-server-virusapp-firebase-adminsdk-fbsvc-dbc217265e.json' assert { type: 'json' }; 
// import DeviceToken from "./db/models/tokensModel.js";

// const proxy = httpProxy.createProxyServer({});
// const app = express();
// app.use(express.json());

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBjPUUhSBtjGOkGGEcvXIekV2bNlWvY2GE",
//   authDomain: "proxy-server-virusapp.firebaseapp.com",
//   projectId: "proxy-server-virusapp",
//   storageBucket: "proxy-server-virusapp.firebasestorage.app",
//   messagingSenderId: "139174977888",
//   appId: "1:139174977888:web:3978d22d16fda1b43cfe05",
//   measurementId: "G-LT74K2T5JH"
// };

// // Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://proxy-server-virusapp-default-rtdb.firebaseio.com/',
// });

// // Function to send push notifications to all devices
// const sendPushNotificationToAll = async (message) => {
//   try {
//     // Fetch all device tokens from the database
//     const tokens = await DeviceToken.find({});
//     if (!tokens || tokens.length === 0) {
//       console.error('No device tokens found in the database');
//       return;
//     }

//     const deviceTokens = tokens.map(tokenDoc => tokenDoc.token);

//     const payload = {
//       notification: {
//         title: 'Proxy Log Update',
//         body: message,
//       },
//     };

//     const response = await admin.messaging().sendToDevice(deviceTokens, payload);
//     console.log('Successfully sent messages:', response);
//   } catch (error) {
//     console.error('Error sending messages:', error);
//   }
// };

// // Middleware to analyze manually directed HTTP traffic
// app.use(async (req, res, next) => {
//   try {
//     if (!req.headers.host) return next();

//     const fullUrl = new URL(req.url, `http://${req.headers.host}`);
//     const domain = fullUrl.hostname;

//     console.log(`Manually Directed HTTP Request to: ${domain}`);

//     // Example of how to send notification on blocked domain
//     if (blockedDomains.has(domain)) {
//       console.log(`🚫 Blocked Domain: ${domain}`);
//       const notificationMessage = `Blocked domain: ${domain}`;
//       await sendPushNotificationToAll(notificationMessage);
//       return res.status(403).send('Access Denied');
//     }

//     const linkData = await LinksModel.findOne({ url: domain });
//     if (linkData) {
//       console.log(`✅ Result: ${linkData.url} is ${linkData.category}`);
//       const notificationMessage = `Domain ${linkData.url} is categorized as ${linkData.category}`;
//       await sendPushNotificationToAll(notificationMessage);
//     } else {
//       console.log(`❌ Domain not found in database: ${domain}`);
//       const notificationMessage = `Domain not found in the database: ${domain}`;
//       await sendPushNotificationToAll(notificationMessage);
//     }
//     next();
//   } catch (error) {
//     console.error('Error processing manual request:', error);
//     next(error); // Pass the error to the next middleware
//   }
// });

// // Proxy middleware for manually directed traffic
// app.use(async (req, res, next) => {
//   try {
//     if (!req.headers.host) {
//       return res.status(400).send('Bad Request: No host header');
//     }

//     const host = req.headers.host.replace(/^(?:https?:\/\/)?/, '');
//     if (blockedDomains.has(host)) {
//       console.log(`🚫 Blocked Domain: ${host}`);
//       const notificationMessage = `Blocked domain: ${host}`;
//       await sendPushNotificationToAll(notificationMessage);
//       return res.status(403).send('Access Denied');
//     }

//     const protocol = req.socket.encrypted ? 'https' : 'http';
//     const target = `${protocol}://${host}`;

//     console.log(`Manually Proxying request to: ${target}${req.url}`);

//     proxy.web(req, res, { target, changeOrigin: true }, (err) => {
//       console.error('Proxy error:', err.message);
//       if (!res.headersSent) {
//         res.status(500).send('Internal Server Error');
//       }
//     });
//   } catch (error) {
//     console.error('Error in proxy middleware:', error);
//     next(error); // Pass the error to the next middleware
//   }
// });

// // HTTPS Proxy: Handles manually directed CONNECT requests
// const server = http.createServer(app);

// server.on('connect', async (req, clientSocket, head) => {
//   const [host, port] = req.url.split(':');
//   console.log(`Manually Directed HTTPS Request to: ${host}:${port || 443}`);

//   if (blockedDomains.has(host)) {
//     console.log(`🚫 Blocked Domain: ${host}`);
//     const notificationMessage = `Blocked domain: ${host}`;
//     await sendPushNotificationToAll(notificationMessage);
//     clientSocket.end('HTTP/1.1 403 Forbidden\r\n\r\n');
//     return;
//   }

//   try {
//     const linkData = await LinksModel.findOne({ url: host });
//const linkData = await LinksModel.findOne({ url: host });
//     if (linkData) {
//       console.log(`✅ Result: ${linkData.url} is ${linkData.category}`);
//       const notificationMessage = `Domain ${linkData.url} is categorized as ${linkData.category}`;
//       await sendPushNotificationToAll(notificationMessage);
//     } else {
//       console.log(`❌ Domain not found in database: ${host}`);
//       const notificationMessage = `Domain not found in the database: ${host}`;
//       await sendPushNotificationToAll(notificationMessage);
//     }
//   } catch (error) {
//     console.error('Error querying database:', error);
//   }

//   const serverSocket = net.connect(port || 443, host, () => {
//     clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
//     serverSocket.write(head);
//     serverSocket.pipe(clientSocket);
//     clientSocket.pipe(serverSocket);
//   });

//   serverSocket.on('error', (err) => {
//     console.error('Error in forwarding HTTPS request:', err.message);
//     clientSocket.end();
//   });

//   clientSocket.on('error', (err) => {
//     console.error('Client Socket Error:', err.message);
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Error handling middleware:', err);
//   res.status(err.statusCode || 500).json({ message: err.message });
// });

// const PORT = process.env.PROXY_PORT || 8080;
// server.listen(PORT, () => {
//   console.log(`Manual Proxy server running on port ${PORT}`);
// });

// export default server;



//last working shii 

import http from 'http';
import net from 'net';
import httpProxy from 'http-proxy';
import express from 'express';
import axios from 'axios'; // Add axios for making HTTP requests
import LinksModel from './db/models/links.js';
import blockedDomains from './blockedDomain.js';
import connectionDB from './db/connection.js';
connectionDB()

const proxy = httpProxy.createProxyServer({});
const app = express();
app.use(express.json());

// OneSignal Configuration
const ONE_SIGNAL_APP_ID = 'f4791dad-92f0-482a-9328-43266d148da7';
const ONE_SIGNAL_REST_API_KEY = 'os_v2_app_6r4r3lms6becveziimtg2fenu4tcoqmg677ujo5fljryj2fcpy26y2phjl57dmglicqe6phgaoymyidriqoxcohyrzh7tnmydgbalma';

// Function to send push notifications to all devices using OneSignal tags
const sendPushNotificationToAll = async (message) => {
  const payload = {
    app_id: ONE_SIGNAL_APP_ID,
    headings: { en: 'Proxy Log Update' },
    contents: { en: message },
    filters: [
      { "field": "tag", "key": "user_type", "relation": "=", "value": "all_users" }
    ],
  };

  try {
    const response = await axios.post('https://onesignal.com/api/v1/notifications', payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${ONE_SIGNAL_REST_API_KEY}`,
      },
    });

    console.log('Successfully sent messages:', response.data);
  } catch (error) {
    console.error('Error sending messages:', error);
  }
};

// Middleware to analyze manually directed HTTP traffic
app.use(async (req, res, next) => {
  try {
    if (!req.headers.host) return next();

    const fullUrl = new URL(req.url, `http://${req.headers.host}`);
    const domain = fullUrl.hostname;

    console.log(`Manually Directed HTTP Request to: ${domain}`);

    // Example of how to send notification on blocked domain
    if (blockedDomains.has(domain)) {
      console.log(`🚫 Blocked Domain: ${domain}`);
      const notificationMessage = `Blocked domain: ${domain}`;
      await sendPushNotificationToAll(notificationMessage);
      return res.status(403).send('Access Denied');
    }

    const linkData = await LinksModel.findOne({ url: domain });
    if (linkData) {
      console.log(`✅ Result: ${linkData.url} is ${linkData.category}`);
      const notificationMessage = `Domain ${linkData.url} is categorized as ${linkData.category}`;
      await sendPushNotificationToAll(notificationMessage);
    } else {
      console.log(`❌ Domain not found in database: ${domain}`);
      const notificationMessage = `Domain not found in the database: ${domain}`;
      await sendPushNotificationToAll(notificationMessage);
    }
    next();
  } catch (error) {
    console.error('Error processing manual request:', error);
    next(error); // Pass the error to the next middleware
  }
});

// Proxy middleware for manually directed traffic
app.use(async (req, res, next) => {
  try {
    if (!req.headers.host) {
      return res.status(400).send('Bad Request: No host header');
    }

    const host = req.headers.host.replace(/^(?:https?:\/\/)?/, '');
    if (blockedDomains.has(host)) {
      console.log(`🚫 Blocked Domain: ${host}`);
      const notificationMessage = `Blocked domain: ${host}`;
      await sendPushNotificationToAll(notificationMessage);
      return res.status(403).send('Access Denied');
    }

    const protocol = req.socket.encrypted ? 'https' : 'http';
    const target = `${protocol}://${host}`;

    console.log(`Manually Proxying request to: ${target}${req.url}`);

    proxy.web(req, res, { target, changeOrigin: true }, (err) => {
      console.error('Proxy error:', err.message);
      if (!res.headersSent) {
        res.status(500).send('Internal Server Error');
      }
    });
  } catch (error) {
    console.error('Error in proxy middleware:', error);
    next(error); // Pass the error to the next middleware
  }
});

// HTTPS Proxy: Handles manually directed CONNECT requests
const server = http.createServer(app);

server.on('connect', async (req, clientSocket, head) => {
  const [host, port] = req.url.split(':');
  console.log(`Manually Directed HTTPS Request to: ${host}:${port || 443}`);

  if (blockedDomains.has(host)) {
    console.log(`🚫 Blocked Domain: ${host}`);
    const notificationMessage = `Blocked domain: ${host}`;
    await sendPushNotificationToAll(notificationMessage);
    clientSocket.end('HTTP/1.1 403 Forbidden\r\n\r\n');
    return;
  }

  try {
    const linkData = await LinksModel.findOne({ url: host });
    if (linkData) {
      console.log(`✅ Result: ${linkData.url} is ${linkData.category}`);
      const notificationMessage = `Domain ${linkData.url} is categorized as ${linkData.category}`;
      await sendPushNotificationToAll(notificationMessage);
    } else {
      console.log(`❌ Domain not found in database: ${host}`);
      const notificationMessage = `Domain not found in the database: ${host}`;
      await sendPushNotificationToAll(notificationMessage);
    }
  } catch (error) {
    console.error('Error querying database:', error);
  }

  const serverSocket = net.connect(port || 443, host, () => {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });

  serverSocket.on('error', (err) => {
    console.error('Error in forwarding HTTPS request:', err.message);
    clientSocket.end();
  });

  clientSocket.on('error', (err) => {
    console.error('Client Socket Error:', err.message);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error handling middleware:', err);
  res.status(err.statusCode || 500).json({ message: err.message });
});

const PORT = process.env.PROXY_PORT || 8080;
server.listen(PORT, () => {
  console.log(`Manual Proxy server running on port ${PORT}`);
});

export default server;
