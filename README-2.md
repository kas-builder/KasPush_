# Kaspa Wallet Tracker

A clean, offline-capable web application for monitoring Kaspa cryptocurrency wallet balances with real-time notifications.

## Features

- **Real-time Balance Monitoring**: Track Kaspa wallet balances with automatic updates every 2.5 minutes
- **Multiple Wallet Support**: 6 predefined wallets (MEXC, Uphold, Bybit, DAGKnight Fund, etc.) plus custom wallet input
- **USD Value Tooltips**: Hover over balances to see instant USD conversion using live price data
- **Custom Push Notifications**: Optional Pushcut integration with customizable notification titles
- **Enhanced Error Handling**: Visual status indicators for API connection health
- **Clean HTML Design**: Classic white background, black text styling for maximum readability
- **Fresh Start**: App resets on each load, only preserving notification settings
- **Offline Capability**: Runs entirely in the browser once loaded
- **No Dependencies**: Pure vanilla HTML, CSS, and JavaScript

## Quick Start

### Option 1: Download ZIP (Easiest)
1. **Download**: Click the green "Code" button above → "Download ZIP"
2. **Extract**: Unzip the files to your desired location
3. **Open**: Double-click `index.html` to open in your browser

### Option 2: Clone Repository
1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/kaspa-wallet-tracker.git
   cd kaspa-wallet-tracker
   ```
2. **Open**: Double-click `index.html` to open in your browser

## Usage

### Wallet Selection
- Choose from 6 predefined wallets in the dropdown
- Or select "Custom Wallet" to enter your own Kaspa address
- Click "Connect Wallet" to start monitoring

### Push Notifications (Optional)
1. Download the [Pushcut app](https://pushcut.io) on your iOS device
2. Create a notification in Pushcut and note the name
3. Get your API key from Pushcut settings
4. Enter both in the app and test the connection

### Supported Wallets
- **MEXC Wallet**: Major exchange wallet
- **Uphold Wallet**: Popular custody service
- **Bybit Wallet**: Trading platform wallet
- **DAGKnight Fund**: Community development fund
- **Burn Address**: Permanently destroyed tokens
- **Custom**: Any valid Kaspa address

## Technical Details

### APIs Used
- **Kaspa API**: `https://api.kaspa.org` - Real-time balance data
- **CoinGecko API**: `https://api.coingecko.com` - Live KAS/USD price conversion
- **Pushcut API**: `https://api.pushcut.io` - Push notifications (optional)

### Browser Compatibility
- Modern browsers with ES6+ support
- CORS enabled for API requests
- Local storage for settings persistence

### File Structure
```
kaspa-wallet-tracker/
├── index.html          # Main application interface
├── style.css           # Clean HTML styling
├── main.js             # Core application logic
├── README.md           # This documentation
├── LICENSE             # MIT license
└── replit.md           # Technical architecture notes
```

## Development

### Local Development
The application uses Python's built-in HTTP server for development:

```bash
python3 -m http.server 5000
```

### Key Functions
- `fetchWalletBalance()` - Retrieves balance from Kaspa API
- `fetchKaspaPrice()` - Gets current KAS/USD price
- `sendPushcutNotification()` - Handles push notifications
- `isValidKaspaAddress()` - Validates wallet addresses

### Configuration
All settings are stored in browser localStorage:
- Selected wallet address and label
- Pushcut API credentials
- Connection preferences

## Deployment

### Static Hosting
This application can be deployed to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Any web server serving static files

### Requirements
- No server-side processing required
- No database needed
- Pure client-side application

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- All API calls are made client-side
- No sensitive data is stored on servers
- Pushcut API keys are stored locally only
- Open source for full transparency

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Create an issue for bug reports
- Feature requests welcome
- Pull requests appreciated

## Disclaimer

This tool is for informational purposes only. Always verify balances through official sources before making financial decisions.

---

**Built with ❤️ for the Kaspa community**