// ../../node_modules/.pnpm/mitt@3.0.1/node_modules/mitt/dist/mitt.mjs
function mitt_default(n) {
  return { all: n = n || /* @__PURE__ */ new Map(), on: function(t, e) {
    var i = n.get(t);
    i ? i.push(e) : n.set(t, [e]);
  }, off: function(t, e) {
    var i = n.get(t);
    i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []));
  }, emit: function(t, e) {
    var i = n.get(t);
    i && i.slice().map(function(n2) {
      n2(e);
    }), (i = n.get("*")) && i.slice().map(function(n2) {
      n2(t, e);
    });
  } };
}

// ../../node_modules/.pnpm/p-debounce@4.0.0/node_modules/p-debounce/index.js
var pDebounce = (fn, wait, options = {}) => {
  if (!Number.isFinite(wait)) {
    throw new TypeError("Expected `wait` to be a finite number");
  }
  let leadingValue;
  let timeout;
  let resolveList = [];
  return function(...arguments_) {
    return new Promise((resolve) => {
      const shouldCallNow = options.before && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        timeout = null;
        const result = options.before ? leadingValue : fn.apply(this, arguments_);
        for (resolve of resolveList) {
          resolve(result);
        }
        resolveList = [];
      }, wait);
      if (shouldCallNow) {
        leadingValue = fn.apply(this, arguments_);
        resolve(leadingValue);
      } else {
        resolveList.push(resolve);
      }
    });
  };
};
pDebounce.promise = (function_) => {
  let currentPromise;
  return async function(...arguments_) {
    if (currentPromise) {
      return currentPromise;
    }
    try {
      currentPromise = function_.apply(this, arguments_);
      return await currentPromise;
    } finally {
      currentPromise = void 0;
    }
  };
};
var p_debounce_default = pDebounce;

// src/inject/rpc/utils.ts
var BROADCAST_CHANNEL_ID = "pallad";
var callPalladAsync = ({
  method,
  payload
}) => {
  return new Promise((resolve, reject) => {
    const privateChannelId = `private-${Math.random()}`;
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_ID);
    const responseChannel = new BroadcastChannel(privateChannelId);
    const messageListener = ({ data }) => {
      channel.close();
      const error = data.response?.error;
      if (error) {
        try {
          console.table(JSON.parse(error.message));
        } catch {
          console.info(error.message);
        }
        return reject(error);
      }
      return resolve(data.response);
    };
    responseChannel.addEventListener("message", messageListener);
    channel.postMessage({
      method,
      payload,
      isPallad: true,
      respondAt: privateChannelId
    });
    return channel.close();
  });
};
var debouncedCall = p_debounce_default(callPalladAsync, 300);

