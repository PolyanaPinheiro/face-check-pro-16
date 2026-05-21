/**
 * faceScanProcessor.ts
 *
 * Processamento de reconhecimento facial para navegador / WebView Android.
 * Usa face-api.js com Tiny Face Detector e backend WebGL.
 * Inclui limpeza explícita de GPU e exemplo de integração com TypeORM + pgvector.
 *
 * Dependências necessárias no ambiente correto:
 * npm install face-api.js @tensorflow/tfjs-core @tensorflow/tfjs-backend-webgl
 * npm install typeorm pg pgvector
 */

import * as faceapi from "face-api.js";
import { setBackend, ready as tfReady, disposeVariables, engine } from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import { Column, DataSource, DataSourceOptions, Entity, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

// CORREÇÃO AQUI: Importa as funções utilitárias nativas do pacote sem invocar a classe 'Vector' inexistente
import pgvector from "pgvector/pg";

export const FACE_RECOGNITION_THRESHOLD = 0.55;
export const LIVENESS_BLINK_THRESHOLD = 0.22;
export const LIVENESS_HEAD_VARIATION_THRESHOLD = 0.08;

export interface FaceRecognitionResult {
  descriptor: Float32Array;
  detectionScore: number;
  liveness: FaceLivenessReport;
}

export interface FaceLivenessReport {
  blinkDetected: boolean;
  headMovementDetected: boolean;
  reason: string;
}

export interface FaceDatabaseMatch {
  id: string;
  label: string;
  distance: number;
  threshold: number;
  matched: boolean;
}

export interface FaceDatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface FaceLivenessState {
  frameIndex: number;
  blinkCount: number;
  lastEyeAspectRatio: number | null;
  lastHeadAngle: number | null;
  hasHeadVariation: boolean;
}

export const defaultLivenessState: FaceLivenessState = {
  frameIndex: 0,
  blinkCount: 0,
  lastEyeAspectRatio: null,
  lastHeadAngle: null,
  hasHeadVariation: false,
};

export async function configureFaceApiWebGLBackend(): Promise<void> {
  await setBackend("webgl");
  await tfReady();
}

export function getTinyFaceDetectorOptions(): faceapi.TinyFaceDetectorOptions {
  return new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 });
}

export async function loadFaceApiModels(modelUrl = "/models"): Promise<void> {
  await configureFaceApiWebGLBackend();
  await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
  await faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl);
  await faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl);
}

export function euclideanDistance(a: Float32Array | number[], b: Float32Array | number[]): number {
  if (a.length !== b.length) {
    throw new Error("Os vetores devem ter o mesmo comprimento para calcular a distância.");
  }
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    const diff = a[i] - b[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

export function isSameFace(distance: number, threshold = FACE_RECOGNITION_THRESHOLD): boolean {
  return distance <= threshold;
}

export function calculateEuclideanThreshold(threshold = FACE_RECOGNITION_THRESHOLD): number {
  return threshold;
}

function distance(pointA: faceapi.Point, pointB: faceapi.Point): number {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  return Math.hypot(dx, dy);
}

export function calculateEyeAspectRatio(eye: faceapi.Point[]): number {
  const vertical1 = distance(eye[1], eye[5]);
  const vertical2 = distance(eye[2], eye[4]);
  const horizontal = distance(eye[0], eye[3]);
  return (vertical1 + vertical2) / (2.0 * horizontal);
}

export function calculateHeadAngle(landmarks: faceapi.FaceLandmarks68): number {
  const leftEye = landmarks.getLeftEye();
  const rightEye = landmarks.getRightEye();
  const nose = landmarks.getNose()[0];

  const eyeCenter = {
    x: (leftEye[0].x + rightEye[3].x) / 2,
    y: (leftEye[0].y + rightEye[3].y) / 2,
  };

  return Math.atan2(nose.y - eyeCenter.y, nose.x - eyeCenter.x);
}

export function updateLivenessState(
  landmarks: faceapi.FaceLandmarks68,
  previousState: FaceLivenessState = defaultLivenessState
): FaceLivenessState {
  const leftEAR = calculateEyeAspectRatio(landmarks.getLeftEye());
  const rightEAR = calculateEyeAspectRatio(landmarks.getRightEye());
  const currentEAR = (leftEAR + rightEAR) / 2;
  const currentHeadAngle = calculateHeadAngle(landmarks);

  const blinkDetected =
    previousState.lastEyeAspectRatio !== null &&
    previousState.lastEyeAspectRatio > LIVENESS_BLINK_THRESHOLD &&
    currentEAR <= LIVENESS_BLINK_THRESHOLD;

  const headVariation =
    previousState.lastHeadAngle !== null &&
    Math.abs(currentHeadAngle - previousState.lastHeadAngle) >= LIVENESS_HEAD_VARIATION_THRESHOLD;

  return {
    frameIndex: previousState.frameIndex + 1,
    blinkCount: previousState.blinkCount + (blinkDetected ? 1 : 0),
    lastEyeAspectRatio: currentEAR,
    lastHeadAngle: currentHeadAngle,
    hasHeadVariation: previousState.hasHeadVariation || headVariation,
  };
}

export function evaluateLiveness(state: FaceLivenessState): FaceLivenessReport {
  const blinkDetected = state.blinkCount > 0;
  const headMovementDetected = state.hasHeadVariation;
  const reason = blinkDetected
    ? "Blink detectado"
    : headMovementDetected
    ? "Variação de ângulo detectada"
    : "Movimento de prova de vida insuficiente";

  return {
    blinkDetected,
    headMovementDetected,
    reason,
  };
}

export async function captureFaceDescriptor(
  source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement
): Promise<FaceRecognitionResult> {
  const options = getTinyFaceDetectorOptions();

  const fullResult = await faceapi
    .detectSingleFace(source, options)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!fullResult) {
    throw new Error("Nenhum rosto detectado. Garanta que o rosto esteja bem enquadrado.");
  }

  const livenessState = updateLivenessState(fullResult.landmarks, defaultLivenessState);
  const liveness = evaluateLiveness(livenessState);

  return {
    descriptor: fullResult.descriptor,
    detectionScore: fullResult.detection.score,
    liveness,
  };
}

export async function captureFaceDescriptorWithLiveCheck(
  source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  previousState: FaceLivenessState
): Promise<{ result: FaceRecognitionResult; state: FaceLivenessState }> {
  const options = getTinyFaceDetectorOptions();

  const fullResult = await faceapi
    .detectSingleFace(source, options)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!fullResult) {
    throw new Error("Nenhum rosto detectado. Garanta que o rosto esteja bem enquadrado.");
  }

  const state = updateLivenessState(fullResult.landmarks, previousState);
  const liveness = evaluateLiveness(state);

  return {
    result: {
      descriptor: fullResult.descriptor,
      detectionScore: fullResult.detection.score,
      liveness,
    },
    state,
  };
}

