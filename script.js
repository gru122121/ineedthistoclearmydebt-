// Initialize variables first
let currentPaymentMethod = null;
let selectedCrypto = null;

// Initialize sound effects
const sounds = {
    hover: new Howl({
        src: ['click.mp3'],
        volume: 0.2
    }),
    click: new Howl({
        src: ['click.mp3'],
        volume: 0.3,
        rate: 1.2
    }),
    success: new Howl({
        src: ['click.mp3'],
        volume: 0.5,
        rate: 1.5
    }),
    payment: new Howl({
        src: ['https://assets.mixkit.co/active_storage/sfx/2019/payment-success-2157.wav'],
        volume: 0.4
    })
};

function openModal() {
    const modal = document.getElementById('modalOverlay');
    const payModal = document.getElementById('payModal');
    
    modal.style.display = 'block';
    
    // Reset transform for smooth animation
    payModal.style.transform = 'translate(-50%, -50%) perspective(1000px)';
    payModal.style.animation = 'modalEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
}

function closeModal() {
    const modal = document.getElementById('modalOverlay');
    const payModal = document.getElementById('payModal');
    
    payModal.style.animation = 'modalExit 0.3s ease-in';
    setTimeout(() => {
        modal.style.display = 'none';
        payModal.style.animation = '';
    }, 300);
}

function createParticleContainer() {
    const container = document.createElement('div');
    container.className = 'particle-container';
    document.body.appendChild(container);
    return container;
}

function createFloatingParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    
    // Random size between 2 and 6 pixels
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random starting position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Random movement direction
    const moveX = (Math.random() - 0.5) * 200;
    const moveY = (Math.random() - 0.5) * 200;
    particle.style.setProperty('--moveX', `${moveX}px`);
    particle.style.setProperty('--moveY', `${moveY}px`);
    
    container.appendChild(particle);
    
    // Remove particle after animation
    particle.addEventListener('animationend', () => {
        particle.remove();
    });
}

function selectPaymentMethod(method) {
    const element = document.getElementById(`${method}Option`);
    
    if (element.classList.contains('active')) {
        // Deselect if already active
        element.classList.remove('active');
        currentPaymentMethod = null;
        document.getElementById('tokenInput').style.display = 'none';
    } else {
        // Select new option
        currentPaymentMethod = method;
        document.getElementById('fiatOption').classList.remove('active');
        document.getElementById('solanaOption').classList.remove('active');
        element.classList.add('active');
        
        if (method === 'solana') {
            showCryptoOptions();
        } else {
            document.getElementById('tokenInput').style.display = 'none';
        }
        
        createSelectionEffect(element);
    }
    
    calculateFee();
}

function createSelectionEffect(element) {
    // Create burst particles
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.className = 'selection-particle';
        const angle = (i / 8) * 360;
        particle.style.setProperty('--angle', `${angle}deg`);
        element.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
}

function calculateFee() {
    const amount = parseFloat(document.getElementById('amount').value) || 0;
    const fee = currentPaymentMethod === 'fiat' ? amount * 0.029 + 0.30 : amount * 0.01;
    document.getElementById('feeInfo').innerHTML = `
        Transaction fee: $${fee.toFixed(2)}<br>
        Total amount: $${(amount + fee).toFixed(2)}
    `;
}

