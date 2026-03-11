import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Check, Loader2, Clock } from "lucide-react";

interface SurveyQuestion {
  id: string;
  question_text: string;
  question_type: "text" | "multiple_choice" | "yes_no";
  options: string | null;
  sort_order: number;
}

export default function PersonalChangePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trainerId, setTrainerId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;

    // Get trainer link
    const { data: link } = await supabase
      .from("trainer_students")
      .select("trainer_id")
      .eq("student_id", user.id)
      .limit(1)
      .maybeSingle();

    if (!link) {
      setLoading(false);
      return;
    }

    setTrainerId(link.trainer_id);

    // Fetch questions and existing responses in parallel
    const [qRes, rRes] = await Promise.all([
      supabase
        .from("custom_survey_questions" as any)
        .select("*")
        .eq("trainer_id", link.trainer_id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("custom_survey_responses" as any)
        .select("question_id, response_value")
        .eq("student_id", user.id),
    ]);

    const qs = (qRes.data as any as SurveyQuestion[]) || [];
    setQuestions(qs);

    // Map existing responses
    const existing: Record<string, string> = {};
    const resData = (rRes.data as any[]) || [];
    for (const r of resData) {
      existing[r.question_id] = r.response_value;
    }
    setResponses(existing);
    setSubmitted(resData.length > 0 && resData.length >= qs.length);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const setResponse = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const submit = async () => {
    if (!user) return;
    // Validate all answered
    for (const q of questions) {
      if (!responses[q.id]?.trim()) {
        toast({ title: "Campos incompletos", description: "Completa todas las preguntas antes de enviar.", variant: "destructive" });
        return;
      }
    }

    setSaving(true);

    // Upsert all responses
    const upserts = questions.map((q) => ({
      student_id: user.id,
      question_id: q.id,
      response_value: responses[q.id]?.trim() || "",
    }));

    const { error } = await supabase
      .from("custom_survey_responses" as any)
      .upsert(upserts as any, { onConflict: "student_id,question_id" });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      // Notify trainer via feed
      if (trainerId) {
        await supabase.from("trainer_changes").insert({
          student_id: user.id,
          trainer_id: trainerId,
          change_type: "personal_survey",
          description: "Completó la encuesta de Cambio Personal personalizada",
        });
      }
      toast({ title: "¡Guardado!", description: "Tu encuesta ha sido registrada exitosamente." });
      setSubmitted(true);
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  // No trainer linked
  if (!trainerId) {
    return (
      <div className="max-w-lg mx-auto">
        <Card className="card-glass">
          <CardContent className="py-12 text-center space-y-3">
            <Sparkles className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">No estás vinculado a un entrenador todavía.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No questions configured
  if (questions.length === 0) {
    return (
      <div className="max-w-lg mx-auto">
        <Card className="card-glass">
          <CardContent className="py-12 text-center space-y-3">
            <Clock className="h-10 w-10 text-primary/50 mx-auto" />
            <p className="text-sm font-medium">Tu entrenador está personalizando tu seguimiento</p>
            <p className="text-xs text-muted-foreground">Vuelve pronto para completar tu encuesta.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10 neon-glow">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h1 className="font-display text-xl font-bold tracking-wide neon-text">CAMBIO PERSONAL</h1>
        <p className="text-sm text-muted-foreground">
          {submitted ? "Tus respuestas han sido registradas. Podés actualizarlas en cualquier momento." : "Completa la encuesta diseñada por tu entrenador"}
        </p>
      </div>

      <Card className="card-glass neon-border">
        <CardContent className="p-5 space-y-6">
          {questions.map((q, i) => (
            <div key={q.id} className="space-y-2">
              <Label className="text-sm font-medium text-foreground">
                {i + 1}. {q.question_text}
              </Label>

              {q.question_type === "text" && (
                <Textarea
                  value={responses[q.id] || ""}
                  onChange={(e) => setResponse(q.id, e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  className="resize-none"
                  rows={3}
                  maxLength={1000}
                />
              )}

              {q.question_type === "yes_no" && (
                <RadioGroup
                  value={responses[q.id] || ""}
                  onValueChange={(v) => setResponse(q.id, v)}
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="Sí" id={`${q.id}-si`} />
                    <Label htmlFor={`${q.id}-si`} className="text-sm cursor-pointer">Sí</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="No" id={`${q.id}-no`} />
                    <Label htmlFor={`${q.id}-no`} className="text-sm cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              )}

              {q.question_type === "multiple_choice" && q.options && (
                <RadioGroup
                  value={responses[q.id] || ""}
                  onValueChange={(v) => setResponse(q.id, v)}
                  className="space-y-2"
                >
                  {q.options.split(",").map((opt) => {
                    const trimmed = opt.trim();
                    return (
                      <div key={trimmed} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30">
                        <RadioGroupItem value={trimmed} id={`${q.id}-${trimmed}`} />
                        <Label htmlFor={`${q.id}-${trimmed}`} className="text-sm cursor-pointer flex-1">{trimmed}</Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={submit} disabled={saving} className="w-full gap-2">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        {saving ? "Guardando..." : submitted ? "Actualizar Respuestas" : "Enviar Encuesta"}
      </Button>
    </div>
  );
}
