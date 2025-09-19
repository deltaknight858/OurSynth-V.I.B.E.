import { unstable_generateUtilityClasses as generateUtilityClasses } from '@mui/utils';
import { unstable_generateUtilityClass as generateUtilityClass } from '@mui/utils';

export interface TextFieldClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type TextFieldClassKey = keyof TextFieldClasses;

export function getTextFieldUtilityClass(slot: string): string {
  return generateUtilityClass('MuiTextField', slot);
}

const textFieldClasses: TextFieldClasses = generateUtilityClasses('MuiTextField', ['root']);

export default textFieldClasses;
