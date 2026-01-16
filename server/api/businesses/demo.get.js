/**
 * Endpoint para obtener un business de demo
 * Retorna un business de ejemplo con datos completos para mostrar las funcionalidades
 */
export default defineEventHandler(async (event) => {
  // Business de demo con datos de ejemplo
  const demoBusiness = {
    id: 'demo-business',
    slug: 'demo',
    name: 'Café MapaMorfi',
    description: 'Un café acogedor con los mejores sabores. Menú digital creado con MapaMorfi.',
    category: 'cafe',
    backgroundColor: '#f5f5dc',
    fontFamily: 'inter',
    menuLayout: 'grid',
    showPrices: true,
    sections: [
      {
        id: 'demo-bebidas-calientes',
        name: 'Bebidas Calientes',
        description: 'Nuestras bebidas calientes preparadas con amor',
        items: [
          {
            id: 'demo-cappuccino',
            name: 'Cappuccino',
            description: 'Espresso con leche vaporizada y espuma de leche',
            price: 850,
            imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
            tags: ['Popular', 'Sin TACC'],
            isAvailable: true,
          },
          {
            id: 'demo-latte',
            name: 'Latte',
            description: 'Espresso suave con leche caliente',
            price: 800,
            imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
            tags: ['Popular'],
            isAvailable: true,
          },
          {
            id: 'demo-americano',
            name: 'Americano',
            description: 'Espresso con agua caliente',
            price: 700,
            imageUrl: '',
            tags: [],
            isAvailable: true,
          },
        ],
      },
      {
        id: 'demo-pasteles',
        name: 'Pasteles',
        description: 'Postres caseros y deliciosos',
        items: [
          {
            id: 'demo-torta-chocolate',
            name: 'Torta de Chocolate',
            description: 'Torta húmeda de chocolate con ganache',
            price: 1200,
            imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
            tags: ['Sin TACC', 'Vegano'],
            isAvailable: true,
          },
          {
            id: 'demo-alfajor',
            name: 'Alfajor Artesanal',
            description: 'Alfajor casero relleno de dulce de leche',
            price: 450,
            imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400',
            tags: ['Popular'],
            isAvailable: true,
          },
        ],
      },
      {
        id: 'demo-sandwiches',
        name: 'Sandwiches',
        description: 'Sandwiches frescos y sabrosos',
        items: [
          {
            id: 'demo-sandwich-jamon',
            name: 'Sandwich de Jamón y Queso',
            description: 'Pan artesanal, jamón cocido, queso tybo, lechuga y tomate',
            price: 1500,
            imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
            tags: ['Popular'],
            isAvailable: true,
          },
          {
            id: 'demo-sandwich-vegano',
            name: 'Sandwich Vegano',
            description: 'Pan integral, aguacate, tomate, rúcula y aderezo especial',
            price: 1400,
            imageUrl: '',
            tags: ['Vegano', 'Sin TACC'],
            isAvailable: true,
          },
        ],
      },
    ],
    openingHours: {
      lunes: { open: '08:00', close: '20:00', closed: false },
      martes: { open: '08:00', close: '20:00', closed: false },
      miercoles: { open: '08:00', close: '20:00', closed: false },
      jueves: { open: '08:00', close: '20:00', closed: false },
      viernes: { open: '08:00', close: '22:00', closed: false },
      sabado: { open: '09:00', close: '22:00', closed: false },
      domingo: { open: '10:00', close: '20:00', closed: false },
    },
    socialMedia: {
      instagram: 'https://instagram.com/mapamorfi',
      facebook: 'https://facebook.com/mapamorfi',
    },
    address: 'Av. Corrientes 1234, Buenos Aires',
    latitude: -34.6037,
    longitude: -58.3816,
    googleMapsUrl: 'https://maps.google.com/?q=-34.6037,-58.3816',
    isActive: true,
  }

  return demoBusiness
})



