// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

"use strict";
System.register(
  "file:///D:/Users/Vijay/deno/test/test",
  [],
  function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function add(a, b) {
      return a + b;
    }
    exports_1("add", add);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
console.log("Welcome to Deno 🦕");
System.register(
  "file:///D:/Users/Vijay/deno/test/deps",
  ["https://deno.land/std/examples/welcome.ts"],
  function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    return {
      setters: [
        function (welcome_1) {
          exports_2("welcome", welcome_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "file:///D:/Users/Vijay/deno/test/index",
  [
    "file:///D:/Users/Vijay/deno/test/test",
    "file:///D:/Users/Vijay/deno/test/deps",
  ],
  function (exports_3, context_3) {
    "use strict";
    var test_ts_1, deps_ts_1;
    var __moduleName = context_3 && context_3.id;
    return {
      setters: [
        function (test_ts_1_1) {
          test_ts_1 = test_ts_1_1;
        },
        function (deps_ts_1_1) {
          deps_ts_1 = deps_ts_1_1;
        },
      ],
      execute: function () {
        console.log(test_ts_1.add(1, 2));
        console.log(deps_ts_1.welcome);
      },
    };
  },
);

__instantiate("file:///D:/Users/Vijay/deno/test/index");
