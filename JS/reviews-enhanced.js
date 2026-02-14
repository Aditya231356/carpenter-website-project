// ============================================
// ENHANCED DYNAMIC REVIEW SYSTEM
// Professional Review System with API Integration
// ============================================

class ReviewSystem {
    constructor() {
        // Responsive review count
        this.currentLimit = window.innerWidth <= 576 ? 3 : 
                            window.innerWidth <= 992 ? 4 : 6;
        this.reviews = [];
        this.currentFilter = 'all';
        this.currentLimit = 6;
        this.currentOffset = 0;
        this.totalReviews = 0;
        this.hasMore = false;
        this.isLoading = false;
        
        // API Configuration
        this.apiBaseUrl = 'http://localhost:3001/api'; // Change this to your server URL
        
        // DOM Elements
        this.reviewsContainer = null;
        this.loadMoreContainer = null;
        this.loadMoreBtn = null;
        this.reviewModal = null;
        this.reviewForm = null;
        this.writeReviewBtn = null;
        this.closeReviewModalBtn = null;
        
        // Review statistics elements
        this.overallRatingEl = null;
        this.overallStarsEl = null;
        this.totalReviewsEl = null;
        this.ratingBars = null;
        
        // Filter elements
        this.filterButtons = [];
        
        // Initialize when DOM is ready
        this.init();
    }
    
