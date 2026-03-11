import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, AlertCircle, Clock } from "lucide-react";

interface SurveyQuestion {
  id: string;
  question_text: string;
  question_type: string;
  options: string | null;
  sort_order: number;
}

interface SurveyResponse {
  question_id: string;
  response_value: string;
  created_at: string;
}

interface Props {
  studentId: string;
}

const TYPE_LABELS: Record<string, string> = {
  text: "Texto Libre",
  multiple_choice: "Opción Múltiple",
  yes_no: "Sí / No",
};

export default function PersonalDiagnosticTab({ studentId }: Props) {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const [qRes, rRes] = await Promise.all([
        supabase
          .from("custom_survey_questions" as any)
          .select("*")
          .eq("trainer_id", user.id)
          .order("sort_order", { ascending: true }),
        supabase
          .from("custom_survey_responses" as any)
          .select("question_id, response_value, created_at")
          .eq("student_id", studentId),
      ]);

      setQuestions((qRes.data as any as SurveyQuestion[]) || []);
      setResponses((rRes.data as any as SurveyResponse[]) || []);
      setLoading(false);
    };

    load();
  }, [user, studentId]);

  if (loading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>;
  }

  if (questions.length === 0) {
    return (
      <Card className="card-glass">
        <CardContent className="py-8 text-center space-y-2">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">
            No has configurado preguntas de encuesta aún. Ve a <strong>Encuesta</strong> en el menú para crear tus preguntas.
          </p>
        </CardContent>
      </Card>
    );
  }

  const responseMap: Record<string, SurveyResponse> = {};
  for (const r of responses) {
    responseMap[r.question_id] = r;
  }

  const hasResponses = responses.length > 0;
  const lastResponse = responses.reduce((latest, r) => {
    return !latest || new Date(r.created_at) > new Date(latest.created_at) ? r : latest;
  }, null as SurveyResponse | null);

  const updatedDate = lastResponse
    ? new Date(lastResponse.created_at).toLocaleDateString("es-ES", {
        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : null;

  if (!hasResponses) {
    return (
      <Card className="card-glass">
        <CardContent className="py-8 text-center space-y-2">
          <Clock className="h-8 w-8 text-primary/50 mx-auto" />
          <p className="text-sm text-muted-foreground">El alumno aún no ha completado la encuesta personalizada.</p>
          <p className="text-xs text-muted-foreground">{questions.length} preguntas configuradas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Diagnóstico Personalizado</span>
        </div>
        {updatedDate && (
          <Badge variant="outline" className="gap-1 text-[10px] border-primary/30 text-primary">
            <Clock className="h-2.5 w-2.5" />
            {updatedDate}
          </Badge>
        )}
      </div>

      <div className="space-y-3">
        {questions.map((q, i) => {
          const response = responseMap[q.id];
          return (
            <div key={q.id} className="p-4 rounded-lg bg-secondary/30 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-medium">{i + 1}. {q.question_text}</span>
                <Badge variant="outline" className="text-[9px] border-border shrink-0">
                  {TYPE_LABELS[q.question_type] || q.question_type}
                </Badge>
              </div>
              <p className="text-sm text-foreground bg-background/50 p-2.5 rounded-md">
                {response?.response_value || <span className="text-muted-foreground italic">Sin respuesta</span>}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
