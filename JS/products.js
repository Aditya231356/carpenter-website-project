// ============================================
// PRODUCTS JAVASCRIPT FILE
// Product Loading, Display & Management
// ============================================

// Product data (in a real application, this would come from an API)
const productsData = [
    {
        id: 1,
        name: "Elegant Wooden Bed Frame",
        description: "Beautifully crafted bed frame with intricate wood carvings and sturdy construction",
        image: "image/1.jpeg",
        category: "furniture",
        featured: true
    },
    {
        id: 2,
        name: "Classic Wooden Dining Table",
        description: "Timeless dining table design perfect for family gatherings and special occasions",
        image: "image/16.jpeg",
        category: "furniture",
        featured: true
    },
    {
        id: 3,
        name: "Premium Wardrobe Unit",
        description: "Spacious wardrobe with multiple compartments and premium wood finish",
        image: "image/8.jpeg",
        category: "furniture",
        featured: true
    },
    {
        id: 4,
        name: "Modern TV Entertainment Unit",
        description: "Contemporary design TV unit with storage space and sleek wood finish",
        image: "image/4.jpeg",
        category: "furniture",
        featured: true
    },
    {
        id: 5,
        name: "Traditional Wooden Sofa Set",
        description: "Classic sofa design combining comfort with traditional wood craftsmanship",
        image: "image/5.jpeg",
        category: "furniture",
        featured: true
    },
    {
        id: 6,
        name: "Compact Study Desk",
        description: "Functional study desk with drawers and space-saving design",
        image: "image/19.jpeg",
        category: "furniture",
        featured: false
    },
    {
        id: 7,
        name: "Rustic Wooden Bookshelf",
        description: "Elegant bookshelf with multiple shelves for books and decor",
        image: "image/7.jpeg",
        category: "furniture",
        featured: false
    },
    {
        id: 8,
        name: "Modern Office Chair",
        description: "Ergonomic office chair with adjustable height and lumbar support",
        image: "image/20.jpeg",
        category: "furniture",
        featured: false
    },
    {
        id: 9,
        name: "Antique Wooden Cabinet",
        description: "Vintage cabinet with intricate carvings and ample storage",
        image: "image/14.jpeg",
        category: "furniture",
        featured: false
    },
    {
        id: 10,
        name: "Outdoor Wooden Bench",
        description: "Durable bench for garden or patio with weather-resistant finish",
        image: "image/15.jpeg",
        category: "furniture",
        featured: false
    },
    {
        id: 11,
        name: "Kids Wooden Play Table",
        description: "Safe and sturdy play table for children with rounded edges",
        image: "image/18.jpeg",
        category: "furniture",
        featured: false
    },
    {
        id: 12,
        name: "Executive Desk",
        description: "Large executive desk with drawers and cable management",
        image: "image/12.jpeg",
        category: "furniture",
        featured: false
    },
    {
        id: 13,
        name: "Wall-Mounted Shelves",
        description: "Space-saving wall shelves for books and display items",
        image: "image/2.jpeg",
        category: "furniture",
        featured: false
    },
    {
        id: 14,
        name: "Dining Room Chairs Set",
        description: "Set of 4 comfortable dining chairs with wooden frames",
        image: "image/16.jpeg",
        category: "furniture",
        featured: false
    },
    {
        id: 15,
        name: "Bedside Table",
        description: "Compact bedside table with drawer and shelf",
        image: "image/17.jpeg",
        category: "furniture",
        featured: false
    },
    {
        id: 16,
        name: "Console Table",
        description: "Slim console table perfect for entryways or hallways",
        image: "image/13.jpeg",
        category: "furniture",
        featured: false
    },
    {
        id: 17,
        name: "Rocking Chair",
        description: "Traditional rocking chair with smooth motion and comfort",
        image: "image/21.jpeg",
        category: "furniture",
        featured: false
    },
    {
        id: 18,
        name: "Storage Ottoman",
        description: "Multi-purpose ottoman with hidden storage compartment",
        image: "image/10.jpeg",
        category: "furniture",
        featured: false
    }
];

// ============================================
// PRODUCT LOADING FUNCTIONS
// ============================================

// Load featured products
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) return;

    const featuredProducts = productsData.filter(product => product.featured).slice(0, 5);

    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        featuredContainer.appendChild(productCard);
    });
}

