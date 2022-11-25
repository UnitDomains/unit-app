const axios = require("axios").default;

export async function getETHPriceFromMarket() {
  try {
    const axiosConfig = {
      baseURL: "https://www.okx.com",
      timeout: 300000,
    };

    let res = await axios.get(
      "/api/v5/market/ticker?instId=BTC-USD-SWAP",
      axiosConfig
    );

    if (res && res.data) return res.data;
    return null;
  } catch (err) {
    return null;
  }
}
