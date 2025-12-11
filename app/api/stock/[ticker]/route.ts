import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  try {
    const { ticker: tickerParam } = await params;
    const ticker = tickerParam.toUpperCase();

    // Use Yahoo Finance API (no key required)
    const quoteUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`;

    const response = await fetch(quoteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      );
    }

    const data = await response.json();
    const result = data.chart.result[0];

    if (!result) {
      return NextResponse.json(
        { error: 'No data available' },
        { status: 404 }
      );
    }

    const meta = result.meta;
    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose;
    const changePercent = ((currentPrice - previousClose) / previousClose) * 100;

    // Get additional info
    const infoUrl = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price,summaryDetail`;
    const infoResponse = await fetch(infoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    });

    let companyName = ticker;
    let marketCap = 0;
    let volume = 0;

    if (infoResponse.ok) {
      const infoData = await infoResponse.json();
      const quoteSummary = infoData.quoteSummary?.result?.[0];

      if (quoteSummary) {
        companyName = quoteSummary.price?.longName || quoteSummary.price?.shortName || ticker;
        marketCap = quoteSummary.price?.marketCap?.raw || 0;
        volume = quoteSummary.price?.regularMarketVolume?.raw || 0;
      }
    }

    return NextResponse.json({
      ticker,
      companyName,
      currentPrice: Number(currentPrice.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
      volume,
      marketCap,
      lastUpdated: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}
