import { unstable_generateUtilityClasses as generateUtilityClasses } from '@mui/utils';
import { unstable_generateUtilityClass as generateUtilityClass } from '@mui/utils';

export interface CardClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type CardClassKey = keyof CardClasses;

export function getCardUtilityClass(slot: string): string {
  return generateUtilityClass('MuiCard', slot);
}

const cardClasses: CardClasses = generateUtilityClasses('MuiCard', ['root']);

export default cardClasses;
