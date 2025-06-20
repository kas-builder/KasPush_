// Kaspa Wallet Tracker - Main JavaScript File
class KaspaWalletTracker {
    constructor() {
        this.currentWallet = null;
        this.currentBalance = 0;
        this.previousBalance = 0;
        this.refreshInterval = null;
        this.countdownInterval = null;
        this.refreshTime = 150000; // 2 minutes 30 seconds in milliseconds
        this.countdownTime = 150; // 2 minutes 30 seconds in seconds
        this.isConnected = false;
        
        // Kaspa API endpoint
        this.apiBaseUrl = 'https://api.kaspa.org';
        
        // CoinGecko API endpoint for USD price
        this.priceApiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=usd';
        this.kaspaUsdPrice = 0;
        
        // Predefined wallets
        this.predefinedWallets = {
            'kaspa:qpzpfwcsqsxhxwup26r55fd0ghqlhyugz8cp6y3wxuddc02vcxtjg75pspnwz': 'MEXC Wallet',
            'kaspa:qpz2vgvlxhmyhmt22h538pjzmvvd52nuut80y5zulgpvyerlskvvwm7n4uk5a': 'Wallet #2',
            'kaspa:qzxrs8gxjgk2q84wlt3xfd057ntws73fptalhy84g85zqfu5lcemvpu04vj3w': 'Uphold Wallet',
            'kaspa:qrvum29vk365g0zcd5gx3c7h829etfq2ytdmscjzw4zw04fjfnprcg9c3tges': 'Bybit Wallet',
            'kaspa:ppk66xua7nmq8elv3eglfet0xxcfuks835xdgsm5jlymjhazyu6h5ac62l4ey': 'DAGKnight Fund Wallet',
            'kaspa:qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkx9awp4e': 'Burn Address Wallet'
        };

        this.initializeElements();
        this.attachEventListeners();
        this.loadStoredData();
    }

    initializeElements() {
        // Wallet selection elements
        this.walletSelect = document.getElementById('walletSelect');
        this.customWalletSection = document.getElementById('customWalletSection');
        this.customAddress = document.getElementById('customAddress');
        this.customLabel = document.getElementById('customLabel');
        this.connectWallet = document.getElementById('connectWallet');
        
        // Wallet info elements
        this.walletInfo = document.getElementById('walletInfo');
        this.walletName = document.getElementById('walletName');
        this.disconnectWallet = document.getElementById('disconnectWallet');
        this.currentBalanceEl = document.getElementById('currentBalance');
        this.balanceChange = document.getElementById('balanceChange');
        this.refreshButton = document.getElementById('refreshButton');
        this.countdown = document.getElementById('countdown');
        this.lastUpdated = document.getElementById('lastUpdated');
        this.connectionStatus = document.getElementById('connectionStatus');
        
        // Pushcut elements
        this.pushcutTitle = document.getElementById('pushcutTitle');
        this.pushcutApiKey = document.getElementById('pushcutApiKey');
        this.pushcutNotificationName = document.getElementById('pushcutNotificationName');
        this.testNotification = document.getElementById('testNotification');
        this.resetApiKey = document.getElementById('resetApiKey');
        this.pushcutStatus = document.getElementById('pushcutStatus');
        this.pushcutIndicator = document.getElementById('pushcutIndicator');
        this.pushcutStatusText = document.getElementById('pushcutStatusText');
    }

    attachEventListeners() {
        // Wallet selection events
        this.walletSelect.addEventListener('change', () => this.handleWalletSelection());
        this.connectWallet.addEventListener('click', () => this.connectToWallet());
        this.disconnectWallet.addEventListener('click', () => this.disconnectFromWallet());
        
        // Refresh events
        this.refreshButton.addEventListener('click', () => this.manualRefresh());
        
        // Pushcut events
        this.testNotification.addEventListener('click', () => this.testPushcutNotification());
        this.resetApiKey.addEventListener('click', () => this.resetPushcutConfig());
        
        // Auto-update status only, no saving
        this.pushcutApiKey.addEventListener('input', () => this.updatePushcutStatus());
        this.pushcutNotificationName.addEventListener('input', () => this.updatePushcutStatus());
    }

