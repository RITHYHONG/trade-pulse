const http = require("http");

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/cron/generate-blog",
  method: "GET",
};

console.log("------------------------------------------");
console.log("🚀 TradePulse Local Cron Runner Started");
console.log("⏰ Interval: 5 Minutes");
console.log("------------------------------------------");

function triggerAutomation() {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] 📡 Triggering blog generation...`);

  const req = http.request(options, (res) => {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk;
    });
    res.on("end", () => {
      try {
        const json = JSON.parse(data);
        if (json.success) {
          console.log(`✅ SUCCESS: Created post "${json.title}"`);
          console.log(`📝 Total posts today: ${json.postsToday}`);
        } else {
          console.log(
            `ℹ️ SKIP: ${json.message || json.reason || "No action needed"}`,
          );
        }
      } catch (e) {
        console.log(`⚠️ Response received (Status: ${res.statusCode})`);
      }
    });
  });

  req.on("error", (e) => {
    console.error(
      `❌ ERROR: Could not connect to localhost:3000. Is "yarn dev" running?`,
    );
  });

  req.end();
}

// Run immediately once
triggerAutomation();

// Then run every 5 minutes
setInterval(triggerAutomation, 5 * 60 * 1000);
