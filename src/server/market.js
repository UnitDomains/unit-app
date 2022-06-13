const axios = require("axios").default;

export async function getETHPriceFromMarket() {
  try {
    console.log("a");
    const axiosConfig = {
      baseURL: "https://www.okx.com",
      timeout: 300000,
    };

    let res = await axios.get(
      "/api/v5/market/ticker?instId=BTC-USD-SWAP",
      axiosConfig
    );

    console.log(res);

    if (res && res.data) return res.data;
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
}
