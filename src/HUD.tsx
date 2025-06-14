import React from "react";

const HUD: React.FC = () => {
  return (
    <div className="w-screen overflow-hidden">
      {/* Minimap Container */}
      <div id="minimap-container" className="absolute bottom-4 left-4">
        {/* Zoom Out Button */}
        <button id="minimap-zoom-out" className="minimap-nav-button absolute top-0 left-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus"><path d="M5 12h14" /></svg>
        </button>
        {/* Zoom In Button */}
        <button id="minimap-zoom-in" className="minimap-nav-button absolute top-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
        </button>
        {/* Diamond shaped minimap */}
        <div id="minimap-diamond" className="relative w-full h-full stone-texture">
          <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">MAP</div>
        </div>
        {/* Rotate Left Button */}
        <button id="minimap-rotate-left" className="minimap-nav-button absolute bottom-0 left-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9V3" /><path d="M4.5 7.5 3 12 7.5 10.5" /></svg>
        </button>
        {/* Rotate Right Button */}
        <button id="minimap-rotate-right" className="minimap-nav-button absolute bottom-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-cw"><path d="M21 12a9 9 0 1 1-9-9V3" /><path d="M19.5 6.5 21 12 16.5 10.5" /></svg>
        </button>
      </div>

      {/* Stats Panel */}
      <div id="stats-panel" className="absolute p-3 rounded-lg shadow-lg stone-texture">
        <h2 className="text-lg font-bold text-gray-200 mb-2 text-center">Stats</h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div>
            <div className="text-gray-300 text-xs mb-0.5">Pop: 1200</div>
            <div className="bar-graph-container"><div className="bar-fill" style={{ width: "75%" }}></div></div>
          </div>
          <div>
            <div className="text-gray-300 text-xs mb-0.5">Gold: $15K</div>
            <div className="bar-graph-container"><div className="bar-fill" style={{ width: "50%" }}></div></div>
          </div>
          <div>
            <div className="text-gray-300 text-xs mb-0.5">Apprv: 85%</div>
            <div className="bar-graph-container"><div className="bar-fill" style={{ width: "85%" }}></div></div>
          </div>
          <div>
            <div className="text-gray-300 text-xs mb-0.5">Res: 420</div>
            <div className="bar-graph-container"><div className="bar-fill" style={{ width: "60%" }}></div></div>
          </div>
        </div>
      </div>

      {/* Notification Area */}
      <div id="notification-area" className="absolute rounded-full shadow-lg stone-texture flex flex-col items-center justify-center text-white text-4xl">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-yellow-300"><path fillRule="evenodd" d="M5.25 9a6.002 6.002 0 0 0 6 6h.75a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 0 0 1.5h.75a2.25 2.25 0 0 0 2.25-2.25v-.811a.75.75 0 0 1 .102-.439l1.474-2.456a.75.75 0 0 1 .599-.294H19.5a.75.75 0 0 0 .75-.75V9A6 6 0 0 0 12 3h-.75a.75.75 0 0 0 0 1.5H12A4.5 4.5 0 0 1 16.5 9v.44l-1.92-.32a.75.75 0 0 0-.44.102L12 11.25l-2.19-.365a.75.75 0 0 0-.44-.102V9A4.5 4.5 0 0 1 12 4.5h.75a.75.75 0 0 0 0-1.5H12A6.002 6.002 0 0 0 5.25 9Z" clipRule="evenodd" /></svg>
        <span className="text-xs text-gray-300 mt-0.5">New Event!</span>
      </div>

      {/* Action Bar */}
      <div id="action-bar" className="absolute p-4 rounded-lg shadow-lg stone-texture flex">
        <div className="flex flex-col space-y-2 pr-4 border-r border-gray-600">
          <button className="parchment-texture px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap" id="build">Build</button>
          <button className="parchment-texture px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap" id="edicts">Edicts</button>
          <button className="parchment-texture px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap" id="trade">Trade</button>
          <button className="parchment-texture px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap" id="military">Military</button>
        </div>
        <div className="grid grid-cols-5 gap-2 pl-4">
          <div className="item-slot" id="build-house">House</div>
          <div className="item-slot" id="build-tenant">Tenant</div>
          <div className="item-slot">Item 3</div>
          <div className="item-slot">Item 4</div>
          <div className="item-slot">Item 5</div>
          <div className="item-slot">Item 6</div>
          <div className="item-slot">Item 7</div>
          <div className="item-slot">Item 8</div>
          <div className="item-slot">Item 9</div>
          <div className="item-slot">Item 10</div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button id="nav-btn-home" className="nav-button stone-texture absolute">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-home"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
      </button>
      <button id="nav-btn-settings" className="nav-button stone-texture absolute">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.78 1.28a2 2 0 0 0 .73 2.73l.04.02a2 2 0 0 1 .97 1.95v.44a2 2 0 0 1-.97 1.95l-.04.02a2 2 0 0 0-.73 2.73l.78 1.28a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.78-1.28a2 2 0 0 0-.73-2.73l-.04-.02a2 2 0 0 1-.97-1.95v-.44a2 2 0 0 1 .97-1.95l.04-.02a2 2 0 0 0 .73-2.73l-.78-1.28a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
      </button>
      <button id="nav-btn-users" className="nav-button stone-texture absolute">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
      </button>
      <button id="nav-btn-info" className="nav-button stone-texture absolute">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
      </button>
    </div>
  );
};

export default HUD;
