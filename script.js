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
        volume: 0.3
    }),
    success: new Howl({
        src: ['https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3'],
        volume: 0.5
    }),
    coins: new Howl({
        src: ['https://assets.mixkit.co/sfx/preview/mixkit-coins-handling-1939.mp3'],
        volume: 0.4
    }),
    whoosh: new Howl({
        src: ['https://assets.mixkit.co/sfx/preview/mixkit-fast-small-sweep-transition-166.mp3'],
        volume: 0.3
    }),
    tada: new Howl({
        src: ['tada.mp3'],
        volume: 0.5
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
    let feeDetails = '';
    
    if (currentPaymentMethod === 'fiat') {
        const processingFee = amount * 0.029;
        const fixedFee = 0.30;
        const totalFee = processingFee + fixedFee;
        
        feeDetails = `
            <div class="fee-breakdown">
                <div class="fee-item">
                    <span>
                        <i class="ri-percent-line"></i>
                        Processing Fee (2.9%)
                    </span>
                    <span>$${processingFee.toFixed(2)}</span>
                </div>
                <div class="fee-item">
                    <span>
                        <i class="ri-add-circle-line"></i>
                        Fixed Fee
                    </span>
                    <span>$${fixedFee.toFixed(2)}</span>
                </div>
                <div class="fee-item total">
                    <span>
                        <i class="ri-exchange-dollar-line"></i>
                        Total Fee
                    </span>
                    <span>$${totalFee.toFixed(2)}</span>
                </div>
                <div class="fee-item grand-total">
                    <span>
                        <i class="ri-money-dollar-circle-line"></i>
                        Final Amount
                    </span>
                    <span>$${(amount + totalFee).toFixed(2)}</span>
                </div>
            </div>
        `;
    } else if (currentPaymentMethod === 'solana' && selectedCrypto) {
        const networkFees = {
            btc: { fee: 0.0001, symbol: '₿' },
            eth: { fee: 0.002, symbol: 'Ξ' },
            sol: { fee: 0.000005, symbol: 'SOL' }
        };
        
        const cryptoFee = networkFees[selectedCrypto];
        const total = amount + cryptoFee.fee;
        
        feeDetails = `
            <div class="fee-breakdown">
                <div class="fee-item">
                    <span>
                        <i class="ri-gas-station-line"></i>
                        Network Fee
                    </span>
                    <span>${cryptoFee.fee} ${cryptoFee.symbol}</span>
                </div>
                <div class="fee-item grand-total">
                    <span>
                        <i class="ri-coin-line"></i>
                        Final Amount
                    </span>
                    <span>${total.toFixed(6)} ${cryptoFee.symbol}</span>
                </div>
            </div>
        `;
    }
    
    const feeInfo = document.getElementById('feeInfo');
    feeInfo.innerHTML = feeDetails;
    
    // Add updating animation to numbers
    document.querySelectorAll('.fee-item').forEach(item => {
        item.classList.add('updating');
        setTimeout(() => item.classList.remove('updating'), 300);
    });
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

async function processPayment() {
    if (!currentPaymentMethod) {
        alert('Please select a payment method');
        return;
    }

    const amount = document.getElementById('amount').value;
    if (!amount) {
        alert('Please enter an amount');
        return;
    }

    // Show success animation for both payment methods
    showSuccessAnimation();
}

function showSuccessAnimation() {
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay';
    
    // Get crypto-specific details
    const cryptoDetails = getCryptoDetails();
    
    overlay.innerHTML = `
        <div class="success-content">
            <div class="success-animation">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                    <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
            </div>
            <div class="success-amount">
                ${cryptoDetails.symbol}${document.getElementById('amount').value}
            </div>
            <div class="success-message">Payment Complete!</div>
            <div class="transaction-info">
                <div class="transaction-id">
                    <span>Transaction ID</span>
                    <code>${generateTransactionId()}</code>
                </div>
                <div class="network">
                    <span>Network</span>
                    <code>${cryptoDetails.network}</code>
                </div>
                <div class="transaction-time">
                    <span>Time</span>
                    <code>${new Date().toLocaleTimeString()}</code>
                </div>
            </div>
            <div class="share-section">
                <h3>Share Your Payment</h3>
                <div class="share-options">
                    <button onclick="shareToTwitter()" class="share-button twitter">
                        <i class="ri-twitter-fill"></i>
                        <span>Twitter</span>
                    </button>
                    <button onclick="shareToInstagram()" class="share-button instagram">
                        <i class="ri-instagram-fill"></i>
                        <span>Instagram</span>
                    </button>
                    <button onclick="openExplorer()" class="share-button explorer">
                        <i class="${cryptoDetails.explorerIcon}"></i>
                        <span>${cryptoDetails.explorerName}</span>
                    </button>
                </div>
                <div class="receipt-preview">
                    <img src="${generateReceiptImage()}" alt="Payment Receipt" class="receipt-image">
                    <button onclick="downloadReceipt()" class="download-button">
                        <i class="ri-download-2-line"></i>
                        Save Receipt
                    </button>
                </div>
            </div>
            <button onclick="closeSuccessOverlay()" class="done-button">
                Done
            </button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    sounds.success.play();
    setTimeout(() => sounds.coins.play(), 300);
    setTimeout(() => sounds.tada.play(), 600);
    
    // Trigger confetti in crypto colors
    triggerConfetti(cryptoDetails.colors);
    
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        overlay.classList.add('active');
    });
}

function getCryptoDetails() {
    if (currentPaymentMethod === 'fiat') {
        return {
            symbol: '$',
            network: 'Bank Transfer',
            explorerIcon: 'ri-bank-line',
            explorerName: 'Receipt',
            colors: ['#00E5FF', '#ffffff']
        };
    }
    
    const cryptoConfigs = {
        btc: {
            symbol: '₿',
            network: 'Bitcoin Network',
            explorerIcon: 'ri-bitcoin-line',
            explorerName: 'Block Explorer',
            colors: ['#F7931A', '#FFAE34'],
            explorerUrl: 'https://blockchain.com/explorer'
        },
        eth: {
            symbol: 'Ξ',
            network: 'Ethereum Network',
            explorerIcon: 'ri-ethereum-line',
            explorerName: 'Etherscan',
            colors: ['#627EEA', '#85A5FF'],
            explorerUrl: 'https://etherscan.io'
        },
        sol: {
            symbol: 'SOL',
            network: 'Solana Network',
            explorerIcon: 'ri-compass-3-line',
            explorerName: 'Solscan',
            colors: ['#14F195', '#9945FF'],
            explorerUrl: 'https://solscan.io'
        }
    };

    return cryptoConfigs[selectedCrypto];
}

function triggerConfetti(colors) {
    // First burst
    confetti({
        particleCount: 100,
        spread: 70,
        colors: colors,
        origin: { y: 0.6 }
    });

    // Second burst with delay
    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            colors: colors,
            origin: { x: 0, y: 0.6 }
        });
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            colors: colors,
            origin: { x: 1, y: 0.6 }
        });
    }, 200);
}

function closeSuccessOverlay() {
    const overlay = document.querySelector('.success-overlay');
    const content = overlay.querySelector('.success-content');
    const cryptoDetails = getCryptoDetails();
    
    // Add exit animation class
    content.classList.add('exit-animation');
    
    // Create particle explosion
    createExitParticles(overlay);
    
    // Play whoosh sound
    sounds.whoosh.play();
    
    // Final confetti burst
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: cryptoDetails.colors,
        angle: 90,
        startVelocity: 45,
        gravity: 0.7,
        ticks: 400
    });
    
    // Side confetti bursts
    setTimeout(() => {
        confetti({
            particleCount: 80,
            angle: 60,
            spread: 80,
            origin: { x: 0, y: 0.5 },
            colors: cryptoDetails.colors
        });
        confetti({
            particleCount: 80,
            angle: 120,
            spread: 80,
            origin: { x: 1, y: 0.5 },
            colors: cryptoDetails.colors
        });
    }, 100);
    
    // Create electric effect
    const electric = document.createElement('div');
    electric.className = 'electric-effect';
    overlay.appendChild(electric);
    
    // Fade out overlay
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
            closeModal();
        }, 500);
    }, 300);
}

function createExitParticles(overlay) {
    const particles = 24; // Increased number of particles
    const colors = getCryptoDetails().colors;
    
    for (let i = 0; i < particles; i++) {
        const particle = document.createElement('div');
        particle.className = 'exit-particle';
        
        // Random size for particles
        const size = Math.random() * 8 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Set random color from crypto colors
        particle.style.background = colors[i % colors.length];
        particle.style.boxShadow = `0 0 10px ${colors[i % colors.length]}`;
        
        // Set random angle and speed for particle trajectory
        const angle = (i / particles) * 360;
        particle.style.setProperty('--angle', `${angle}deg`);
        particle.style.setProperty('--speed', `${0.6 + Math.random() * 0.4}s`);
        
        overlay.appendChild(particle);
    }
}

function copyPaymentLink() {
    const amount = document.getElementById('amount').value;
    const link = `https://yourwebsite.com/pay?amount=${amount}&method=${currentPaymentMethod}`;
    navigator.clipboard.writeText(link);
    
    const copyButton = document.querySelector('.share-button.copy');
    const originalContent = copyButton.innerHTML;
    copyButton.innerHTML = '<i class="ri-check-line"></i><span>Copied!</span>';
    copyButton.classList.add('copied');
    
    setTimeout(() => {
        copyButton.innerHTML = originalContent;
        copyButton.classList.remove('copied');
    }, 2000);
}

function showPhantomPrompt() {
    const prompt = document.createElement('div');
    prompt.className = 'phantom-prompt';
    prompt.innerHTML = `
        <div class="prompt-content">
            <img src="https://phantom.app/img/logo.png" alt="Phantom">
            <h3>Install Phantom Wallet</h3>
            <p>To complete this transaction, you'll need to install the Phantom wallet.</p>
            <button onclick="window.open('https://phantom.app/', '_blank')">
                <i class="ri-external-link-line"></i>
                Get Phantom
            </button>
        </div>
    `;
    document.body.appendChild(prompt);
}

function generateTransactionId() {
    return 'tx_' + Math.random().toString(36).substr(2, 9);
}

function shareToTwitter() {
    const cryptoDetails = getCryptoDetails();
    const amount = document.getElementById('amount').value;
    const text = encodeURIComponent(
        `Just sent ${cryptoDetails.symbol}${amount} using the coolest payment modal ever! 🚀✨\nNetwork: ${cryptoDetails.network}`
    );
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

// Update the handleParallax function
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
    
    // Apply parallax to trigger button while maintaining center position
    triggerButton.style.transform = `translate(-50%, -50%) perspective(1000px) rotateY(${xWalk/3}deg) rotateX(${-yWalk/3}deg)`;
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

function openExplorer() {
    const cryptoDetails = getCryptoDetails();
    if (cryptoDetails.explorerUrl) {
        window.open(cryptoDetails.explorerUrl, '_blank');
    }
}

function generateReceiptImage() {
    const cryptoDetails = getCryptoDetails();
    const amount = document.getElementById('amount').value;
    const time = new Date().toLocaleTimeString();
    const txId = generateTransactionId();

    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630; // Twitter card size
    const ctx = canvas.getContext('2d');

    // Set gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1f2c');
    gradient.addColorStop(1, '#0A0C10');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add glass effect overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fillRect(100, 50, canvas.width - 200, canvas.height - 100);

    // Add blur effect border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 50, canvas.width - 200, canvas.height - 100);

    // Set text styles
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';

    // Draw amount
    ctx.font = 'bold 72px SF Pro Display';
    ctx.fillStyle = cryptoDetails.colors[0];
    ctx.fillText(`${cryptoDetails.symbol}${amount}`, canvas.width/2, 200);

    // Draw network info
    ctx.font = '32px SF Pro Display';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(cryptoDetails.network, canvas.width/2, 280);

    // Draw transaction details
    ctx.font = '24px SF Pro Display';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText(`Transaction ID: ${txId}`, canvas.width/2, 350);
    ctx.fillText(`Time: ${time}`, canvas.width/2, 400);
    ctx.fillText(`Network Fee: ${cryptoDetails.fee} ${cryptoDetails.symbol}`, canvas.width/2, 450);

    // Add decorative elements
    drawDecorativeElements(ctx, cryptoDetails.colors);

    // Add logo or branding
    ctx.font = 'bold 28px SF Pro Display';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Payment Receipt', canvas.width/2, 550);

    return canvas.toDataURL('image/png');
}

function drawDecorativeElements(ctx, colors) {
    // Add glowing circles
    ctx.beginPath();
    const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 100);
    gradient.addColorStop(0, colors[0] + '33');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.arc(200, 200, 100, 0, Math.PI * 2);
    ctx.fill();

    // Add floating particles
    for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length] + '33';
        ctx.arc(
            Math.random() * ctx.canvas.width,
            Math.random() * ctx.canvas.height,
            Math.random() * 4 + 2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
}

function downloadReceipt() {
    const link = document.createElement('a');
    link.download = 'payment-receipt.png';
    link.href = generateReceiptImage();
    link.click();
}