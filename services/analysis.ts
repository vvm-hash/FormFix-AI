import { COLORS } from "@/constants/colors";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type Severity = "low" | "medium" | "high" | "critical";

export interface DetectedIssue {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  bodyPart: string;
}

export interface InjuryRisk {
  id: string;
  name: string;
  probability: number; // 0–100
  severity: Severity;
  affectedArea: string;
}

export interface Recommendation {
  id: string;
  text: string;
  priority: "high" | "medium" | "low";
  category: "form" | "strength" | "mobility" | "awareness";
}

export interface CorrectiveExercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
  category: "mobility" | "stability" | "strength" | "activation";
  description: string;
}

export interface AnalysisResult {
  id: string;
  exerciseName: string;
  analysisDate: string;
  riskScore: number; // 0–100
  overallSeverity: Severity;
  detectedIssues: DetectedIssue[];
  injuryRisks: InjuryRisk[];
  recommendations: Recommendation[];
  correctiveExercises: CorrectiveExercise[];
  anglesAnalyzed: number;
  confidenceScore: number; // 0–100
}

// ─────────────────────────────────────────────
// Mock Analysis Result
// ─────────────────────────────────────────────

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  id: "analysis_001",
  exerciseName: "Running Gait",
  analysisDate: new Date().toISOString(),
  riskScore: 72,
  overallSeverity: "high",
  confidenceScore: 91,
  anglesAnalyzed: 3,

  detectedIssues: [
    {
      id: "issue_01",
      title: "Knee Valgus Collapse",
      description:
        "Inward caving of the knee during the stance phase increases medial joint stress significantly.",
      severity: "high",
      bodyPart: "Knee",
    },
    {
      id: "issue_02",
      title: "Shoulder Misalignment",
      description:
        "Left shoulder drops during arm swing, causing rotational imbalance and energy inefficiency.",
      severity: "medium",
      bodyPart: "Shoulder",
    },
    {
      id: "issue_03",
      title: "Excessive Forward Lean",
      description:
        "Trunk leans more than 8° forward from vertical, loading lumbar vertebrae under impact.",
      severity: "high",
      bodyPart: "Spine",
    },
    {
      id: "issue_04",
      title: "Hip Drop (Trendelenburg)",
      description:
        "Contralateral hip drops during single-leg stance, indicating weak gluteus medius.",
      severity: "medium",
      bodyPart: "Hip",
    },
  ],

  injuryRisks: [
    {
      id: "risk_01",
      name: "ACL Strain",
      probability: 68,
      severity: "high",
      affectedArea: "Left Knee",
    },
    {
      id: "risk_02",
      name: "Lower Back Stress Fracture",
      probability: 54,
      severity: "high",
      affectedArea: "Lumbar Spine",
    },
    {
      id: "risk_03",
      name: "IT Band Syndrome",
      probability: 41,
      severity: "medium",
      affectedArea: "Right Knee / Hip",
    },
    {
      id: "risk_04",
      name: "Rotator Cuff Stress",
      probability: 29,
      severity: "low",
      affectedArea: "Left Shoulder",
    },
  ],

  recommendations: [
    {
      id: "rec_01",
      text: "Keep knees tracking directly over toes throughout entire stance phase.",
      priority: "high",
      category: "form",
    },
    {
      id: "rec_02",
      text: "Reduce forward spinal bend — aim for a 2–3° forward lean from ankles, not hips.",
      priority: "high",
      category: "awareness",
    },
    {
      id: "rec_03",
      text: "Engage your core before foot strike to protect the lumbar spine under load.",
      priority: "high",
      category: "strength",
    },
    {
      id: "rec_04",
      text: "Maintain level shoulder girdle — avoid compensatory arm swing rotations.",
      priority: "medium",
      category: "form",
    },
    {
      id: "rec_05",
      text: "Increase cadence by 5–8% to reduce ground contact time and impact forces.",
      priority: "medium",
      category: "awareness",
    },
  ],

  correctiveExercises: [
    {
      id: "ex_01",
      name: "Hip 90/90 Mobility Drill",
      sets: 3,
      reps: 10,
      category: "mobility",
      description:
        "Improves hip internal and external rotation range to reduce compensatory patterns.",
    },
    {
      id: "ex_02",
      name: "Single-Leg Stability Hold",
      sets: 3,
      duration: "30s each",
      category: "stability",
      description:
        "Trains gluteus medius and proprioception to prevent hip drop during stance.",
    },
    {
      id: "ex_03",
      name: "Glute Bridge Activation",
      sets: 4,
      reps: 15,
      category: "activation",
      description:
        "Activates posterior chain before runs to prime hip extensors and reduce knee load.",
    },
    {
      id: "ex_04",
      name: "Lateral Band Walk",
      sets: 3,
      reps: 20,
      category: "strength",
      description:
        "Strengthens hip abductors to correct knee valgus under dynamic loading.",
    },
    {
      id: "ex_05",
      name: "Thoracic Spine Rotation",
      sets: 2,
      reps: 12,
      category: "mobility",
      description:
        "Unlocks upper back mobility to reduce compensatory shoulder and lumbar rotation.",
    },
  ],
};

// ─────────────────────────────────────────────
// Helper Utilities
// ─────────────────────────────────────────────

/**
 * Returns a color token based on severity level.
 */
export function getRiskColor(severity: Severity): string {
  switch (severity) {
    case "critical":
      return "#FF1744";
    case "high":
      return COLORS.danger;
    case "medium":
      return "#FF9800";
    case "low":
      return COLORS.primary;
    default:
      return COLORS.textSecondary;
  }
}

/**
 * Returns a human-readable severity label with emoji indicator.
 */
export function getSeverityLevel(severity: Severity): {
  label: string;
  emoji: string;
} {
  switch (severity) {
    case "critical":
      return { label: "CRITICAL", emoji: "🔴" };
    case "high":
      return { label: "HIGH RISK", emoji: "🟠" };
    case "medium":
      return { label: "MODERATE", emoji: "🟡" };
    case "low":
      return { label: "LOW RISK", emoji: "🟢" };
    default:
      return { label: "UNKNOWN", emoji: "⚪" };
  }
}

/**
 * Maps a 0–100 risk score to a Severity bucket.
 */
export function scoreToSeverity(score: number): Severity {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 35) return "medium";
  return "low";
}

/**
 * Returns category display name and icon character.
 */
export function getCategoryMeta(
  category: CorrectiveExercise["category"]
): { label: string; icon: string } {
  switch (category) {
    case "mobility":
      return { label: "Mobility", icon: "⟳" };
    case "stability":
      return { label: "Stability", icon: "◈" };
    case "strength":
      return { label: "Strength", icon: "▲" };
    case "activation":
      return { label: "Activation", icon: "⚡" };
    default:
      return { label: "General", icon: "•" };
  }
}

/**
 * Formats an ISO date string to a readable display string.
 */
export function formatAnalysisDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}