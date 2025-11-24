// import React, { useEffect, useState } from 'react';
// import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
// import { useWebSocket } from '@/hooks/useWebSocket';

// // interface WebSocketStatusProps {
// //   url: string;
// //   onConnect?: () => void;
// //   onVehicleUpdate?: (data: any) => void;
// //   onOrderUpdate?: (data: any) => void;
// //   onRouteOptimized?: (data: any) => void;
// //   onAlert?: (data: any) => void;
// // }

// export function WebSocketStatus({
//   url,
//   onConnect,
//   onVehicleUpdate,
//   onOrderUpdate,
//   onRouteOptimized,
//   onAlert,
// }: WebSocketStatusProps) {
//   const [messageCount, setMessageCount] = useState(0);
//   const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

//   const { isConnected, error, connect, disconnect } = useWebSocket({
//     url,
//     autoConnect: false,
//     onConnect: () => {
//       onConnect?.();
//     },
//   });

//   // // Subscribe to WebSocket events
//   // useEffect(() => {
//   //   const unsubscribe = [];

//   //   // This would typically use the useWebSocket hook's `on` method
//   //   // This is a simplified example showing where you'd attach listeners

//   //   return () => {
//   //     unsubscribe.forEach(fn => fn());
//   //   };
//   // }, [onVehicleUpdate, onOrderUpdate, onRouteOptimized, onAlert]);

//   return (
//     <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-white">Real-time Updates</h3>
//         <div className="flex items-center gap-2">
//           {isConnected ? (
//             <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
//               <Wifi className="w-4 h-4 text-green-400" />
//               <span className="text-sm text-green-400">Connected</span>
//             </div>
//           ) : (
//             <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full">
//               <WifiOff className="w-4 h-4 text-red-400" />
//               <span className="text-sm text-red-400">Disconnected</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {error && (
//         <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded flex items-start gap-2">
//           <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
//           <div className="text-sm text-red-400">
//             <p className="font-medium">Connection Error</p>
//             <p className="text-xs mt-1">{error.message}</p>
//           </div>
//         </div>
//       )}

//       <div className="flex gap-2 mb-4">
//         <button
//           onClick={connect}
//           disabled={isConnected}
//           className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-sm font-medium transition-colors"
//         >
//           Connect
//         </button>
//         <button
//           onClick={disconnect}
//           disabled={!isConnected}
//           className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-sm font-medium transition-colors"
//         >
//           Disconnect
//         </button>
//       </div>

//       <div className="space-y-2 text-sm">
//         <div className="flex justify-between text-slate-400">
//           <span>Messages Received:</span>
//           <span className="text-white font-medium">{messageCount}</span>
//         </div>
//         <div className="flex justify-between text-slate-400">
//           <span>Last Update:</span>
//           <span className="text-white font-mono">
//             {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
//           </span>
//         </div>
//         <div className="flex justify-between text-slate-400">
//           <span>Connection Status:</span>
//           <span className={`font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
//             {isConnected ? 'Active' : 'Inactive'}
//           </span>
//         </div>
//       </div>

//       <div className="mt-4 p-3 bg-slate-700/50 rounded text-xs text-slate-400">
//         <p>Server: <span className="text-slate-300 font-mono">{url}</span></p>
//       </div>
//     </div>
//   );
// }