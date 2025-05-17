
export interface ElementPosition {
  top: number;
  left: number;
}

export interface EditableElement {
  text: string;
  style: Record<string, string>;
  position: ElementPosition;
}
