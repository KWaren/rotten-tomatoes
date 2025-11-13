// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import { useRouter } from "next/navigation";



// export default function Dashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const salesChartRef = useRef<HTMLCanvasElement>(null);
//   const categoryChartRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {

//   }, []);

//     const router = useRouter();
//   const handleLogout = async () => {
//     try {
//       const res = await fetch("/api/auth/logout", {
//         method: "POST",
//       });

//       if (res.ok) {
//         router.push("/login");
//       } else {
//         console.error("Logout failed");
//       }
//     } catch (error) {
//       console.error("Error during logout:", error);
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Navbar */}
//       <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
//         <div className="px-4 py-3 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="text-gray-600 hover:text-gray-900 lg:hidden"
//             >
//               <i className="fas fa-bars text-xl"></i>
//             </button>
//             <h1 className="text-xl font-bold text-gray-900">Mon Application</h1>
//           </div>
//           <div className="flex items-center space-x-4">
//             <div className="relative hidden md:block">
//               <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
//               <input
//                 type="text"
//                 placeholder="Rechercher..."
//                 className="bg-gray-100 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
//               />
//             </div>
//             <button className="relative text-gray-600 hover:text-gray-900">
//               <i className="fas fa-bell text-xl"></i>
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
//             </button>
//             <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2">
//               <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
//                 U
//               </div>
//               <span className="text-gray-700 font-medium hidden md:block">Utilisateur</span>
//               <i className="fas fa-chevron-down text-gray-500 text-sm hidden md:block"></i>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Sidebar */}
//       <aside
//         className={`fixed left-0 top-0 h-full bg-white shadow-lg w-64 transform transition-transform duration-300 ease-in-out z-40 mt-14 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//           }`}
//       >
//         <div className="p-4">
//           <nav className="space-y-1">
//             <a href="/dashboard" className="flex items-center space-x-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium">
//               <i className="fas fa-home text-lg"></i>
//               <span>Dashboard</span>
//             </a>
//             <a href="/users" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition">
//               <i className="fas fa-users text-lg"></i>
//               <span>Utilisateurs</span>
//             </a>
//             <a href="/orders" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition">
//               <i className="fas fa-shopping-cart text-lg"></i>
//               <span>Commandes</span>
//             </a>
//             <a href="/products" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition">
//               <i className="fas fa-box text-lg"></i>
//               <span>Produits</span>
//             </a>
//             <a href="/analytics" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition">
//               <i className="fas fa-chart-line text-lg"></i>
//               <span>Analytiques</span>
//             </a>
//             <a href="/settings" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition">
//               <i className="fas fa-cog text-lg"></i>
//               <span>Paramètres</span>
//             </a>
//           </nav>
//           <div className="mt-8 pt-8 border-t border-gray-200">
//             <a href="/logout" className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition">
//               <i className="fas fa-sign-out-alt text-lg"></i>
//               <span>Déconnexion</span>
//             </a>
//           </div>
//         </div>
//       </aside>

//       {/* Overlay */}
//       {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

//       {/* Main Content */}
//       <main className="lg:ml-64 mt-14 p-6">
//         <div className="max-w-7xl mx-auto">
//           <div className="mb-8">
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
//             <p className="text-gray-600">Vue d&apos;ensemble de vos performances</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//             {/* Stats cards ici */}
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//             <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Ventes mensuelles</h3>
//               <canvas ref={salesChartRef} className="w-full" height={80}></canvas>
//             </div>
//             <div className="bg-white rounded-xl shadow-sm p-6">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Catégories</h3>
//               <canvas ref={categoryChartRef} className="w-full"></canvas>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
