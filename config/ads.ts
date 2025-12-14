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
    html: `<a href="https://www.binance.com/en/register?ref=YOUR_AFFILIATE_ID"><img src="https://public.bnbstatic.com/static/images/affiliate/banners/728x90_en.png" alt="Trade on Binance" width="728" height="90" /></a>`,
    width: 728,
    height: 90,
  },
  skyscraper: {
    html: `<a href="https://www.binance.com/en/register?ref=YOUR_AFFILIATE_ID"><img src="https://public.bnbstatic.com/static/images/affiliate/banners/300x600_en.png" alt="Trade on Binance" width="300" height="600" /></a>`,
    width: 300,
    height: 600,
  },
  rectangle: {
    html: `<a href="https://www.binance.com/en/register?ref=YOUR_AFFILIATE_ID"><img src="https://public.bnbstatic.com/static/images/affiliate/banners/300x250_en.png" alt="Trade on Binance" width="300" height="250" /></a>`,
    width: 300,
    height: 250,
  },
  banner: {
    html: `<a href="https://www.binance.com/en/register?ref=YOUR_AFFILIATE_ID"><img src="https://public.bnbstatic.com/static/images/affiliate/banners/728x90_en.png" alt="Trade on Binance" width="728" height="90" /></a>`,
    width: 728,
    height: 90,
  },
  native: {
    html: `<a href="https://www.binance.com/en/register?ref=YOUR_AFFILIATE_ID">Trade Crypto on Binance - Earn Rewards</a>`,
    width: 0, // Flexible
    height: 0,
  },
};

// Additional platforms for variety - replace YOUR_AFFILIATE_ID with actual IDs
export const additionalAds = {
  bitget: {
    leaderboard: `<a href="https://www.bitget.com/en/register?inviteCode=YOUR_AFFILIATE_ID"><img src="https://www.bitget.com/static/images/affiliate/728x90.png" alt="Trade on Bitget" width="728" height="90" /></a>`,
    skyscraper: `<a href="https://www.bitget.com/en/register?inviteCode=YOUR_AFFILIATE_ID"><img src="https://www.bitget.com/static/images/affiliate/300x600.png" alt="Trade on Bitget" width="300" height="600" /></a>`,
    rectangle: `<a href="https://www.bitget.com/en/register?inviteCode=YOUR_AFFILIATE_ID"><img src="https://www.bitget.com/static/images/affiliate/300x250.png" alt="Trade on Bitget" width="300" height="250" /></a>`,
  },
  okx: {
    leaderboard: `<a href="https://www.okx.com/join/YOUR_AFFILIATE_ID"><img src="https://www.okx.com/cdn/assets/imgs/affiliate/728x90.png" alt="Trade on OKX" width="728" height="90" /></a>`,
    skyscraper: `<a href="https://www.okx.com/join/YOUR_AFFILIATE_ID"><img src="https://www.okx.com/cdn/assets/imgs/affiliate/300x600.png" alt="Trade on OKX" width="300" height="600" /></a>`,
    rectangle: `<a href="https://www.okx.com/join/YOUR_AFFILIATE_ID"><img src="https://www.okx.com/cdn/assets/imgs/affiliate/300x250.png" alt="Trade on OKX" width="300" height="250" /></a>`,
  },
  icmarkets: {
    leaderboard: `<a href="https://www.icmarkets.com/global/en/?camp=YOUR_AFFILIATE_ID"><img src="https://www.icmarkets.com/global/en/assets/images/affiliate/728x90.png" alt="Trade with IC Markets" width="728" height="90" /></a>`,
    skyscraper: `<a href="https://www.icmarkets.com/global/en/?camp=YOUR_AFFILIATE_ID"><img src="https://www.icmarkets.com/global/en/assets/images/affiliate/300x600.png" alt="Trade with IC Markets" width="300" height="600" /></a>`,
    rectangle: `<a href="https://www.icmarkets.com/global/en/?camp=YOUR_AFFILIATE_ID"><img src="https://www.icmarkets.com/global/en/assets/images/affiliate/300x250.png" alt="Trade with IC Markets" width="300" height="250" /></a>`,
  },
  ftmo: {
    leaderboard: `<a href="https://ftmo.com/en/?aff=YOUR_AFFILIATE_ID"><img src="https://ftmo.com/images/affiliate/728x90.png" alt="FTMO Prop Trading" width="728" height="90" /></a>`,
    skyscraper: `<a href="https://ftmo.com/en/?aff=YOUR_AFFILIATE_ID"><img src="https://ftmo.com/images/affiliate/300x600.png" alt="FTMO Prop Trading" width="300" height="600" /></a>`,
    rectangle: `<a href="https://ftmo.com/en/?aff=YOUR_AFFILIATE_ID"><img src="https://ftmo.com/images/affiliate/300x250.png" alt="FTMO Prop Trading" width="300" height="250" /></a>`,
  },
};