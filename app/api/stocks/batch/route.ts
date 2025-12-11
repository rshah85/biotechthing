import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { tickers } = await request.json();

    if (!Array.isArray(tickers) || tickers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid tickers array' },
        { status: 400 }
      );
    }

    const tickersString = tickers.map(t => t.toUpperCase()).join(',');

    // Yahoo Finance batch quote endpoint
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${tickersString}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch stock data' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const quotes = data.quoteResponse.result;

    const stocks = quotes.map((quote: any) => ({
      ticker: quote.symbol,
      companyName: quote.longName || quote.shortName || quote.symbol,
      currentPrice: Number((quote.regularMarketPrice || 0).toFixed(2)),
      changePercent: Number((quote.regularMarketChangePercent || 0).toFixed(2)),
      volume: quote.regularMarketVolume || 0,
      marketCap: quote.marketCap || 0,
      lastUpdated: new Date().toISOString()
    }));

    return NextResponse.json({ stocks });

  } catch (error) {
    console.error('Error fetching batch stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}
