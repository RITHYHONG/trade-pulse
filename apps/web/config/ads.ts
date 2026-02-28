export interface AdBanner {
  html: string;
  width: number;
  height: number;
}

export interface AdConfig {
  leaderboard: AdBanner;
  skyscraper: AdBanner;
  rectangle: AdBanner;
  banner: AdBanner;
  native: AdBanner;
}

export const ads: AdConfig = {
  leaderboard: {
    html: `<a href="https://www.binance.com/en/register?ref=876367856" target="_blank" rel="noopener noreferrer"><img src="https://banners.cex.io/728x90.gif" alt="Trade Crypto" style="border:0; display:block;" width="728" height="90" /></a>`,
    width: 728,
    height: 90,
  },
  skyscraper: {
    html: `<a href="https://www.binance.com/en/register?ref=876367856" target="_blank" rel="noopener noreferrer"><img src="https://banners.cex.io/160x600.gif" alt="Trade Crypto" style="border:0; display:block;" width="160" height="600" /></a>`,
    width: 160,
    height: 600,
  },
  rectangle: {
    html: `<a href="https://www.binance.com/en/register?ref=876367856" target="_blank" rel="noopener noreferrer"><img src="https://banners.cex.io/300x250.gif" alt="Trade Crypto" style="border:0; display:block;" width="300" height="250" /></a>`,
    width: 300,
    height: 250,
  },
  banner: {
    html: `<a href="https://www.binance.com/en/register?ref=876367856" target="_blank" rel="noopener noreferrer"><img src="https://banners.cex.io/468x60.gif" alt="Trade Crypto" style="border:0; display:block;" width="468" height="60" /></a>`,
    width: 468,
    height: 60,
  },
  native: {
    html: `<a href="https://www.binance.com/en/register?ref=876367856" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 20px;background:#F0B90B;color:#000;text-decoration:none;font-weight:600;border-radius:4px;font-family:system-ui,-apple-system,sans-serif;">🚀 Start Trading Crypto - Get Bonus</a>`,
    width: 0,
    height: 0,
  },
};

// Additional platforms for variety - replace 876367856 with actual IDs
export const additionalAds = {
  bitget: {
    leaderboard: `<a href="https://www.bitget.com/en/register?inviteCode=876367856"><img src="https://www.bitget.com/static/images/affiliate/728x90.png" alt="Trade on Bitget" width="728" height="90" /></a>`,
    skyscraper: `<a href="https://www.bitget.com/en/register?inviteCode=876367856"><img src="https://www.bitget.com/static/images/affiliate/300x600.png" alt="Trade on Bitget" width="300" height="600" /></a>`,
    rectangle: `<a href="https://www.bitget.com/en/register?inviteCode=876367856"><img src="https://www.bitget.com/static/images/affiliate/300x250.png" alt="Trade on Bitget" width="300" height="250" /></a>`,
  },
  okx: {
    leaderboard: `<a href="https://www.okx.com/join/876367856"><img src="https://www.okx.com/cdn/assets/imgs/affiliate/728x90.png" alt="Trade on OKX" width="728" height="90" /></a>`,
    skyscraper: `<a href="https://www.okx.com/join/876367856"><img src="https://www.okx.com/cdn/assets/imgs/affiliate/300x600.png" alt="Trade on OKX" width="300" height="600" /></a>`,
    rectangle: `<a href="https://www.okx.com/join/876367856"><img src="https://www.okx.com/cdn/assets/imgs/affiliate/300x250.png" alt="Trade on OKX" width="300" height="250" /></a>`,
  },
  icmarkets: {
    leaderboard: `<a href="https://www.icmarkets.com/global/en/?camp=876367856"><img src="https://www.icmarkets.com/global/en/assets/images/affiliate/728x90.png" alt="Trade with IC Markets" width="728" height="90" /></a>`,
    skyscraper: `<a href="https://www.icmarkets.com/global/en/?camp=876367856"><img src="https://www.icmarkets.com/global/en/assets/images/affiliate/300x600.png" alt="Trade with IC Markets" width="300" height="600" /></a>`,
    rectangle: `<a href="https://www.icmarkets.com/global/en/?camp=876367856"><img src="https://www.icmarkets.com/global/en/assets/images/affiliate/300x250.png" alt="Trade with IC Markets" width="300" height="250" /></a>`,
  },
  ftmo: {
    leaderboard: `<a href="https://ftmo.com/en/?aff=876367856"><img src="https://ftmo.com/images/affiliate/728x90.png" alt="FTMO Prop Trading" width="728" height="90" /></a>`,
    skyscraper: `<a href="https://ftmo.com/en/?aff=876367856"><img src="https://ftmo.com/images/affiliate/300x600.png" alt="FTMO Prop Trading" width="300" height="600" /></a>`,
    rectangle: `<a href="https://ftmo.com/en/?aff=876367856"><img src="https://ftmo.com/images/affiliate/300x250.png" alt="FTMO Prop Trading" width="300" height="250" /></a>`,
  },
};