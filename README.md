# Biotech FDA Tracker - Complete Rebuild

**Modern, real-time biotech stock tracker for FDA PDUFA dates**

Built for StockTrak Competition: Dec 8, 2025 - Jan 30, 2026

---

## 🎯 What's New (Complete Rebuild)

This is a **completely rebuilt** version with:

✅ **Real-time stock data** from Yahoo Finance (no fake/cached data)
✅ **Modern, beautiful UI** with dark mode
✅ **Responsive design** - works on desktop, tablet, and mobile
✅ **Smart watchlist** with automatic $10 filtering
✅ **Stock scanner** - add any ticker instantly
✅ **PDUFA calendar** with upcoming FDA dates
✅ **Position calculator** - perfect position sizing
✅ **Local storage** - your watchlist persists
✅ **TypeScript** - fully type-safe code

---

## 🚀 Features

### 1. **Watchlist**
- Real-time stock prices from Yahoo Finance
- Shows: price, % change, volume, PDUFA date, days until PDUFA
- Color-coded status: Green = Safe (>$10), Red = Disqualification Risk (<$10)
- Sort by: PDUFA date, price, % change, or ticker
- One-click refresh
- Add/remove stocks easily

### 2. **Stock Scanner**
- Search any ticker symbol
- Get instant data: price, market cap, volume, % change
- Eligibility check (>$10 requirement)
- Quick position sizing preview
- Add to watchlist with one click

### 3. **PDUFA Calendar**
- All upcoming FDA PDUFA dates (Dec 2025 - Jan 2026)
- Shows: company, drug name, indication, approval type
- Filter: Upcoming, Past, or All
- Countdown to each PDUFA date
- One-click add to watchlist

### 4. **Position Calculator**
- Calculate exact shares for $10K max position
- Accounts for $10 trading fee
- Shows total cost and leftover cash
- Warns if stock is below $10 minimum

### 5. **Dark Mode**
- Toggle dark/light mode
- Preference saved automatically
- Easy on the eyes for late-night trading

---

## 📦 Installation (Step-by-Step for Non-Coders)

### Prerequisites

You need Node.js installed on your computer.

**Check if you have Node.js:**
```bash
node --version
```

If you see a version number (like v18.x.x or higher), you're good! Skip to [Setup](#setup).

If not, install Node.js:

**Mac:**
```bash
brew install node
```

**Windows:**
1. Go to https://nodejs.org/
2. Download the LTS version
3. Run the installer
4. Click "Next" through everything

---

### Setup

**1. Navigate to the project folder:**

```bash
cd /Users/rishishah/Desktop/BPA_project/biotech-tracker
```

**2. Install dependencies:**

```bash
npm install
```

This will take 1-2 minutes. It's downloading all the packages needed.

**3. Run the development server:**

```bash
npm run dev
```

**4. Open your browser:**

Go to: **http://localhost:3000**

That's it! The app is now running.

---

## 🎮 How to Use

### First Time Setup

1. Open http://localhost:3000
2. You'll see a watchlist with your default stocks (AGIO, CYTK, CORT, DNLI, TVTX)
3. Click "Refresh" to load current prices

### Adding Stocks

**Method 1: Stock Scanner**
1. Scroll to "Stock Scanner" section
2. Type ticker symbol (e.g., ARVN)
3. Click "Scan"
4. Review the data
5. Click "+ Add to Watchlist"
6. Refresh the watchlist to see it

**Method 2: PDUFA Calendar**
1. Scroll to "PDUFA Calendar"
2. Browse upcoming PDUFA dates
3. Click "+ Watchlist" on any stock
4. Refresh the watchlist

### Removing Stocks

1. In the watchlist table, find the stock
2. Click "Remove" in the Action column
3. The stock is immediately removed

### Calculating Position Size

1. Scroll to "Position Calculator"
2. Enter the stock price
3. Click "Calculate"
4. See exactly how many shares to buy

### Using Dark Mode

- Click the sun/moon icon in the top right
- Your preference is saved automatically

---

## 📊 Stock Data Included

