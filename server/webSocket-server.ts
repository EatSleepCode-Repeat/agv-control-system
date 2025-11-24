// import { WebSocketServer, WebSocket } from 'ws';
// import { createServer } from 'http';
// import { Vehicle, Order, Location } from '../types';

// interface WSMessage<T = any> {
//   type: string;
//   data: T;
//   timestamp: number;
//   id?: string;
// }

// class AGVWebSocketServer {
//   private wss: WebSocketServer;
//   private vehicles: Vehicle[] = [];
//   private orders: Order[] = [];
//   private locations: Location[] = [];
//   private clients = new Set<WebSocket>();

//   constructor(port: number = 8080) {
//     const server = createServer();
//     this.wss = new WebSocketServer({ server });

//     this.wss.on('connection', (ws) => this.handleConnection(ws));

//     server.listen(port, () => {
//       console.log(`AGV WebSocket Server running on ws://localhost:${port}`);
//       this.startSimulation();
//     });
//   }

//   private handleConnection(ws: WebSocket) {
//     console.log('Client connected');
//     this.clients.add(ws);

//     // Send initial state
//     this.sendToClient(ws, {
//       type: 'INITIAL_STATE',
//       data: { vehicles: this.vehicles, orders: this.orders, locations: this.locations },
//       timestamp: Date.now(),
//     });

//     ws.on('message', (data) => this.handleMessage(ws,));
//     ws.on('close', () => this.handleDisconnection(ws));
//     ws.on('error', (error) => console.error('WebSocket error:', error));
//   }

//   private handleMessage(ws: WebSocket, data: WebSocket) {
//     try {
//       const message: WSMessage = JSON.parse(data.toString());
//       console.log('Received message:', message.type);

//       switch (message.type) {
//         case 'HEARTBEAT':
//           this.sendToClient(ws, {
//             type: 'HEARTBEAT',
//             data: { status: 'ok' },
//             timestamp: Date.now(),
//           });
//           break;

//         case 'REQUEST_ROUTE_OPTIMIZATION':
//           this.handleRouteOptimization(message.data);
//           break;

//         case 'UPDATE_VEHICLE_STATUS':
//           this.handleVehicleStatusUpdate(message.data);
//           break;

//         case 'REQUEST_STATE':
//           this.sendToClient(ws, {
//             type: 'STATE_UPDATE',
//             data: { vehicles: this.vehicles, orders: this.orders },
//             timestamp: Date.now(),
//           });
//           break;
//       }
//     } catch (error) {
//       console.error('Error handling message:', error);
//     }
//   }

//   private handleDisconnection(ws: WebSocket) {
//     console.log('Client disconnected');
//     this.clients.delete(ws);
//   }

//   private startSimulation() {
//     // Simulate vehicle updates every 500ms
//     setInterval(() => {
//       this.vehicles.forEach(v => {
//         if (v.status === 'moving') {
//           v.x += (Math.random() - 0.5) * 4;
//           v.y += (Math.random() - 0.5) * 4;
//           v.x = Math.max(0, Math.min(400, v.x));
//           v.y = Math.max(0, Math.min(300, v.y));

//           // Simulate battery drain
//           v.battery = Math.max(0, v.battery - 0.1);

//           this.broadcast({
//             type: 'VEHICLE_UPDATE',
//             data: {
//               vehicleId: v.id,
//               x: v.x,
//               y: v.y,
//               status: v.status,
//               battery: Math.round(v.battery),
//             },
//             timestamp: Date.now(),
//           });
//         }
//       });
//     }, 500);
//   }

//   private handleRouteOptimization(data: any) {
//     // Simulate route optimization response
//     const optimizedRoute = {
//       orderId: data.orderId,
//       vehicleId: data.vehicleId,
//       distance: Math.random() * 200 + 50,
//       estimatedTime: Math.random() * 300 + 60,
//       waypoints: [
//         { x: 50, y: 50, name: 'Warehouse A' },
//         { x: 150, y: 150, name: 'Station B' },
//         { x: 250, y: 100, name: 'Warehouse C' },
//       ],
//     };

//     this.broadcast({
//       type: 'ROUTE_OPTIMIZED',
//       data: optimizedRoute,
//       timestamp: Date.now(),
//     });
//   }

//   private handleVehicleStatusUpdate(data: any) {
//     const vehicle = this.vehicles.find(v => v.id === data.vehicleId);
//     if (vehicle) {
//       vehicle.status = data.status;
//       this.broadcast({
//         type: 'VEHICLE_UPDATE',
//         data: { vehicleId: vehicle.id, status: vehicle.status },
//         timestamp: Date.now(),
//       });
//     }
//   }

//   private broadcast(message: WSMessage) {
//     const payload = JSON.stringify(message);
//     this.clients.forEach(client => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(payload);
//       }
//     });
//   }

//   private sendToClient(ws: WebSocket, message: WSMessage) {
//     if (ws.readyState === WebSocket.OPEN) {
//       ws.send(JSON.stringify(message));
//     }
//   }

//   setVehicles(vehicles: Vehicle[]) {
//     this.vehicles = vehicles;
//   }

//   setOrders(orders: Order[]) {
//     this.orders = orders;
//   }

//   setLocations(locations: Location[]) {
//     this.locations = locations;
//   }
// }

// // Start the server
// new AGVWebSocketServer(8080);