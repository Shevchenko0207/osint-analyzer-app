export type VPKGrade = 1 | 2 | 3 | 4 | 5;

export type EntityCluster =
  | 'DIRECT_DEFENSE'
  | 'HYPER_GROWTH_SATELLITE'
  | 'OCCUPIED_TERRITORY_HUB'
  | 'DUAL_USE_RD'
  | 'FINANCIAL_HUB'
  | 'MILITARY_EDTECH'
  | 'CIVIL_SECURITY'
  | 'CIVILIAN';

export interface EntityMetrics {
  revenue?: string;
  profit?: string;
  age?: number;
  type?: string;
}

export interface OSINTEntity {
  id: string;
  name: string;
  city: string;
  vpk_score: VPKGrade;
  cluster: EntityCluster;
  color: string;
  sanctions: string[];
  metrics: EntityMetrics;
  tags: string[];
  training_hub: boolean;
  lat: number;
  lng: number;
}

export interface FilterState {
  searchQuery: string;
  selectedGrade: VPKGrade | 'ALL';
  onlyTrainingHubs: boolean;
  onlySanctioned: boolean;
  selectedCluster: EntityCluster | 'ALL';
}
