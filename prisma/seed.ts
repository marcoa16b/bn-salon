import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌸 Seeding Mary\'s Salon database...')

  // Create sample services
  const services = [
    {
      title: 'Corte de cabello',
      description: 'Corte clásico o moderno según tu estilo. Incluye lavado y secado.',
      price: 1500,
      durationMinutes: 45,
    },
    {
      title: 'Peinado',
      description: 'Peinado para ocasiones especiales, fiestas o eventos.',
      price: 2000,
      durationMinutes: 60,
    },
    {
      title: 'Manicura',
      description: 'Manicura completa con esmaltado clásico. Incluye cutícula y limado.',
      price: 1200,
      durationMinutes: 40,
    },
    {
      title: 'Uñas esculpidas',
      description: 'Uñas esculpidas en gel o acrílico con diseño a elección.',
      price: 3000,
      durationMinutes: 90,
    },
    {
      title: 'Maquillaje',
      description: 'Maquillaje profesional para eventos, fiestas o bodas.',
      price: 2500,
      durationMinutes: 60,
    },
    {
      title: 'Tratamiento capilar',
      description: 'Hidratación profunda para cabello seco o dañado.',
      price: 1800,
      durationMinutes: 50,
    },
    {
      title: 'Depilación con cera',
      description: 'Depilación facial o corporal con cera caliente o tibia.',
      price: 800,
      durationMinutes: 30,
    },
    {
      title: 'Pestañas pelo por pelo',
      description: 'Extensión de pestañas método pelo por pelo, mirada natural.',
      price: 3500,
      durationMinutes: 120,
    },
  ]

  for (const service of services) {
    await prisma.service.create({
      data: service,
    })
    console.log(`  ✅ Created service: ${service.title}`)
  }

  // Create sample clients
  const clients = [
    { name: 'María García', phone: '+54 11 5555 1234', email: 'maria.garcia@email.com' },
    { name: 'Sofía López', phone: '+54 11 5555 2345', email: 'sofia.lopez@email.com' },
    { name: 'Carolina Rodríguez', phone: '+54 11 5555 3456', email: 'carolina.r@email.com' },
    { name: 'Ana Martínez', phone: '+54 11 5555 4567', email: 'ana.martinez@email.com' },
    { name: 'Laura Fernández', phone: '+54 11 5555 5678', email: 'laura.f@email.com' },
  ]

  for (const client of clients) {
    await prisma.client.create({
      data: client,
    })
    console.log(`  ✅ Created client: ${client.name}`)
  }

  console.log('🌸 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
