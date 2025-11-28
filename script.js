// Estado da aplicação
let products = [];
let cart = [];
let currentUser = null;
let editingProduct = null;
let activeCategory = 'all';

// Inicialização
document.addEventListener('DOMContentLoaded', async function() {
    await loadProducts();
    setupEventListeners();
    updateCartUI();
    checkAuthStatus();
});

// Event Listeners
function setupEventListeners() {
    // Category filter
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            setActiveCategory(category);
        });
    });

    // Admin login form
    document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
    
    // Product form
    document.getElementById('productFormElement').addEventListener('submit', handleProductSubmit);

    // Modal close on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });
}

// Carregar produtos
async function loadProducts() {
    showLoading(true);
    
    try {
        const { data, error } = await getProducts();
        
        if (error) {
            console.error('Erro ao carregar produtos:', error);
            showToast('Erro ao carregar produtos', 'error');
        } else {
            products = data || [];
            renderProducts();
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showToast('Erro ao carregar produtos', 'error');
    } finally {
        showLoading(false);
    }
}

// Renderizar produtos
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const filteredProducts = activeCategory === 'all' 
        ? products 
        : products.filter(p => p.category === activeCategory);

    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🔍</div>
                <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #1f2937;">Nenhum produto encontrado</h3>
                <p style="color: #6b7280;">Tente selecionar uma categoria diferente</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image_url}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">R$ ${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart('${product.id}')" ${!product.available ? 'disabled' : ''}>
                        <i class="fas fa-plus"></i>
                        ${product.available ? 'Adicionar' : 'Indisponível'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filtro de categoria
function setActiveCategory(category) {
    activeCategory = category;
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    renderProducts();
}

// Carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !product.available) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showToast(`${product.name} adicionado ao carrinho!`, 'success');
}

function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        updateCartUI();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function clearCart() {
    cart = [];
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    const totalPrice = document.getElementById('totalPrice');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Carrinho vazio</p>
            </div>
        `;
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image_url}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        cartFooter.style.display = 'block';
        totalPrice.textContent = `R$ ${total.toFixed(2)}`;
    }
}

async function submitOrder() {
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    
    if (!customerName || !customerPhone) {
        showToast('Por favor, preencha nome e telefone', 'error');
        return;
    }
    
    if (cart.length === 0) {
        showToast('Carrinho vazio', 'error');
        return;
    }
    
    const checkoutBtn = document.querySelector('.checkout-btn');
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Enviando...';
    
    try {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const orderData = {
            customer_name: customerName,
            customer_phone: customerPhone,
            items: cart,
            total: total,
            status: 'pending'
        };
        
        if (!isSupabaseConfigured()) {
            // Em modo demo, simular sucesso do pedido
            console.log('Modo demo - pedido simulado:', orderData);
            showToast('Pedido enviado com sucesso! (Modo Demo)', 'success');
            
            // Limpar carrinho e fechar modal
            cart = [];
            updateCartDisplay();
            document.getElementById('checkout-modal').style.display = 'none';
            return;
        }

        const { data, error } = await createOrder(orderData);
        
        if (error) {
            throw new Error(error.message);
        }
        
        showToast('Pedido enviado com sucesso!', 'success');
        clearCart();
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        toggleCart();
        
        // Enviar notificação via WhatsApp
        setTimeout(() => {
            if (confirm('Deseja enviar confirmação por WhatsApp?')) {
                whatsappService.sendStatusUpdate(orderData, 'pending');
                whatsappService.notifyNewOrder(orderData);
            }
        }, 1000);
    } catch (error) {
        console.error('Erro ao enviar pedido:', error);
        showToast('Erro ao enviar pedido: ' + error.message, 'error');
    } finally {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Finalizar Pedido';
    }
}

// Modais
function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('show');
}

function toggleAdminLogin() {
    if (currentUser) {
        toggleAdminPanel();
    } else {
        const modal = document.getElementById('adminLoginModal');
        modal.classList.toggle('show');
    }
}

function toggleAdminPanel() {
    const modal = document.getElementById('adminPanelModal');
    modal.classList.toggle('show');
    if (modal.classList.contains('show')) {
        loadAdminProducts();
    }
}

function openOrdersPage() {
    window.open('orders.html', '_blank');
}

// Autenticação
async function checkAuthStatus() {
    try {
        const user = await getCurrentUser();
        currentUser = user;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Entrando...';
    
    try {
        const { data, error } = await signInAdmin(email, password);
        
        if (error) {
            showToast('Email ou senha incorretos', 'error');
        } else {
            currentUser = data.user;
            showToast('Login realizado com sucesso!', 'success');
            toggleAdminLogin();
            toggleAdminPanel();
            document.getElementById('adminEmail').value = '';
            document.getElementById('adminPassword').value = '';
        }
    } catch (error) {
        showToast('Erro ao fazer login', 'error');
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Entrar';
    }
}

async function adminLogout() {
    try {
        await signOutAdmin();
        currentUser = null;
        showToast('Logout realizado com sucesso!', 'success');
        toggleAdminPanel();
    } catch (error) {
        showToast('Erro ao fazer logout', 'error');
    }
}

// Administração de produtos
async function loadAdminProducts() {
    const productsList = document.getElementById('adminProductsList');
    productsList.innerHTML = '<p class="loading">Carregando produtos...</p>';
    
    try {
        const { data, error } = await getAllProducts();
        
        if (error) {
            productsList.innerHTML = '<p style="color: #dc2626;">Erro ao carregar produtos</p>';
            return;
        }
        
        if (data.length === 0) {
            productsList.innerHTML = '<p style="color: #6b7280; text-align: center; padding: 2rem;">Nenhum produto encontrado</p>';
            return;
        }
         /*<button class="edit-btn" onclick="editProduct('${product.id}')">
                        <i class="fas fa-edit"></i>
                    </button>*/
        productsList.innerHTML = data.map(product => `
            <div class="admin-product-item">
                <img src="${product.image_url}" alt="${product.name}" class="admin-product-image">
                <div class="admin-product-info">
                    <div class="admin-product-name">${product.name}</div>
                    <div class="admin-product-description">${product.description}</div>
                    <div class="admin-product-details">
                        <span class="admin-product-price">R$ ${product.price.toFixed(2)}</span>
                        <span class="admin-product-category">${getCategoryName(product.category)}</span>
                        <span class="admin-product-status ${product.available ? 'available' : 'unavailable'}">
                            ${product.available ? 'Disponível' : 'Indisponível'}
                        </span>
                    </div>
                </div>
                <div class="admin-product-actions">
                   
                    <button class="delete-btn" onclick="deleteProductConfirm('${product.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        productsList.innerHTML = '<p style="color: #dc2626;">Erro ao carregar produtos</p>';
    }
}