    handleWalletSelection() {
        const selectedValue = this.walletSelect.value;
        
        if (selectedValue === 'custom') {
            this.customWalletSection.classList.remove('custom-wallet-hidden');
        } else {
            this.customWalletSection.classList.add('custom-wallet-hidden');
        }
    }

    async connectToWallet() {
        const selectedValue = this.walletSelect.value;
        
        if (!selectedValue) {
            this.showNotification('Please select a wallet', 'error');
            return;
        }

        let walletAddress, walletLabel;

        if (selectedValue === 'custom') {
            walletAddress = this.customAddress.value.trim();
            walletLabel = this.customLabel.value.trim() || 'Custom Wallet';
            
            if (!walletAddress) {
                this.showNotification('Please enter a custom wallet address', 'error');
                return;
            }
            
            if (!this.isValidKaspaAddress(walletAddress)) {
                this.showNotification('Invalid Kaspa address format', 'error');
                return;
            }
        } else {
            walletAddress = selectedValue;
            walletLabel = this.predefinedWallets[selectedValue];
        }

        try {
            this.connectWallet.disabled = true;
            this.connectWallet.textContent = 'Connecting...';
            
            // Test connection by fetching balance and price
            const [balance] = await Promise.all([
                this.fetchWalletBalance(walletAddress),
                this.fetchKaspaPrice()
            ]);
            
            this.currentWallet = {
                address: walletAddress,
                label: walletLabel
            };
            
            this.currentBalance = balance;
            this.previousBalance = balance;
            this.isConnected = true;
            
            this.updateUI();
            this.startAutoRefresh();
            
            this.connectWallet.textContent = 'Wallet Connected';
            this.showNotification(`Connected to ${walletLabel}`, 'success');
            
        } catch (error) {
            this.showNotification(`Failed to connect: ${error.message}`, 'error');
            this.connectWallet.disabled = false;
            this.connectWallet.textContent = 'Connect Wallet';
        }
    }

    disconnectFromWallet() {
        this.stopAutoRefresh();
        this.currentWallet = null;
        this.currentBalance = 0;
        this.previousBalance = 0;
        this.isConnected = false;
        
        this.walletInfo.classList.add('hidden');
        this.walletSelect.value = '';
        this.customWalletSection.classList.add('custom-wallet-hidden');
        this.customAddress.value = '';
        this.customLabel.value = '';
        
        // Reset connect button
        this.connectWallet.disabled = false;
        this.connectWallet.textContent = 'Connect Wallet';
        
        this.clearWalletData();
        this.showNotification('Disconnected from wallet', 'info');
    }

    async fetchWalletBalance(address) {
        try {
            // Use Kaspa REST API to get balance
            const response = await fetch(`${this.apiBaseUrl}/addresses/${address}/balance`);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Convert from sompi to KAS (1 KAS = 100,000,000 sompi)
            const balanceInKas = data.balance / 100000000;
            return balanceInKas;
            
        } catch (error) {
            console.error('Error fetching balance:', error);
            
            // Fallback to alternative API endpoints
            try {
                const fallbackResponse = await fetch(`https://explorer.kaspa.org/api/addresses/${address}/balance`);
                if (fallbackResponse.ok) {
                    const fallbackData = await fallbackResponse.json();
                    return fallbackData.balance / 100000000;
                }
            } catch (fallbackError) {
                console.error('Fallback API also failed:', fallbackError);
            }
            
            throw new Error('Unable to fetch balance from Kaspa network');
        }
    }

    async fetchKaspaPrice() {
        try {
            const response = await fetch(this.priceApiUrl);
            if (response.ok) {
                const data = await response.json();
                this.kaspaUsdPrice = data.kaspa.usd;

            }
        } catch (error) {
            console.error('Error fetching Kaspa price:', error);
            this.kaspaUsdPrice = 0;
        }
    }

    async refreshBalance() {
        if (!this.currentWallet || !this.isConnected) {
            return;
        }

        try {
            this.connectionStatus.className = 'status-indicator loading';
            
            // Fetch both balance and price simultaneously
            const [newBalance] = await Promise.all([
                this.fetchWalletBalance(this.currentWallet.address),
                this.fetchKaspaPrice()
            ]);
            
            this.previousBalance = this.currentBalance;
            this.currentBalance = newBalance;
            
            this.updateBalanceDisplay();
            this.updateLastUpdatedTime();
            
            this.connectionStatus.className = 'status-indicator online';
            
            // Check for balance changes and send notifications
            if (this.currentBalance !== this.previousBalance) {
                this.handleBalanceChange();
            }
            
        } catch (error) {
            console.error('Error refreshing balance:', error);
            this.connectionStatus.className = 'status-indicator offline';
            this.showNotification('Failed to refresh balance', 'error');
        }
    }

