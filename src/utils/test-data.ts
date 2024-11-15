import { supabase } from '../lib/supabase';

export async function insertTestData() {
  // Insert test organization
  const { data: org } = await supabase
    .from('organizations')
    .insert({
      name: 'Test Salon',
      slug: 'test-salon'
    })
    .select()
    .single();

  if (!org) throw new Error('Failed to create organization');

  // Insert test profile (admin user)
  await supabase
    .from('profiles')
    .insert({
      organization_id: org.id,
      email: 'admin@test.com',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin'
    });

  // Insert test services
  await supabase
    .from('services')
    .insert([
      {
        organization_id: org.id,
        name: 'Corte y Peinado',
        description: 'Corte de cabello profesional y peinado',
        duration: 45,
        price: 800
      },
      {
        organization_id: org.id,
        name: 'Tinte',
        description: 'Tinte profesional',
        duration: 120,
        price: 2500
      }
    ]);

  // Insert test products
  await supabase
    .from('products')
    .insert([
      {
        organization_id: org.id,
        name: 'Shampoo Premium',
        description: 'Shampoo profesional',
        price: 450,
        stock: 25,
        sku: 'SH001'
      },
      {
        organization_id: org.id,
        name: 'Acondicionador Premium',
        description: 'Acondicionador profesional',
        price: 400,
        stock: 20,
        sku: 'AC001'
      }
    ]);
}