### Initial Watchlist:
- **AGIO** - Agios Pharmaceuticals (Vorasidenib for brain cancer)
- **CYTK** - Cytokinetics (Aficamten for HCM)
- **CORT** - Corcept Therapeutics (Relacorilant for Cushing's)
- **DNLI** - Denali Therapeutics (DNL747 for Alzheimer's)
- **TVTX** - Travere Therapeutics (Sparsentan for kidney disease)

### Additional PDUFA Dates in Calendar:
- **ARVN** - Arvinas (ARV-471 for breast cancer) - Dec 28, 2025
- **MDGL** - Madrigal (Resmetirom for NASH) - Jan 15, 2026
- **IMVT** - Immunovant (IMVT-1402 for autoimmune) - Jan 22, 2026
- **KROS** - Keros (KER-050 for pulmonary hypertension) - Jan 18, 2026
- **RCKT** - Rocket Pharmaceuticals (RP-L201 gene therapy) - Jan 12, 2026

---

## ⚙️ Technical Details

### Built With:
- **Next.js 14** - React framework
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Modern styling
- **Yahoo Finance API** - Real-time stock data (free, no API key needed)

### Project Structure:
```
biotech-tracker/
├── app/
│   ├── page.tsx                    # Main dashboard
│   └── api/
│       ├── stock/[ticker]/route.ts # Single stock API
│       └── stocks/batch/route.ts   # Batch stock API
├── components/
│   ├── Watchlist.tsx               # Watchlist table
│   ├── StockScanner.tsx            # Stock search tool
│   ├── PDUFACalendar.tsx           # PDUFA date calendar
│   └── PositionCalculator.tsx      # Position sizing
├── data/
│   └── pdufa-calendar.json         # PDUFA dates database
├── types/
│   └── index.ts                    # TypeScript types
└── README.md                       # This file
```

### Data Storage:
- **Watchlist**: Stored in browser localStorage
- **PDUFA Dates**: Static JSON file (you can edit it)
- **Stock Prices**: Fetched in real-time from Yahoo Finance

---

## 🔧 Customization

### Adding More PDUFA Dates

1. Open `data/pdufa-calendar.json`
2. Add a new entry:

```json
{
  "ticker": "EXAMPLE",
  "companyName": "Example Biotech",
  "drugName": "Example Drug",
  "indication": "Example Disease",
  "pdufa_date": "2026-01-31",
  "approvalType": "NDA",
  "notes": "Any additional notes"
}
```

3. Save the file
4. Refresh the app

### Changing Competition Rules

Edit these values in `components/PositionCalculator.tsx`:

```typescript
const MAX_POSITION = 10000;  // Max $ per position
const TRADING_FEE = 10;       // Trading fee
const MIN_PRICE = 10;         // Min stock price
```

---

## 🚨 Important Reminders

### Competition Rules:
- **Starting Capital**: $100,000
- **Max Position**: $10,000 per stock (10% rule)
- **Trading Fee**: $10 per trade
- **CRITICAL**: Stocks MUST be ≥$10/share or you're **DISQUALIFIED**

### Stock Price Warnings:
- ✅ **Green "Safe"** badge = Stock is ≥$10 (safe to trade)
- ❌ **Red "DQ Risk"** badge = Stock is <$10 (**DO NOT TRADE**)

### Data Accuracy:
- Prices update when you click "Refresh"
- Data is real-time from Yahoo Finance
- PDUFA dates can change - verify with FDA.gov
- Run the app daily to stay current

---

## 📱 Mobile/Responsive

The app works great on:
- Desktop computers (best experience)
- Tablets
- Phones

Just open http://localhost:3000 on any device on the same network.

---

## 🐛 Troubleshooting

### "npm: command not found"
- Install Node.js first (see Prerequisites above)

### Port 3000 already in use
```bash
# Kill the process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

### Stock prices not loading
- Check your internet connection
- Yahoo Finance might be rate-limiting - wait a few minutes
- Try refreshing the page

### Watchlist disappeared
- Watchlist is stored in browser localStorage
- If you clear browser data, it resets
- Just re-add stocks from the PDUFA calendar

### Dark mode not working
- Make sure you're clicking the sun/moon icon
- Try refreshing the page
- Check browser console for errors (F12)

---

## 📈 Trading Strategy Tips

### Entry Timing:
- **14 days before PDUFA**: Early entry, catch momentum
- **7 days before**: Late entry, confirmation of hype
- **1-2 days before**: Very risky, often peak price

### Exit Timing:
- **1-2 days before PDUFA**: Recommended (avoid binary risk)
- **Day of PDUFA**: Very risky
- **After approval**: Partial profits, let rest run

### Position Sizing:
- **High confidence**: Max $10K
- **Medium confidence**: $5-7K
- **Speculative**: $2-3K

### Risk Management:
- Set stop-losses at -15% to -20%
- Never risk more than 10% on one trade
- Take profits at +20%, +50%, +100%
- Diversify across 5-10 positions

---

## 🚀 Deployment (Optional)

### Deploy to Vercel (Free):

1. Create account at https://vercel.com
2. Click "Add New Project"
3. Import from GitHub: https://github.com/rshah85/biotechthing
4. Click "Deploy"
5. Done! Get a live URL like: `biotech-tracker.vercel.app`

### Environment Variables:
None needed! Everything works out of the box.

---

## 📝 Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## 🔄 Keeping Data Fresh

### Daily Routine:
1. Open the app
2. Click "Refresh" on watchlist
3. Check PDUFA calendar for new dates
4. Verify stock prices before trading
5. Add/remove stocks as needed

### Weekly Routine:
1. Check for PDUFA date changes on FDA.gov
2. Update `data/pdufa-calendar.json` if needed
3. Review your positions
4. Scan for new biotech stocks

---

## 🎯 Competition Timeline

- **Start**: December 8, 2025
- **End**: January 30, 2026
- **Duration**: 53 days
- **Focus**: PDUFA dates Dec 2025 - Jan 2026

---

## 💡 Pro Tips

1. **Research First**: Check FDA advisory committee votes before trading
2. **Verify Dates**: PDUFA dates can be delayed - check FDA.gov weekly
3. **Diversify**: Don't put all $100K in one stock
4. **Use Stop-Losses**: Protect your capital
5. **Exit Before PDUFA**: Avoid binary event risk
6. **Track Everything**: Use the watchlist to monitor all positions

---

## 📞 Support

If something breaks or you need help:
1. Check Troubleshooting section above
2. Make sure you followed installation steps exactly
3. Try deleting `node_modules` and running `npm install` again

---

## 🏆 Good Luck!

You now have a professional-grade biotech tracker with:
- Real-time data
- Beautiful, modern UI
- All the tools you need to win

**Focus on the PDUFA plays, manage your risk, and win that competition!**

---

## 📜 License

MIT License - Do whatever you want with this code.

---

Built with ❤️ for the StockTrak Competition
