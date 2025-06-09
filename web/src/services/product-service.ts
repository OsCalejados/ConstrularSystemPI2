import { ProductFormData } from '@/types/validations'
import { api } from '@/lib/axios'
import { products } from '@/data/products'

export async function getProducts() {
  // Temporariamente usando dados mock
  // TODO: Descomentar quando o backend estiver pronto
  // const response = await api.get('products')
  // return response.data

  return products
}

export async function getProductById(productId: number | string) {
  // Temporariamente usando dados mock
  // TODO: Descomentar quando o backend estiver pronto
  // const response = await api.get(`products/${productId}`)
  // return response.data

  const product = products.find((p) => p.id === Number(productId))
  if (!product) {
    throw new Error('Produto não encontrado')
  }

  return product
}

export async function createProduct(productFormData: ProductFormData) {
  console.log(productFormData)

  const response = await api.post('products', productFormData)

  console.log(response.data)
}

export async function updateProduct(
  productId: number | string,
  productFormData: ProductFormData,
) {
  const response = await api.put(`products/${productId}`, productFormData)

  console.log(response.data)
}

export async function deleteProduct(productId: number | string) {
  await api.delete(`products/${productId}`)
}