export async function findBestMatchInDatabase(
  descriptor: Float32Array,
  candidates: Array<{ id: string; label: string; descriptor: number[] }>,
  threshold = FACE_RECOGNITION_THRESHOLD
): Promise<FaceDatabaseMatch | null> {
  let best: FaceDatabaseMatch | null = null;

  for (const candidate of candidates) {
    const distance = euclideanDistance(descriptor, candidate.descriptor);
    const matched = isSameFace(distance, threshold);

    if (!best || distance < best.distance) {
      best = {
        id: candidate.id,
        label: candidate.label,
        distance,
        threshold,
        matched,
      };
    }
  }

  return best;
}

export async function loadNearestFaceTemplate(
  dataSource: DataSource,
  descriptor: number[]
): Promise<FaceDatabaseMatch | null> {
  // CORREÇÃO AQUI: Garante a formatação adequada da string do vetor usando o helper do cliente
  const vectorString = pgvector.toSql(descriptor);

  const raw = await dataSource.query(
    `SELECT id, label, descriptor, (descriptor <-> $1) AS distance FROM face_templates ORDER BY distance LIMIT 1`,
    [vectorString]
  );

  if (!raw || raw.length === 0) {
    return null;
  }

  const row = raw[0];
  return {
    id: row.id,
    label: row.label,
    distance: parseFloat(row.distance),
    threshold: FACE_RECOGNITION_THRESHOLD,
    matched: parseFloat(row.distance) <= FACE_RECOGNITION_THRESHOLD,
  };
}

@Entity("face_templates")
export class FaceTemplate extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "text" })
  label!: string;

  // CORREÇÃO AQUI: TypeORM gerencia a coluna como array nativa no TS e passa para a extensão do Postgres
  @Column({
    type: "vector",
    transformer: {
      to: (value: number[]) => value,
      from: (value: string | number[]) => {
        if (typeof value === "string") {
          // CORREÇÃO: Usando o método nativo de conversão de string para array
          return value.replace('[', '').replace(']', '').split(',').map(Number);
        }
        return value;
      },
    },
  })
  descriptor!: number[];
}

export function buildFaceDataSource(config: FaceDatabaseConfig): DataSource {
  const options: DataSourceOptions = {
    type: "postgres",
    host: config.host,
    port: config.port,
    username: config.username,
    password: config.password,
    database: config.database,
    entities: [FaceTemplate],
    synchronize: false,
    logging: false,
    extra: {
      extensions: ["vector"],
    },
  };

  return new DataSource(options);
}

export function releaseFaceApiGpuMemory(): void {
  try {
    disposeVariables();
  } catch {
    /** Ignora se não houver variáveis ativas */
  }

  try {
    // CORREÇÃO AQUI: Acessando via string ['backendInstance'] ou usando o método público oficial
    const currentEngine = engine();
    const backend = (currentEngine as any)['backendInstance'] || (faceapi.tf.backend ? faceapi.tf.backend() : null);
    
    if (backend && typeof backend.dispose === 'function') {
      backend.dispose();
    }
  } catch {
    /** Ignora falhas ao descartar o backend WebGL */
  }
}