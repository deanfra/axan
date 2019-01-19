export default interface RoomInstance {
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
  doors?: Array<number>;
  tiles?: Array<number>;
  setPosition(): void;
  overlaps(): boolean;
  isConnectedTo(): boolean;
}