import { Direction } from '../enums'
export interface Rover {
  position: {
    x: number;
    y: number;
    direction: string;
  },
  instructions: string;
}
