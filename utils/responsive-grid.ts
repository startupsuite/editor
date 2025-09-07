export type ColumnBreakpoints = {
  sm?: number
  md?: number
  lg?: number
  xl?: number
}

export function getResponsiveGridClass(
  columns = 1,
  breakpoints: ColumnBreakpoints = { sm: 1, md: 2, lg: 3, xl: 4 },
): string {
  const { sm = 1, md = 2, lg = 3, xl = 4 } = breakpoints

  return `grid gap-3 grid-cols-${columns} sm:grid-cols-${sm} md:grid-cols-${md} lg:grid-cols-${lg} xl:grid-cols-${xl}`
}
