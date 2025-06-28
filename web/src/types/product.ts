import { MeasureUnit } from '@/enums/measure-unit'

export interface Product {
  id: number
  name: string
  brand: string
  unit: MeasureUnit
  stockQuantity: number
  costPrice: number
  profitMargin: number
  profit: number
  salePrice: number
  createdAt: string
}
