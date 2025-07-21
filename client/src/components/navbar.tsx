import { Shield, LayoutDashboard, Video, Layers, AlertTriangle, Users, ChevronDown, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="navbar-bg border-b border-slate-700 px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* SecureSight Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Shield className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold text-white">SecureSight</span>
          </div>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            <a 
              href="#" 
              className="flex items-center space-x-2 text-orange-400 hover:text-orange-300 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="font-medium">Dashboard</span>
            </a>
            <a 
              href="#" 
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
            >
              <Video className="w-4 h-4" />
              <span className="font-medium">Cameras</span>
            </a>
            <a 
              href="#" 
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span className="font-medium">Scenes</span>
            </a>
            <a 
              href="#" 
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Incidents</span>
            </a>
            <a 
              href="#" 
              className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
            >
              <Users className="w-4 h-4" />
              <span className="font-medium">Users</span>
            </a>
          </div>
        </div>
        
        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-700 rounded-lg px-3 py-2">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
              <User className="text-slate-300 w-4 h-4" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-white">Security Admin</div>
              <div className="text-slate-400 text-xs">admin@securesight.com</div>
            </div>
            <ChevronDown className="text-slate-400 w-3 h-3" />
          </div>
        </div>
      </div>
    </nav>
  );
}
