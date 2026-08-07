export type PromotionValidity = {
  startDate: string
  endDate: string
  visible: boolean
}

export type PromotionValidityByBranch = Record<string, PromotionValidity>
