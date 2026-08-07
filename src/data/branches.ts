export const branches = [
  { id: 'rio-grande', name: 'Río Grande' },
  { id: 'centro', name: 'Sucursal Centro' },
  { id: 'sucursal-2', name: 'Sucursal 2' },
] as const

export const getBranchName = (id: string) =>
  branches.find((branch) => branch.id === id)?.name ?? 'Sucursal desconocida'
