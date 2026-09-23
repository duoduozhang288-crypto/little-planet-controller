/* ============================================================
 * day-night.js —— 昼夜一键切换（单人玩法）
 * ------------------------------------------------------------
 * 原理：昼夜两版资源是同一构建的两套主题常量（白天版由官方昼夜
 * 配色逐项映射生成，游戏本体文件一行未动）。本层只做三件事：
 *
 *   1. 读 ?theme=day，同步 <meta name="theme-color">
 *   2. 右上角画一个切换按钮（用页面自己的 CSS 变量，两套主题下自动适配）
 *   3. 点击 = 换 theme 参数后整页重载 —— 存档在 localStorage，不丢
 *
 * 分屏座位（?seat=N）里不画按钮：双人模式切时间由宿主页 duo.html
 * 统一做，两个画面必须同时切换。
 * ============================================================ */
(function () {
  "use strict";

  var params = new URLSearchParams(location.search);
  if (params.get("seat")) return; /* 座位侧交给宿主页 */

  var day = params.get("theme") === "day";

  /* 浏览器 UI 色（手机地址栏等）跟着主题走 */
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta && day) meta.setAttribute("content", "#d4e8d0");

  /* 位置：右上角，顶栏（top:29 一带）与手记胶囊（top:98）之间 */
  var btn = document.createElement("button");
  btn.type = "button";
  btn.id = "day-night-toggle";
  btn.textContent = day ? "🌙 夜晚" : "☀️ 白天";
  btn.title = "一键切换昼夜（会重新加载画面，探索进度不会丢）";
  btn.setAttribute("aria-label", btn.title);
  btn.addEventListener("click", function () {
    if (day) params.delete("theme");
    else params.set("theme", "day");
    var q = params.toString();
    location.search = q; /* 整页重载；手记存于 localStorage，不受影响 */
  });

  var css = [
    "#day-night-toggle{position:absolute;top:66px;right:36px;z-index:40;",
    "display:inline-flex;align-items:center;gap:6px;",
    "font:inherit;font-size:12px;letter-spacing:.5px;cursor:pointer;",
    "color:var(--muted);background:var(--glass);",
    "border:1px solid var(--line);border-radius:9px;padding:7px 12px;",
    "-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);",
    "transition:color .2s,border-color .2s;}",
    "#day-night-toggle:hover{color:var(--accent);border-color:var(--accent);}",
  ].join("");

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  function mount() {
    /* 优先进双人入口的容器（#duo-entry-wrap），和「双人模式」按钮并排；
       容器里定位交给 flex，原绝对定位由 duo-entry.js 的样式覆盖掉。 */
    var wrap = document.getElementById("duo-entry-wrap");
    if (wrap) {
      wrap.appendChild(btn);
      return;
    }
    var app = document.getElementById("app") || document.body;
    app.appendChild(btn);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
