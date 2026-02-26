import { useState } from "react";
import { useApp } from "@/lib/context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3 } from "lucide-react";
import { WEEK_LABELS } from "@/lib/store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TrackingPage() {
  const { students } = useApp();
  const [selectedStudent, setSelectedStudent] = useState(students[0]?.id || "");
  const student = students.find((s) => s.id === selectedStudent);

  const chartData = student
    ? student.completedRoutines.map((val, i) => ({
        name: WEEK_LABELS[i],
        completadas: val,
      }))
    : [];

  const totalCompleted = student ? student.completedRoutines.reduce((a, b) => a + b, 0) : 0;
  const avg = student ? Math.round(totalCompleted / student.completedRoutines.length) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold tracking-wide neon-text">Seguimiento</h1>
        <p className="text-muted-foreground text-sm mt-1">Progreso de rutinas completadas por alumno</p>
      </div>

      <div className="max-w-xs">
        <Select value={selectedStudent} onValueChange={setSelectedStudent}>
          <SelectTrigger className="bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {students.map((s) => (
              <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {student && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="card-glass lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Rutinas Completadas por Semana
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
                    <XAxis dataKey="name" stroke="hsl(220, 10%, 55%)" fontSize={12} />
                    <YAxis stroke="hsl(220, 10%, 55%)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(220, 18%, 11%)",
                        border: "1px solid hsl(142, 76%, 46%, 0.3)",
                        borderRadius: "8px",
                        color: "hsl(0, 0%, 95%)",
                      }}
                    />
                    <Bar dataKey="completadas" fill="hsl(142, 76%, 46%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="card-glass neon-border">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{totalCompleted}</p>
                <p className="text-xs text-muted-foreground mt-1">Total rutinas completadas</p>
              </CardContent>
            </Card>
            <Card className="card-glass">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">{avg}</p>
                <p className="text-xs text-muted-foreground mt-1">Promedio semanal</p>
              </CardContent>
            </Card>
            <Card className="card-glass">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold">{student.exercises.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Ejercicios asignados</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
