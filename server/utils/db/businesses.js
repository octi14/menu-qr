import { getDatabase } from '../mongodb'

export async function getBusinessBySlug(slug) {
  if (!slug) return null
  
  try {
    const db = await getDatabase()
    if (!db) return null
    
    const business = await db.collection('businesses').findOne({ slug: slug.trim() })
    
    if (!business) return null
    
    // Convertir _id a id y limpiar el objeto
    const { _id, ...rest } = business
    return {
      ...rest,
      id: _id.toString(),
    }
  } catch (error) {
    console.error('Error fetching business:', error)
    return null
  }
}

export async function getAllBusinesses(userId = null) {
  try {
    const db = await getDatabase()
    if (!db) {
      console.warn('getAllBusinesses: No database connection available')
      return []
    }
    
    // Validar que userId sea válido antes de usarlo en la query
    const query = userId && userId.trim() !== '' ? { userId: userId.trim() } : {}
    console.log('getAllBusinesses: Query:', JSON.stringify(query))
    
    const businesses = await db.collection('businesses').find(query).toArray()
    console.log(`getAllBusinesses: Found ${businesses.length} businesses`)
    
    return businesses.map((business) => {
      const { _id, ...rest } = business
      return {
        ...rest,
        id: _id.toString(),
      }
    })
  } catch (error) {
    console.error('Error fetching businesses:', error)
    return []
  }
}

export async function saveBusiness(business) {
  try {
    const db = await getDatabase()
    if (!db) return false
    
    const { id, ...businessData } = business
    
    await db.collection('businesses').updateOne(
      { slug: business.slug },
      { $set: businessData },
      { upsert: true }
    )
    
    return true
  } catch (error) {
    console.error('Error saving business:', error)
    return false
  }
}

export async function createBusiness(business) {
  try {
    const db = await getDatabase()
    const { id, ...businessData } = business
    
    await db.collection('businesses').insertOne(businessData)
    
    return true
  } catch (error) {
    console.error('Error creating business:', error)
    return false
  }
}

export async function deleteBusiness(slug) {
  try {
    const db = await getDatabase()
    if (!db) return false
    
    const result = await db.collection('businesses').deleteOne({ slug: slug.trim() })
    
    return result.deletedCount > 0
  } catch (error) {
    console.error('Error deleting business:', error)
    return false
  }
}

