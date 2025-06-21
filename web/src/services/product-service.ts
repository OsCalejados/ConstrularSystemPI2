import { ProductFormData } from '@/types/validations'
import api from '@/lib/axios'

export async function getProducts() {
  const response = await api.get('products')
  return response.data
}

export async function getProductById(productId: number | string) {
  const response = await api.get(`products/${productId}`)
  return response.data
}

export async function createProduct(productFormData: ProductFormData) {
  console.log(productFormData)

  await api.post('products', productFormData)
}

export async function updateProduct(
  productId: number | string,
  productFormData: ProductFormData,
) {
  await api.put(`products/${productId}`, productFormData)
}

export async function deleteProduct(productId: number | string) {
  await api.delete(`products/${productId}`)
}
