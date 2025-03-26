
export type certificate_type = 'course' | 'competition' | 'other';
export type competition_level = 'college' | 'state' | 'national' | 'international' | null;

export interface Certificate {
  id: string;
  student_id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  certificate_type: certificate_type;
  competition_level: competition_level;
  verification_hash: string | null;
  points_awarded: number;
  media_url: string | null;
  metadata: any | null;
  created_at: string;
}

export interface PointRule {
  id: string;
  certificate_type: certificate_type;
  competition_level: competition_level;
  points: number;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  student_id: string;
  institution: string | null;
  total_points: number;
  institution_rank: number | null;
  overall_rank: number | null;
  last_updated: string;
  // Join with profiles
  display_name?: string;
  avatar_url?: string | null;
}
