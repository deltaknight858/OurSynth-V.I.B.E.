import React, { useState, useContext, createContext } from "react";
import { useRouter } from "next/router";
import {
  Home, FileText, BookOpen, Palette, Zap, Package, 
  GitBranch, Archive, Puzzle, Settings, ChevronDown,
  ChevronRight, X, User, LogIn, LogOut, Bell, Sun, Moon
} from "lucide-react";
import styles from "./Shell.module.css";

// Shell Context for managing state across components
const ShellContext = createContext(null);

// Navigation items organized by groups
const navigationGroups = [
  {
    title: "Flows & Apps",
    id: "flows-apps",
    items: [
      { href: "/", label: "Dashboard", icon: Home },
      { href: "/studio", label: "Studio", icon: Palette },
      { href: "/aether", label: "Aether", icon: Zap },
    ]
  },
  {
    title: "Workspace & Tools", 
    id: "workspace-tools",
    items: [
      { href: "/notes", label: "Notes", icon: FileText },
      { href: "/notebooks", label: "Notebooks", icon: BookOpen },
      { href: "/components", label: "Components", icon: Puzzle },
    ]
  },
  {
    title: "Utilities",
    id: "utilities", 
    items: [
      { href: "/capsules", label: "Capsules", icon: Package },
      { href: "/provenance", label: "Provenance", icon: GitBranch },
      { href: "/assets", label: "Assets", icon: Archive },
      { href: "/settings", label: "Settings", icon: Settings },
    ]
  }
];

// Get page title from route
const getPageTitle = (pathname) => {
  for (const group of navigationGroups) {
    for (const item of group.items) {
      if (item.href === pathname) {
        return item.label;
      }
    }
  }
  return "OurSynth";
};