    handleBalanceChange() {
        const difference = this.currentBalance - this.previousBalance;
        
        if (difference > 0) {
            this.balanceChange.textContent = `Received: +${this.formatNumberWithCommas(difference)} KAS`;
            this.balanceChange.className = 'balance-change positive';
            this.balanceChange.classList.remove('hidden');
            
            // Send Pushcut notification for positive balance change
            this.sendPushcutNotification(
                `Kaspa Wallet Update`,
                `${this.currentWallet.label} received +${this.formatNumberWithCommas(difference)} KAS. New balance: ${this.formatNumberWithCommas(this.currentBalance)} KAS`
            );
            
        } else if (difference < 0) {
            this.balanceChange.textContent = `Sent: ${this.formatNumberWithCommas(Math.abs(difference))} KAS`;
            this.balanceChange.className = 'balance-change negative';
            this.balanceChange.classList.remove('hidden');
        }
        
        // Hide balance change after 10 seconds
        setTimeout(() => {
            this.balanceChange.classList.add('hidden');
        }, 10000);
    }

    formatNumberWithCommas(number) {
        return Math.round(number).toLocaleString();
    }

    updateBalanceDisplay() {
        this.currentBalanceEl.textContent = `${this.formatNumberWithCommas(this.currentBalance)} KAS`;
        
        // Update tooltip with USD value
        if (this.kaspaUsdPrice > 0) {
            const usdValue = this.currentBalance * this.kaspaUsdPrice;
            this.currentBalanceEl.title = `$${this.formatNumberWithCommas(usdValue)} USD`;
        }
    }

