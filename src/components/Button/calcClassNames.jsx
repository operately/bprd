import classNames from "classnames";

/**
 * Calculate class names for button based on props and theme options
 * @param {import('./UnstyledButton').BaseButtonProps} props - Button props
 * @param {Object} options - Theme options
 * @param {string} options.normal - Classes to apply in normal state
 * @param {string} options.loading - Classes to apply in loading state
 * @param {string} options.always - Classes to always apply
 * @returns {string} - Calculated class names
 */
export function calcClassName(props, { normal, loading, always }) {
  const size = props.size || "base";

  return classNames(
    "relative",
    "flex-grow-0 flex-shrink-0",
    "font-semibold text-center inline-flex items-center justify-center",
    "transition-all duration-100",
    always,
    {
      "cursor-default": props.loading,
      "cursor-pointer": !props.loading,
    },
    {
      "px-2 py-[1px] text-xs rounded-2xl": size === "xxs",
      "px-2.5 py-1 text-sm rounded-full": size === "xs",
      "px-3 py-1.5 text-sm rounded-full": size === "sm",
      "px-3.5 py-2 rounded-full": size === "base",
      "px-4 py-2.5 rounded-full": size === "lg",
    },
    {
      [normal]: !props.loading,
      [loading]: props.loading,
    },
  );
}
