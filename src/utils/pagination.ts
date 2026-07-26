export const paginate = <T,>(items: T[], pageSize = 3): T[][] => {
  const pages: T[][] = []
  for (let index = 0; index < items.length; index += pageSize) {
    pages.push(items.slice(index, index + pageSize))
  }
  return pages
}
