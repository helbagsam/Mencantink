/**
 * Layanan kepercayaan — semua akses ke data pengrajin, bukti proses, dan hasil
 * tinjauan lewat sini.
 *
 * Komponen tidak pernah menyentuh localStorage. Waktu pindah ke database,
 * hanya services/storage.ts yang berubah; berkas ini dan seluruh komponen tetap.
 */

import { Artisan, computeLadder, deriveTier, LadderProgress } from '../domain/artisan';
import {
  ProofPack,
  TrustTier,
  VerificationRecord,
  Verifier,
  missingRequiredProof,
} from '../domain/trust';
import {
  SEED_ARTISANS,
  SEED_PROOF_PACKS,
  SEED_VERIFICATIONS,
  SEED_VERIFIERS,
} from '../data/trustSeed';
import { readCollection, upsert } from './storage';

const ARTISANS = 'artisans';
const PROOF_PACKS = 'proof_packs';
const VERIFICATIONS = 'verifications';
const VERIFIERS = 'verifiers';

/* ------------------------------------------------------------------ */
/* Baca                                                                */
/* ------------------------------------------------------------------ */

export async function getArtisans(): Promise<Artisan[]> {
  return readCollection<Artisan>(ARTISANS, SEED_ARTISANS);
}

export async function getArtisanById(id: string): Promise<Artisan | null> {
  const rows = await getArtisans();
  return rows.find((a) => a.id === id) ?? null;
}

export async function getArtisanBySlug(slug: string): Promise<Artisan | null> {
  const rows = await getArtisans();
  return rows.find((a) => a.slug === slug) ?? null;
}

export async function getVerifiers(): Promise<Verifier[]> {
  return readCollection<Verifier>(VERIFIERS, SEED_VERIFIERS);
}

export async function getProofPacks(): Promise<ProofPack[]> {
  return readCollection<ProofPack>(PROOF_PACKS, SEED_PROOF_PACKS);
}

export async function getVerifications(): Promise<VerificationRecord[]> {
  return readCollection<VerificationRecord>(VERIFICATIONS, SEED_VERIFICATIONS);
}

/* ------------------------------------------------------------------ */
/* Tulis                                                               */
/* ------------------------------------------------------------------ */

export async function saveProofPack(pack: ProofPack): Promise<ProofPack> {
  return upsert<ProofPack>(PROOF_PACKS, pack, SEED_PROOF_PACKS);
}

export async function saveArtisan(artisan: Artisan): Promise<Artisan> {
  return upsert<Artisan>(ARTISANS, artisan, SEED_ARTISANS);
}

export async function saveVerification(
  record: VerificationRecord,
): Promise<VerificationRecord> {
  return upsert<VerificationRecord>(VERIFICATIONS, record, SEED_VERIFICATIONS);
}

/**
 * Menyetel ulang tingkat pengrajin dari bukti yang benar-benar tercatat.
 *
 * Tingkat tidak pernah ditulis langsung dari antarmuka. Dia selalu dihitung,
 * supaya tidak bisa berubah jadi sekadar tulisan seperti badge "98%
 * Authenticity" pada versi lama aplikasi ini.
 */
export async function recomputeArtisanTier(artisanId: string): Promise<TrustTier | null> {
  const artisan = await getArtisanById(artisanId);
  if (!artisan) return null;

  const packs = await getProofPacks();
  const verifiedCount = packs.filter(
    (p) => p.artisanId === artisanId && p.status === 'verified',
  ).length;

  const tier = deriveTier(artisan, { verifiedProofPackCount: verifiedCount });
  if (tier !== artisan.tier) {
    await saveArtisan({ ...artisan, tier });
  }
  return tier;
}

/* ------------------------------------------------------------------ */
/* Ringkasan untuk antarmuka                                           */
/* ------------------------------------------------------------------ */

/**
 * Semua yang dibutuhkan panel Bukti Keaslian pada halaman produk, dalam satu
 * bentuk siap pakai supaya komponen tidak perlu merangkai sendiri.
 */
export interface ProductTrustSummary {
  productId: string;
  artisan: Artisan | null;
  proofPack: ProofPack | null;
  verification: VerificationRecord | null;
  verifier: Verifier | null;
  secondVerifier: Verifier | null;
  /** Jenis bukti wajib yang belum diunggah. */
  missingProof: ReturnType<typeof missingRequiredProof>;
  /** Tingkat yang berlaku untuk produk ini. */
  tier: TrustTier;
}

export async function getProductTrust(
  productId: string,
  fallbackArtisanId?: string,
): Promise<ProductTrustSummary> {
  const [artisans, packs, verifications, verifiers] = await Promise.all([
    getArtisans(),
    getProofPacks(),
    getVerifications(),
    getVerifiers(),
  ]);

  const proofPack = packs.find((p) => p.productId === productId) ?? null;
  const artisanId = proofPack?.artisanId ?? fallbackArtisanId;
  const artisan = artisans.find((a) => a.id === artisanId) ?? null;

  const verification = proofPack
    ? (verifications.find((v) => v.proofPackId === proofPack.id) ?? null)
    : null;

  const verifier = verification
    ? (verifiers.find((v) => v.id === verification.verifierId) ?? null)
    : null;

  const secondVerifier = verification?.secondReviewerId
    ? (verifiers.find((v) => v.id === verification.secondReviewerId) ?? null)
    : null;

  return {
    productId,
    artisan,
    proofPack,
    verification,
    verifier,
    secondVerifier,
    missingProof: proofPack ? missingRequiredProof(proofPack) : [],
    // Produk tanpa bukti yang ditinjau tidak mewarisi tingkat pengrajinnya.
    // Kepercayaan melekat pada kain yang diperiksa, bukan pada nama pembuatnya.
    tier: verification && proofPack?.status === 'verified' ? (artisan?.tier ?? 'registered') : 'registered',
  };
}

/** Tangga naik tingkat seorang pengrajin, lengkap dengan langkah yang tersisa. */
export async function getArtisanLadder(artisanId: string): Promise<LadderProgress | null> {
  const artisan = await getArtisanById(artisanId);
  if (!artisan) return null;

  const packs = await getProofPacks();
  const verifiedProofPackCount = packs.filter(
    (p) => p.artisanId === artisanId && p.status === 'verified',
  ).length;

  return computeLadder(artisan, { verifiedProofPackCount });
}

/** Daftar produk yang pernah diunggah seorang pengrajin. */
export async function getArtisanProofPacks(artisanId: string): Promise<ProofPack[]> {
  const packs = await getProofPacks();
  return packs.filter((p) => p.artisanId === artisanId);
}
