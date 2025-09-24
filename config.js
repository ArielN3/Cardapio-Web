// Configuração do Supabase
const SUPABASE_CONFIG = {
    url: 'https://zkbgstglzvamymjceylc.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprYmdzdGdsenZhbXltamNleWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1ODMxNjYsImV4cCI6MjA3NDE1OTE2Nn0.lVHdfONcZv8Hp9J9JhZfoVvQPqddM90fW8Z3AhQHLYw'
};

// Verificar se as variáveis de ambiente estão configuradas
const isSupabaseConfigured = () => {
    return SUPABASE_CONFIG.url !== 'https://placeholder.supabase.co' && 
           SUPABASE_CONFIG.anonKey !== 'placeholder-key';
};

// Dados mock para demonstração
const MOCK_PRODUCTS = [
    {
        id: '1',
        name: 'Big Burger Clássico',
        description: 'Hambúrguer artesanal 180g, queijo cheddar, alface, tomate, cebola roxa e molho especial',
        price: 25.90,
        category: 'hamburgers',
        image_url: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=500',
        available: true,
    },
    {
        id: '2',
        name: 'Bacon Lover',
        description: 'Hambúrguer 180g, bacon crocante, queijo cheddar duplo, cebola caramelizada e molho barbecue',
        price: 32.90,
        category: 'hamburgers',
        image_url: 'https://images.pexels.com/photos/2762942/pexels-photo-2762942.jpeg?auto=compress&cs=tinysrgb&w=500',
        available: true,
    },
    {
        id: '3',
        name: 'Veggie Gourmet',
        description: 'Hambúrguer vegetal de quinoa e grão-de-bico, queijo vegano, rúcula e tomate seco',
        price: 28.90,
        category: 'hamburgers',
        image_url: 'https://images.pexels.com/photos/1639565/pexels-photo-1639565.jpeg?auto=compress&cs=tinysrgb&w=500',
        available: true,
    },
    {
        id: '4',
        name: 'Coca-Cola 350ml',
        description: 'Refrigerante gelado',
        price: 4.50,
        category: 'drinks',
        image_url: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=500',
        available: true,
    },
    {
        id: '5',
        name: 'Suco de Laranja Natural',
        description: 'Suco natural da fruta, 400ml',
        price: 7.90,
        category: 'drinks',
        image_url: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=500',
        available: true,
    },
    {
        id: '6',
        name: 'Batata Frita Especial',
        description: 'Batatas rústicas temperadas com ervas, porção individual',
        price: 12.90,
        category: 'sides',
        image_url: 'https://images.pexels.com/photos/1586942/pexels-photo-1586942.jpeg?auto=compress&cs=tinysrgb&w=500',
        available: true,
    },
    {
        id: '7',
        name: 'Onion Rings',
        description: 'Anéis de cebola empanados e crocantes, porção individual',
        price: 9.90,
        category: 'sides',
        image_url: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=500',
        available: true,
    },
    {
        id: '8',
        name: 'Double Cheese',
        description: 'Dois hambúrgueres 120g, queijo cheddar duplo, pickles e molho especial',
        price: 35.90,
        category: 'hamburgers',
        image_url: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=500',
        available: true,
    },
];

// Credenciais de demonstração
//const DEMO_ADMIN = {
  //  email: 'admin@test.com',
   // password: 'admin123'
//};
