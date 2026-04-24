import { toValue } from 'vue'

/**
 * CRUD mínimo de secciones e ítems sobre un business reactivo (misma ref que en el panel).
 */
export function useMenuSectionEditor (businessRef) {
  const ensureSections = () => {
    const b = toValue(businessRef)
    if (!b) return null
    if (!Array.isArray(b.sections)) b.sections = []
    return b
  }

  const addSection = () => {
    const b = ensureSections()
    if (!b) return
    b.sections.push({
      id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: 'Nueva sección',
      description: '',
      items: [],
    })
  }

  const deleteSection = (index) => {
    const b = ensureSections()
    if (!b || !b.sections[index]) return
    if (!confirm('¿Estás seguro de que querés eliminar esta sección y todos sus ítems?')) return
    b.sections.splice(index, 1)
  }

  const moveSection = (index, delta) => {
    const b = ensureSections()
    if (!b) return
    const next = index + delta
    if (next < 0 || next >= b.sections.length) return
    const [s] = b.sections.splice(index, 1)
    b.sections.splice(next, 0, s)
  }

  const addItem = (sectionIndex) => {
    const b = ensureSections()
    if (!b || !b.sections[sectionIndex]) return
    if (!Array.isArray(b.sections[sectionIndex].items)) b.sections[sectionIndex].items = []
    b.sections[sectionIndex].items.push({
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: 'Nuevo ítem',
      description: 'Descripción del ítem',
      price: 0,
      imageUrl: '',
      tags: [],
      tagsString: '',
      isAvailable: true,
    })
  }

  const deleteItem = (sectionIndex, itemIndex) => {
    const b = ensureSections()
    if (!b) return
    if (!confirm('¿Estás seguro de que querés eliminar este ítem?')) return
    b.sections[sectionIndex].items.splice(itemIndex, 1)
  }

  const updateItemTags = (sectionIndex, itemIndex) => {
    const b = ensureSections()
    if (!b) return
    const item = b.sections[sectionIndex]?.items[itemIndex]
    if (!item) return
    if (item.tagsString) {
      item.tags = item.tagsString.split(',').map(t => t.trim()).filter(t => t.length > 0)
    } else {
      item.tags = []
    }
  }

  return {
    addSection,
    deleteSection,
    addItem,
    deleteItem,
    updateItemTags,
    moveSection,
  }
}