// Load all products
function loadAllProducts() {
    const allProductsContainer = document.getElementById('allProductsGrid');
    if (!allProductsContainer) return;

    // Clear existing content
    allProductsContainer.innerHTML = '';

    productsData.forEach(product => {
        const productCard = createProductCard(product);
        allProductsContainer.appendChild(productCard);
    });

    showNotification('All ' + productsData.length + ' products loaded successfully!', 'success');
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.setAttribute('data-category', product.category);

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='image/placeholder.jpg'">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p class="product-description">${product.description}</p>
        </div>
    `;

    return card;
}

// ============================================
// PRODUCT INTERACTION FUNCTIONS
// ============================================

// View product details
function viewProductDetails(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    // Create modal for product details
    const modal = document.createElement('div');
    modal.className = 'modal product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-cube"></i> ${product.name}</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="product-detail-grid">
                    <div class="product-detail-image">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='image/placeholder.jpg'">
                    </div>
                    <div class="product-detail-info">
                        <div class="product-category-badge">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                        <p class="product-description-full">${product.description}</p>

                        <div class="product-features">
                            <h4><i class="fas fa-star"></i> Key Features</h4>
                            <ul>
                                <li><i class="fas fa-check"></i> Premium quality wood</li>
                                <li><i class="fas fa-check"></i> Expert craftsmanship</li>
                                <li><i class="fas fa-check"></i> Customizable design</li>
                                <li><i class="fas fa-check"></i> Long-lasting durability</li>
                                <li><i class="fas fa-check"></i> Professional installation</li>
                            </ul>
                        </div>

                        <div class="product-actions-large">
                            <button class="btn btn-primary" onclick="inquireAboutProduct(${product.id})">
                                <i class="fas fa-envelope"></i> Get Quote
                            </button>
                            <button class="btn btn-outline" onclick="addToQuote(${product.id})">
                                <i class="fas fa-plus"></i> Add to Quote List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Show modal
    setTimeout(() => modal.classList.add('show'), 10);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Inquire about product
function inquireAboutProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    // Scroll to contact form and pre-fill subject
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });

        // Pre-fill the contact form
        setTimeout(() => {
            const subjectSelect = document.getElementById('contactSubject');
            const messageTextarea = document.getElementById('contactMessage');

            if (subjectSelect) {
                subjectSelect.value = 'product';
            }

            if (messageTextarea) {
                messageTextarea.value = `Hi, I'm interested in the ${product.name}. Please provide more details and pricing information.`;
                messageTextarea.focus();
            }

            showNotification(`Contact form updated for ${product.name}`, 'info');
        }, 1000);
    }
}

// Add to quote
function addToQuote(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    // Get existing quote list from localStorage
    let quoteList = JSON.parse(localStorage.getItem('quoteList') || '[]');

    // Check if product is already in quote
    const existingIndex = quoteList.findIndex(item => item.id === productId);

    if (existingIndex >= 0) {
        quoteList[existingIndex].quantity = (quoteList[existingIndex].quantity || 1) + 1;
    } else {
        quoteList.push({
            ...product,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }

    // Save to localStorage
    localStorage.setItem('quoteList', JSON.stringify(quoteList));

    showNotification(`${product.name} added to quote list!`, 'success');

    // Update quote count if there's a quote indicator
    updateQuoteCount();
}

// Update quote count indicator
function updateQuoteCount() {
    const quoteList = JSON.parse(localStorage.getItem('quoteList') || '[]');
    const count = quoteList.length;

    // Update any quote count indicators on the page
    const quoteIndicators = document.querySelectorAll('.quote-count');
    quoteIndicators.forEach(indicator => {
        indicator.textContent = count;
        indicator.style.display = count > 0 ? 'inline' : 'none';
    });
}

// ============================================
// PRODUCT FILTERING & SEARCH
// ============================================

// Filter products by category
function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Search products
function searchProducts(query) {
    const productCards = document.querySelectorAll('.product-card');
    const searchTerm = query.toLowerCase();

    productCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.product-description').textContent.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Load featured products
    loadFeaturedProducts();

    // Set up "View All Products" button
    const viewAllBtn = document.querySelector('a[href="#all-products"]');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loadAllProducts();

            // Smooth scroll to all products section
            const allProductsSection = document.getElementById('all-products');
            if (allProductsSection) {
                const headerHeight = document.getElementById('header') ? document.getElementById('header').offsetHeight : 0;
                const targetPosition = allProductsSection.offsetTop - headerHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Initialize quote count
    updateQuoteCount();

    // Responsive: Change products per page based on screen size
function setProductsPerPage() {
    if (window.innerWidth <= 576) {
        window.itemsPerPage = 4; // Small mobile
    } else if (window.innerWidth <= 768) {
        window.itemsPerPage = 6; // Mobile landscape
    } else {
        window.itemsPerPage = 6; // Tablet/Desktop
    }
}

    // Call on load
    setProductsPerPage();

    // Call on resize
    window.addEventListener('resize', function() {
        clearTimeout(window.resizedTimer);
        window.resizedTimer = setTimeout(setProductsPerPage, 250);
    });
});

// ============================================
// EXPORT FUNCTIONS FOR GLOBAL ACCESS
// ============================================

window.loadFeaturedProducts = loadFeaturedProducts;
window.loadAllProducts = loadAllProducts;
window.viewProductDetails = viewProductDetails;
window.inquireAboutProduct = inquireAboutProduct;
window.addToQuote = addToQuote;
window.filterProducts = filterProducts;
window.searchProducts = searchProducts;
window.updateQuoteCount = updateQuoteCount;
