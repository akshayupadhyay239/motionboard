export type ContestCategory =
  | 'Ad'
  | 'AI Ad'
  | 'Social'
  | 'Cinematic'
  | 'Music Video'
  | 'Short Film'
  | 'Other'

export type SourcePlatform =
  | 'Twitter'
  | 'YouTube'
  | 'Instagram'
  | 'Reddit'
  | 'Website'

export type ContestStatus = 'open' | 'closed'

export interface Contest {
  id: string
  title: string
  brand: string
  description: string
  prize: string
  deadline: string // ISO date string
  category: ContestCategory
  source_platform: SourcePlatform
  source_url: string
  thumbnail_url: string | null
  featured: boolean
  status: ContestStatus
  submitted_by: string | null
  approved: boolean
  created_at: string
}

export type ContestInsert = Omit<Contest, 'id' | 'created_at' | 'approved' | 'featured' | 'status'> & {
  approved?: boolean
  featured?: boolean
  status?: ContestStatus
}
