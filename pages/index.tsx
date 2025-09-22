import AppLayout from "../components/AppLayout";
import { useContext } from "react";
import { ShellContext } from "../components/Shell";
import { Palette, Zap, FileText, BookOpen, Package } from "lucide-react";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const shellContext = useContext(ShellContext);
  
  const quickActions = [
    {
      title: "Studio",
      description: "Create and edit visual content",
      icon: Palette,
      href: "/studio",
      color: "#7C4DFF"
    },
    {
      title: "Aether",
      description: "AI-powered workflow automation",
      icon: Zap,
      href: "/aether",
      color: "#00F5FF"
    },
    {
      title: "Notes",
      description: "Capture ideas and thoughts",
      icon: FileText,
      href: "/notes",
      color: "#FF6B35"
    },
    {
      title: "Notebooks",
      description: "Organize knowledge and projects",
      icon: BookOpen,
      href: "/notebooks",
      color: "#7C4DFF"
    },
    {
      title: "Capsules",
      description: "Package and share workflows",
      icon: Package,
      href: "/capsules",
      color: "#00F5FF"
    }
  ];
  
  const handleQuickAction = (item) => {
    if (shellContext?.onTabOpen) {
      shellContext.onTabOpen({
        href: item.href,
        label: item.title,
        icon: item.icon
      });
    }
  };

  return (
    <AppLayout title="Dashboard">
      <div className={styles.dashboard}>
        <header className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>Welcome to OurSynth</h1>
          <p className={styles.dashboardSubtitle}>
            Your creative ecosystem for building, organizing, and sharing digital workflows
          </p>
        </header>

        <section className={styles.quickActions}>
          <h2 className={styles.sectionTitle}>Quick Actions</h2>
          <div className={styles.actionGrid}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.href}
                  className={styles.actionCard}
                  onClick={() => handleQuickAction(action)}
                  style={{ '--accent-color': action.color }}
                >
                  <div className={styles.actionIcon}>
                    <Icon size={24} />
                  </div>
                  <div className={styles.actionContent}>
                    <h3 className={styles.actionTitle}>{action.title}</h3>
                    <p className={styles.actionDescription}>{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.recentActivity}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <Palette size={16} />
              </div>
              <div className={styles.activityContent}>
                <span className={styles.activityTitle}>New Studio Project Created</span>
                <span className={styles.activityTime}>2 hours ago</span>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <Package size={16} />
              </div>
              <div className={styles.activityContent}>
                <span className={styles.activityTitle}>Capsule "Alpha" Published</span>
                <span className={styles.activityTime}>1 day ago</span>
              </div>
            </div>
            <div className={styles.activityItem}>
              <div className={styles.activityIcon}>
                <Zap size={16} />
              </div>
              <div className={styles.activityContent}>
                <span className={styles.activityTitle}>Aether Workflow Automated</span>
                <span className={styles.activityTime}>2 days ago</span>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.systemStatus}>
          <h2 className={styles.sectionTitle}>System Status</h2>
          <div className={styles.statusGrid}>
            <div className={styles.statusCard}>
              <div className={styles.statusIndicator} data-status="online"></div>
              <span>All Systems Operational</span>
            </div>
            <div className={styles.statusCard}>
              <div className={styles.statusIndicator} data-status="online"></div>
              <span>Aether Engine Running</span>
            </div>
            <div className={styles.statusCard}>
              <div className={styles.statusIndicator} data-status="online"></div>
              <span>Studio Services Active</span>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
