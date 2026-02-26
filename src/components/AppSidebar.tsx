import { Users, Dumbbell, ClipboardList, BarChart3, CalendarCheck, Trophy, User, Zap } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const trainerItems = [
  { title: "Alumnos", url: "/trainer/students", icon: Users },
  { title: "Rutinas", url: "/trainer/routines", icon: Dumbbell },
  { title: "Planes", url: "/trainer/plans", icon: ClipboardList },
  { title: "Seguimiento", url: "/trainer/tracking", icon: BarChart3 },
];

const studentItems = [
  { title: "Mi Rutina Hoy", url: "/student/today", icon: CalendarCheck },
  { title: "Mis Planes", url: "/student/plans", icon: Trophy },
  { title: "Mi Progreso", url: "/student/progress", icon: Zap },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isTrainer = location.pathname.startsWith("/trainer");

  const items = isTrainer ? trainerItems : studentItems;
  const roleLabel = isTrainer ? "Entrenador" : "Alumno";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-display text-sm font-bold tracking-wider neon-text">FITPRO</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{roleLabel}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-[10px] uppercase tracking-widest">
            {!collapsed && "Navegación"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-secondary/80 transition-colors"
                      activeClassName="bg-primary/10 text-primary neon-border"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-[10px] uppercase tracking-widest">
            {!collapsed && "Cambiar Vista"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={isTrainer ? "/student/today" : "/trainer/students"}
                    className="hover:bg-secondary/80 transition-colors"
                    activeClassName=""
                  >
                    <User className="mr-2 h-4 w-4" />
                    {!collapsed && <span>{isTrainer ? "Vista Alumno" : "Vista Entrenador"}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <p className="text-[10px] text-muted-foreground text-center">FitPro v1.0</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
