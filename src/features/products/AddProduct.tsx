import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface ProductFormData {
  name: string
  description: string
  price: number
  image: FileList
}

const AddProduct: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductFormData>()

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true)
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
      const filePath = `product-images/${fileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Resim yüklenirken hata oluştu')
      return null
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true)
      
      let imageUrl = ''
      
      // Upload image if provided
      if (data.image && data.image.length > 0) {
        const uploadedImageUrl = await uploadImage(data.image[0])
        if (!uploadedImageUrl) {
          return // Error already shown in uploadImage function
        }
        imageUrl = uploadedImageUrl
      }

      // Insert product to database
      const { error } = await supabase
        .from('products')
        .insert([
          {
            name: data.name,
            description: data.description,
            price: data.price,
            image_url: imageUrl,
            user_id: user?.id
          }
        ])

      if (error) {
        throw error
      }

      toast.success('Ürün başarıyla eklendi!')
      reset()
      navigate('/products')
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Ürün eklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 mr-4">
                ← Geri Dön
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Yeni Ürün Ekle
              </h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Ürün Adı *
                </label>
                <div className="mt-1">
                  <input
                    {...register('name', {
                      required: 'Ürün adı gereklidir',
                      minLength: {
                        value: 2,
                        message: 'Ürün adı en az 2 karakter olmalıdır'
                      }
                    })}
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Ürün adını girin"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Açıklama *
                </label>
                <div className="mt-1">
                  <textarea
                    {...register('description', {
                      required: 'Ürün açıklaması gereklidir',
                      minLength: {
                        value: 10,
                        message: 'Açıklama en az 10 karakter olmalıdır'
                      }
                    })}
                    rows={4}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Ürün açıklamasını girin"
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Fiyat (₺) *
                </label>
                <div className="mt-1">
                  <input
                    {...register('price', {
                      required: 'Fiyat gereklidir',
                      min: {
                        value: 0.01,
                        message: 'Fiyat 0\'dan büyük olmalıdır'
                      },
                      valueAsNumber: true
                    })}
                    type="number"
                    step="0.01"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Ürün Resmi
                </label>
                <div className="mt-1">
                  <input
                    {...register('image')}
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    PNG, JPG, GIF formatlarında resim yükleyebilirsiniz.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <Link
                  to="/dashboard"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  İptal
                </Link>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="bg-blue-600 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (uploading ? 'Resim yükleniyor...' : 'Ürün ekleniyor...') : 'Ürün Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AddProduct 