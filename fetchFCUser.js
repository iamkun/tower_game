const fetchFCUser = async (address) => {
  console.log(address);
  try {
    const url = `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${
      address.length > 1 ? address.join("%2") : address[0]
    }`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        api_key: process.env.NEYNAR_API_KEY,
      },
    };

    const res = await fetch(url, options);

    const data = await res.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};