// src/inject/rpc/provider.ts
var _events = mitt_default();
window.addEventListener("pallad_event", (event) => {
  event.stopImmediatePropagation();
  const { detail } = event;
  _events.emit(detail.type, detail.data);
});
var info = {
  slug: "pallad",
  name: "Pallad",
  icon: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzAwIDMwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzE5OF8yNDY5NSkiPgo8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgcng9IjEyIiBmaWxsPSIjRjZDMTc3Ii8+CjxwYXRoIGQ9Ik05MCAyMTRDOTAgMjExLjc5MSA5MS43OTA5IDIxMCA5NCAyMTBIMTM2QzE0My43MzIgMjEwIDE1MCAyMTYuMjY4IDE1MCAyMjRWMjI2QzE1MCAyMzMuNzMyIDE0My43MzIgMjQwIDEzNiAyNDBIMTA0Qzk2LjI2OCAyNDAgOTAgMjMzLjczMiA5MCAyMjZWMjE0WiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNOTAgNjRDOTAgNjEuNzkwOSA5MS43OTA5IDYwIDk0IDYwSDE5NkMyMDMuNzMyIDYwIDIxMCA2Ni4yNjggMjEwIDc0Vjc2QzIxMCA4My43MzIgMjAzLjczMiA5MCAxOTYgOTBIMTA0Qzk2LjI2OCA5MCA5MCA4My43MzIgOTAgNzZWNjRaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik0yMTAgOTRDMjEwIDkxLjc5MDkgMjExLjc5MSA5MCAyMTQgOTBIMjI2QzIzMy43MzIgOTAgMjQwIDk2LjI2OCAyNDAgMTA0VjEzNkMyNDAgMTQzLjczMiAyMzMuNzMyIDE1MCAyMjYgMTUwSDIyNEMyMTYuMjY4IDE1MCAyMTAgMTQzLjczMiAyMTAgMTM2Vjk0WiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNNjAgOTRDNjAgOTEuNzkwOSA2MS43OTA5IDkwIDY0IDkwSDc2QzgzLjczMiA5MCA5MCA5Ni4yNjggOTAgMTA0VjE5NkM5MCAyMDMuNzMyIDgzLjczMiAyMTAgNzYgMjEwSDc0QzY2LjI2OCAyMTAgNjAgMjAzLjczMiA2MCAxOTZWOTRaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik0xNTAgMTUwSDE5NkMyMDMuNzMyIDE1MCAyMTAgMTU2LjI2OCAyMTAgMTY0VjE2NkMyMTAgMTczLjczMiAyMDMuNzMyIDE4MCAxOTYgMTgwSDE2NEMxNTYuMjY4IDE4MCAxNTAgMTczLjczMiAxNTAgMTY2VjE1MFoiIGZpbGw9IiMyNTIzM0EiLz4KPHBhdGggZD0iTTIxMCAxNTBIMTk1QzE5NSAxNTAgMjAxIDE1MCAyMDUuNSAxNTQuNUMyMTAgMTU5IDIxMCAxNjUgMjEwIDE2NVYxNTBaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik0yMTAgMTUwTDIyNSAxNTBDMjI1IDE1MCAyMTkgMTUwIDIxNC41IDE0NS41QzIxMCAxNDEgMjEwIDEzNSAyMTAgMTM1TDIxMCAxNTBaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik0yMTAgMTUwTDIxMCAxMzVDMjEwIDEzNSAyMTAgMTQxIDIwNS41IDE0NS41QzIwMSAxNTAgMTk1IDE1MCAxOTUgMTUwTDIxMCAxNTBaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik05MCA5MEg3NUM3NSA5MCA4MSA5MCA4NS41IDk0LjVDOTAgOTkgOTAgMTA1IDkwIDEwNVY5MFoiIGZpbGw9IiMyNTIzM0EiLz4KPHBhdGggZD0iTTkwIDkwTDEwNSA5MEMxMDUgOTAgOTkgOTAgOTQuNSA4NS41QzkwIDgxIDkwIDc1IDkwIDc1TDkwIDkwWiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNOTAgOTBMOTAgMTA1QzkwIDEwNSA5MCA5OSA5NC41IDk0LjVDOTkgOTAgMTA1IDkwIDEwNSA5MEw5MCA5MFoiIGZpbGw9IiMyNTIzM0EiLz4KPHBhdGggZD0iTTIxMCA5MEgxOTVDMTk1IDkwIDIwMSA5MCAyMDUuNSA5NC41QzIxMCA5OSAyMTAgMTA1IDIxMCAxMDVWOTBaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik0yMTAgOTBMMjEwIDc1QzIxMCA3NSAyMTAgODEgMjA1LjUgODUuNUMyMDEgOTAgMTk1IDkwIDE5NSA5MEwyMTAgOTBaIiBmaWxsPSIjMjUyMzNBIi8+CjxwYXRoIGQ9Ik0yMTAgOTBMMjEwIDEwNUMyMTAgMTA1IDIxMCA5OSAyMTQuNSA5NC41QzIxOSA5MCAyMjUgOTAgMjI1IDkwTDIxMCA5MFoiIGZpbGw9IiMyNTIzM0EiLz4KPHBhdGggZD0iTTkwIDIxMEwxMDUgMjEwQzEwNSAyMTAgOTkgMjEwIDk0LjUgMjA1LjVDOTAgMjAxIDkwIDE5NSA5MCAxOTVMOTAgMjEwWiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNOTAgMjEwTDkwIDE5NUM5MCAxOTUgOTAgMjAxIDg1LjUgMjA1LjVDODEgMjEwIDc1IDIxMCA3NSAyMTBMOTAgMjEwWiIgZmlsbD0iIzI1MjMzQSIvPgo8cGF0aCBkPSJNOTAgMjEwTDkwIDIyNUM5MCAyMjUgOTAgMjE5IDk0LjUgMjE0LjVDOTkgMjEwIDEwNSAyMTAgMTA1IDIxMEw5MCAyMTBaIiBmaWxsPSIjMjUyMzNBIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMTk4XzI0Njk1Ij4KPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHJ4PSI0MCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K",
  rdns: "co.pallad"
};
var provider = {
  _events,
  request: async ({ method, params }) => await debouncedCall({
    method,
    payload: { ...params, origin: window.location.origin }
  }),
  isPallad: true,
  on: _events.on,
  off: _events.off
};

// src/inject/rpc.ts
var init = () => {
  ;
  window.mina = provider;
  const announceProvider = () => {
    window.dispatchEvent(
      new CustomEvent("mina:announceProvider", {
        detail: Object.freeze({ info, provider })
      })
    );
  };
  window.addEventListener("mina:requestProvider", () => {
    announceProvider();
  });
  announceProvider();
  console.info("[Pallad] RPC has been initialized.");
};
init();
