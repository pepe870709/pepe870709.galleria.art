// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle (for future enhancement)
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Add smooth scrolling to internal links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only apply smooth scrolling for internal page links
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Gallery image hover effects
    const artworkItems = document.querySelectorAll('.artwork-item');
    artworkItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Order form functionality
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        setupOrderForm();
    }

    // Add loading animation to buttons
    const buttons = document.querySelectorAll('button, .submit-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.type === 'submit') {
                // Add loading state
                const originalText = this.textContent;
                this.textContent = 'Processing...';
                this.disabled = true;
                
                // Reset after 2 seconds (in real app, this would be after form submission)
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                }, 2000);
            }
        });
    });
});

// Order form setup function
function setupOrderForm() {
    const sizeSelect = document.getElementById('size');
    const materialSelect = document.getElementById('material');
    const quantityInput = document.getElementById('quantity');
    const subtotalSpan = document.getElementById('subtotal');
    const totalSpan = document.getElementById('total');
    const orderForm = document.getElementById('orderForm');

    // Price mappings
    const sizePrices = {
        'small': 45,
        'medium': 85,
        'large': 125,
        'extra-large': 185
    };

    const materialPrices = {
        'paper': 0,
        'canvas': 25,
        'metal': 40
    };

    const shippingCost = 15;

    // Update order summary when form changes
    function updateOrderSummary() {
        const selectedSize = sizeSelect.value;
        const selectedMaterial = materialSelect.value;
        const quantity = parseInt(quantityInput.value) || 1;

        let basePrice = sizePrices[selectedSize] || 0;
        let materialPrice = materialPrices[selectedMaterial] || 0;
        let subtotal = (basePrice + materialPrice) * quantity;
        let total = subtotal + shippingCost;

        subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
        totalSpan.textContent = `$${total.toFixed(2)}`;
    }

    // Add event listeners for price calculation
    [sizeSelect, materialSelect, quantityInput].forEach(element => {
        if (element) {
            element.addEventListener('change', updateOrderSummary);
            element.addEventListener('input', updateOrderSummary);
        }
    });

    // Form submission handler
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(orderForm);
            const orderData = {};
            
            for (let [key, value] of formData.entries()) {
                orderData[key] = value;
            }

            // Add calculated totals
            const selectedSize = sizeSelect.value;
            const selectedMaterial = materialSelect.value;
            const quantity = parseInt(quantityInput.value) || 1;
            
            let basePrice = sizePrices[selectedSize] || 0;
            let materialPrice = materialPrices[selectedMaterial] || 0;
            let subtotal = (basePrice + materialPrice) * quantity;
            let total = subtotal + shippingCost;

            orderData.subtotal = subtotal;
            orderData.shipping = shippingCost;
            orderData.total = total;

            // Simulate order processing
            console.log('Order submitted:', orderData);
            
            // Show success message
            showOrderSuccess(orderData);
        });
    }

    // Initialize calculation
    updateOrderSummary();
}

// Show order success message
function showOrderSuccess(orderData) {
    const successMessage = document.createElement('div');
    successMessage.className = 'order-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <h3>✅ Order Submitted Successfully!</h3>
            <p>Thank you for your order, ${orderData.customerName}!</p>
            <p>Order Total: $${orderData.total.toFixed(2)}</p>
            <p>You will receive a confirmation email at ${orderData.email} shortly.</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    
    // Style the success message
    successMessage.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const successContent = successMessage.querySelector('.success-content');
    successContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 8px 30px rgba(0,0,0,0.3);
    `;
    
    const button = successMessage.querySelector('button');
    button.style.cssText = `
        background: #667eea;
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 8px;
        margin-top: 1rem;
        cursor: pointer;
        font-size: 1rem;
    `;
    
    document.body.appendChild(successMessage);
    
    // Auto-close after 5 seconds
    setTimeout(() => {
        if (successMessage.parentElement) {
            successMessage.remove();
        }
    }, 5000);
}

// Intersection Observer for fade-in animations
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.addEventListener('DOMContentLoaded', function() {
        const animatedElements = document.querySelectorAll('.artwork-item, .bio-section, .info-card');
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add smooth scroll to top functionality
function addScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 0;
        z-index: 999;
    `;
    
    document.body.appendChild(scrollButton);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', debounce(() => {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.transform = 'scale(1)';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.transform = 'scale(0.8)';
        }
    }, 100));
    
    // Scroll to top on click
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top button when DOM is loaded
document.addEventListener('DOMContentLoaded', addScrollToTop);