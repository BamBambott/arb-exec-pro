import { useState, useEffect, useCallback, useRef } from “react”;

// ─── Chain & Token Config ─────────────────────────────────────────────────────
const CHAINS = {
ethereum: { id:1,     name:“Ethereum”, short:“ETH”,  color:”#627EEA”, native:“ETH”,  cgId:“ethereum”       },
arbitrum: { id:42161, name:“Arbitrum”, short:“ARB”,  color:”#28A0F0”, native:“ETH”,  cgId:“ethereum”       },
optimism: { id:10,    name:“Optimism”, short:“OP”,   color:”#FF0420”, native:“ETH”,  cgId:“ethereum”       },
base:     { id:8453,  name:“Base”,     short:“BASE”, color:”#0052FF”, native:“ETH”,  cgId:“ethereum”       },
polygon:  { id:137,   name:“Polygon”,  short:“POLY”, color:”#8247E5”, native:“MATIC”,cgId:“matic-network”  },
solana:   { id:null,  name:“Solana”,   short:“SOL”,  color:”#9945FF”, native:“SOL”,  cgId:“solana”         },
};

const TOKENS = {
ethereum: [
{ s:“WETH”,  a:“0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2”, d:18 },
{ s:“WBTC”,  a:“0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599”, d:8  },
{ s:“PEPE”,  a:“0x6982508145454Ce325dDbE47a25d4ec3d2311933”, d:18 },
{ s:“LINK”,  a:“0x514910771AF9Ca656af840dff83E8264EcF986CA”, d:18 },
{ s:“UNI”,   a:“0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984”, d:18 },
{ s:“SHIB”,  a:“0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE”, d:18 },
{ s:“AAVE”,  a:“0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9”, d:18 },
{ s:“LDO”,   a:“0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32”, d:18 },
{ s:“CRV”,   a:“0xD533a949740bb3306d119CC777fa900bA034cd52”, d:18 },
{ s:“INJ”,   a:“0xe28b3B32B6c345A34Ff64674606124Dd5Aceca30”, d:18 },
{ s:“FLOKI”, a:“0xcf0C122c6b73ff809C693DB761e7BaeBe62b6a2E”, d:9  },
],
arbitrum: [
{ s:“ARB”,    a:“0x912CE59144191C1204E64559FE8253a0e49E6548”, d:18 },
{ s:“GMX”,    a:“0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a”, d:18 },
{ s:“MAGIC”,  a:“0x539bdE0d7Dbd336b79148AA742883198BBF60342”, d:18 },
{ s:“RDNT”,   a:“0x3082CC23568eA640225c2467653dB90e9250AaA0”, d:18 },
{ s:“PENDLE”, a:“0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8”, d:18 },
],
optimism: [
{ s:“OP”,   a:“0x4200000000000000000000000000000000000042”, d:18 },
{ s:“VELO”, a:“0x9560e827aF36c94D2Ac33a39bCE1Fe78631088Db”, d:18 },
{ s:“SNX”,  a:“0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4”, d:18 },
],
base: [
{ s:“BRETT”,  a:“0x532f27101965dd16442E59d40670FaF5eBB142E4”, d:18 },
{ s:“DEGEN”,  a:“0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed”, d:18 },
{ s:“TOSHI”,  a:“0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4”, d:18 },
{ s:“AERO”,   a:“0x940181a94A35A4569E4529A3CDfB74e38FD98631”, d:18 },
{ s:“HIGHER”, a:“0x0578d8A44db98B23BF096A382e016e29a5Ce0ffe”, d:18 },
],
polygon: [
{ s:“WMATIC”, a:“0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270”, d:18 },
{ s:“QUICK”,  a:“0xB5C064F955D8e7F38fE0460C556a72987494eE17”, d:18 },
{ s:“GHST”,   a:“0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7”, d:18 },
],
solana: [
{ s:“SOL”,  a:“So11111111111111111111111111111111111111112”,        d:9 },
{ s:“BONK”, a:“DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263”,   d:5 },
{ s:“WIF”,  a:“EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm”,   d:6 },
{ s:“JUP”,  a:“JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN”,     d:6 },
{ s:“PYTH”, a:“HZ1JovNiVvGrk6eWJJ29YDWXWheLqEroBNnjCF3ViNNj”,    d:6 },
],
};

const ALL_TOKENS = Object.entries(TOKENS).flatMap(([chain, arr]) => arr.map(t => ({ …t, chain })));

const USDC = {
ethereum: { a:“0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48”, d:6 },
arbitrum: { a:“0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8”, d:6 },
optimism: { a:“0x7F5c764cBc14f9669B88837ca1490cCa17c31607”, d:6 },
base:     { a:“0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913”, d:6 },
polygon:  { a:“0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174”, d:6 },
};

const SOL_USDC   = “EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v”;
const PS_PROXY   = “0x216B4B4Ba9F3e719726886d34a177484278Bfcae”;
const GAS_UNITS  = 180000;
const EXPLORERS  = {
ethereum:“https://etherscan.io/tx/”, arbitrum:“https://arbiscan.io/tx/”,
optimism:“https://optimistic.etherscan.io/tx/”, base:“https://basescan.org/tx/”,
polygon:“https://polygonscan.com/tx/”, solana:“https://solscan.io/tx/”,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fp = (n, d = 4) => !n || isNaN(n) ? “—” : n < 0.0001 ? Number(n).toExponential(2) : Number(n).toFixed(d);

const playSound = (enabled) => {
if (!enabled) return;
try {
const ctx = new (window.AudioContext || window.webkitAudioContext)();
[523, 659, 784, 1047].forEach((f, i) => {
const o = ctx.createOscillator(), g = ctx.createGain();
o.connect(g); g.connect(ctx.destination);
o.frequency.value = f; o.type = “sine”;
const t = ctx.currentTime + i * 0.1;
g.gain.setValueAtTime(0.1, t);
g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
o.start(t); o.stop(t + 0.2);
});
} catch {}
};

const sendNotif = (title, body, enabled) => {
if (!enabled || Notification?.permission !== “granted”) return;
try { new Notification(title, { body }); } catch {}
};

const toCSV = (rows) => {
const h = [“Time”,“Token”,“Chain”,“Spread%”,“BuyDEX”,“SellDEX”,“TradeUSD”,“EstProfit”,“GasUSD”,“NetProfit”,“Status”,“TxHash”];
return [h, …rows.map(r => [r.time,r.symbol,r.chain,r.spread,r.buy,r.sell,r.tradeUSD,r.estProfit,r.gasUSD,r.netProfit,r.status,r.txHash||””])].map(r => r.join(”,”)).join(”\n”);
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ArbExecPro() {
const [chainFilter, setChainFilter]   = useState(“all”);
const [data,        setData]          = useState({});
const [loading,     setLoading]       = useState({});
const [evmWallet,   setEvmWallet]     = useState(null);
const [solWallet,   setSolWallet]     = useState(null);
const [prices,      setPrices]        = useState({ eth:3000, matic:0.8, sol:150 });
const [gasUSD,      setGasUSD]        = useState(null);
const [selectedOpp, setSelectedOpp]   = useState(null);
const [execState,   setExecState]     = useState(null);
const [execLog,     setExecLog]       = useState([]);
const [history,     setHistory]       = useState([]);
const [alerts,      setAlerts]        = useState([]);
const [countdown,   setCountdown]     = useState(30);
const [tab,         setTab]           = useState(“exec”);
const [cfg, setCfg] = useState({
minSpread:0.5, minNetProfit:0.5, tradeUSD:50,
slippage:1, minLiqUSD:20000, sound:true, notifs:false, autoExec:false,
});

const seenOpps   = useRef(new Set());
const cfgRef     = useRef(cfg);
cfgRef.current   = cfg;

// ── Prices & Gas ──────────────────────────────────────────────────────────
useEffect(() => {
const load = async () => {
try {
const r = await fetch(“https://api.coingecko.com/api/v3/simple/price?ids=ethereum,matic-network,solana&vs_currencies=usd”);
const j = await r.json();
setPrices({ eth: j.ethereum?.usd||3000, matic: j[“matic-network”]?.usd||0.8, sol: j.solana?.usd||150 });
} catch {}
};
load();
const t = setInterval(load, 60000);
return () => clearInterval(t);
}, []);

const refreshGas = useCallback(async () => {
if (!window.ethereum || !evmWallet) return;
try {
const hex   = await window.ethereum.request({ method:“eth_gasPrice” });
const gwei  = parseInt(hex,16)/1e9;
const chain = Object.values(CHAINS).find(c => c.id === evmWallet.chainId);
const price = chain?.native === “MATIC” ? prices.matic : prices.eth;
setGasUSD((gwei * GAS_UNITS / 1e9) * price);
} catch {}
}, [evmWallet, prices]);

useEffect(() => { refreshGas(); }, [refreshGas]);

// ── Log helper ────────────────────────────────────────────────────────────
const addLog = useCallback((msg, type=“info”) => {
setExecLog(p => [{ time: new Date().toLocaleTimeString(), msg, type }, …p].slice(0,80));
}, []);

// ── Fetch token ───────────────────────────────────────────────────────────
const fetchToken = useCallback(async (token) => {
const key = `${token.s}_${token.chain}`;
setLoading(p => ({ …p, [key]:true }));
try {
const res   = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${token.a}`);
const json  = await res.json();
const pairs = (json.pairs||[])
.filter(p => p.priceUsd && parseFloat(p.priceUsd)>0 && (p.liquidity?.usd||0)>=cfgRef.current.minLiqUSD)
.sort((a,b) => (b.liquidity?.usd||0)-(a.liquidity?.usd||0))
.slice(0,8);

```
  if (pairs.length >= 2) {
    const prices2  = pairs.map(p => parseFloat(p.priceUsd));
    const maxP     = Math.max(...prices2);
    const minP     = Math.min(...prices2);
    const spread   = ((maxP-minP)/minP)*100;
    const buyPair  = pairs.find(p => parseFloat(p.priceUsd)===minP);
    const sellPair = pairs.find(p => parseFloat(p.priceUsd)===maxP);
    const ageHours = buyPair?.pairCreatedAt ? (Date.now()-buyPair.pairCreatedAt)/3.6e6 : 9999;
    const risky    = ageHours < 24 || spread > 10;

    setData(p => ({ ...p, [key]:{ pairs, spread, buyPair, sellPair, minP, maxP, token, ageHours, risky } }));

    if (spread >= cfgRef.current.minSpread) {
      const estProfit  = (spread/100)*cfgRef.current.tradeUSD;
      const gas        = setGasUSD.current || 0;
      const netProfit  = estProfit - (gas||0);
      const oppId      = `${token.s}_${token.chain}_${spread.toFixed(1)}`;

      if (!seenOpps.current.has(oppId)) {
        seenOpps.current.add(oppId);
        setTimeout(() => seenOpps.current.delete(oppId), 120000);
        playSound(cfgRef.current.sound);
        sendNotif(`⚡ ${token.s} ${spread.toFixed(2)}% SPREAD`, `Buy ${buyPair.dexId} → Sell ${sellPair.dexId} | Est. net +$${netProfit.toFixed(2)}`, cfgRef.current.notifs);

        setAlerts(p => [{
          id:Date.now(), time:new Date().toLocaleTimeString(),
          symbol:token.s, chain:token.chain, spread:spread.toFixed(2),
          buy:buyPair.dexId, sell:sellPair.dexId,
          estProfit:estProfit.toFixed(2), netProfit:netProfit.toFixed(2), token, risky,
        }, ...p].slice(0,40));

        if (cfgRef.current.autoExec && netProfit >= cfgRef.current.minNetProfit && !risky) {
          setSelectedOpp({ pairs, spread, buyPair, sellPair, minP, maxP, token, ageHours, risky });
          setTab("exec"); setExecState(null);
        }
      }
    }
  }
} catch {
  setData(p => ({ ...p, [key]:{ error:true, token } }));
}
setLoading(p => ({ ...p, [key]:false }));
```

}, [addLog]);

const fetchAll = useCallback(() => {
ALL_TOKENS.forEach(t => fetchToken(t));
setCountdown(30);
}, [fetchToken]);

useEffect(() => { fetchAll(); }, []);
useEffect(() => {
const t = setInterval(() => setCountdown(c => { if(c<=1){fetchAll();return 30;} return c-1; }), 1000);
return () => clearInterval(t);
}, [fetchAll]);

// ── Wallets ───────────────────────────────────────────────────────────────
const connectEVM = async () => {
if (!window.ethereum) return alert(“MetaMask not found. Install it first.”);
try {
const [addr]   = await window.ethereum.request({ method:“eth_requestAccounts” });
const chainHex = await window.ethereum.request({ method:“eth_chainId” });
const balHex   = await window.ethereum.request({ method:“eth_getBalance”, params:[addr,“latest”] });
setEvmWallet({ address:addr, chainId:parseInt(chainHex,16), balance:(parseInt(balHex,16)/1e18).toFixed(4) });
addLog(`EVM connected: ${addr.slice(0,10)}…`, “success”);
window.ethereum.on(“chainChanged”, h => setEvmWallet(w => w?({…w,chainId:parseInt(h,16)}):w));
window.ethereum.on(“accountsChanged”, ([a]) => setEvmWallet(w => w?({…w,address:a}):w));
} catch(e) { addLog(“EVM connect: “+e.message, “error”); }
};

const connectSolana = async () => {
const p = window.solana || window.phantom?.solana;
if (!p) return alert(“Phantom not found. Install from phantom.app”);
try {
const r = await p.connect();
setSolWallet({ address:r.publicKey.toString() });
addLog(`Phantom: ${r.publicKey.toString().slice(0,10)}…`, “success”);
} catch(e) { addLog(“Phantom: “+e.message, “error”); }
};

// ── EVM helpers ───────────────────────────────────────────────────────────
const switchChain = async (targetId) => {
if (evmWallet?.chainId===targetId) return true;
try {
await window.ethereum.request({ method:“wallet_switchEthereumChain”, params:[{chainId:“0x”+targetId.toString(16)}] });
setEvmWallet(w => ({…w, chainId:targetId}));
return true;
} catch(e) { addLog(“Chain switch failed: “+e.message, “error”); return false; }
};

const checkAndApprove = async (tokenAddr, amountWei) => {
try {
const callData = `0xdd62ed3e${evmWallet.address.slice(2).padStart(64,"0")}${PS_PROXY.slice(2).padStart(64,"0")}`;
const result   = await window.ethereum.request({ method:“eth_call”, params:[{to:tokenAddr, data:callData},“latest”] });
if (BigInt(result) >= BigInt(amountWei)) { addLog(“USDC allowance OK ✓”, “success”); return true; }
addLog(“Approving USDC for Paraswap…”, “warn”);
const approveData = `0x095ea7b3${PS_PROXY.slice(2).padStart(64,"0")}${"f".repeat(64)}`;
const tx = await window.ethereum.request({ method:“eth_sendTransaction”, params:[{from:evmWallet.address, to:tokenAddr, data:approveData}] });
addLog(`Approval tx: ${tx.slice(0,18)}…`, “success”);
await new Promise(r => setTimeout(r,4000));
return true;
} catch(e) { addLog(“Approval failed: “+e.message, “error”); return false; }
};

// ── EVM Execute ───────────────────────────────────────────────────────────
const executeEVM = async (opp) => {
if (!evmWallet) return alert(“Connect MetaMask first.”);
const chain = opp.token.chain;
const cInfo = CHAINS[chain];
if (!cInfo?.id) return addLog(“No chain ID for “+chain, “error”);
if (!(await switchChain(cInfo.id))) return;

```
const usdc = USDC[chain];
if (!usdc) return addLog("No USDC config for "+chain, "error");
const amountIn = Math.floor(cfg.tradeUSD * 10**usdc.d);

setExecState("approving");
addLog(`── EVM ARB: ${opp.token.s} on ${cInfo.name} ──`, "start");
addLog(`Buy:  ${opp.buyPair.dexId} @ $${fp(opp.minP,6)}`, "info");
addLog(`Sell: ${opp.sellPair.dexId} @ $${fp(opp.maxP,6)}`, "info");
addLog(`Size: $${cfg.tradeUSD} USDC | Slippage: ${cfg.slippage}%`, "info");
addLog(`Est. gas cost: ${gasUSD?`$${gasUSD.toFixed(2)}`:"unknown"}`, "info");

if (!(await checkAndApprove(usdc.a, amountIn))) { setExecState("error"); return; }

setExecState("quoting");
addLog("Fetching Paraswap route…", "info");
try {
  const priceRes  = await fetch(`https://apiv5.paraswap.io/prices?srcToken=${usdc.a}&destToken=${opp.token.a}&amount=${amountIn}&network=${cInfo.id}&srcDecimals=${usdc.d}&destDecimals=${opp.token.d}&userAddress=${evmWallet.address}`);
  const priceData = await priceRes.json();
  if (!priceData.priceRoute) { addLog("No route: "+(priceData.error||"unknown"), "error"); setExecState("error"); return; }

  const destAmt = priceData.priceRoute.destAmount;
  addLog(`Route OK → ${(parseInt(destAmt)/10**opp.token.d).toFixed(6)} ${opp.token.s}`, "success");
  setExecState("building");

  const buildRes = await fetch(`https://apiv5.paraswap.io/transactions/${cInfo.id}?ignoreChecks=true`, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      srcToken:usdc.a, destToken:opp.token.a,
      srcAmount:String(amountIn),
      destAmount:String(Math.floor(parseInt(destAmt)*(1-cfg.slippage/100))),
      priceRoute:priceData.priceRoute, userAddress:evmWallet.address,
      slippage:cfg.slippage*100, srcDecimals:usdc.d, destDecimals:opp.token.d,
    }),
  });
  const txData = await buildRes.json();
  if (!txData.to) { addLog("Build error: "+(txData.error||"unknown"), "error"); setExecState("error"); return; }

  setExecState("buying");
  addLog("Sending to MetaMask — confirm to proceed…", "warn");
  const txHash = await window.ethereum.request({
    method:"eth_sendTransaction",
    params:[{ from:evmWallet.address, to:txData.to, data:txData.data, value:txData.value||"0x0", ...(txData.gas?{gas:"0x"+parseInt(txData.gas).toString(16)}:{}) }],
  });
  addLog(`✓ BUY tx sent: ${txHash.slice(0,20)}… ↗`, "success");
  addLog(`⚠ SELL MANUALLY on ${opp.sellPair.dexId} to close the arb`, "warn");

  const estProfit  = (opp.spread/100)*cfg.tradeUSD;
  const gas        = gasUSD||0;
  const netProfit  = estProfit-gas;
  setHistory(p => [{
    id:Date.now(), time:new Date().toLocaleTimeString(),
    symbol:opp.token.s, chain, spread:opp.spread.toFixed(2),
    buy:opp.buyPair.dexId, sell:opp.sellPair.dexId,
    tradeUSD:cfg.tradeUSD, estProfit:estProfit.toFixed(2),
    gasUSD:gas.toFixed(2), netProfit:netProfit.toFixed(2),
    status:"BUY_SENT", txHash,
  }, ...p]);
  setExecState("done");
  refreshGas();
} catch(e) {
  if (e.code===4001) addLog("Rejected by user", "error");
  else addLog("Error: "+e.message, "error");
  setExecState("error");
}
```

};

// ── Solana Execute ────────────────────────────────────────────────────────
const executeSolana = async (opp) => {
const phantom = window.solana || window.phantom?.solana;
if (!phantom || !solWallet) return alert(“Connect Phantom first.”);
if (!phantom.isConnected) { try { await phantom.connect(); } catch(e) { return addLog(“Phantom reconnect failed”, “error”); } }

```
setExecState("quoting");
addLog(`── SOL ARB: ${opp.token.s} via Jupiter ──`, "start");
addLog(`Buy:  ${opp.buyPair.dexId} @ $${fp(opp.minP,6)}`, "info");
addLog(`Sell: ${opp.sellPair.dexId} @ $${fp(opp.maxP,6)}`, "info");
addLog(`Size: $${cfg.tradeUSD} USDC | Slippage: ${cfg.slippage}%`, "info");
const amtLamports = Math.floor(cfg.tradeUSD * 1e6);

try {
  addLog("Fetching Jupiter quote…", "info");
  const qRes  = await fetch(`https://quote-api.jup.ag/v6/quote?inputMint=${SOL_USDC}&outputMint=${opp.token.a}&amount=${amtLamports}&slippageBps=${Math.round(cfg.slippage*100)}`);
  const quote = await qRes.json();
  if (!quote.outAmount) { addLog("Jupiter quote failed: "+(quote.error||JSON.stringify(quote).slice(0,60)), "error"); setExecState("error"); return; }
  addLog(`Quote: ${(parseInt(quote.outAmount)/10**opp.token.d).toFixed(6)} ${opp.token.s}`, "success");

  setExecState("building");
  addLog("Building swap transaction…", "info");
  const swapRes = await fetch("https://quote-api.jup.ag/v6/swap", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ quoteResponse:quote, userPublicKey:solWallet.address, wrapAndUnwrapSol:true, dynamicComputeUnitLimit:true, prioritizationFeeLamports:"auto" }),
  });
  const { swapTransaction } = await swapRes.json();
  if (!swapTransaction) { addLog("Swap build failed", "error"); setExecState("error"); return; }

  setExecState("buying");
  addLog("Sending to Phantom — approve to confirm…", "warn");
  try {
    const result = await phantom.request({ method:"signAndSendTransaction", params:{ transaction:swapTransaction } });
    const sig    = result?.signature || String(result);
    addLog(`✓ SOL BUY: ${sig.slice(0,20)}… ↗`, "success");
    addLog(`⚠ SELL MANUALLY on ${opp.sellPair.dexId}`, "warn");
    const estProfit = (opp.spread/100)*cfg.tradeUSD;
    const solGasCost = 0.000005 * prices.sol;
    setHistory(p => [{
      id:Date.now(), time:new Date().toLocaleTimeString(),
      symbol:opp.token.s, chain:"solana", spread:opp.spread.toFixed(2),
      buy:opp.buyPair.dexId, sell:opp.sellPair.dexId,
      tradeUSD:cfg.tradeUSD, estProfit:estProfit.toFixed(2),
      gasUSD:solGasCost.toFixed(4), netProfit:(estProfit-solGasCost).toFixed(2),
      status:"BUY_SENT", txHash:sig,
    }, ...p]);
    setExecState("done");
  } catch(phantomErr) {
    addLog("Phantom signAndSendTransaction: "+phantomErr.message, "error");
    addLog("Production fix: use VersionedTransaction.deserialize(Buffer.from(swapTx,'base64'))", "info");
    addLog("Install: npm install @solana/web3.js", "info");
    setExecState("error");
  }
} catch(e) { addLog("Solana error: "+e.message, "error"); setExecState("error"); }
```

};

const execute = (opp) => {
setExecState(null);
if (opp.token.chain === “solana”) executeSolana(opp);
else executeEVM(opp);
};

const exportCSV = () => {
if (!history.length) return;
const a = document.createElement(“a”);
a.href = URL.createObjectURL(new Blob([toCSV(history)], {type:“text/csv”}));
a.download = `arb_history_${Date.now()}.csv`;
a.click();
};

// ── Derived ───────────────────────────────────────────────────────────────
const filtered  = Object.entries(data).filter(([,d]) => chainFilter===“all” || d.token?.chain===chainFilter);
const opps      = filtered.filter(([,d]) => d?.spread>=cfg.minSpread && !d?.error && !d?.risky);
const riskyOpps = filtered.filter(([,d]) => d?.spread>=cfg.minSpread && !d?.error && d?.risky);
const totalPnL  = history.reduce((s,h) => s+parseFloat(h.netProfit||0), 0);
const scanning  = Object.values(loading).filter(Boolean).length;
const getNet    = (spread) => (spread/100)*cfg.tradeUSD - (gasUSD||0);

// ── Render ────────────────────────────────────────────────────────────────
return (
<div style={{ minHeight:“100vh”, background:”#04030a”, fontFamily:”‘IBM Plex Mono’,‘Courier New’,monospace”, color:”#b0c8e0”, fontSize:12 }}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap'); @keyframes glow   { 0%,100%{filter:brightness(1)} 50%{filter:brightness(1.25)} } @keyframes fadeUp { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} } @keyframes spin   { to{transform:rotate(360deg)} } @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} } *{box-sizing:border-box} ::-webkit-scrollbar{width:3px;height:3px} ::-webkit-scrollbar-track{background:#080612} ::-webkit-scrollbar-thumb{background:#1a2038} .btn{cursor:pointer;border:none;font-family:inherit;transition:all .15s} .btn:hover{filter:brightness(1.2)} .btn:active{transform:scale(.97)} .rh:hover{background:#0b0f1c!important;cursor:pointer} input{font-family:inherit;background:#0b0f1c;border:1px solid #1a2038;color:#00d4ff;outline:none;border-radius:3px;padding:4px 8px;width:100%} a{color:inherit;text-decoration:none}`}</style>

```
  {/* ── TOP BAR ── */}
  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 16px",borderBottom:"1px solid #10162a",background:"#06050d",flexWrap:"wrap",gap:8 }}>
    <div style={{ display:"flex",alignItems:"center",gap:12 }}>
      <div>
        <div style={{ fontSize:16,fontWeight:700,color:"#00d4ff",letterSpacing:.5 }}>◈ ARB_EXEC PRO</div>
        <div style={{ fontSize:8,color:"#1a2a40",letterSpacing:3 }}>{ALL_TOKENS.length} TOKENS · 6 CHAINS · PARASWAP + JUPITER</div>
      </div>
      {[
        { l:"OPPS",    v:opps.length,          c:opps.length>0?"#00d4ff":"#1a2038" },
        { l:"⚠ RISKY", v:riskyOpps.length,     c:riskyOpps.length>0?"#ff6b35":"#1a2038" },
        { l:"NET P&L", v:`${totalPnL>=0?"+":""}$${totalPnL.toFixed(2)}`, c:totalPnL>0?"#00ff94":totalPnL<0?"#ff4060":"#1a2038" },
        { l:"SCAN",    v:scanning>0?"LIVE":`${countdown}s`, c:scanning>0?"#00ff94":"#1a3050" },
      ].map(s => (
        <div key={s.l} style={{ background:"#0b0f1c",border:"1px solid #141e30",borderRadius:4,padding:"3px 9px",textAlign:"center" }}>
          <div style={{ fontSize:7,color:"#1a2038",letterSpacing:1 }}>{s.l}</div>
          <div style={{ fontSize:13,fontWeight:700,color:s.c }}>{s.v}</div>
        </div>
      ))}
    </div>
    <div style={{ display:"flex",gap:6,alignItems:"center",flexWrap:"wrap" }}>
      {evmWallet
        ? <div style={{ background:"#0b0f1c",border:"1px solid #1a3050",borderRadius:4,padding:"4px 10px" }}>
            <div style={{ fontSize:7,color:"#1a3050" }}>EVM WALLET</div>
            <div style={{ color:"#00d4ff",fontSize:11 }}>{evmWallet.address.slice(0,6)}…{evmWallet.address.slice(-4)} · {evmWallet.balance} ETH</div>
          </div>
        : <button className="btn" onClick={connectEVM} style={{ background:"#0b1828",border:"1px solid #00d4ff50",borderRadius:4,color:"#00d4ff",padding:"7px 14px",fontWeight:600,fontSize:11 }}>⬡ METAMASK</button>
      }
      {solWallet
        ? <div style={{ background:"#0b0f1c",border:"1px solid #4a2070",borderRadius:4,padding:"4px 10px" }}>
            <div style={{ fontSize:7,color:"#4a2070" }}>PHANTOM</div>
            <div style={{ color:"#9945FF",fontSize:11 }}>{solWallet.address.slice(0,6)}…{solWallet.address.slice(-4)}</div>
          </div>
        : <button className="btn" onClick={connectSolana} style={{ background:"#0b0818",border:"1px solid #9945FF50",borderRadius:4,color:"#9945FF",padding:"7px 14px",fontWeight:600,fontSize:11 }}>◎ PHANTOM</button>
      }
      <button className="btn" onClick={fetchAll} style={{ background:"#0b0f1c",border:"1px solid #1a2038",borderRadius:4,color:"#4a6a8a",padding:"7px 10px" }}>⟳</button>
    </div>
  </div>

  <div style={{ display:"grid",gridTemplateColumns:"1fr 340px",height:"calc(100vh - 52px)" }}>

    {/* ── TOKEN GRID ── */}
    <div style={{ display:"flex",flexDirection:"column",overflow:"hidden",borderRight:"1px solid #10162a" }}>

      {/* Toolbar */}
      <div style={{ padding:"7px 14px",borderBottom:"1px solid #0d1220",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6 }}>
        <div style={{ display:"flex",gap:3 }}>
          {["all",...Object.keys(CHAINS)].map(ch => (
            <button key={ch} className="btn" onClick={()=>setChainFilter(ch)} style={{
              background:chainFilter===ch?"#0d1828":"transparent",
              border:`1px solid ${chainFilter===ch?"#00d4ff40":"#10162a"}`,
              borderRadius:3,color:chainFilter===ch?"#00d4ff":"#2a3a50",
              padding:"3px 8px",fontSize:9,letterSpacing:.5,
            }}>{ch==="all"?"ALL":CHAINS[ch].short}</button>
          ))}
        </div>
        <div style={{ display:"flex",gap:12,fontSize:9,color:"#2a3a50" }}>
          {evmWallet && gasUSD!=null && <span>GAS ≈ <span style={{color:"#ff6b35"}}>${gasUSD.toFixed(2)}</span></span>}
          <span>ETH <span style={{color:"#b0c8e0"}}>${prices.eth.toLocaleString()}</span></span>
          <span>SOL <span style={{color:"#b0c8e0"}}>${prices.sol}</span></span>
          <span>MATIC <span style={{color:"#b0c8e0"}}>${prices.matic}</span></span>
        </div>
      </div>

      {/* Table head */}
      <div style={{ display:"grid",gridTemplateColumns:"80px 48px 72px 100px 100px 78px 60px 1fr",padding:"5px 14px",background:"#06050d",fontSize:7,color:"#1a2038",letterSpacing:2,gap:6,position:"sticky",top:0,zIndex:2,borderBottom:"1px solid #0d1220" }}>
        {["TOKEN","CHAIN","SPREAD","BUY DEX","SELL DEX","NET $","FLAGS",""].map(h=><span key={h}>{h}</span>)}
      </div>

      {/* Rows */}
      <div style={{ overflowY:"auto",flex:1 }}>
        {filtered.length===0 && (
          <div style={{ padding:"60px 0",textAlign:"center",color:"#1a2038",fontSize:11 }}>
            <div style={{ fontSize:22,animation:"spin 2s linear infinite",display:"inline-block",marginBottom:8 }}>⟳</div>
            <div>Scanning {ALL_TOKENS.length} tokens across 6 chains…</div>
          </div>
        )}
        {filtered.map(([key,d],i) => {
          const isLoad = loading[key];
          const hasOpp = d?.spread>=cfg.minSpread && !d?.error;
          const net    = d?.spread ? getNet(d.spread) : null;
          const cInfo  = CHAINS[d.token?.chain];
          const isSel  = selectedOpp?.token?.s===d.token?.s && selectedOpp?.token?.chain===d.token?.chain;
          return (
            <div key={key} className="rh"
              onClick={() => hasOpp && (setSelectedOpp(d),setTab("exec"),setExecState(null))}
              style={{
                display:"grid",gridTemplateColumns:"80px 48px 72px 100px 100px 78px 60px 1fr",
                padding:"8px 14px",gap:6,
                background:isSel?"#0d1828":d?.risky&&hasOpp?"#120b06":hasOpp?"#070e1a":i%2===0?"#04030a":"#06050d",
                borderBottom:"1px solid #0a0d18",
                borderLeft:`2px solid ${isSel?"#00d4ff":d?.risky&&hasOpp?"#ff6b35":hasOpp?"#00d4ff28":"transparent"}`,
                alignItems:"center",
                animation:hasOpp&&!isSel?"fadeUp .3s ease":"none",
              }}>
              <span style={{ fontWeight:700,color:hasOpp?(d.risky?"#ff6b35":"#00d4ff"):"#3a5a7a",fontSize:12 }}>{d.token?.s}</span>
              <span style={{ fontSize:8,color:cInfo?.color||"#2a3a50" }}>{cInfo?.short}</span>
              <span style={{ fontSize:13,fontWeight:700,color:!d?"#1a2038":d.error?"#503030":hasOpp?(d.risky?"#ff6b35":"#00d4ff"):"#2a4060" }}>
                {isLoad?"···":d?.error?"ERR":d?.spread?`${d.spread.toFixed(2)}%`:"—"}
              </span>
              <span style={{ fontSize:9,color:"#3a5a7a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{d?.buyPair?.dexId||"—"}</span>
              <span style={{ fontSize:9,color:"#3a5a7a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{d?.sellPair?.dexId||"—"}</span>
              <span style={{ fontSize:11,fontWeight:hasOpp?700:400,color:net!=null&&hasOpp?(net>0?"#00ff94":"#ff4060"):"#1a2038" }}>
                {net!=null&&hasOpp?`${net>=0?"+":""}$${net.toFixed(2)}`:"—"}
              </span>
              <span style={{ fontSize:9,color:"#ff6b35" }}>
                {d?.risky&&"⚠"}{d?.ageHours<24&&<span style={{marginLeft:2}}>NEW</span>}
              </span>
              <div>
                {hasOpp
                  ? <button className="btn" onClick={e=>{e.stopPropagation();setSelectedOpp(d);setTab("exec");setExecState(null);}}
                      style={{ background:d.risky?"#180c06":"#060e1a",border:`1px solid ${d.risky?"#ff6b3560":"#00d4ff50"}`,borderRadius:3,color:d.risky?"#ff6b35":"#00d4ff",padding:"3px 8px",fontWeight:700,fontSize:9 }}>
                      {d.risky?"⚠ RISKY":"EXEC →"}
                    </button>
                  : <span style={{ fontSize:8,color:"#1a2038" }}>{isLoad?"SCAN…":d?.error?"ERR":"WATCHING"}</span>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* ── RIGHT PANEL ── */}
    <div style={{ display:"flex",flexDirection:"column",overflow:"hidden" }}>

      {/* Tabs */}
      <div style={{ display:"flex",borderBottom:"1px solid #10162a",background:"#06050d" }}>
        {[["exec","EXECUTE"],["settings","SETTINGS"],["history","HISTORY"]].map(([t,l]) => (
          <button key={t} className="btn" onClick={()=>setTab(t)} style={{
            flex:1,padding:"9px 0",fontSize:8,letterSpacing:2,
            background:tab===t?"#0b0f1c":"transparent",
            borderBottom:tab===t?"2px solid #00d4ff":"2px solid transparent",
            color:tab===t?"#00d4ff":"#2a3a50",
          }}>{l}</button>
        ))}
      </div>

      {/* ── EXECUTE ── */}
      {tab==="exec" && (
        <div style={{ flex:1,overflowY:"auto",padding:14 }}>
          {selectedOpp ? (
            <div style={{ animation:"fadeUp .2s ease" }}>
              {selectedOpp.risky && (
                <div style={{ padding:"7px 10px",background:"#180c06",border:"1px solid #ff6b3540",borderRadius:4,marginBottom:10,fontSize:9,color:"#ff6b35",lineHeight:1.6 }}>
                  ⚠ HIGH RISK: Pair age &lt;24h or spread &gt;10%. Potential honeypot or fake liquidity. Proceed at your own risk.
                </div>
              )}
              <div style={{ background:"#0b0f1c",border:`1px solid ${selectedOpp.risky?"#ff6b3530":"#00d4ff20"}`,borderRadius:6,padding:12,marginBottom:10 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:20,fontWeight:700,color:selectedOpp.risky?"#ff6b35":"#00d4ff" }}>{selectedOpp.token.s}</div>
                    <div style={{ fontSize:8,color:"#1a3050",letterSpacing:1 }}>{CHAINS[selectedOpp.token.chain]?.name?.toUpperCase()}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:18,fontWeight:700,color:selectedOpp.spread>=2?"#ff4060":selectedOpp.spread>=1?"#ffaa00":"#00ff94" }}>{selectedOpp.spread?.toFixed(2)}%</div>
                    <div style={{ fontSize:8,color:"#1a3050" }}>SPREAD</div>
                  </div>
                </div>
                {[
                  ["BUY ON",     selectedOpp.buyPair?.dexId,  `@ $${fp(selectedOpp.minP,6)}`, "#00ff94"],
                  ["SELL ON",    selectedOpp.sellPair?.dexId, `@ $${fp(selectedOpp.maxP,6)}`, "#ff6b35"],
                  ["TRADE SIZE", `$${cfg.tradeUSD} USDC`,  null, "#b0c8e0"],
                  ["EST PROFIT", `+$${((selectedOpp.spread/100)*cfg.tradeUSD).toFixed(2)}`, null, "#00ff94"],
                  ["GAS COST",   gasUSD!=null?`−$${gasUSD.toFixed(2)}`:"calculating…", null, "#ff6b35"],
                  ["NET PROFIT", gasUSD!=null?`${getNet(selectedOpp.spread)>=0?"+":""}$${getNet(selectedOpp.spread).toFixed(2)}`:"—", null, getNet(selectedOpp.spread)>=0?"#00ff94":"#ff4060"],
                  ["PAIR AGE",   selectedOpp.ageHours>8760?">1yr":`${selectedOpp.ageHours.toFixed(0)}h`, null, selectedOpp.ageHours<24?"#ff6b35":"#3a5a7a"],
                  ["LIQUIDITY",  selectedOpp.buyPair?.liquidity?.usd?`$${(selectedOpp.buyPair.liquidity.usd/1000).toFixed(0)}k`:"—", null, "#3a5a7a"],
                ].map(([l,v,s,c]) => (
                  <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #0d1220" }}>
                    <span style={{ fontSize:8,color:"#1a3050",letterSpacing:.5 }}>{l}</span>
                    <div style={{ textAlign:"right" }}>
                      <span style={{ fontSize:11,color:c,fontWeight:600 }}>{v}</span>
                      {s && <div style={{ fontSize:8,color:"#2a4060" }}>{s}</div>}
                    </div>
                  </div>
                ))}
              </div>

              {execState && !["done","error"].includes(execState) && (
                <div style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 10px",background:"#0b0f1c",border:"1px solid #1a2038",borderRadius:4,marginBottom:8,fontSize:10,color:"#00d4ff" }}>
                  <span style={{ animation:"spin 1s linear infinite",display:"inline-block" }}>⟳</span>
                  {execState.toUpperCase()}…
                </div>
              )}
              {execState==="done" && <div style={{ padding:"7px 10px",background:"#071608",border:"1px solid #00ff9430",borderRadius:4,marginBottom:8,fontSize:10,color:"#00ff94" }}>✓ BUY SENT — sell on {selectedOpp.sellPair?.dexId} to close</div>}
              {execState==="error" && <div style={{ padding:"7px 10px",background:"#160608",border:"1px solid #ff404030",borderRadius:4,marginBottom:8,fontSize:10,color:"#ff4060" }}>✗ Failed — check exec log below</div>}

              <div style={{ display:"flex",flexDirection:"column",gap:5 }}>
                <button className="btn" onClick={()=>execute(selectedOpp)}
                  disabled={!!execState && !["done","error"].includes(execState)}
                  style={{ background:execState&&!["done","error"].includes(execState)?"#0b0f1c":"#071428",border:`1px solid ${execState&&!["done","error"].includes(execState)?"#1a2038":"#00d4ff"}`,borderRadius:4,color:execState&&!["done","error"].includes(execState)?"#2a4060":"#00d4ff",padding:"10px",fontWeight:700,fontSize:12 }}>
                  {selectedOpp.token.chain==="solana"?"◎ ":"⬡ "}
                  {execState==="approving"?"APPROVING USDC…":execState==="quoting"?"FETCHING ROUTE…":execState==="building"?"BUILDING TX…":execState==="buying"?"CONFIRM IN WALLET…":execState==="done"?"DONE — RE-EXECUTE?":execState==="error"?"↺ RETRY":"⚡ AUTO-EXECUTE BUY LEG"}
                </button>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:5 }}>
                  <a href={selectedOpp.buyPair?.url||`https://dexscreener.com/${selectedOpp.token.chain}/${selectedOpp.buyPair?.pairAddress}`} target="_blank" rel="noreferrer"
                    style={{ display:"block",textAlign:"center",padding:"7px",background:"#071408",border:"1px solid #00ff9428",borderRadius:4,color:"#00ff94",fontSize:10,fontWeight:700 }}>↗ BUY MANUAL</a>
                  <a href={selectedOpp.sellPair?.url||`https://dexscreener.com/${selectedOpp.token.chain}/${selectedOpp.sellPair?.pairAddress}`} target="_blank" rel="noreferrer"
                    style={{ display:"block",textAlign:"center",padding:"7px",background:"#160706",border:"1px solid #ff6b3528",borderRadius:4,color:"#ff6b35",fontSize:10,fontWeight:700 }}>↗ SELL MANUAL</a>
                </div>
                <button className="btn" onClick={()=>{setSelectedOpp(null);setExecState(null);}} style={{ background:"transparent",border:"1px solid #10162a",borderRadius:4,color:"#2a3a50",padding:"6px",fontSize:9 }}>DISMISS</button>
              </div>

              <div style={{ marginTop:8,padding:8,background:"#06050d",borderRadius:4,border:"1px solid #0d1220",fontSize:8,color:"#2a4060",lineHeight:1.8 }}>
                ⚠ BUY leg only. Sell manually to close. Sequential arb carries price risk between transactions. Atomic arb requires a flash loan smart contract.
              </div>
            </div>
          ) : (
            <div style={{ paddingTop:24,textAlign:"center",color:"#1a2038" }}>
              <div style={{ fontSize:24,marginBottom:10,opacity:.3 }}>◈</div>
              <div style={{ fontSize:11,marginBottom:18 }}>Click <span style={{color:"#00d4ff"}}>EXEC →</span> on any row<br/>to open execution panel</div>
              {opps.length>0 && <>
                <div style={{ fontSize:7,letterSpacing:2,color:"#1a3050",marginBottom:7 }}>LIVE OPPORTUNITIES</div>
                {opps.slice(0,5).map(([,d]) => (
                  <div key={d.token.s+d.token.chain} onClick={()=>{setSelectedOpp(d);setExecState(null);}}
                    className="btn" style={{ background:"#0b0f1c",border:"1px solid #00d4ff18",borderRadius:4,padding:"7px 12px",display:"flex",justifyContent:"space-between",marginBottom:4,animation:"glow 2s ease-in-out infinite" }}>
                    <span style={{ color:"#00d4ff",fontWeight:700,fontSize:11 }}>{d.token.s}</span>
                    <span style={{ color:"#3a5a7a",fontSize:10 }}>{d.spread.toFixed(2)}%</span>
                    <span style={{ color:getNet(d.spread)>=0?"#00ff94":"#ff4060",fontWeight:700,fontSize:11 }}>{getNet(d.spread)>=0?"+":""}${getNet(d.spread).toFixed(2)}</span>
                  </div>
                ))}
              </>}
            </div>
          )}
        </div>
      )}

      {/* ── SETTINGS ── */}
      {tab==="settings" && (
        <div style={{ flex:1,overflowY:"auto",padding:14 }}>
          <div style={{ fontSize:8,color:"#1a3050",letterSpacing:3,marginBottom:14 }}>STRATEGY SETTINGS</div>
          {[
            {l:"MIN SPREAD %",     k:"minSpread",    step:.1,  min:.1,  max:20},
            {l:"MIN NET PROFIT $", k:"minNetProfit", step:.5,  min:0,   max:500},
            {l:"TRADE SIZE USD $", k:"tradeUSD",     step:10,  min:10,  max:100000},
            {l:"SLIPPAGE %",       k:"slippage",     step:.1,  min:.1,  max:5},
            {l:"MIN LIQUIDITY $",  k:"minLiqUSD",    step:5000,min:5000,max:5000000},
          ].map(f => (
            <div key={f.k} style={{ marginBottom:10 }}>
              <div style={{ fontSize:8,color:"#2a4060",letterSpacing:1,marginBottom:3 }}>{f.l}</div>
              <input type="number" step={f.step} min={f.min} max={f.max} value={cfg[f.k]}
                onChange={e=>setCfg(s=>({...s,[f.k]:parseFloat(e.target.value)||f.min}))}
              />
            </div>
          ))}

          <div style={{ borderTop:"1px solid #10162a",marginTop:14,paddingTop:14 }}>
            <div style={{ fontSize:8,color:"#1a3050",letterSpacing:3,marginBottom:12 }}>ALERTS</div>
            {[{l:"🔊 SOUND ALERTS",k:"sound"},{l:"🔔 BROWSER NOTIFICATIONS",k:"notifs"}].map(t => (
              <div key={t.k} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
                <span style={{ fontSize:10,color:"#4a6a8a" }}>{t.l}</span>
                <button className="btn" onClick={()=>{
                  if(t.k==="notifs"&&!cfg.notifs) Notification?.requestPermission?.();
                  setCfg(s=>({...s,[t.k]:!s[t.k]}));
                }} style={{ background:cfg[t.k]?"#071428":"#0b0f1c",border:`1px solid ${cfg[t.k]?"#00d4ff":"#1a2038"}`,borderRadius:4,color:cfg[t.k]?"#00d4ff":"#2a3a50",padding:"4px 14px",fontSize:9,fontWeight:700 }}>
                  {cfg[t.k]?"ON":"OFF"}
                </button>
              </div>
            ))}
            <div style={{ marginTop:12,padding:10,background:"#0c0806",border:"1px solid #ff6b3528",borderRadius:4 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
                <span style={{ fontSize:10,color:"#ff6b35",fontWeight:700 }}>⚡ AUTO-EXEC MODE</span>
                <button className="btn" onClick={()=>setCfg(s=>({...s,autoExec:!s.autoExec}))} style={{ background:cfg.autoExec?"#180c06":"#0b0f1c",border:`1px solid ${cfg.autoExec?"#ff6b35":"#1a2038"}`,borderRadius:4,color:cfg.autoExec?"#ff6b35":"#2a3a50",padding:"4px 14px",fontSize:9,fontWeight:700 }}>
                  {cfg.autoExec?"ENABLED":"DISABLED"}
                </button>
              </div>
              <div style={{ fontSize:8,color:"#604030",lineHeight:1.7 }}>
                Auto-highlights opportunities when net profit ≥ ${cfg.minNetProfit}. Still requires wallet confirmation. Does not skip MetaMask/Phantom approval.
              </div>
            </div>
          </div>

          <div style={{ borderTop:"1px solid #10162a",marginTop:14,paddingTop:14 }}>
            <div style={{ fontSize:8,color:"#1a3050",letterSpacing:3,marginBottom:10 }}>DEPLOY CHECKLIST</div>
            <div style={{ fontSize:8,color:"#2a4060",lineHeight:2 }}>
              <div>□ <span style={{color:"#00d4ff"}}>npm install @solana/web3.js</span> — full Solana support</div>
              <div>□ Serve over <span style={{color:"#00d4ff"}}>HTTPS</span> — MetaMask requires it</div>
              <div>□ Verify <span style={{color:"#00d4ff"}}>Paraswap proxy</span> address per chain</div>
              <div>□ Set <span style={{color:"#00d4ff"}}>REACT_APP_RPC_URL</span> env var for faster gas reads</div>
              <div>□ For atomic arb: deploy <span style={{color:"#00d4ff"}}>Aave V3 flash loan</span> contract</div>
              <div>□ Add <span style={{color:"#00d4ff"}}>rate limiting</span> to DexScreener calls in prod</div>
            </div>
          </div>
        </div>
      )}

      {/* ── HISTORY ── */}
      {tab==="history" && (
        <div style={{ flex:1,overflowY:"auto",padding:14 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <div style={{ fontSize:8,color:"#1a3050",letterSpacing:3 }}>TRADE HISTORY ({history.length})</div>
            {history.length>0 && <button className="btn" onClick={exportCSV} style={{ background:"#0b1828",border:"1px solid #00d4ff30",borderRadius:3,color:"#00d4ff",padding:"4px 10px",fontSize:8 }}>↓ CSV</button>}
          </div>
          {history.length>0 && (
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5,marginBottom:12 }}>
              {[
                {l:"TRADES", v:history.length,                                             c:"#b0c8e0"},
                {l:"VOLUME", v:`$${history.reduce((s,h)=>s+parseFloat(h.tradeUSD),0).toLocaleString()}`, c:"#3a5a7a"},
                {l:"NET P&L",v:`${totalPnL>=0?"+":""}$${totalPnL.toFixed(2)}`,             c:totalPnL>=0?"#00ff94":"#ff4060"},
              ].map(s=>(
                <div key={s.l} style={{ background:"#0b0f1c",border:"1px solid #141e30",borderRadius:4,padding:"7px",textAlign:"center" }}>
                  <div style={{ fontSize:7,color:"#1a2038",letterSpacing:1 }}>{s.l}</div>
                  <div style={{ fontSize:13,fontWeight:700,color:s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
          )}
          {history.length===0
            ? <div style={{ textAlign:"center",color:"#1a2038",paddingTop:40,fontSize:11 }}>No trades yet</div>
            : history.map(h => (
              <div key={h.id} style={{ background:"#0b0f1c",border:"1px solid #10162a",borderRadius:4,padding:"10px",marginBottom:6,animation:"fadeUp .2s ease" }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
                  <span style={{ color:"#00d4ff",fontWeight:700 }}>{h.symbol} <span style={{ fontSize:9,color:CHAINS[h.chain]?.color }}>{CHAINS[h.chain]?.short}</span></span>
                  <span style={{ fontSize:8,color:"#1a3050" }}>{h.time}</span>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,fontSize:9,marginBottom:5 }}>
                  <span style={{ color:"#3a5a7a" }}>Buy: <span style={{color:"#00ff94"}}>{h.buy}</span></span>
                  <span style={{ color:"#3a5a7a" }}>Sell: <span style={{color:"#ff6b35"}}>{h.sell}</span></span>
                  <span style={{ color:"#3a5a7a" }}>Spread: <span style={{color:"#b0c8e0"}}>{h.spread}%</span></span>
                  <span style={{ color:"#3a5a7a" }}>Gas: <span style={{color:"#ff6b35"}}>${h.gasUSD}</span></span>
                  <span style={{ color:"#3a5a7a" }}>Size: <span style={{color:"#b0c8e0"}}>${h.tradeUSD}</span></span>
                  <span style={{ color:"#3a5a7a" }}>Net: <span style={{ fontWeight:700,color:parseFloat(h.netProfit)>=0?"#00ff94":"#ff4060" }}>{parseFloat(h.netProfit)>=0?"+":""}${h.netProfit}</span></span>
                </div>
                {h.txHash && (
                  <a href={(EXPLORERS[h.chain]||"")+h.txHash} target="_blank" rel="noreferrer" style={{ fontSize:8,color:"#1a3050" }}>
                    TX: {h.txHash.slice(0,22)}… ↗
                  </a>
                )}
              </div>
            ))
          }
        </div>
      )}

      {/* Exec Log strip */}
      <div style={{ height:130,borderTop:"1px solid #10162a",padding:"8px 12px",overflowY:"auto",background:"#06050d" }}>
        <div style={{ fontSize:7,color:"#1a2038",letterSpacing:2,marginBottom:5 }}>EXEC LOG</div>
        {execLog.length===0
          ? <div style={{ fontSize:9,color:"#1a2038" }}>No activity yet</div>
          : execLog.map((l,i) => (
            <div key={i} style={{ display:"flex",gap:8,padding:"2px 0",borderBottom:"1px solid #0a0d18" }}>
              <span style={{ fontSize:8,color:"#1a2038",whiteSpace:"nowrap",paddingTop:1 }}>{l.time}</span>
              <span style={{ fontSize:9,lineHeight:1.5,color:l.type==="error"?"#ff4060":l.type==="success"?"#00ff94":l.type==="warn"?"#ffaa00":l.type==="start"?"#00d4ff":"#3a5a7a" }}>{l.msg}</span>
            </div>
          ))
        }
      </div>
    </div>
  </div>

  {/* ── ALERT TICKER ── */}
  {alerts.length>0 && (
    <div style={{ position:"fixed",bottom:0,left:0,right:0,background:"#06050d",borderTop:"1px solid #10162a",padding:"5px 14px",display:"flex",gap:10,overflow:"hidden",zIndex:10,alignItems:"center" }}>
      <span style={{ fontSize:8,color:"#00d4ff",letterSpacing:2,whiteSpace:"nowrap",fontWeight:700,animation:"blink 1s ease-in-out infinite" }}>◈ LIVE</span>
      <div style={{ display:"flex",gap:18,overflow:"hidden" }}>
        {alerts.slice(0,7).map(a => (
          <span key={a.id} style={{ fontSize:9,color:"#2a4060",whiteSpace:"nowrap" }}>
            <span style={{ color:a.risky?"#ff6b35":"#00d4ff",fontWeight:700 }}>{a.symbol}</span>
            {" "}{a.spread}% · buy {a.buy} · sell {a.sell} ·{" "}
            <span style={{ color:parseFloat(a.netProfit)>=0?"#00ff94":"#ff4060" }}>net {parseFloat(a.netProfit)>=0?"+":""}${a.netProfit}</span>
            {a.risky&&<span style={{ color:"#ff6b35" }}> ⚠</span>}
          </span>
        ))}
      </div>
    </div>
  )}
</div>
```

);
}