// Sidebar Group Component
function SidebarGroup({ group, openTabs, activeTab, onTabOpen, collapsedGroups, onToggleGroup }) {
  const isCollapsed = collapsedGroups[group.id];
  
  return (
    <div className={styles.sidebarGroup}>
      <button 
        className={styles.sidebarGroupHeader}
        onClick={() => onToggleGroup(group.id)}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
        <span>{group.title}</span>
      </button>
      {!isCollapsed && (
        <div className={styles.sidebarGroupContent}>
          {group.items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.href;
            const isOpen = openTabs.some(tab => tab.href === item.href);
            
            return (
              <button
                key={item.href}
                className={`${styles.sidebarItem} ${isActive ? styles.active : ''} ${isOpen ? styles.open : ''}`}
                onClick={() => onTabOpen(item)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Tab Bar Component
function TabBar({ openTabs, activeTab, onTabChange, onTabClose }) {
  if (openTabs.length === 0) return null;
  
  return (
    <div className={styles.tabBar}>
      {openTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.href;
        
        return (
          <div
            key={tab.href}
            className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
            onClick={() => onTabChange(tab.href)}
          >
            <Icon size={14} />
            <span>{tab.label}</span>
            <button
              className={styles.tabCloseButton}
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.href);
              }}
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// Top Bar Component
function TopBar({ contextTitle, user, onUserAction, isDarkTheme, onThemeToggle }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  return (
    <header className={styles.topBar}>
      <div className={styles.topBarContent}>
        {/* Branding */}
        <div className={styles.brand}>
          <img src="/logo.svg" alt="OurSynth Logo" className={styles.logo} />
          <span className={styles.brandText}>OurSynth</span>
        </div>
        
        {/* Context Title */}
        <div className={styles.contextTitle}>
          {contextTitle}
        </div>
        
        {/* User Menu */}
        <div className={styles.userMenu}>
          <button 
            className={styles.utilityButton}
            onClick={onThemeToggle}
            title="Toggle Theme"
          >
            {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button className={styles.utilityButton} title="Notifications">
            <Bell size={18} />
          </button>
          
          <div className={styles.userMenuContainer}>
            <button 
              className={styles.userButton}
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              {user ? (
                <img src={user.avatar} alt={user.name} className={styles.userAvatar} />
              ) : (
                <User size={18} />
              )}
            </button>
            
            {userMenuOpen && (
              <div className={styles.userDropdown}>
                {user ? (
                  <>
                    <div className={styles.userInfo}>
                      <img src={user.avatar} alt={user.name} className={styles.userAvatarLarge} />
                      <div>
                        <div className={styles.userName}>{user.name}</div>
                        <div className={styles.userEmail}>{user.email}</div>
                      </div>
                    </div>
                    <button 
                      className={styles.userMenuItem}
                      onClick={() => onUserAction('signout')}
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button 
                    className={styles.userMenuItem}
                    onClick={() => onUserAction('signin')}
                  >
                    <LogIn size={16} />
                    Sign In
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// Main Shell Component
export default function Shell({ children }) {
  const router = useRouter();
  const [openTabs, setOpenTabs] = useState([
    { href: "/", label: "Dashboard", icon: Home } // Default tab
  ]);
  const [activeTab, setActiveTab] = useState("/");
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [user, setUser] = useState(null); // Mock user state
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  
  const contextTitle = getPageTitle(router.pathname);
  
  // Handle tab operations
  const handleTabOpen = (item) => {
    // Check if tab is already open
    const existingTab = openTabs.find(tab => tab.href === item.href);
    if (existingTab) {
      // Just switch to existing tab
      setActiveTab(item.href);
      router.push(item.href);
    } else {
      // Open new tab
      setOpenTabs(prev => [...prev, item]);
      setActiveTab(item.href);
      router.push(item.href);
    }
  };
  
  const handleTabChange = (href) => {
    setActiveTab(href);
    router.push(href);
  };
  
  const handleTabClose = (href) => {
    const newTabs = openTabs.filter(tab => tab.href !== href);
    setOpenTabs(newTabs);
    
    // If closing active tab, switch to another tab
    if (activeTab === href && newTabs.length > 0) {
      const newActiveTab = newTabs[newTabs.length - 1].href;
      setActiveTab(newActiveTab);
      router.push(newActiveTab);
    }
  };
  
  const handleToggleGroup = (groupId) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };
  
  const handleUserAction = (action) => {
    if (action === 'signin') {
      // Mock sign in
      setUser({
        name: "Demo User",
        email: "demo@oursynth.eco",
        avatar: "/favicon.svg"
      });
    } else if (action === 'signout') {
      setUser(null);
    }
  };
  
  const handleThemeToggle = () => {
    setIsDarkTheme(!isDarkTheme);
    // You could implement actual theme switching here
  };
  
  const shellContextValue = {
    openTabs,
    activeTab,
    user,
    isDarkTheme,
    onTabOpen: handleTabOpen,
    onTabChange: handleTabChange,
    onTabClose: handleTabClose
  };
  
  return (
    <ShellContext.Provider value={shellContextValue}>
      <div className={`${styles.shellRoot} ${isDarkTheme ? styles.darkTheme : styles.lightTheme}`}>
        {/* Top Bar */}
        <TopBar
          contextTitle={contextTitle}
          user={user}
          onUserAction={handleUserAction}
          isDarkTheme={isDarkTheme}
          onThemeToggle={handleThemeToggle}
        />
        
        {/* Tab Bar */}
        <TabBar
          openTabs={openTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onTabClose={handleTabClose}
        />
        
        {/* Main Layout */}
        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <nav className={styles.sidebarNav}>
              {navigationGroups.map(group => (
                <SidebarGroup
                  key={group.id}
                  group={group}
                  openTabs={openTabs}
                  activeTab={activeTab}
                  onTabOpen={handleTabOpen}
                  collapsedGroups={collapsedGroups}
                  onToggleGroup={handleToggleGroup}
                />
              ))}
            </nav>
          </aside>
          
          {/* Main Content Area */}
          <main className={styles.main}>
            {children}
          </main>
        </div>
      </div>
    </ShellContext.Provider>
  );
}

// Export context for other components to use
export { ShellContext };
