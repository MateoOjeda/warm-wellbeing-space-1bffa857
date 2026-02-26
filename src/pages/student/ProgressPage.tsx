import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { WEEK_LABELS } from "@/lib/store";
import { TrendingUp, Weight, Target, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function ProgressPage() {
  const { currentStudent } = useApp();

  const routineData = currentStudent.completedRoutines.map((val, i) => ({
    name: WEEK_LABELS[i],
    rutinas: val,
  }));

  // Simulated weight progression
  const weightData = [
    { name: "Ene", peso: currentStudent.weight + 3 },
    { name: "Feb", peso: currentStudent.weight + 2 },
    { name: "Mar", peso: currentStudent.weight + 1.5 },
    { name: "Abr", peso: currentStudent.weight + 0.5 },
    { name: "May", peso: currentStudent.weight },
    { name: "Jun", peso: currentStudent.weight - 0.5 },
  ];

  const totalRoutines = currentStudent.completedRoutines.reduce((a, b) => a + b, 0);
  const completedToday = currentStudent.exercises.filter((e) => e.completed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/40">
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl font-display">
            {currentStudent.avatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-display font-bold tracking-wide neon-text">{currentStudent.name}</h1>
          <p className="text-muted-foreground text-sm">{currentStudent.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="card-glass">
          <CardContent className="p-4 text-center">
            <Target className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold">{totalRoutines}</p>
            <p className="text-[10px] text-muted-foreground">Rutinas totales</p>
          </CardContent>
        </Card>
        <Card className="card-glass">
          <CardContent className="p-4 text-center">
            <Zap className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold">{completedToday}</p>
            <p className="text-[10px] text-muted-foreground">Hoy completados</p>
          </CardContent>
        </Card>
        <Card className="card-glass">
          <CardContent className="p-4 text-center">
            <Weight className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold">{currentStudent.weight} kg</p>
            <p className="text-[10px] text-muted-foreground">Peso actual</p>
          </CardContent>
        </Card>
        <Card className="card-glass">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold">{currentStudent.exercises.length}</p>
            <p className="text-[10px] text-muted-foreground">Ejercicios</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-base">Rutinas por Semana</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={routineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
                  <XAxis dataKey="name" stroke="hsl(220, 10%, 55%)" fontSize={11} />
                  <YAxis stroke="hsl(220, 10%, 55%)" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(220, 18%, 11%)",
                      border: "1px solid hsl(142, 76%, 46%, 0.3)",
                      borderRadius: "8px",
                      color: "hsl(0, 0%, 95%)",
                    }}
                  />
                  <Area type="monotone" dataKey="rutinas" stroke="hsl(142, 76%, 46%)" fill="hsl(142, 76%, 46%, 0.15)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="text-base">Evolución de Peso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
                  <XAxis dataKey="name" stroke="hsl(220, 10%, 55%)" fontSize={11} />
                  <YAxis stroke="hsl(220, 10%, 55%)" fontSize={11} domain={["dataMin - 1", "dataMax + 1"]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(220, 18%, 11%)",
                      border: "1px solid hsl(142, 76%, 46%, 0.3)",
                      borderRadius: "8px",
                      color: "hsl(0, 0%, 95%)",
                    }}
                  />
                  <Line type="monotone" dataKey="peso" stroke="hsl(25, 95%, 53%)" strokeWidth={2} dot={{ fill: "hsl(25, 95%, 53%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