    updateLastUpdatedTime() {
        const now = new Date();
        this.lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString()}`;
    }

    updateUI() {
        if (this.currentWallet && this.isConnected) {
            this.walletName.textContent = this.currentWallet.label;
            this.updateBalanceDisplay();
            this.updateLastUpdatedTime();
            this.walletInfo.classList.remove('hidden');
            this.connectionStatus.className = 'status-indicator online';
        } else {
            this.walletInfo.classList.add('hidden');
        }
    }

    startAutoRefresh() {
        this.stopAutoRefresh();
        
        // Start countdown timer
        this.startCountdown();
        
        // Set up auto refresh
        this.refreshInterval = setInterval(() => {
            this.refreshBalance();
            this.startCountdown();
        }, this.refreshTime);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }

    startCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        let timeLeft = this.countdownTime;
        
        this.countdownInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            this.countdown.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            timeLeft--;
            
            if (timeLeft < 0) {
                clearInterval(this.countdownInterval);
                this.countdown.textContent = 'Refreshing...';
            }
        }, 1000);
    }

    async manualRefresh() {
        this.refreshButton.disabled = true;
        this.refreshButton.textContent = 'Refreshing...';
        
        await this.refreshBalance();
        this.startCountdown();
        
        this.refreshButton.disabled = false;
        this.refreshButton.textContent = 'Refresh Now';
    }

    async sendPushcutNotification(title, text) {
        const apiKey = this.pushcutApiKey.value.trim();
        const notificationName = this.pushcutNotificationName.value.trim();
        const customTitle = this.pushcutTitle.value.trim();
        
        if (!apiKey || !notificationName) {
            return false; // Skip if not configured
        }

        // Use custom title if provided, otherwise use default title
        const finalTitle = customTitle || title;

        try {
            const response = await fetch(`https://api.pushcut.io/v1/notifications/${notificationName}`, {
                method: 'POST',
                headers: {
                    'API-Key': apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: finalTitle,
                    text: text
                })
            });

            if (!response.ok) {
                let errorMessage = 'Pushcut notification failed';
                
                if (response.status === 401) {
                    errorMessage = 'Invalid Pushcut API key';
                } else if (response.status === 404) {
                    errorMessage = 'Pushcut notification name not found';
                } else if (response.status === 422) {
                    errorMessage = 'Invalid Pushcut request format';
                } else {
                    errorMessage = `Pushcut error: ${response.status}`;
                }
                
                console.error('Pushcut API Error:', response.status);
                this.showNotification(errorMessage, 'error');
                return false;
            }

            console.log('Pushcut notification sent successfully');
            return true;
            
        } catch (error) {
            console.error('Failed to send Pushcut notification:', error);
            this.showNotification('Pushcut connection failed - check internet connection', 'error');
            return false;
        }
    }

    async testPushcutNotification() {
        const apiKey = this.pushcutApiKey.value.trim();
        const notificationName = this.pushcutNotificationName.value.trim();
        
        if (!apiKey) {
            this.showNotification('Please enter your Pushcut API key', 'error');
            return;
        }
        
        if (!notificationName) {
            this.showNotification('Please enter a notification name', 'error');
            return;
        }

        this.testNotification.disabled = true;
        this.testNotification.textContent = 'Sending...';

        const success = await this.sendPushcutNotification(
            'Kaspa Wallet Tracker Test',
            'This is a test notification from your Kaspa Wallet Tracker!'
        );
        
        if (success) {
            this.showNotification('Test notification sent successfully!', 'success');
            this.setPushcutStatusIndicator(true, 'Pushcut connection verified');
        } else {
            this.setPushcutStatusIndicator(false, 'Pushcut connection failed');
        }
        
        this.testNotification.disabled = false;
        this.testNotification.textContent = 'Test Notification';
    }

    updatePushcutStatus() {
        const apiKey = this.pushcutApiKey.value.trim();
        const notificationName = this.pushcutNotificationName.value.trim();
        
        if (apiKey && notificationName) {
            this.pushcutStatus.classList.remove('hidden');
            this.setPushcutStatusIndicator(null, 'Pushcut notifications ready');
        } else {
            this.pushcutStatus.classList.add('hidden');
        }
    }

    setPushcutStatusIndicator(success, message) {
        if (success === true) {
            this.pushcutStatus.classList.remove('error');
            this.pushcutIndicator.style.color = 'green';
        } else if (success === false) {
            this.pushcutStatus.classList.add('error');
            this.pushcutIndicator.style.color = 'red';
        } else {
            // Neutral state - fields filled but not tested
            this.pushcutStatus.classList.remove('error');
            this.pushcutIndicator.style.color = 'orange';
        }
        
        this.pushcutStatusText.textContent = message;
    }

    resetPushcutConfig() {
        this.pushcutTitle.value = '';
        this.pushcutApiKey.value = '';
        this.pushcutNotificationName.value = '';
        this.updatePushcutStatus();
        this.showNotification('Pushcut configuration reset', 'info');
    }

    savePushcutConfig() {
        const config = {
            customTitle: this.pushcutTitle.value,
            apiKey: this.pushcutApiKey.value,
            notificationName: this.pushcutNotificationName.value
        };
        localStorage.setItem('kaspa-tracker-pushcut', JSON.stringify(config));
    }

    loadPushcutConfig() {
        const stored = localStorage.getItem('kaspa-tracker-pushcut');
        if (stored) {
            try {
                const config = JSON.parse(stored);
                this.pushcutTitle.value = config.customTitle || '';
                this.pushcutApiKey.value = config.apiKey || '';
                this.pushcutNotificationName.value = config.notificationName || '';
                this.updatePushcutStatus();
            } catch (error) {
                console.error('Error loading Pushcut config:', error);
            }
        }
    }

    saveWalletData() {
        if (this.currentWallet) {
            const data = {
                wallet: this.currentWallet,
                balance: this.currentBalance,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('kaspa-tracker-wallet', JSON.stringify(data));
        }
    }

    clearWalletData() {
        localStorage.removeItem('kaspa-tracker-wallet');
    }

    clearPushcutData() {
        localStorage.removeItem('kaspa-tracker-pushcut');
    }

    loadStoredData() {
        // Clear all stored data to ensure completely fresh start
        this.clearWalletData();
        this.clearPushcutData();
    }

    isValidKaspaAddress(address) {
        // Basic Kaspa address validation
        return /^kaspa:[a-z0-9]{61,63}$/.test(address);
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KaspaWalletTracker();
});
