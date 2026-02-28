import { isMarketVolatile } from "./src/lib/services/volatility-service";

async function testVolatility() {
  console.log("Checking market volatility...");
  const result = await isMarketVolatile();
  console.log("Result:", result);
}

testVolatility().catch(console.error);
