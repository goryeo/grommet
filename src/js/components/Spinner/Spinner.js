import React, { isValidElement, forwardRef, useContext } from 'react';
import { ThemeContext } from 'styled-components';

import { Box } from '../Box';
import { defaultProps } from '../../default-props';

const BasicSpinner = ({ size, ref, ...rest }) => (
  <Box height={size} width={size} ref={ref} {...rest} />
);

/**
 * If the user is calling <Spinner>…</Spinner> with children, it will take
 * precedence over theme styling. Yet, it will still inherit the
 * default animation and size of the spinner, and of course any additional
 * given props.
 *
 * If the user is providing an icon/svg via the theme.spinner.icon,
 * the Spinner will use it as a child and will include all its relevant
 * theme props (size/color/pad…) as well,
 * user will only need to type <Spinner />.
 * If the icon has its own animation, user can turn it off via the theme.
 *
 * If none of the above is provider <Spinner /> will provide its default border,
 * size and friends, all configurable via theme.
 */
const Spinner = forwardRef(
  ({ children, color: colorProp, size, ...rest }, ref) => {
    const theme = useContext(ThemeContext) || defaultProps.theme;

    // Avoid color and size leaking into the DOM
    const {
      size: sizeThemeProp,
      color: colorThemeProp,
      ...themeProps
    } = theme.spinner.container;

    const normalizedSize = size || sizeThemeProp;
    const spinnerSize = theme.spinner.size[normalizedSize] || normalizedSize;

    const color = colorProp || colorThemeProp;
    const Icon = theme.spinner.icon;

    // children will take precedence over theme attributes
    if (children) {
      return (
        <BasicSpinner size={spinnerSize} ref={ref} {...rest}>
          {children}
        </BasicSpinner>
      );
    }

    // In case icon is provided by the theme
    if (Icon)
      return (
        <BasicSpinner size={spinnerSize} ref={ref} {...themeProps} {...rest}>
          {/* If the icon is SVG then treat it differently than an element */}
          {isValidElement(Icon) ? (
            Icon
          ) : (
            <Icon size={spinnerSize} color={color} />
          )}
        </BasicSpinner>
      );

    return (
      <BasicSpinner
        size={spinnerSize}
        ref={ref}
        border={[
          { side: 'all', color: 'background-contrast', size },
          { side: 'top', color, size },
        ]}
        {...themeProps}
        {...rest}
      />
    );
  },
);

Spinner.displayName = 'Spinner';

let SpinnerDoc;
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  SpinnerDoc = require('./doc').doc(Spinner);
}
const SpinnerWrapper = SpinnerDoc || Spinner;

export { SpinnerWrapper as Spinner };