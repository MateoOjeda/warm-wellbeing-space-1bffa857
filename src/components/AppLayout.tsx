import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppContext } from "@/lib/context";
import { useAppState } from "@/lib/store";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  const appState = useAppState();

  return (
    <AppContext.Provider value={appState}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 flex items-center border-b border-border px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
              <SidebarTrigger className="mr-4" />
              <div className="flex-1" />
            </header>
            <main className="flex-1 p-4 md:p-6 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AppContext.Provider>
  );
}
