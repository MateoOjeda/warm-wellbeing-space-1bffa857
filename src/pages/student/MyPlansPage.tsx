import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Apple, Dumbbell, Heart, StretchHorizontal, ClipboardList, Lock } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Apple,
  Dumbbell,
  Heart,
  Stretch: StretchHorizontal,
};

export default function MyPlansPage() {
  const { currentStudent } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-wide neon-text">Mis Planes</h1>
        <p className="text-muted-foreground text-sm mt-1">Planes asignados por tu entrenador</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentStudent.plans.map((plan) => {
          const Icon = iconMap[plan.icon] || ClipboardList;
          return (
            <Card
              key={plan.id}
              className={`card-glass transition-all duration-300 ${
                plan.enabled ? "neon-border" : "opacity-50"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${plan.enabled ? "bg-primary/15" : "bg-secondary"}`}>
                    {plan.enabled ? (
                      <Icon className="h-6 w-6 text-primary" />
                    ) : (
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      plan.enabled
                        ? "border-primary/40 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {plan.enabled ? "Habilitado" : "Próximamente"}
                  </Badge>
                </div>
                <h3 className={`font-semibold mb-1 ${!plan.enabled && "text-muted-foreground"}`}>
                  {plan.name}
                </h3>
                <p className="text-xs text-muted-foreground">{plan.description}</p>
                {plan.enabled && (
                  <div className="mt-4 h-1 rounded-full bg-primary/20">
                    <div className="h-full w-2/3 rounded-full bg-primary" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
