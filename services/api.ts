import { AnalysisResult, MOCK_ANALYSIS_RESULT } from "./analysis";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface UploadVideoPayload {
  exerciseId: string;
  angle: "front" | "side" | "rear" | "overhead";
  videoUri: string;
  durationSeconds?: number;
}

export interface UploadVideoResponse {
  uploadId: string;
  status: "queued" | "processing" | "ready" | "error";
  angle: string;
  uploadedAt: string;
}

export interface StartAnalysisPayload {
  exerciseId: string;
  uploadIds: string[];
  userId?: string;
}

export interface StartAnalysisResponse {
  analysisId: string;
  status: "queued" | "processing" | "complete" | "error";
  estimatedDurationMs: number;
  startedAt: string;
}

export interface GetAnalysisResultsResponse {
  analysisId: string;
  status: "processing" | "complete" | "error";
  result: AnalysisResult | null;
  completedAt?: string;
}

// ─────────────────────────────────────────────
// Simulated Network Delay
// ─────────────────────────────────────────────

function simulateDelay(ms: number = 1200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────
// API Service
// ─────────────────────────────────────────────

/**
 * Uploads a single movement video for a given angle.
 * In production: POST /api/uploads
 */
export async function uploadMovementVideos(
  payload: UploadVideoPayload
): Promise<UploadVideoResponse> {
  await simulateDelay(800);

  // TODO: Replace with real multipart/form-data upload to backend
  return {
    uploadId: `upload_${Date.now()}_${payload.angle}`,
    status: "ready",
    angle: payload.angle,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Triggers AI biomechanical analysis for a set of uploaded videos.
 * In production: POST /api/analysis/start
 */
export async function startAnalysis(
  payload: StartAnalysisPayload
): Promise<StartAnalysisResponse> {
  await simulateDelay(1000);

  if (!payload.uploadIds || payload.uploadIds.length === 0) {
    throw new Error("At least one upload ID is required to start analysis.");
  }

  // TODO: Replace with real API call — send uploadIds and exerciseId
  return {
    analysisId: `analysis_${Date.now()}`,
    status: "processing",
    estimatedDurationMs: 8000,
    startedAt: new Date().toISOString(),
  };
}

/**
 * Polls or fetches the completed analysis results.
 * In production: GET /api/analysis/:analysisId/results
 */
export async function getAnalysisResults(
  analysisId: string
): Promise<GetAnalysisResultsResponse> {
  await simulateDelay(1400);

  if (!analysisId) {
    throw new Error("Analysis ID is required.");
  }

  // TODO: Replace with real polling or webhook-based result fetch
  return {
    analysisId,
    status: "complete",
    result: MOCK_ANALYSIS_RESULT,
    completedAt: new Date().toISOString(),
  };
}

/**
 * Fetches the history of past analyses for a user.
 * In production: GET /api/analysis/history?userId=...
 */
export async function getAnalysisHistory(
  userId: string
): Promise<{ analyses: Pick<AnalysisResult, "id" | "exerciseName" | "riskScore" | "analysisDate">[] }> {
  await simulateDelay(700);

  // TODO: Replace with paginated real endpoint
  return {
    analyses: [
      {
        id: "analysis_001",
        exerciseName: "Running Gait",
        riskScore: 72,
        analysisDate: new Date().toISOString(),
      },
      {
        id: "analysis_002",
        exerciseName: "Barbell Squat",
        riskScore: 45,
        analysisDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ],
  };
}

/**
 * Deletes a specific analysis record.
 * In production: DELETE /api/analysis/:analysisId
 */
export async function deleteAnalysis(
  analysisId: string
): Promise<{ success: boolean }> {
  await simulateDelay(500);

  // TODO: Replace with real DELETE request
  return { success: true };
}