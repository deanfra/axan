export interface RoomInstance {
  x?: number;
  y?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  centerX?: number;
  centerY?: number;
  width?: number;
  height?: number;
  doors?: Array<DoorInstance>;
  tiles?: Array<Array<number>>;
  setPosition(): void;
  overlaps(): boolean;
  isConnectedTo(): boolean;
}

export interface DoorInstance {
  x: number;
  y: number;
  linksTo: number;
}