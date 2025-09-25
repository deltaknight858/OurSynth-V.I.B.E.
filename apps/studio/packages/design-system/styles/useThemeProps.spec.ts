import { Theme, useThemeProps } from '@mui/material/styles';
import { SliderProps } from '@mui/material/Slider';

describe('useThemeProps', () => {
  it('should provide themed component props', () => {
    function ThemedComponent() {
      const props = useThemeProps<Theme, SliderProps, 'MuiSlider'>({
        props: { color: 'primary' },
        name: 'MuiSlider',
      });

      // component's props are valid
      // Only existence of props is relevant here not type.
      expect(props.track).toBeDefined();
      expect(props.valueLabelDisplay).toBeDefined();
      
      return null;
    }

    expect(ThemedComponent).toBeDefined();
  });
});