    async init() {
        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.cacheElements();
            this.setupEventListeners();
            this.loadInitialData();
            this.setupCharacterCounter();
        });
        // Handle resize
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                const newLimit = window.innerWidth <= 576 ? 3 : 
                                window.innerWidth <= 992 ? 4 : 6;
                if (newLimit !== this.currentLimit) {
                    this.currentLimit = newLimit;
                    this.currentOffset = 0;
                    this.loadReviews();
                }
            }, 300);
        });
    }
    
    cacheElements() {
        // Cache frequently used DOM elements
        this.reviewsContainer = document.getElementById('reviewsContainer');
        this.loadMoreContainer = document.getElementById('loadMoreContainer');
        this.loadMoreBtn = document.getElementById('loadMoreReviews');
        this.reviewModal = document.getElementById('reviewModal');
        this.reviewForm = document.getElementById('reviewForm');
        this.writeReviewBtn = document.getElementById('writeReviewBtn');
        this.closeReviewModalBtn = document.getElementById('closeReviewModal');
        
        // Review statistics
        this.overallRatingEl = document.getElementById('overallRating');
        this.overallStarsEl = document.getElementById('overallStars');
        this.totalReviewsEl = document.getElementById('totalReviews');
        this.ratingBars = document.querySelectorAll('.rating-bar');
        
        // Filter buttons
        this.filterButtons = document.querySelectorAll('.reviews-filter .filter-btn');
    }
    
    setupEventListeners() {
        // Write review button
        if (this.writeReviewBtn) {
            this.writeReviewBtn.addEventListener('click', () => this.openReviewModal());
        }
        
        // Close review modal
        if (this.closeReviewModalBtn) {
            this.closeReviewModalBtn.addEventListener('click', () => this.closeReviewModal());
        }
        
        // Close modal when clicking outside
        if (this.reviewModal) {
            this.reviewModal.addEventListener('click', (e) => {
                if (e.target === this.reviewModal) {
                    this.closeReviewModal();
                }
            });
        }
        
        // Review form submission
        if (this.reviewForm) {
            this.reviewForm.addEventListener('submit', (e) => this.handleReviewSubmit(e));
        }
        
        // Star rating interaction
        this.setupStarRating();
        
        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterClick(e));
        });
        
        // Load more button
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => this.loadMoreReviews());
        }
        
        // Keyboard navigation for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.reviewModal.style.display === 'block') {
                this.closeReviewModal();
            }
        });
    }
    
    setupCharacterCounter() {
        const reviewText = document.getElementById('reviewText');
        const charCount = document.getElementById('charCount');
        
        if (reviewText && charCount) {
            reviewText.addEventListener('input', () => {
                charCount.textContent = reviewText.value.length;
            });
        }
    }
    
    setupStarRating() {
        const starInputs = document.querySelectorAll('.star-rating input');
        const starLabels = document.querySelectorAll('.star-rating label');
        
        starLabels.forEach((label, index) => {
            label.addEventListener('mouseenter', () => {
                // Highlight stars on hover
                starLabels.forEach((l, i) => {
                    l.classList.toggle('hover', i <= index);
                });
            });
            
            label.addEventListener('mouseleave', () => {
                // Remove hover class
                starLabels.forEach(l => l.classList.remove('hover'));
            });
            
            label.addEventListener('click', () => {
                // Set active state
                starLabels.forEach((l, i) => {
                    l.classList.toggle('active', i <= index);
                    l.classList.remove('hover');
                });
            });
        });
    }
    
    async loadInitialData() {
        // Load reviews and statistics
        await Promise.all([
            this.loadReviews(),
            this.loadReviewStats()
        ]);
    }
    
    async loadReviews() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoading(true);
        
        try {
            const response = await fetch(
                `${this.apiBaseUrl}/reviews?rating=${this.currentFilter}&limit=${this.currentLimit}&offset=${this.currentOffset}`
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                this.reviews = this.currentOffset === 0 ? result.data : [...this.reviews, ...result.data];
                this.totalReviews = result.total;
                this.hasMore = result.hasMore;
                
                this.renderReviews();
                this.updateLoadMoreButton();
            } else {
                throw new Error(result.error || 'Failed to load reviews');
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.showError('Failed to load reviews. Please try again.');
            
            // Fallback to localStorage or default reviews
            this.loadFromLocalStorage();
        } finally {
            this.isLoading = false;
            this.showLoading(false);
        }
    }
    
    async loadReviewStats() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/reviews/stats`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                this.updateReviewStats(result.data);
            }
        } catch (error) {
            console.error('Error loading review stats:', error);
            // Fallback to calculating from loaded reviews
            this.calculateStatsFromReviews();
        }
    }
    
    renderReviews() {
        if (!this.reviewsContainer) return;
        
        // Clear container if loading from beginning
        if (this.currentOffset === 0) {
            this.reviewsContainer.innerHTML = '';
        }
        
        if (this.reviews.length === 0) {
            this.showNoReviewsMessage();
            return;
        }
        
        // Render each review
        const fragment = document.createDocumentFragment();
        
        this.reviews.forEach((review, index) => {
            const reviewCard = this.createReviewCard(review, index);
            fragment.appendChild(reviewCard);
        });
        
        this.reviewsContainer.appendChild(fragment);
        
        // Add animation class to new cards
        const newCards = this.reviewsContainer.querySelectorAll('.review-card');
        newCards.forEach((card, index) => {
            if (index >= this.reviews.length - this.currentLimit) {
                card.classList.add('slide-up');
            }
        });
    }
    
    createReviewCard(review, index) {
        const card = document.createElement('div');
        card.className = 'testimonial-card review-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const stars = this.generateStarsHTML(review.rating);
        const date = this.formatDate(review.date);
        
        card.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="reviewer-details">
                        <h4>${this.escapeHTML(review.name)}</h4>
                        <div class="rating-stars">
                            ${stars}
                            <span class="rating-number">${review.rating}.0</span>
                        </div>
                        ${review.verified ? 
                            '<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified</span>' : 
                            ''}
                    </div>
                </div>
                <div class="review-date">
                    ${date}
                </div>
            </div>
            
            <div class="review-content">
                <h5 class="review-title">${this.escapeHTML(review.title)}</h5>
                <p class="review-text">${this.escapeHTML(review.review)}</p>
            </div>
            
            <div class="review-footer">
                <div class="service-tag">
                    <i class="fas fa-tag"></i> ${this.getServiceTypeLabel(review.serviceType)}
                </div>
                <div class="review-actions">
                    <button class="helpful-btn" onclick="window.reviewSystem.markHelpful(${review.id})"
                            data-helpful="${review.helpful || 0}">
                        <i class="fas fa-thumbs-up"></i> 
                        Helpful (${review.helpful || 0})
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    showNoReviewsMessage() {
        if (!this.reviewsContainer) return;
        
        this.reviewsContainer.innerHTML = `
            <div class="no-reviews">
                <i class="fas fa-comments"></i>
                <h3>No reviews yet</h3>
                <p>Be the first to share your experience!</p>
                <button class="btn btn-primary mt-2" onclick="window.reviewSystem.openReviewModal()">
                    <i class="fas fa-pen"></i> Write First Review
                </button>
            </div>
        `;
    }
    
    showLoading(show) {
        if (!this.reviewsContainer) return;
        
        if (show) {
            if (this.currentOffset === 0) {
                this.reviewsContainer.innerHTML = `
                    <div class="loading-container">
                        <div class="loading-spinner"></div>
                        <p>Loading reviews...</p>
                    </div>
                `;
            } else if (this.loadMoreBtn) {
                this.loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                this.loadMoreBtn.disabled = true;
            }
        } else if (this.loadMoreBtn) {
            this.loadMoreBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Load More Reviews';
            this.loadMoreBtn.disabled = false;
        }
    }
    
    updateLoadMoreButton() {
        if (!this.loadMoreContainer || !this.loadMoreBtn) return;
        
        if (this.hasMore) {
            this.loadMoreContainer.style.display = 'block';
        } else {
            this.loadMoreContainer.style.display = 'none';
        }
    }
    
    async loadMoreReviews() {
        this.currentOffset += this.currentLimit;
        await this.loadReviews();
    }
    
    async handleFilterClick(event) {
        const button = event.currentTarget;
        const rating = button.getAttribute('data-rating');
        
        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Reset pagination
        this.currentFilter = rating;
        this.currentOffset = 0;
        
        // Load filtered reviews
        await this.loadReviews();
    }
    
    openReviewModal() {
        if (!this.reviewModal) return;
        
        this.reviewModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Reset form
        if (this.reviewForm) {
            this.reviewForm.reset();
            
            // Reset star rating
            document.querySelectorAll('.star-rating label').forEach(label => {
                label.classList.remove('active');
            });
            
            // Reset character counter
            const charCount = document.getElementById('charCount');
            if (charCount) {
                charCount.textContent = '0';
            }
            
            // Focus on first input
            const firstInput = this.reviewForm.querySelector('input, textarea, select');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }
    
    closeReviewModal() {
        if (!this.reviewModal) return;
        
        this.reviewModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    async handleReviewSubmit(event) {
        event.preventDefault();
        
        if (!this.reviewForm) return;
        
        // Get form data
        const formData = this.getFormData();
        
        // Validate form
        const validation = this.validateForm(formData);
        if (!validation.valid) {
            this.showError(validation.message);
            return;
        }
        
        // Show loading state
        const submitBtn = this.reviewForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        try {
            // Submit review to API
            const response = await fetch(`${this.apiBaseUrl}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Success
                this.showSuccess('Thank you for your review! It will be visible after approval.');
                this.closeReviewModal();
                
                // Reload reviews and stats
                await Promise.all([
                    this.loadReviews(),
                    this.loadReviewStats()
                ]);
            } else {
                throw new Error(result.error || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            this.showError('Failed to submit review. Please try again.');
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
    
    getFormData() {
        const ratingInput = this.reviewForm.querySelector('input[name="rating"]:checked');
        
        return {
            name: document.getElementById('reviewerName').value.trim(),
            email: document.getElementById('reviewerEmail').value.trim(),
            phone: document.getElementById('reviewerPhone').value.trim(),
            rating: ratingInput ? parseInt(ratingInput.value) : 0,
            title: document.getElementById('reviewTitle').value.trim(),
            review: document.getElementById('reviewText').value.trim(),
            serviceType: document.getElementById('serviceType').value
        };
    }
    
    validateForm(formData) {
        // Check required fields
        if (!formData.name || !formData.email || !formData.phone || !formData.rating || !formData.title || !formData.review || !formData.serviceType) {
            return {
                valid: false,
                message: 'Please fill in all required fields'
            };
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return {
                valid: false,
                message: 'Please enter a valid email address'
            };
        }
        
        // Validate phone (Indian format)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(formData.phone)) {
            return {
                valid: false,
                message: 'Please enter a valid 10-digit Indian phone number'
            };
        }
        
        // Validate rating
        if (formData.rating < 1 || formData.rating > 5) {
            return {
                valid: false,
                message: 'Please select a rating between 1 and 5 stars'
            };
        }
        
        // Validate review length
        if (formData.review.length < 20) {
            return {
                valid: false,
                message: 'Please write a more detailed review (at least 20 characters)'
            };
        }
        
        if (formData.review.length > 1000) {
            return {
                valid: false,
                message: 'Review is too long (maximum 1000 characters)'
            };
        }
        
        // Validate title length
        if (formData.title.length < 5) {
            return {
                valid: false,
                message: 'Review title is too short (minimum 5 characters)'
            };
        }
        
        return { valid: true };
    }
    
    async markHelpful(reviewId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/reviews/${reviewId}/helpful`, {
                method: 'PUT'
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Update the helpful count in the UI
                const helpfulBtn = document.querySelector(`.helpful-btn[onclick*="${reviewId}"]`);
                if (helpfulBtn) {
                    const currentCount = parseInt(helpfulBtn.getAttribute('data-helpful')) || 0;
                    const newCount = currentCount + 1;
                    
                    helpfulBtn.innerHTML = `<i class="fas fa-thumbs-up"></i> Helpful (${newCount})`;
                    helpfulBtn.setAttribute('data-helpful', newCount);
                    helpfulBtn.classList.add('active');
                    
                    // Disable button after clicking
                    helpfulBtn.disabled = true;
                    
                    this.showSuccess('Thank you for your feedback!');
                }
            }
        } catch (error) {
            console.error('Error marking review as helpful:', error);
        }
    }
    
    updateReviewStats(stats) {
        // Update overall rating
        if (this.overallRatingEl) {
            this.overallRatingEl.textContent = stats.averageRating;
        }
        
        // Update stars
        if (this.overallStarsEl) {
            this.overallStarsEl.innerHTML = this.generateStarsHTML(stats.averageRating);
        }
        
        // Update total reviews
        if (this.totalReviewsEl) {
            this.totalReviewsEl.textContent = stats.totalReviews;
        }
        
        // Update rating breakdown
        this.updateRatingBreakdown(stats.ratingBreakdown);
    }
    
    updateRatingBreakdown(breakdown) {
        this.ratingBars.forEach(bar => {
            const rating = bar.querySelector('.rating-label').textContent.trim();
            const count = breakdown[rating] || 0;
            const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
            const percentage = total > 0 ? (count / total) * 100 : 0;
            
            const fill = bar.querySelector('.bar-fill');
            const countSpan = bar.querySelector('.count');
            
            if (fill) {
                fill.style.width = `${percentage}%`;
            }
            
            if (countSpan) {
                countSpan.textContent = count;
            }
        });
    }
    
    calculateStatsFromReviews() {
        if (this.reviews.length === 0) return;
        
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / this.reviews.length).toFixed(1);
        const totalReviews = this.reviews.length;
        
        // Calculate rating breakdown
        const ratingBreakdown = {
            5: this.reviews.filter(r => r.rating === 5).length,
            4: this.reviews.filter(r => r.rating === 4).length,
            3: this.reviews.filter(r => r.rating === 3).length,
            2: this.reviews.filter(r => r.rating === 2).length,
            1: this.reviews.filter(r => r.rating === 1).length
        };
        
        this.updateReviewStats({
            averageRating,
            totalReviews,
            ratingBreakdown
        });
    }
    
    loadFromLocalStorage() {
        // Fallback to localStorage if API fails
        try {
            const storedReviews = localStorage.getItem('customerReviews');
            if (storedReviews) {
                this.reviews = JSON.parse(storedReviews);
                this.renderReviews();
                this.calculateStatsFromReviews();
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }
    
    // Utility methods
    generateStarsHTML(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        return stars;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        return date.toLocaleDateString('en-IN', options);
    }
    
    getServiceTypeLabel(type) {
        const labels = {
            'custom-furniture': 'Custom Furniture',
            'doors-windows': 'Doors & Windows',
            'repair-restoration': 'Repair & Restoration',
            'commercial': 'Commercial Carpentry',
            'other': 'Other Services'
        };
        return labels[type] || type;
    }
    
    escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type = 'info') {
        // Check if notification function exists in main.js
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
            return;
        }
        
        // Fallback notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Initialize the review system when page loads
window.reviewSystem = new ReviewSystem();

// Make functions globally available for onclick events
window.markHelpful = function(reviewId) {
    if (window.reviewSystem) {
        window.reviewSystem.markHelpful(reviewId);
    }
};

window.openReviewModal = function() {
    if (window.reviewSystem) {
        window.reviewSystem.openReviewModal();
    }
};