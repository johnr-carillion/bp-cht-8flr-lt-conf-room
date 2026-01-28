export interface SourceItem {
  sourceName: string;
  sourceType: string;
  sourceValue: number;
}

export interface SourceGroup {
  name: string;
  items: SourceItem[];
}