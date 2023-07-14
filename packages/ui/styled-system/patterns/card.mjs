import { mapObject } from '../helpers.mjs';
import { css } from '../css/index.mjs';

const cardConfig = {
transform(props) {
  return {
    borderWidth: "1px",
    borderColor: "gray.700",
    borderRadius: 8,
    ...props
  };
}}

export const getCardStyle = (styles = {}) => cardConfig.transform(styles, { map: mapObject })

export const card = (styles) => css(getCardStyle(styles))