function createRipple(event, element) {
    const ripple = document.createElement('div');
    ripple.classList.add('ripple');
    element.appendChild(ripple);

    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size/2}px`;
    ripple.style.top = `${event.clientY - rect.top - size/2}px`;

    ripple.addEventListener('animationend', () => {
        ripple.remove();
    });
}

function processPayment() {
    if (!currentPaymentMethod) {
        alert('Please select a payment method');
        return;
    }
    
    if (currentPaymentMethod === 'solana' && !selectedCrypto) {
        alert('Please select a cryptocurrency');
        return;
    }
    
    const amount = document.getElementById('amount').value;
    if (!amount) {
        alert('Please enter an amount');
        return;
    }
    
    sounds.success.play();
    
    // Create electric effect
    const electric = document.createElement('div');
    electric.classList.add('electric-effect');
    document.body.appendChild(electric);
    
    // Particle explosion
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.setProperty('--angle', `${i * 18}deg`);
        document.body.appendChild(particle);
        
        setTimeout(() => particle.remove(), 1000);
    }
    
    // Success checkmark animation
    const success = document.createElement('div');
    success.classList.add('success-checkmark');
    success.innerHTML = '<i class="ri-checkbox-circle-line"></i>';
    document.body.appendChild(success);
    
    setTimeout(() => {
        success.remove();
        electric.remove();
        closeModal();
    }, 2000);
}

function shareToTwitter() {
    const text = encodeURIComponent('Just sent a payment using the cutest payment modal ever! 🐾💖');
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
}

function shareToInstagram() {
    alert('Opening Instagram... Create a story to share your payment! 📸');
    window.open('https://instagram.com', '_blank');
}

function showCryptoOptions() {
    const cryptoModal = document.getElementById('cryptoModal');
    cryptoModal.classList.add('active');
    
    // Add entrance animation for each option
    const options = document.querySelectorAll('.crypto-option');
    options.forEach((option, index) => {
        option.style.opacity = '0';
        option.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            option.style.opacity = '1';
            option.style.transform = 'translateX(0)';
        }, index * 100);
    });
}

function hideCryptoOptions() {
    const cryptoModal = document.getElementById('cryptoModal');
    
    // Add exit animation
    const options = document.querySelectorAll('.crypto-option');
    options.forEach((option, index) => {
        setTimeout(() => {
            option.style.opacity = '0';
            option.style.transform = 'translateX(20px)';
        }, index * 50);
    });
    
    setTimeout(() => {
        cryptoModal.classList.remove('active');
    }, 300);
    
    if (!selectedCrypto) {
        document.getElementById('solanaOption').classList.remove('active');
        currentPaymentMethod = null;
    }
}

function selectCrypto(crypto) {
    selectedCrypto = crypto;
    
    // Create selection effect
    const cryptoOptions = document.querySelectorAll('.crypto-option');
    cryptoOptions.forEach(option => {
        option.style.transform = 'translateX(0)';
        option.style.opacity = '0.5';
    });
    
    const selectedOption = event.currentTarget;
    selectedOption.style.transform = 'translateX(8px)';
    selectedOption.style.opacity = '1';
    
    // Add particle effect
    createSelectionEffect(selectedOption);
    
    // Hide crypto modal after a short delay
    setTimeout(() => {
        hideCryptoOptions();
        document.getElementById('tokenInput').style.display = 'block';
    }, 500);
}

// Add parallax effect
function handleParallax(e) {
    const modal = document.getElementById('payModal');
    const triggerButton = document.querySelector('.trigger-button');
    
    if (!modal || !triggerButton) return;
    
    const walk = 30; // px to move
    const { clientX: x, clientY: y } = e;
    const { innerWidth: width, innerHeight: height } = window;
    
    const xWalk = (x / width * walk) - (walk / 2);
    const yWalk = (y / height * walk) - (walk / 2);
    
    // Apply parallax to modal
    if (modal.style.display !== 'none') {
        modal.style.transform = `translate(-50%, -50%) perspective(1000px) rotateY(${xWalk/2}deg) rotateX(${-yWalk/2}deg)`;
    }
    
    // Apply parallax to trigger button
    triggerButton.style.transform = `perspective(1000px) rotateY(${xWalk/3}deg) rotateX(${-yWalk/3}deg)`;
}

// Update the event listeners in DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Add parallax effect
    document.addEventListener('mousemove', handleParallax);
    
    // Add click sound effects instead of hover
    document.querySelectorAll('button, .payment-option').forEach(button => {
        button.addEventListener('click', () => {
            sounds.click.play();
            button.classList.add('bubble-animation');
            setTimeout(() => button.classList.remove('bubble-animation'), 300);
        });
    });
    
    // Create particle container
    const particleContainer = createParticleContainer();
    
    // Create new particles periodically
    setInterval(() => {
        if (Math.random() < 0.3) {
            createFloatingParticle(particleContainer);
        }
    }, 200);
    
    // Add button particles
    createButtonParticles();
    
    // Update particle positions on window resize
    window.addEventListener('resize', () => {
        const container = document.querySelector('.button-particles');
        if (container) {
            container.innerHTML = '';
        }
    });
});

// Add ripple effect to all buttons
document.querySelectorAll('button, .payment-option').forEach(button => {
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.addEventListener('click', (e) => createRipple(e, button));
});

// Add these CSS classes for the new animations
const newStyles = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple 0.6s linear;
}

.electric-effect {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(0, 229, 255, 0.1), transparent);
    animation: electric 1s ease-out;
    pointer-events: none;
    z-index: 9999;
}

.particle {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    background: var(--primary);
    border-radius: 50%;
    animation: particle 1s ease-out;
    transform-origin: center;
    transform: rotate(var(--angle));
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes electric {
    0% { opacity: 0; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.1); }
    100% { opacity: 0; transform: scale(1); }
}

@keyframes particle {
    0% { transform: rotate(var(--angle)) translateY(0); opacity: 1; }
    100% { transform: rotate(var(--angle)) translateY(100px); opacity: 0; }
}
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = newStyles;
document.head.appendChild(styleSheet);

// Add live price updates
function updateCryptoPrices() {
    // This would normally fetch from an API
    const prices = {
        btc: '$' + (Math.random() * 1000 + 43000).toFixed(2),
        eth: '$' + (Math.random() * 100 + 2300).toFixed(2),
        sol: '$' + (Math.random() * 10 + 85).toFixed(2)
    };
    
    document.querySelectorAll('.crypto-option').forEach(option => {
        const crypto = option.getAttribute('onclick').match(/'(\w+)'/)[1];
        option.querySelector('.crypto-price').textContent = prices[crypto];
    });
}

// Update prices periodically
setInterval(updateCryptoPrices, 5000);

// Add this new function
function createButtonParticles() {
    const button = document.querySelector('.trigger-button');
    const container = document.createElement('div');
    container.className = 'button-particles';
    button.parentNode.insertBefore(container, button);

    // Create orbiting orbs
    for (let i = 0; i < 3; i++) {
        const orb = document.createElement('div');
        orb.className = 'orb';
        
        // Random size between 6 and 12 pixels
        const size = Math.random() * 6 + 6;
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;
        
        // Set initial position around button
        const rect = button.getBoundingClientRect();
        orb.style.left = `${rect.left + rect.width/2}px`;
        orb.style.top = `${rect.top + rect.height/2}px`;
        
        // Add random delay and direction
        orb.style.animationDelay = `${i * -2}s`;
        orb.style.animationDirection = i % 2 === 0 ? 'normal' : 'reverse';
        
        container.appendChild(orb);
    }

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'button-particle';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position around the button
        const rect = button.getBoundingClientRect();
        const angle = Math.random() * Math.PI * 2;
        const radius = 30 + Math.random() * 20;
        const x = rect.left + rect.width/2 + Math.cos(angle) * radius;
        const y = rect.top + rect.height/2 + Math.sin(angle) * radius;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        container.appendChild(particle);
        
        // Create trailing effect
        const trail = document.createElement('div');
        trail.className = 'trail';
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        container.appendChild(trail);
        
        // Remove elements after animation
        setTimeout(() => {
            particle.remove();
            trail.remove();
        }, 4000);
    }

    // Create particles periodically
    setInterval(createParticle, 100);

    // Update orb positions on scroll and resize
    function updateOrbPositions() {
        const rect = button.getBoundingClientRect();
        container.querySelectorAll('.orb').forEach(orb => {
            orb.style.left = `${rect.left + rect.width/2}px`;
            orb.style.top = `${rect.top + rect.height/2}px`;
        });
    }

    window.addEventListener('scroll', updateOrbPositions);
    window.addEventListener('resize', updateOrbPositions);
}