function getCategoryName(category) {
    const names = {
        'hamburgers': 'Hambúrgueres',
        'drinks': 'Bebidas',
        'sides': 'Acompanhamentos'
    };
    return names[category] || category;
}

function showProductForm() {
    document.getElementById('productForm').style.display = 'block';
    document.getElementById('formTitle').textContent = 'Novo Produto';
    editingProduct = null;
    clearProductForm();
}

function hideProductForm() {
    document.getElementById('productForm').style.display = 'none';
    editingProduct = null;
    clearProductForm();
}

function clearProductForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productCategory').value = 'hamburgers';
    document.getElementById('productImage').value = '';
    document.getElementById('productAvailable').checked = true;
}

async function editProduct(productId) {
    const { data } = await getAllProducts();
    const product = data.find(p => p.id === productId);
    
    if (!product) return;
    
    editingProduct = product;
    document.getElementById('formTitle').textContent = 'Editar Produto';
    document.getElementById('productName').value = product.name;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productImage').value = product.image_url;
    document.getElementById('productAvailable').checked = product.available;
    
    showProductForm();
}

async function handleProductSubmit(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value,
        price: parseFloat(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value,
        category: document.getElementById('productCategory').value,
        image_url: document.getElementById('productImage').value,
        available: document.getElementById('productAvailable').checked,
    };
    
    const saveBtn = document.querySelector('.save-btn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';
    
    try {
        let result;
        
        if (editingProduct) {
            result = await updateProduct(editingProduct.id, productData);
        } else {
            result = await createProduct(productData);
        }
        
        if (result.error) {
            showToast('Erro ao salvar produto', 'error');
        } else {
            showToast(editingProduct ? 'Produto atualizado!' : 'Produto criado!', 'success');
            hideProductForm();
            loadAdminProducts();
            loadProducts(); // Recarregar produtos na tela principal
        }
    } catch (error) {
        showToast('Erro ao salvar produto', 'error');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Salvar';
    }
}

async function deleteProductConfirm(productId) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
        const { error } = await deleteProduct(productId);
        
        if (error) {
            showToast('Erro ao excluir produto', 'error');
        } else {
            showToast('Produto excluído!', 'success');
            loadAdminProducts();
            loadProducts(); // Recarregar produtos na tela principal
        }
    } catch (error) {
        showToast('Erro ao excluir produto', 'error');
    }
}

// Utilitários
function showLoading(show) {
    const grid = document.getElementById('productsGrid');
    if (show) {
        grid.innerHTML = `
            <div class="loading-skeleton">
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
            </div>
        `;
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
