// Cliente Supabase
let supabaseClient = null;

// Inicializar cliente Supabase
function initSupabase() {
    if (isSupabaseConfigured() && window.supabase) {
        try {
            supabaseClient = window.supabase.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey
            );
            console.log('Supabase inicializado com sucesso');
        } catch (error) {
            console.error('Erro ao inicializar Supabase:', error);
        }
    }
}

// Funções de autenticação
async function signInAdmin(email, password) {
    if (!supabaseClient) {
        // Simulação para demo
        if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
            return { data: { user: { email } }, error: null };
        }
        return { data: null, error: { message: 'Email ou senha incorretos' } };
    }

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

async function signOutAdmin() {
    if (!supabaseClient) {
        return { error: null };
    }

    try {
        const { error } = await supabaseClient.auth.signOut();
        return { error };
    } catch (error) {
        return { error };
    }
}

async function getCurrentUser() {
    if (!supabaseClient) {
        return null;
    }

    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user;
    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        return null;
    }
}

// Funções de produtos
async function getProducts() {
    if (!supabaseClient) {
        return { data: MOCK_PRODUCTS, error: null };
    }

    try {
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('available', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao carregar produtos:', error);
            return { data: MOCK_PRODUCTS, error: null };
        }

        return { data: data || [], error: null };
    } catch (error) {
        console.error('Erro de conexão:', error);
        return { data: MOCK_PRODUCTS, error: null };
    }
}

async function getAllProducts() {
    if (!supabaseClient) {
        return { data: MOCK_PRODUCTS, error: null };
    }

    try {
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao carregar produtos:', error);
            return { data: MOCK_PRODUCTS, error: null };
        }

        return { data: data || [], error: null };
    } catch (error) {
        console.error('Erro de conexão:', error);
        return { data: MOCK_PRODUCTS, error: null };
    }
}

async function createProduct(product) {
    if (!supabaseClient) {
        showToast('Supabase não configurado - usando modo demo', 'error');
        return { data: null, error: { message: 'Modo demo - produto não salvo' } };
    }

    try {
        const { data, error } = await supabaseClient
            .from('products')
            .insert([product])
            .select();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

async function updateProduct(id, product) {
    if (!supabaseClient) {
        showToast('Supabase não configurado - usando modo demo', 'error');
        return { data: null, error: { message: 'Modo demo - produto não atualizado' } };
    }

    try {
        const { data, error } = await supabaseClient
            .from('products')
            .update(product)
            .eq('id', id)
            .select();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

async function deleteProduct(id) {
    if (!supabaseClient) {
        showToast('Supabase não configurado - usando modo demo', 'error');
        return { data: null, error: { message: 'Modo demo - produto não excluído' } };
    }

    try {
        const { data, error } = await supabaseClient
            .from('products')
            .delete()
            .eq('id', id);

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

// Funções de pedidos
async function createOrder(orderData) {
    if (!supabaseClient) {
        showToast('Supabase não configurado - usando modo demo', 'error');
        return { data: null, error: { message: 'Modo demo - pedido não salvo' } };
    }

    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .insert([orderData])
            .select();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

async function getOrders() {
    if (!supabaseClient) {
        return { data: [], error: null };
    }

    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        return { data: data || [], error };
    } catch (error) {
        return { data: [], error };
    }
}

async function updateOrderStatus(orderId, status) {
    if (!supabaseClient) {
        return { data: null, error: { message: 'Modo demo' } };
    }

    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .update({ status })
            .eq('id', orderId)
            .select();

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

async function deleteOrderFromDB(orderId) {
    if (!supabaseClient) {
        return { data: null, error: { message: 'Modo demo - pedido não excluído' } };
    }

    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .delete()
            .eq('id', orderId);

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

async function deleteOrderFromDB(orderId) {
    if (!supabaseClient) {
        return { data: null, error: { message: 'Modo demo - pedido não excluído' } };
    }

    try {
        const { data, error } = await supabaseClient
            .from('orders')
            .delete()
            .eq('id', orderId);

        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
}

// Funções de categorias
async function getCategories() {
    if (!supabaseClient) {
        return { 
            data: [
                { name: 'hamburgers', display_name: 'Hambúrgueres', icon: '🍔' },
                { name: 'drinks', display_name: 'Bebidas', icon: '🥤' },
                { name: 'sides', display_name: 'Acompanhamentos', icon: '🍟' }
            ], 
            error: null 
        };
    }

    try {
        const { data, error } = await supabaseClient
            .from('categories')
            .select('*')
            .eq('active', true)
            .order('order_index');

        return { data: data || [], error };
    } catch (error) {
        return { data: [], error };
    }
}
// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', initSupabase);
