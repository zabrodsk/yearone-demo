/* @ds-bundle: {"format":3,"namespace":"YearOneDesignSystem_5121e2","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Tabs","sourcePath":"components/display/Tabs.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"AgentThinking","sourcePath":"components/feedback/AgentThinking.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"ddb768c8c902","components/core/Badge.jsx":"8062e9e66b9c","components/core/Button.jsx":"41fd35575b46","components/core/IconButton.jsx":"6b91c7f3f665","components/display/Card.jsx":"d18bc57e3e30","components/display/Tabs.jsx":"c2794d2d8b2e","components/display/Tag.jsx":"689b3d38a600","components/feedback/AgentThinking.jsx":"6c13ce0ac117","components/feedback/Toast.jsx":"db0d553f3223","components/feedback/Tooltip.jsx":"daa1c0e602e7","components/forms/Checkbox.jsx":"7ef59a636286","components/forms/Input.jsx":"a4df36233dc5","components/forms/Select.jsx":"8e829456c9d7","components/forms/Switch.jsx":"a6a426e2d41f","components/forms/Textarea.jsx":"c41889c55bdf","ui_kits/app/AppShell.jsx":"a8ee0eedd913","ui_kits/app/GuidanceCanvas.jsx":"426e835c4182","ui_kits/app/PlanView.jsx":"8341fdb7ae58","ui_kits/app/WhatIf.jsx":"3d5edb03be1d","ui_kits/app/data.js":"9791e6b47b70"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.YearOneDesignSystem_5121e2 = window.YearOneDesignSystem_5121e2 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'yo-avatar-styles';
const CSS = `
.yo-avatar{display:inline-flex;align-items:center;justify-content:center;flex:none;
  border-radius:var(--radius-full);overflow:hidden;font-family:var(--font-display);
  font-weight:var(--weight-medium);color:#fff;background:var(--ink-700);
  -webkit-user-select:none;user-select:none;position:relative}
.yo-avatar img{width:100%;height:100%;object-fit:cover;display:block}
.yo-avatar--xs{width:24px;height:24px;font-size:10px}
.yo-avatar--sm{width:32px;height:32px;font-size:12px}
.yo-avatar--md{width:40px;height:40px;font-size:15px}
.yo-avatar--lg{width:56px;height:56px;font-size:20px}
.yo-avatar--agent{background:var(--accent)}
.yo-avatar--square{border-radius:var(--radius-md)}
`;
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const e = document.createElement('style');
  e.id = STYLE_ID;
  e.textContent = CSS;
  document.head.appendChild(e);
}
const PALETTE = ['#3A56E8', '#18996A', '#DD8E2E', '#4B515D', '#6379EE', '#A22F2A'];
function initials(name = '') {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase() || '?';
}
function hueFor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = h * 31 + name.charCodeAt(i) >>> 0;
  return PALETTE[h % PALETTE.length];
}
const AGENT_MARK = /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 48 48",
  width: "58%",
  height: "58%",
  fill: "none",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M19.2 10.8 A14 14 0 1 0 28.8 10.8",
  stroke: "currentColor",
  strokeWidth: "3.6",
  strokeLinecap: "round",
  fill: "none"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "24",
  cy: "24",
  r: "4.6",
  fill: "currentColor"
}));
function Avatar({
  name = '',
  src = '',
  size = 'md',
  shape = 'round',
  agent = false,
  className = '',
  style = {},
  ...rest
}) {
  ensureStyles();
  const cls = ['yo-avatar', `yo-avatar--${size}`, shape === 'square' ? 'yo-avatar--square' : '', agent ? 'yo-avatar--agent' : '', className].filter(Boolean).join(' ');
  const bg = agent ? undefined : src ? undefined : hueFor(name);
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    style: {
      background: bg,
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name
  }) : agent ? AGENT_MARK : initials(name));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'yo-badge-styles';
const CSS = `
.yo-badge{display:inline-flex;align-items:center;gap:5px;font-family:var(--font-body);
  font-weight:var(--weight-medium);font-size:var(--text-xs);line-height:1;
  padding:4px 8px;border-radius:var(--radius-full);border:1px solid transparent;white-space:nowrap}
.yo-badge--sm{font-size:var(--text-2xs);padding:3px 7px}
.yo-badge__dot{width:6px;height:6px;border-radius:50%;background:currentColor;flex:none}
.yo-badge svg{width:13px;height:13px}
.yo-badge--neutral{background:var(--ink-100);color:var(--ink-700);border-color:var(--border-default)}
.yo-badge--success{background:var(--green-50);color:var(--green-700);border-color:var(--green-100)}
.yo-badge--warning{background:var(--amber-50);color:var(--amber-700);border-color:var(--amber-100)}
.yo-badge--danger{background:var(--red-50);color:var(--red-700);border-color:var(--red-100)}
.yo-badge--info{background:var(--signal-50);color:var(--signal-700);border-color:var(--signal-100)}
.yo-badge--solid{background:var(--ink-900);color:#fff;border-color:transparent}
`;
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const e = document.createElement('style');
  e.id = STYLE_ID;
  e.textContent = CSS;
  document.head.appendChild(e);
}
function Badge({
  tone = 'neutral',
  size = 'md',
  dot = false,
  icon = null,
  className = '',
  children,
  ...rest
}) {
  ensureStyles();
  const cls = ['yo-badge', `yo-badge--${tone}`, size === 'sm' ? 'yo-badge--sm' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    className: "yo-badge__dot"
  }), icon, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'yo-button-styles';
const CSS = `
.yo-btn{
  display:inline-flex;align-items:center;justify-content:center;gap:8px;
  font-family:var(--font-body);font-weight:var(--weight-medium);
  border-radius:var(--radius-sm);border:1px solid transparent;
  cursor:pointer;white-space:nowrap;text-decoration:none;
  transition:background var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
  -webkit-user-select:none;user-select:none;
}
.yo-btn:focus-visible{outline:none;box-shadow:var(--focus-ring)}
.yo-btn[disabled],.yo-btn[aria-disabled="true"]{cursor:not-allowed;opacity:.5}
.yo-btn--sm{height:var(--control-sm);padding:0 10px;font-size:var(--text-sm)}
.yo-btn--md{height:var(--control-md);padding:0 14px;font-size:var(--text-md)}
.yo-btn--lg{height:var(--control-lg);padding:0 18px;font-size:var(--text-lg)}
.yo-btn--full{width:100%}

.yo-btn--primary{background:var(--accent);color:var(--text-on-accent);box-shadow:var(--shadow-xs)}
.yo-btn--primary:hover:not([disabled]){background:var(--accent-hover)}
.yo-btn--primary:active:not([disabled]){background:var(--accent-active)}

.yo-btn--secondary{background:var(--surface-card);color:var(--text-strong);border-color:var(--border-default);box-shadow:var(--shadow-xs)}
.yo-btn--secondary:hover:not([disabled]){background:var(--surface-hover);border-color:var(--border-strong)}
.yo-btn--secondary:active:not([disabled]){background:var(--surface-active)}

.yo-btn--ghost{background:transparent;color:var(--text-body)}
.yo-btn--ghost:hover:not([disabled]){background:var(--surface-hover)}
.yo-btn--ghost:active:not([disabled]){background:var(--surface-active)}

.yo-btn--danger{background:var(--status-danger);color:#fff;box-shadow:var(--shadow-xs)}
.yo-btn--danger:hover:not([disabled]){background:var(--red-700)}

.yo-btn__think{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);
  gap:2px;width:14px;height:14px;flex:none}
.yo-btn__think span{width:3px;height:3px;border-radius:1px;background:currentColor;
  animation:yo-btn-think 1.1s var(--ease-in-out) infinite}
.yo-btn__think span:nth-child(1){animation-delay:0ms}
.yo-btn__think span:nth-child(2){animation-delay:80ms}
.yo-btn__think span:nth-child(3){animation-delay:160ms}
.yo-btn__think span:nth-child(4){animation-delay:320ms}
.yo-btn__think span:nth-child(5){animation-delay:240ms}
.yo-btn__think span:nth-child(6){animation-delay:160ms}
.yo-btn__think span:nth-child(7){animation-delay:480ms}
.yo-btn__think span:nth-child(8){animation-delay:400ms}
.yo-btn__think span:nth-child(9){animation-delay:320ms}
@keyframes yo-btn-think{0%,100%{opacity:.25;transform:scale(.85)}40%{opacity:1;transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.yo-btn__think span{animation-duration:2.2s}}
.yo-btn__icon{display:inline-flex;flex:none}
.yo-btn__icon svg{width:1em;height:1em;display:block}
`;
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = CSS;
  document.head.appendChild(el);
}
function Button({
  variant = 'primary',
  size = 'md',
  iconLeft = null,
  iconRight = null,
  loading = false,
  disabled = false,
  fullWidth = false,
  as = 'button',
  className = '',
  children,
  ...rest
}) {
  ensureStyles();
  const Tag = as;
  const cls = ['yo-btn', `yo-btn--${variant}`, `yo-btn--${size}`, fullWidth ? 'yo-btn--full' : '', className].filter(Boolean).join(' ');
  const isDisabled = disabled || loading;
  const tagProps = Tag === 'button' ? {
    disabled: isDisabled,
    type: rest.type || 'button'
  } : {
    'aria-disabled': isDisabled || undefined
  };
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls
  }, tagProps, rest), loading && /*#__PURE__*/React.createElement("span", {
    className: "yo-btn__think",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)), !loading && iconLeft && /*#__PURE__*/React.createElement("span", {
    className: "yo-btn__icon"
  }, iconLeft), children, !loading && iconRight && /*#__PURE__*/React.createElement("span", {
    className: "yo-btn__icon"
  }, iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'yo-iconbutton-styles';
const CSS = `
.yo-iconbtn{display:inline-flex;align-items:center;justify-content:center;
  border-radius:var(--radius-sm);border:1px solid transparent;background:transparent;
  color:var(--text-muted);cursor:pointer;flex:none;
  transition:background var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard);}
.yo-iconbtn:hover:not([disabled]){background:var(--surface-hover);color:var(--text-strong)}
.yo-iconbtn:active:not([disabled]){background:var(--surface-active)}
.yo-iconbtn:focus-visible{outline:none;box-shadow:var(--focus-ring)}
.yo-iconbtn[disabled]{cursor:not-allowed;opacity:.45}
.yo-iconbtn--sm{width:28px;height:28px}
.yo-iconbtn--md{width:36px;height:36px}
.yo-iconbtn--lg{width:44px;height:44px}
.yo-iconbtn--solid{background:var(--surface-card);border-color:var(--border-default);box-shadow:var(--shadow-xs)}
.yo-iconbtn--solid:hover:not([disabled]){border-color:var(--border-strong)}
.yo-iconbtn--accent{background:var(--accent);color:#fff}
.yo-iconbtn--accent:hover:not([disabled]){background:var(--accent-hover);color:#fff}
.yo-iconbtn svg{width:1.05em;height:1.05em;display:block}
.yo-iconbtn--sm{font-size:15px}.yo-iconbtn--md{font-size:17px}.yo-iconbtn--lg{font-size:19px}
`;
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const e = document.createElement('style');
  e.id = STYLE_ID;
  e.textContent = CSS;
  document.head.appendChild(e);
}
function IconButton({
  variant = 'ghost',
  size = 'md',
  label,
  children,
  className = '',
  ...rest
}) {
  ensureStyles();
  const cls = ['yo-iconbtn', `yo-iconbtn--${variant}`, `yo-iconbtn--${size}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    className: cls,
    "aria-label": label,
    title: label
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'yo-card-styles';
const CSS = `
.yo-card{background:var(--surface-card);border:1px solid var(--border-default);
  border-radius:var(--radius-md);box-shadow:var(--shadow-xs);
  transition:border-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard),background var(--duration-fast) var(--ease-standard);}
.yo-card--pad-sm{padding:var(--space-5)}
.yo-card--pad-md{padding:var(--space-7)}
.yo-card--pad-lg{padding:var(--space-8)}
.yo-card--pad-none{padding:0}
.yo-card--raised{box-shadow:var(--shadow-sm)}
.yo-card--interactive{cursor:pointer}
.yo-card--interactive:hover{border-color:var(--border-strong);box-shadow:var(--shadow-sm)}
.yo-card--selectable{cursor:pointer}
.yo-card--selected{border-color:var(--accent);background:var(--accent-tint);box-shadow:none}
.yo-card--selected:hover{border-color:var(--accent)}
.yo-card__head{display:flex;align-items:flex-start;gap:12px;margin-bottom:var(--space-4)}
.yo-card__head-icon{display:flex;align-items:center;justify-content:center;width:36px;height:36px;flex:none;
  border-radius:var(--radius-sm);background:var(--surface-sunken);color:var(--text-muted)}
.yo-card__head-icon svg{width:18px;height:18px}
.yo-card__head-text{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}
.yo-card__title{font-family:var(--font-display);font-size:var(--text-lg);font-weight:var(--weight-semibold);
  color:var(--text-strong);letter-spacing:var(--tracking-tight);line-height:1.2}
.yo-card__sub{font-size:var(--text-sm);color:var(--text-muted)}
`;
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const e = document.createElement('style');
  e.id = STYLE_ID;
  e.textContent = CSS;
  document.head.appendChild(e);
}
function Card({
  padding = 'md',
  raised = false,
  interactive = false,
  selectable = false,
  selected = false,
  title,
  subtitle,
  icon = null,
  headerRight = null,
  as = 'div',
  className = '',
  children,
  ...rest
}) {
  ensureStyles();
  const Tag = as;
  const cls = ['yo-card', `yo-card--pad-${padding}`, raised ? 'yo-card--raised' : '', interactive ? 'yo-card--interactive' : '', selectable ? 'yo-card--selectable' : '', selected ? 'yo-card--selected' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cls,
    "aria-pressed": selectable ? selected : undefined
  }, rest), (title || icon) && /*#__PURE__*/React.createElement("div", {
    className: "yo-card__head"
  }, icon && /*#__PURE__*/React.createElement("span", {
    className: "yo-card__head-icon"
  }, icon), /*#__PURE__*/React.createElement("span", {
    className: "yo-card__head-text"
  }, title && /*#__PURE__*/React.createElement("span", {
    className: "yo-card__title"
  }, title), subtitle && /*#__PURE__*/React.createElement("span", {
    className: "yo-card__sub"
  }, subtitle)), headerRight), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'yo-tabs-styles';
const CSS = `
.yo-tabs{display:flex;align-items:center;gap:2px;border-bottom:1px solid var(--border-default)}
.yo-tabs--pill{border-bottom:none;gap:4px;background:var(--surface-sunken);padding:3px;border-radius:var(--radius-md);display:inline-flex}
.yo-tab{appearance:none;background:transparent;border:none;cursor:pointer;font-family:var(--font-body);
  font-size:var(--text-sm);font-weight:var(--weight-medium);color:var(--text-muted);
  padding:9px 12px;position:relative;display:inline-flex;align-items:center;gap:7px;white-space:nowrap;
  transition:color var(--duration-fast) var(--ease-standard)}
.yo-tab:hover{color:var(--text-body)}
.yo-tab svg{width:15px;height:15px}
.yo-tab__count{font-family:var(--font-mono);font-size:var(--text-2xs);color:var(--text-subtle);
  background:var(--surface-sunken);border-radius:var(--radius-full);padding:1px 6px}
.yo-tab--active{color:var(--text-strong)}
.yo-tab--active::after{content:'';position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--accent);border-radius:2px}
.yo-tab:focus-visible{outline:none;box-shadow:var(--focus-ring);border-radius:var(--radius-sm)}
.yo-tabs--pill .yo-tab{border-radius:var(--radius-sm);padding:6px 14px}
.yo-tabs--pill .yo-tab--active{background:var(--surface-card);color:var(--text-strong);box-shadow:var(--shadow-xs)}
.yo-tabs--pill .yo-tab--active::after{display:none}
.yo-tabs--pill .yo-tab__count{background:var(--ink-150)}
`;
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const e = document.createElement('style');
  e.id = STYLE_ID;
  e.textContent = CSS;
  document.head.appendChild(e);
}
function Tabs({
  items = [],
  value,
  onChange,
  variant = 'underline',
  className = '',
  ...rest
}) {
  ensureStyles();
  const cls = ['yo-tabs', variant === 'pill' ? 'yo-tabs--pill' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    role: "tablist"
  }, rest), items.map(it => {
    const v = typeof it === 'string' ? it : it.value;
    const label = typeof it === 'string' ? it : it.label;
    const active = v === value;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      "aria-selected": active,
      type: "button",
      className: ['yo-tab', active ? 'yo-tab--active' : ''].filter(Boolean).join(' '),
      onClick: () => onChange && onChange(v)
    }, it.icon, label, it.count != null && /*#__PURE__*/React.createElement("span", {
      className: "yo-tab__count"
    }, it.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'yo-tag-styles';
const CSS = `
.yo-tag{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-mono);
  font-size:var(--text-2xs);font-weight:var(--weight-medium);letter-spacing:.02em;
  color:var(--text-body);background:var(--surface-sunken);border:1px solid var(--border-default);
  border-radius:var(--radius-xs);padding:3px 7px;white-space:nowrap;line-height:1.3}
.yo-tag--code{color:var(--ink-700);text-transform:uppercase}
.yo-tag--accent{color:var(--signal-700);background:var(--signal-50);border-color:var(--signal-100)}
.yo-tag svg{width:12px;height:12px}
.yo-tag__x{display:inline-flex;align-items:center;justify-content:center;cursor:pointer;
  color:var(--text-subtle);margin:-1px -2px -1px 0;border-radius:3px;padding:1px}
.yo-tag__x:hover{color:var(--text-strong);background:var(--surface-active)}
`;
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const e = document.createElement('style');
  e.id = STYLE_ID;
  e.textContent = CSS;
  document.head.appendChild(e);
}
function Tag({
  variant = 'default',
  icon = null,
  onRemove,
  className = '',
  children,
  ...rest
}) {
  ensureStyles();
  const cls = ['yo-tag', variant !== 'default' ? `yo-tag--${variant}` : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), icon, children, onRemove && /*#__PURE__*/React.createElement("span", {
    className: "yo-tag__x",
    role: "button",
    "aria-label": "Odebrat",
    onClick: onRemove
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x"
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/AgentThinking.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'yo-agentthinking-styles';
const CSS = `
.yo-think{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-body);color:var(--text-muted)}
.yo-think__dots{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);
  gap:2px;flex:none}
.yo-think__dots span{border-radius:1.5px;background:var(--accent);
  animation:yo-think-pulse 1.1s var(--ease-in-out,cubic-bezier(.65,0,.35,1)) infinite}
.yo-think--sm .yo-think__dots{width:14px;height:14px}
.yo-think--sm .yo-think__dots span{width:3px;height:3px}
.yo-think--md .yo-think__dots{width:20px;height:20px}
.yo-think--md .yo-think__dots span{width:5px;height:5px;border-radius:2px}
.yo-think--lg .yo-think__dots{width:30px;height:30px;gap:3px}
.yo-think--lg .yo-think__dots span{width:7px;height:7px;border-radius:2px}
.yo-think__dots span:nth-child(1){animation-delay:0ms}
.yo-think__dots span:nth-child(2){animation-delay:80ms}
.yo-think__dots span:nth-child(3){animation-delay:160ms}
.yo-think__dots span:nth-child(4){animation-delay:320ms}
.yo-think__dots span:nth-child(5){animation-delay:240ms}
.yo-think__dots span:nth-child(6){animation-delay:160ms}
.yo-think__dots span:nth-child(7){animation-delay:480ms}
.yo-think__dots span:nth-child(8){animation-delay:400ms}
.yo-think__dots span:nth-child(9){animation-delay:320ms}
.yo-think__label{font-size:var(--text-sm);font-weight:var(--weight-medium)}
.yo-think--lg .yo-think__label{font-size:var(--text-md)}
@keyframes yo-think-pulse{0%,100%{opacity:.2;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.yo-think__dots span{animation-duration:2.4s}}
`;
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const e = document.createElement('style');
  e.id = STYLE_ID;
  e.textContent = CSS;
  document.head.appendChild(e);
}
function AgentThinking({
  label = 'Počítám…',
  size = 'md',
  className = '',
  ...rest
}) {
  ensureStyles();
  const cls = ['yo-think', `yo-think--${size}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls,
    role: "status",
    "aria-live": "polite"
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "yo-think__dots",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)), label && /*#__PURE__*/React.createElement("span", {
    className: "yo-think__label"
  }, label));
}
Object.assign(__ds_scope, { AgentThinking });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/AgentThinking.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'yo-toast-styles';
const CSS = `
.yo-toast{display:flex;align-items:flex-start;gap:11px;background:var(--surface-card);
  border:1px solid var(--border-default);border-radius:var(--radius-md);box-shadow:var(--shadow-lg);
  padding:13px 14px;min-width:300px;max-width:420px;font-family:var(--font-body);
  position:relative;overflow:hidden}
.yo-toast::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--text-muted)}
.yo-toast--success::before{background:var(--status-success)}
.yo-toast--danger::before{background:var(--status-danger)}
.yo-toast--warning::before{background:var(--status-warning)}
.yo-toast--info::before{background:var(--accent)}
.yo-toast__icon{display:flex;align-items:center;justify-content:center;flex:none;width:20px;height:20px;margin-top:1px}
.yo-toast__icon svg{width:18px;height:18px}
.yo-toast--success .yo-toast__icon{color:var(--status-success)}
.yo-toast--danger .yo-toast__icon{color:var(--status-danger)}
.yo-toast--warning .yo-toast__icon{color:var(--status-warning)}
.yo-toast--info .yo-toast__icon{color:var(--accent)}
.yo-toast__body{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}
.yo-toast__title{font-size:var(--text-sm);font-weight:var(--weight-semibold);color:var(--text-strong)}
.yo-toast__msg{font-size:var(--text-sm);color:var(--text-muted);line-height:var(--leading-normal)}
.yo-toast__close{appearance:none;background:transparent;border:none;cursor:pointer;color:var(--text-subtle);
  padding:2px;margin:-2px -2px 0 0;border-radius:var(--radius-xs);flex:none}
.yo-toast__close:hover{color:var(--text-strong);background:var(--surface-hover)}
.yo-toast__close svg{width:15px;height:15px;display:block}
`;
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const e = document.createElement('style');
  e.id = STYLE_ID;
  e.textContent = CSS;
  document.head.appendChild(e);
}
const ICONS = {
  success: 'circle-check',
  danger: 'alert-octagon',
  warning: 'alert-triangle',
  info: 'info'
};
function Toast({
  tone = 'info',
  title,
  children,
  icon,
  onClose,
  className = '',
  ...rest
}) {
  ensureStyles();
  const cls = ['yo-toast', `yo-toast--${tone}`, className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cls,
    role: "status"
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "yo-toast__icon"
  }, icon || /*#__PURE__*/React.createElement("i", {
    "data-lucide": ICONS[tone] || 'info'
  })), /*#__PURE__*/React.createElement("div", {
    className: "yo-toast__body"
  }, title && /*#__PURE__*/React.createElement("span", {
    className: "yo-toast__title"
  }, title), children && /*#__PURE__*/React.createElement("span", {
    className: "yo-toast__msg"
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "yo-toast__close",
    "aria-label": "Zav\u0159\xEDt",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x"
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'yo-tooltip-styles';
const CSS = `
.yo-tip{position:relative;display:inline-flex}
.yo-tip__pop{position:absolute;z-index:50;left:50%;transform:translateX(-50%) translateY(4px);
  bottom:calc(100% + 8px);background:var(--ink-900);color:#fff;font-family:var(--font-body);
  font-size:var(--text-xs);font-weight:var(--weight-medium);line-height:1.4;
  padding:6px 9px;border-radius:var(--radius-sm);white-space:nowrap;pointer-events:none;
  opacity:0;transition:opacity var(--duration-fast) var(--ease-standard),transform var(--duration-fast) var(--ease-standard);
  box-shadow:var(--shadow-md);max-width:240px;white-space:normal;width:max-content}
.yo-tip:hover .yo-tip__pop,.yo-tip:focus-within .yo-tip__pop{opacity:1;transform:translateX(-50%) translateY(0)}
.yo-tip__pop::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);
  border:5px solid transparent;border-top-color:var(--ink-900)}
.yo-tip--bottom .yo-tip__pop{bottom:auto;top:calc(100% + 8px)}
.yo-tip--bottom .yo-tip__pop::after{top:auto;bottom:100%;border-top-color:transparent;border-bottom-color:var(--ink-900)}
`;
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const e = document.createElement('style');
  e.id = STYLE_ID;
  e.textContent = CSS;
  document.head.appendChild(e);
}
function Tooltip({
  label,
  side = 'top',
  className = '',
  children,
  ...rest
}) {
  ensureStyles();
  const cls = ['yo-tip', side === 'bottom' ? 'yo-tip--bottom' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cls
  }, rest), children, /*#__PURE__*/React.createElement("span", {
    className: "yo-tip__pop",
    role: "tooltip"
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'yo-checkbox-styles';
const CSS = `
.yo-check{display:inline-flex;align-items:flex-start;gap:9px;font-family:var(--font-body);
  font-size:var(--text-md);color:var(--text-body);cursor:pointer;-webkit-user-select:none;user-select:none}
.yo-check[data-disabled]{cursor:not-allowed;opacity:.5}
.yo-check__box{width:18px;height:18px;flex:none;margin-top:1px;border-radius:5px;
  border:1px solid var(--border-strong);background:var(--surface-card);
  display:inline-flex;align-items:center;justify-content:center;color:#fff;
  transition:background var(--duration-fast) var(--ease-standard),border-color var(--duration-fast) var(--ease-standard);}
.yo-check input{position:absolute;opacity:0;width:0;height:0}
.yo-check input:focus-visible + .yo-check__box{box-shadow:var(--focus-ring);border-color:var(--border-focus)}
.yo-check input:checked + .yo-check__box{background:var(--accent);border-color:var(--accent)}
.yo-check__box svg{width:13px;height:13px;opacity:0;transform:scale(.7);transition:opacity var(--duration-fast),transform var(--duration-fast)}
.yo-check input:checked + .yo-check__box svg{opacity:1;transform:scale(1)}
.yo-check__body{display:flex;flex-direction:column;gap:2px}
.yo-check__desc{font-size:var(--text-sm);color:var(--text-muted)}
`;
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const e = document.createElement('style');
  e.id = STYLE_ID;
  e.textContent = CSS;
  document.head.appendChild(e);
}
function Checkbox({
  label,
  description,
  checked,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("label", {
    className: ['yo-check', className].filter(Boolean).join(' '),
    "data-disabled": disabled ? '' : undefined,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    checked: checked,
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "yo-check__box"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check"
  })), (label || description || children) && /*#__PURE__*/React.createElement("span", {
    className: "yo-check__body"
  }, label && /*#__PURE__*/React.createElement("span", null, label), children, description && /*#__PURE__*/React.createElement("span", {
    className: "yo-check__desc"
  }, description)));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'yo-input-styles';
const CSS = `
.yo-field{display:flex;flex-direction:column;gap:6px;font-family:var(--font-body)}
.yo-field__label{font-size:var(--text-sm);font-weight:var(--weight-medium);color:var(--text-body)}
.yo-field__req{color:var(--status-danger);margin-left:2px}
.yo-field__hint{font-size:var(--text-xs);color:var(--text-muted)}
.yo-field__err{font-size:var(--text-xs);color:var(--status-danger)}
.yo-input-wrap{position:relative;display:flex;align-items:center}
.yo-input{width:100%;font-family:var(--font-body);font-size:var(--text-md);color:var(--text-strong);
  background:var(--surface-card);border:1px solid var(--border-default);border-radius:var(--radius-sm);
  height:var(--control-md);padding:0 12px;transition:border-color var(--duration-fast) var(--ease-standard),
  box-shadow var(--duration-fast) var(--ease-standard);}
.yo-input::placeholder{color:var(--text-subtle)}
.yo-input:hover:not(:disabled):not([data-invalid]){border-color:var(--border-strong)}
.yo-input:focus{outline:none;border-color:var(--border-focus);box-shadow:var(--focus-ring)}
.yo-input:disabled{background:var(--surface-sunken);color:var(--text-subtle);cursor:not-allowed}
.yo-input[data-invalid]{border-color:var(--status-danger)}
.yo-input[data-invalid]:focus{box-shadow:0 0 0 3px var(--red-100)}
.yo-input--sm{height:var(--control-sm);font-size:var(--text-sm);padding:0 10px}
.yo-input--lg{height:var(--control-lg);font-size:var(--text-lg);padding:0 14px}
.yo-input--mono{font-family:var(--font-mono);font-size:var(--text-sm)}
.yo-input--hasL{padding-left:36px}.yo-input--hasR{padding-right:36px}
.yo-input__icon{position:absolute;display:flex;align-items:center;justify-content:center;
  color:var(--text-subtle);pointer-events:none;width:36px;height:100%}
.yo-input__icon svg{width:16px;height:16px}
.yo-input__icon--l{left:0}.yo-input__icon--r{right:0}
`;
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const e = document.createElement('style');
  e.id = STYLE_ID;
  e.textContent = CSS;
  document.head.appendChild(e);
}
function Input({
  label,
  hint,
  error,
  required = false,
  size = 'md',
  mono = false,
  iconLeft = null,
  iconRight = null,
  id,
  className = '',
  style = {},
  ...rest
}) {
  ensureStyles();
  const fid = id || (label ? 'yo-in-' + Math.random().toString(36).slice(2, 7) : undefined);
  const cls = ['yo-input', size !== 'md' ? `yo-input--${size}` : '', mono ? 'yo-input--mono' : '', iconLeft ? 'yo-input--hasL' : '', iconRight ? 'yo-input--hasR' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/React.createElement("div", {
    className: "yo-field",
    style: style
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "yo-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "yo-field__req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "yo-input-wrap"
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    className: "yo-input__icon yo-input__icon--l"
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: fid,
    className: cls,
    "data-invalid": error ? '' : undefined,
    "aria-invalid": !!error
  }, rest)), iconRight && /*#__PURE__*/React.createElement("span", {
    className: "yo-input__icon yo-input__icon--r"
  }, iconRight)), error ? /*#__PURE__*/React.createElement("span", {
    className: "yo-field__err"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "yo-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'yo-select-styles';
const CSS = `
.yo-select-wrap{position:relative;display:flex;align-items:center}
.yo-select{width:100%;font-family:var(--font-body);font-size:var(--text-md);color:var(--text-strong);
  background:var(--surface-card);border:1px solid var(--border-default);border-radius:var(--radius-sm);
  height:var(--control-md);padding:0 36px 0 12px;cursor:pointer;appearance:none;-webkit-appearance:none;
  transition:border-color var(--duration-fast) var(--ease-standard),box-shadow var(--duration-fast) var(--ease-standard);}
.yo-select:hover:not(:disabled){border-color:var(--border-strong)}
.yo-select:focus{outline:none;border-color:var(--border-focus);box-shadow:var(--focus-ring)}
.yo-select:disabled{background:var(--surface-sunken);color:var(--text-subtle);cursor:not-allowed}
.yo-select--sm{height:var(--control-sm);font-size:var(--text-sm)}
.yo-select--lg{height:var(--control-lg);font-size:var(--text-lg)}
.yo-select[data-placeholder]{color:var(--text-subtle)}
.yo-select__chev{position:absolute;right:10px;display:flex;align-items:center;pointer-events:none;color:var(--text-muted)}
.yo-select__chev svg{width:16px;height:16px}
`;
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const e = document.createElement('style');
  e.id = STYLE_ID;
  e.textContent = CSS;
  document.head.appendChild(e);
}
function Select({
  label,
  hint,
  error,
  required = false,
  size = 'md',
  placeholder,
  options = [],
  value,
  id,
  className = '',
  style = {},
  children,
  ...rest
}) {
  ensureStyles();
  const fid = id || (label ? 'yo-se-' + Math.random().toString(36).slice(2, 7) : undefined);
  const cls = ['yo-select', size !== 'md' ? `yo-select--${size}` : '', className].filter(Boolean).join(' ');
  const isPh = placeholder && (value === '' || value == null);
  return /*#__PURE__*/React.createElement("div", {
    className: "yo-field",
    style: style
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "yo-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "yo-field__req"
  }, "*")), /*#__PURE__*/React.createElement("div", {
    className: "yo-select-wrap"
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: fid,
    className: cls,
    value: value,
    "data-placeholder": isPh ? '' : undefined,
    "aria-invalid": !!error
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label)), children), /*#__PURE__*/React.createElement("span", {
    className: "yo-select__chev"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "chevron-down"
  }))), error ? /*#__PURE__*/React.createElement("span", {
    className: "yo-field__err"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "yo-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'yo-switch-styles';
const CSS = `
.yo-switch{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-body);
  font-size:var(--text-md);color:var(--text-body);cursor:pointer;-webkit-user-select:none;user-select:none}
.yo-switch[data-disabled]{cursor:not-allowed;opacity:.5}
.yo-switch input{position:absolute;opacity:0;width:0;height:0}
.yo-switch__track{width:36px;height:20px;flex:none;border-radius:var(--radius-full);
  background:var(--ink-300);position:relative;transition:background var(--duration-base) var(--ease-standard)}
.yo-switch__thumb{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;
  background:#fff;box-shadow:var(--shadow-sm);transition:transform var(--duration-base) var(--ease-out)}
.yo-switch input:checked + .yo-switch__track{background:var(--accent)}
.yo-switch input:checked + .yo-switch__track .yo-switch__thumb{transform:translateX(16px)}
.yo-switch input:focus-visible + .yo-switch__track{box-shadow:var(--focus-ring)}
`;
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const e = document.createElement('style');
  e.id = STYLE_ID;
  e.textContent = CSS;
  document.head.appendChild(e);
}
function Switch({
  label,
  checked,
  disabled = false,
  className = '',
  ...rest
}) {
  ensureStyles();
  return /*#__PURE__*/React.createElement("label", {
    className: ['yo-switch', className].filter(Boolean).join(' '),
    "data-disabled": disabled ? '' : undefined,
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    role: "switch",
    checked: checked,
    disabled: disabled
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "yo-switch__track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "yo-switch__thumb"
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STYLE_ID = 'yo-textarea-styles';
const CSS = `
.yo-textarea{width:100%;font-family:var(--font-body);font-size:var(--text-md);color:var(--text-strong);
  background:var(--surface-card);border:1px solid var(--border-default);border-radius:var(--radius-sm);
  padding:10px 12px;line-height:var(--leading-normal);resize:vertical;min-height:84px;
  transition:border-color var(--duration-fast) var(--ease-standard),box-shadow var(--duration-fast) var(--ease-standard);}
.yo-textarea::placeholder{color:var(--text-subtle)}
.yo-textarea:hover:not(:disabled):not([data-invalid]){border-color:var(--border-strong)}
.yo-textarea:focus{outline:none;border-color:var(--border-focus);box-shadow:var(--focus-ring)}
.yo-textarea:disabled{background:var(--surface-sunken);color:var(--text-subtle);cursor:not-allowed}
.yo-textarea[data-invalid]{border-color:var(--status-danger)}
`;
function ensureStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const e = document.createElement('style');
  e.id = STYLE_ID;
  e.textContent = CSS;
  document.head.appendChild(e);
}
function Textarea({
  label,
  hint,
  error,
  required = false,
  id,
  rows = 4,
  className = '',
  style = {},
  ...rest
}) {
  ensureStyles();
  const fid = id || (label ? 'yo-ta-' + Math.random().toString(36).slice(2, 7) : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: "yo-field",
    style: style
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "yo-field__label",
    htmlFor: fid
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "yo-field__req"
  }, "*")), /*#__PURE__*/React.createElement("textarea", _extends({
    id: fid,
    rows: rows,
    className: ['yo-textarea', className].filter(Boolean).join(' '),
    "data-invalid": error ? '' : undefined,
    "aria-invalid": !!error
  }, rest)), error ? /*#__PURE__*/React.createElement("span", {
    className: "yo-field__err"
  }, error) : hint ? /*#__PURE__*/React.createElement("span", {
    className: "yo-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppShell.jsx
try { (() => {
/* global React */
(function () {
  const {
    Avatar,
    IconButton,
    Tooltip
  } = window.YearOneDesignSystem_5121e2;
  const SHELL_CSS = `
.yo-app{display:grid;grid-template-columns:248px 1fr;height:100%;min-height:100vh;background:var(--surface-page);color:var(--text-body)}
.yo-side{display:flex;flex-direction:column;background:var(--surface-card);border-right:1px solid var(--border-default)}
.yo-side__brand{display:flex;align-items:center;gap:10px;padding:18px 18px 14px}
.yo-side__brand img{height:26px;display:block}
.yo-side__co{margin:4px 14px 14px;padding:11px 12px;border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--surface-page)}
.yo-side__co-name{font-family:var(--font-display);font-weight:600;font-size:var(--text-sm);color:var(--text-strong);letter-spacing:-.01em}
.yo-side__co-meta{font-family:var(--font-mono);font-size:11px;color:var(--text-muted);margin-top:3px}
.yo-nav{display:flex;flex-direction:column;gap:2px;padding:6px 10px;flex:1}
.yo-nav__sec{font-family:var(--font-mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--text-subtle);padding:14px 10px 6px}
.yo-nav__item{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:var(--radius-sm);cursor:pointer;
  font-size:var(--text-sm);font-weight:var(--weight-medium);color:var(--text-muted);border:none;background:transparent;width:100%;text-align:left;
  transition:background var(--duration-fast) var(--ease-standard),color var(--duration-fast) var(--ease-standard)}
.yo-nav__item:hover{background:var(--surface-hover);color:var(--text-strong)}
.yo-nav__item--active{background:var(--accent-tint);color:var(--accent-active)}
.yo-nav__item svg{width:17px;height:17px;flex:none}
.yo-nav__count{margin-left:auto;font-family:var(--font-mono);font-size:11px;color:var(--text-subtle)}
.yo-nav__item--active .yo-nav__count{color:var(--accent)}
.yo-side__foot{display:flex;align-items:center;gap:10px;padding:12px 16px;border-top:1px solid var(--border-default)}
.yo-side__foot-name{font-size:var(--text-sm);font-weight:var(--weight-medium);color:var(--text-strong)}
.yo-side__foot-mail{font-size:var(--text-xs);color:var(--text-muted)}
.yo-main{display:flex;flex-direction:column;min-width:0;overflow:hidden}
.yo-top{display:flex;align-items:center;gap:14px;padding:14px 28px;border-bottom:1px solid var(--border-default);background:color-mix(in srgb,var(--surface-card) 80%,transparent);backdrop-filter:blur(8px);position:sticky;top:0;z-index:10}
.yo-top__title{font-family:var(--font-display);font-size:var(--text-xl);font-weight:600;color:var(--text-strong);letter-spacing:-.015em}
.yo-top__sub{font-size:var(--text-sm);color:var(--text-muted);margin-top:1px}
.yo-top__actions{margin-left:auto;display:flex;align-items:center;gap:8px}
.yo-content{flex:1;overflow:auto;padding:28px}
.yo-content__inner{max-width:var(--container-lg);margin:0 auto}
`;
  function ensureShell() {
    if (document.getElementById('yo-shell-css')) return;
    const e = document.createElement('style');
    e.id = 'yo-shell-css';
    e.textContent = SHELL_CSS;
    document.head.appendChild(e);
  }
  function NavItem({
    icon,
    label,
    active,
    count,
    onClick
  }) {
    return /*#__PURE__*/React.createElement("button", {
      className: 'yo-nav__item' + (active ? ' yo-nav__item--active' : ''),
      onClick: onClick
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": icon
    }), label, count != null && /*#__PURE__*/React.createElement("span", {
      className: "yo-nav__count"
    }, count));
  }
  function AppShell({
    co,
    view,
    setView,
    title,
    subtitle,
    actions,
    children
  }) {
    ensureShell();
    return /*#__PURE__*/React.createElement("div", {
      className: "yo-app"
    }, /*#__PURE__*/React.createElement("aside", {
      className: "yo-side"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-side__brand"
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/yearone-wordmark.svg",
      alt: "YearOne"
    })), /*#__PURE__*/React.createElement("div", {
      className: "yo-side__co"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-side__co-name"
    }, co.name), /*#__PURE__*/React.createElement("div", {
      className: "yo-side__co-meta"
    }, "I\u010CO ", co.ico, " \xB7 ", co.form)), /*#__PURE__*/React.createElement("nav", {
      className: "yo-nav"
    }, /*#__PURE__*/React.createElement(NavItem, {
      icon: "layout-grid",
      label: "Pl\xE1n",
      active: view === 'plan',
      count: 7,
      onClick: () => setView('plan')
    }), /*#__PURE__*/React.createElement(NavItem, {
      icon: "calendar-clock",
      label: "Timeline",
      active: view === 'timeline',
      onClick: () => setView('timeline')
    }), /*#__PURE__*/React.createElement(NavItem, {
      icon: "git-branch",
      label: "Co kdy\u017E",
      active: view === 'whatif',
      onClick: () => setView('whatif')
    }), /*#__PURE__*/React.createElement("div", {
      className: "yo-nav__sec"
    }, "Firma"), /*#__PURE__*/React.createElement(NavItem, {
      icon: "building-2",
      label: "Profil firmy",
      onClick: () => setView('canvas')
    }), /*#__PURE__*/React.createElement(NavItem, {
      icon: "bell",
      label: "Upozorn\u011Bn\xED",
      count: 2
    }), /*#__PURE__*/React.createElement(NavItem, {
      icon: "settings",
      label: "Nastaven\xED"
    })), /*#__PURE__*/React.createElement("div", {
      className: "yo-side__foot"
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "Jan Nov\xE1k",
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "yo-side__foot-name"
    }, "Jan Nov\xE1k"), /*#__PURE__*/React.createElement("div", {
      className: "yo-side__foot-mail"
    }, "jednatel")))), /*#__PURE__*/React.createElement("main", {
      className: "yo-main"
    }, /*#__PURE__*/React.createElement("header", {
      className: "yo-top"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "yo-top__title"
    }, title), subtitle && /*#__PURE__*/React.createElement("div", {
      className: "yo-top__sub"
    }, subtitle)), /*#__PURE__*/React.createElement("div", {
      className: "yo-top__actions"
    }, /*#__PURE__*/React.createElement(Tooltip, {
      label: "N\xE1pov\u011Bda"
    }, /*#__PURE__*/React.createElement(IconButton, {
      variant: "ghost",
      label: "N\xE1pov\u011Bda"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "help-circle"
    }))), actions)), /*#__PURE__*/React.createElement("div", {
      className: "yo-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-content__inner"
    }, children))));
  }
  window.AppShell = AppShell;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/GuidanceCanvas.jsx
try { (() => {
/* global React */
(function () {
  const {
    Card,
    Input,
    Select,
    Checkbox,
    Switch,
    Button,
    Tag,
    Badge
  } = window.YearOneDesignSystem_5121e2;
  const CANVAS_CSS = `
.yo-canvas__intro{display:flex;align-items:flex-start;gap:14px;margin-bottom:22px}
.yo-canvas__intro-icon{width:40px;height:40px;border-radius:var(--radius-md);background:var(--accent-tint);color:var(--accent);display:flex;align-items:center;justify-content:center;flex:none}
.yo-canvas__intro-icon svg{width:20px;height:20px}
.yo-canvas__intro h2{font-size:var(--text-2xl);margin-bottom:4px}
.yo-canvas__intro p{color:var(--text-muted);font-size:var(--text-md);max-width:60ch}
.yo-canvas__grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.yo-canvas__card-label{display:flex;align-items:center;gap:9px;font-family:var(--font-display);font-weight:600;font-size:var(--text-md);color:var(--text-strong);margin-bottom:14px}
.yo-canvas__card-label svg{width:17px;height:17px;color:var(--text-muted)}
.yo-canvas__chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}
.yo-canvas__chip{cursor:pointer;font-size:var(--text-sm);font-family:var(--font-body);padding:6px 11px;border-radius:var(--radius-full);
  border:1px solid var(--border-default);background:var(--surface-card);color:var(--text-body);transition:all var(--duration-fast) var(--ease-standard)}
.yo-canvas__chip:hover{border-color:var(--border-strong)}
.yo-canvas__chip--on{background:var(--accent-tint);border-color:var(--accent);color:var(--accent-active);font-weight:var(--weight-medium)}
.yo-canvas__bar{position:sticky;bottom:0;margin-top:24px;display:flex;align-items:center;gap:14px;padding:16px 20px;
  background:var(--surface-card);border:1px solid var(--border-default);border-radius:var(--radius-lg);box-shadow:var(--shadow-md)}
.yo-canvas__bar-text{font-size:var(--text-sm);color:var(--text-muted)}
.yo-canvas__bar-text b{color:var(--text-strong);font-weight:var(--weight-semibold)}
.yo-canvas__full{grid-column:1 / -1}
`;
  function ensureCanvas() {
    if (document.getElementById('yo-canvas-css')) return;
    const e = document.createElement('style');
    e.id = 'yo-canvas-css';
    e.textContent = CANVAS_CSS;
    document.head.appendChild(e);
  }
  function Chips({
    options,
    value,
    onToggle,
    multi
  }) {
    return /*#__PURE__*/React.createElement("div", {
      className: "yo-canvas__chips"
    }, options.map(o => {
      const on = multi ? value.includes(o) : value === o;
      return /*#__PURE__*/React.createElement("button", {
        key: o,
        className: 'yo-canvas__chip' + (on ? ' yo-canvas__chip--on' : ''),
        onClick: () => onToggle(o)
      }, o);
    }));
  }
  function GuidanceCanvas({
    onBuild
  }) {
    ensureCanvas();
    const [field, setField] = React.useState('Webové a grafické služby');
    const [regions, setRegions] = React.useState(['Praha']);
    const [form, setForm] = React.useState('sro');
    const [turnover, setTurnover] = React.useState('1 800 000');
    const [employees, setEmployees] = React.useState(true);
    const [premises, setPremises] = React.useState(false);
    const toggleRegion = r => setRegions(p => p.includes(r) ? p.filter(x => x !== r) : [...p, r]);
    const filled = 5;
    return /*#__PURE__*/React.createElement("div", {
      className: "yo-canvas"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-canvas__intro"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-canvas__intro-icon"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "layout-grid"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "Sestavte model sv\xE9 firmy"), /*#__PURE__*/React.createElement("p", null, "Vypl\u0148te karty n\xED\u017Ee. YearOne pak s\xE1m dohled\xE1 \xFAdaje v registrech, klasifikuje \u017Eivnost a odvod\xED va\u0161e povinnosti."))), /*#__PURE__*/React.createElement("div", {
      className: "yo-canvas__grid"
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "md"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-canvas__card-label"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "briefcase"
    }), "Co bude firma d\u011Blat?"), /*#__PURE__*/React.createElement(Input, {
      value: field,
      onChange: e => setField(e.target.value),
      placeholder: "Hlavn\xED \u010Dinnost"
    }), /*#__PURE__*/React.createElement(Chips, {
      multi: false,
      value: field,
      onToggle: setField,
      options: ['Webové a grafické služby', 'Poradenství', 'E-shop', 'Doprava', 'Hostinská činnost']
    })), /*#__PURE__*/React.createElement(Card, {
      padding: "md"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-canvas__card-label"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "map-pin"
    }), "Kde bude p\u016Fsobit?"), /*#__PURE__*/React.createElement(Chips, {
      multi: true,
      value: regions,
      onToggle: toggleRegion,
      options: ['Praha', 'Brno', 'Ostrava', 'Plzeň', 'Celá ČR', 'EU']
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement(Checkbox, {
      label: "Bude m\xEDt provozovnu",
      checked: premises,
      onChange: e => setPremises(e.target.checked)
    }))), /*#__PURE__*/React.createElement(Card, {
      padding: "md"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-canvas__card-label"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "scale"
    }), "Pr\xE1vn\xED forma"), /*#__PURE__*/React.createElement(Select, {
      value: form,
      onChange: e => setForm(e.target.value),
      options: [{
        value: 'sro',
        label: 's.r.o.'
      }, {
        value: 'osvc',
        label: 'OSVČ'
      }, {
        value: 'as',
        label: 'a.s.'
      }, {
        value: 'vos',
        label: 'v.o.s.'
      }]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        display: 'flex',
        gap: 7,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Tag, {
      variant: "code"
    }, "DPPO"), /*#__PURE__*/React.createElement(Tag, {
      variant: "code"
    }, "DATOVA_SCHRANKA"), /*#__PURE__*/React.createElement(Tag, {
      variant: "accent",
      icon: /*#__PURE__*/React.createElement("i", {
        "data-lucide": "git-branch"
      })
    }, "odvozeno z formy"))), /*#__PURE__*/React.createElement(Card, {
      padding: "md"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-canvas__card-label"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "users"
    }), "Kdo a kolik?"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 13
      }
    }, /*#__PURE__*/React.createElement(Switch, {
      label: "Pl\xE1nuji zam\u011Bstnance",
      checked: employees,
      onChange: e => setEmployees(e.target.checked)
    }), /*#__PURE__*/React.createElement(Input, {
      label: "O\u010Dek\xE1van\xFD ro\u010Dn\xED obrat",
      mono: true,
      value: turnover,
      onChange: e => setTurnover(e.target.value),
      iconRight: /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--text-muted)'
        }
      }, "K\u010D"),
      hint: "Hl\xEDd\xE1me limit pro povinnou registraci k DPH"
    })))), /*#__PURE__*/React.createElement("div", {
      className: "yo-canvas__bar"
    }, /*#__PURE__*/React.createElement("span", {
      className: "yo-canvas__bar-text"
    }, /*#__PURE__*/React.createElement("b", null, filled, " z 6"), " karet vypln\u011Bno \xB7 zbytek dohled\xE1 agent"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      iconRight: /*#__PURE__*/React.createElement("i", {
        "data-lucide": "arrow-right"
      }),
      onClick: onBuild
    }, "Sestavit pl\xE1n"))));
  }
  window.GuidanceCanvas = GuidanceCanvas;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/GuidanceCanvas.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/PlanView.jsx
try { (() => {
/* global React */
(function () {
  const {
    Card,
    Badge,
    Tag,
    Button,
    Tabs,
    AgentThinking,
    Avatar
  } = window.YearOneDesignSystem_5121e2;
  const PLAN_CSS = `
.yo-plan{display:grid;grid-template-columns:260px 1fr;gap:24px;align-items:start}
.yo-plan__rail{position:sticky;top:18px;display:flex;flex-direction:column;gap:14px}
.yo-rail__row{display:flex;justify-content:space-between;gap:10px;font-size:var(--text-sm);padding:7px 0;border-bottom:1px solid var(--border-subtle)}
.yo-rail__row:last-child{border-bottom:none}
.yo-rail__k{color:var(--text-muted)}
.yo-rail__v{color:var(--text-strong);font-weight:var(--weight-medium);text-align:right}
.yo-rail__v--mono{font-family:var(--font-mono);font-size:12px}
.yo-plan__main{min-width:0;display:flex;flex-direction:column;gap:18px}
.yo-plan__head{display:flex;align-items:center;gap:14px}
.yo-plan__stats{display:flex;gap:10px;margin-left:auto}
.yo-stat{text-align:right}
.yo-stat__n{font-family:var(--font-display);font-size:var(--text-2xl);font-weight:600;color:var(--text-strong);line-height:1}
.yo-stat__l{font-size:11px;color:var(--text-muted);font-family:var(--font-mono);letter-spacing:.04em;text-transform:uppercase}
.yo-oblsec__h{font-family:var(--font-mono);font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:var(--text-subtle);margin:6px 0 8px}
.yo-obl{display:flex;align-items:flex-start;gap:13px;padding:14px 16px;border:1px solid var(--border-default);border-radius:var(--radius-md);background:var(--surface-card);margin-bottom:8px;box-shadow:var(--shadow-xs)}
.yo-obl--hidden{border-color:var(--signal-200);background:var(--signal-50)}
.yo-obl__status{width:22px;height:22px;flex:none;margin-top:1px;display:flex;align-items:center;justify-content:center}
.yo-obl__status svg{width:19px;height:19px}
.yo-obl__status--done{color:var(--status-success)}
.yo-obl__status--todo{color:var(--text-subtle)}
.yo-obl__status--confirm{color:var(--accent)}
.yo-obl__status--watch{color:var(--status-warning)}
.yo-obl__body{flex:1;min-width:0}
.yo-obl__top{display:flex;align-items:center;gap:9px;flex-wrap:wrap}
.yo-obl__title{font-weight:var(--weight-semibold);font-size:var(--text-md);color:var(--text-strong)}
.yo-obl__why{font-size:var(--text-sm);color:var(--text-muted);margin-top:4px;line-height:var(--leading-normal)}
.yo-obl__hiddentag{display:inline-flex;align-items:center;gap:5px;font-size:var(--text-xs);font-weight:var(--weight-medium);color:var(--signal-700);margin-top:7px}
.yo-obl__hiddentag svg{width:13px;height:13px}
.yo-obl__meta{display:flex;flex-direction:column;align-items:flex-end;gap:7px;flex:none}
.yo-obl__due{font-size:var(--text-xs);color:var(--text-muted);font-family:var(--font-mono);white-space:nowrap}
/* timeline */
.yo-tl{position:relative;padding-left:30px}
.yo-tl::before{content:'';position:absolute;left:9px;top:6px;bottom:6px;width:2px;background:var(--border-default)}
.yo-tl__node{position:relative;margin-bottom:18px}
.yo-tl__dot{position:absolute;left:-30px;top:2px;width:20px;height:20px;border-radius:50%;background:var(--surface-card);border:2px solid var(--border-strong);display:flex;align-items:center;justify-content:center}
.yo-tl__dot svg{width:11px;height:11px;color:var(--text-muted)}
.yo-tl__dot--done{border-color:var(--status-success);color:var(--status-success)}
.yo-tl__dot--done svg{color:var(--status-success)}
.yo-tl__dot--active{border-color:var(--accent);box-shadow:0 0 0 4px var(--accent-tint)}
.yo-tl__dot--active svg{color:var(--accent)}
.yo-tl__when{font-family:var(--font-mono);font-size:11px;color:var(--text-subtle);letter-spacing:.03em}
.yo-tl__card{margin-top:5px}
/* pipeline */
.yo-pipe{max-width:520px;margin:40px auto;display:flex;flex-direction:column;gap:6px}
.yo-pipe__h{display:flex;align-items:center;gap:12px;margin-bottom:18px}
.yo-pipe__step{display:flex;align-items:center;gap:13px;padding:13px 15px;border-radius:var(--radius-md);border:1px solid transparent;transition:all var(--duration-base) var(--ease-standard)}
.yo-pipe__step--active{background:var(--surface-card);border-color:var(--border-default);box-shadow:var(--shadow-sm)}
.yo-pipe__step--done{opacity:.55}
.yo-pipe__ic{width:30px;height:30px;border-radius:var(--radius-sm);flex:none;display:flex;align-items:center;justify-content:center;background:var(--surface-sunken);color:var(--text-muted)}
.yo-pipe__step--active .yo-pipe__ic{background:var(--accent-tint);color:var(--accent)}
.yo-pipe__step--done .yo-pipe__ic{background:var(--green-50);color:var(--status-success)}
.yo-pipe__ic svg{width:16px;height:16px}
.yo-pipe__lbl{font-size:var(--text-md);font-weight:var(--weight-medium);color:var(--text-body);flex:1}
.yo-pipe__step--active .yo-pipe__lbl{color:var(--text-strong)}
.yo-pipe__chk{color:var(--status-success)}
.yo-pipe__chk svg{width:17px;height:17px;display:block}
`;
  function ensurePlan() {
    if (document.getElementById('yo-plan-css')) return;
    const e = document.createElement('style');
    e.id = 'yo-plan-css';
    e.textContent = PLAN_CSS;
    document.head.appendChild(e);
  }
  const STATUS_ICON = {
    done: 'circle-check',
    todo: 'circle-dashed',
    confirm: 'help-circle',
    watch: 'eye'
  };
  const STATUS_BADGE = {
    done: ['success', 'Splněno'],
    todo: ['neutral', 'K vyřízení'],
    confirm: ['info', 'K potvrzení'],
    watch: ['warning', 'Hlídáme']
  };
  function Obligation({
    o
  }) {
    const [b1, b2] = STATUS_BADGE[o.status];
    return /*#__PURE__*/React.createElement("div", {
      className: 'yo-obl' + (o.hidden ? ' yo-obl--hidden' : '')
    }, /*#__PURE__*/React.createElement("span", {
      className: 'yo-obl__status yo-obl__status--' + o.status
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": STATUS_ICON[o.status]
    })), /*#__PURE__*/React.createElement("div", {
      className: "yo-obl__body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-obl__top"
    }, /*#__PURE__*/React.createElement("span", {
      className: "yo-obl__title"
    }, o.title), /*#__PURE__*/React.createElement(Tag, {
      variant: "code"
    }, o.code), o.source === 'agent' && /*#__PURE__*/React.createElement(Badge, {
      tone: "info",
      size: "sm",
      icon: /*#__PURE__*/React.createElement("i", {
        "data-lucide": "search-check"
      })
    }, "Dohled\xE1no")), /*#__PURE__*/React.createElement("div", {
      className: "yo-obl__why"
    }, o.why), o.hidden && /*#__PURE__*/React.createElement("span", {
      className: "yo-obl__hiddentag"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "lightbulb"
    }), "Na tohle se \u010Dasto zapom\xEDn\xE1")), /*#__PURE__*/React.createElement("div", {
      className: "yo-obl__meta"
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: b1,
      dot: o.status === 'watch'
    }, b2), /*#__PURE__*/React.createElement("span", {
      className: "yo-obl__due"
    }, o.due), o.status === 'confirm' && /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary"
    }, "Potvrdit")));
  }
  function PlanView({
    co,
    obligations,
    mode
  }) {
    ensurePlan();
    const groups = obligations.reduce((m, o) => {
      (m[o.cat] = m[o.cat] || []).push(o);
      return m;
    }, {});
    const counts = {
      done: obligations.filter(o => o.status === 'done').length,
      confirm: obligations.filter(o => o.status === 'confirm').length,
      hidden: obligations.filter(o => o.hidden).length
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "yo-plan"
    }, /*#__PURE__*/React.createElement("aside", {
      className: "yo-plan__rail"
    }, /*#__PURE__*/React.createElement(Card, {
      padding: "sm",
      title: "Profil firmy",
      icon: /*#__PURE__*/React.createElement("i", {
        "data-lucide": "building-2"
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-rail__row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "yo-rail__k"
    }, "I\u010CO"), /*#__PURE__*/React.createElement("span", {
      className: "yo-rail__v yo-rail__v--mono"
    }, co.ico)), /*#__PURE__*/React.createElement("div", {
      className: "yo-rail__row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "yo-rail__k"
    }, "Forma"), /*#__PURE__*/React.createElement("span", {
      className: "yo-rail__v"
    }, co.form)), /*#__PURE__*/React.createElement("div", {
      className: "yo-rail__row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "yo-rail__k"
    }, "Obor"), /*#__PURE__*/React.createElement("span", {
      className: "yo-rail__v"
    }, co.field)), /*#__PURE__*/React.createElement("div", {
      className: "yo-rail__row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "yo-rail__k"
    }, "S\xEDdlo"), /*#__PURE__*/React.createElement("span", {
      className: "yo-rail__v"
    }, co.seat)), /*#__PURE__*/React.createElement("div", {
      className: "yo-rail__row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "yo-rail__k"
    }, "Obrat"), /*#__PURE__*/React.createElement("span", {
      className: "yo-rail__v yo-rail__v--mono"
    }, co.turnover)), /*#__PURE__*/React.createElement("div", {
      className: "yo-rail__row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "yo-rail__k"
    }, "Zam\u011Bstnanci"), /*#__PURE__*/React.createElement("span", {
      className: "yo-rail__v"
    }, co.employees ? 'Ano' : 'Ne')))), /*#__PURE__*/React.createElement(Card, {
      padding: "sm"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 9
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      agent: true,
      size: "sm"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: 'var(--text-muted)',
        lineHeight: 1.4
      }
    }, "Pl\xE1n hl\xEDd\xE1m pr\u016Fb\u011B\u017En\u011B. P\u0159i zm\u011Bn\u011B firmy upozorn\xEDm.")))), /*#__PURE__*/React.createElement("div", {
      className: "yo-plan__main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-plan__head"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 'var(--text-2xl)'
      }
    }, mode === 'timeline' ? 'Timeline prvního roku' : 'Plán povinností'), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        fontSize: 14,
        marginTop: 2
      }
    }, "Personalizov\xE1no pro ", co.name)), /*#__PURE__*/React.createElement("div", {
      className: "yo-plan__stats"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-stat"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-stat__n"
    }, counts.confirm), /*#__PURE__*/React.createElement("div", {
      className: "yo-stat__l"
    }, "k potvrzen\xED")), /*#__PURE__*/React.createElement("div", {
      className: "yo-stat"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-stat__n"
    }, counts.hidden), /*#__PURE__*/React.createElement("div", {
      className: "yo-stat__l"
    }, "skryt\xFDch")), /*#__PURE__*/React.createElement("div", {
      className: "yo-stat"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-stat__n"
    }, counts.done), /*#__PURE__*/React.createElement("div", {
      className: "yo-stat__l"
    }, "hotovo")))), mode === 'timeline' ? /*#__PURE__*/React.createElement("div", {
      className: "yo-tl"
    }, obligations.map((o, i) => /*#__PURE__*/React.createElement("div", {
      className: "yo-tl__node",
      key: o.code
    }, /*#__PURE__*/React.createElement("span", {
      className: 'yo-tl__dot ' + (o.status === 'done' ? 'yo-tl__dot--done' : i === 2 ? 'yo-tl__dot--active' : '')
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": o.status === 'done' ? 'check' : 'circle'
    })), /*#__PURE__*/React.createElement("div", {
      className: "yo-tl__when"
    }, o.due), /*#__PURE__*/React.createElement("div", {
      className: "yo-tl__card"
    }, /*#__PURE__*/React.createElement(Obligation, {
      o: o
    }))))) : Object.entries(groups).map(([cat, list]) => /*#__PURE__*/React.createElement("div", {
      key: cat
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-oblsec__h"
    }, cat), list.map(o => /*#__PURE__*/React.createElement(Obligation, {
      key: o.code,
      o: o
    }))))));
  }
  function Pipeline({
    step,
    steps
  }) {
    ensurePlan();
    return /*#__PURE__*/React.createElement("div", {
      className: "yo-pipe"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-pipe__h"
    }, /*#__PURE__*/React.createElement(AgentThinking, {
      size: "lg",
      label: "YearOne sestavuje v\xE1\u0161 pl\xE1n\u2026"
    })), steps.map((s, i) => {
      const state = i < step ? 'done' : i === step ? 'active' : '';
      return /*#__PURE__*/React.createElement("div", {
        key: s.id,
        className: 'yo-pipe__step' + (state ? ' yo-pipe__step--' + state : '')
      }, /*#__PURE__*/React.createElement("span", {
        className: "yo-pipe__ic"
      }, /*#__PURE__*/React.createElement("i", {
        "data-lucide": s.icon
      })), /*#__PURE__*/React.createElement("span", {
        className: "yo-pipe__lbl"
      }, s.label), i < step && /*#__PURE__*/React.createElement("span", {
        className: "yo-pipe__chk"
      }, /*#__PURE__*/React.createElement("i", {
        "data-lucide": "check"
      })));
    }));
  }
  window.PlanView = PlanView;
  window.Pipeline = Pipeline;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/PlanView.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/WhatIf.jsx
try { (() => {
/* global React */
(function () {
  const {
    Card,
    Badge,
    Tag,
    Button,
    Textarea,
    AgentThinking
  } = window.YearOneDesignSystem_5121e2;
  const WI_CSS = `
.yo-wi__intro{margin-bottom:20px}
.yo-wi__intro h2{font-size:var(--text-2xl)}
.yo-wi__intro p{color:var(--text-muted);font-size:var(--text-md);margin-top:3px;max-width:62ch}
.yo-wi__cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px}
.yo-wi__scn{display:flex;align-items:center;gap:11px;padding:14px;cursor:pointer}
.yo-wi__scn-ic{width:34px;height:34px;border-radius:var(--radius-sm);flex:none;display:flex;align-items:center;justify-content:center;background:var(--surface-sunken);color:var(--text-muted)}
.yo-wi__scn-ic svg{width:18px;height:18px}
.yo-wi__scn-lbl{font-size:var(--text-sm);font-weight:var(--weight-medium);color:var(--text-strong);line-height:1.3}
.yo-wi__ask{display:flex;gap:10px;align-items:flex-end}
.yo-wi__ask > div:first-child{flex:1}
/* diff */
.yo-diff{margin-top:22px;display:grid;grid-template-columns:1fr;gap:16px}
.yo-diff__head{display:flex;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid var(--border-default)}
.yo-diff__head h3{font-size:var(--text-xl)}
.yo-diff__cols{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.yo-diff__col-h{display:flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--text-subtle);margin-bottom:10px}
.yo-diff__col-h svg{width:14px;height:14px}
.yo-diff__item{display:flex;align-items:flex-start;gap:10px;padding:11px 13px;border-radius:var(--radius-sm);margin-bottom:8px;border:1px solid var(--border-default);background:var(--surface-card)}
.yo-diff__item--add{border-color:var(--green-100);background:var(--green-50)}
.yo-diff__item-ic{flex:none;margin-top:1px}
.yo-diff__item-ic svg{width:16px;height:16px;color:var(--status-success)}
.yo-diff__item-body{flex:1}
.yo-diff__item-t{font-size:var(--text-sm);font-weight:var(--weight-medium);color:var(--text-strong);display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.yo-diff__item-d{font-size:var(--text-xs);color:var(--text-muted);font-family:var(--font-mono);margin-top:3px}
.yo-diff__q{display:flex;align-items:center;gap:9px;font-size:var(--text-sm);color:var(--text-body);padding:8px 0}
.yo-diff__q svg{width:15px;height:15px;color:var(--accent);flex:none}
.yo-diff__impact{display:flex;gap:18px;align-items:center;flex-wrap:wrap}
.yo-diff__metric{display:flex;flex-direction:column;gap:2px}
.yo-diff__metric-l{font-size:11px;font-family:var(--font-mono);letter-spacing:.04em;text-transform:uppercase;color:var(--text-subtle)}
.yo-diff__metric-v{font-family:var(--font-display);font-size:var(--text-lg);font-weight:600;color:var(--text-strong)}
.yo-diff__actions{display:flex;gap:10px;margin-top:6px;padding-top:16px;border-top:1px solid var(--border-default)}
.yo-wi__empty{margin-top:20px;text-align:center;padding:40px;color:var(--text-muted)}
`;
  function ensureWI() {
    if (document.getElementById('yo-wi-css')) return;
    const e = document.createElement('style');
    e.id = 'yo-wi-css';
    e.textContent = WI_CSS;
    document.head.appendChild(e);
  }
  function WhatIf({
    scenarios,
    diffData
  }) {
    ensureWI();
    const [state, setState] = React.useState('idle'); // idle | thinking | result
    const [picked, setPicked] = React.useState(null);
    const diff = diffData.vat;
    const run = id => {
      setPicked(id);
      setState('thinking');
      setTimeout(() => setState('result'), 1700);
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "yo-wi"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-wi__intro"
    }, /*#__PURE__*/React.createElement("h2", null, "Co kdy\u017E se firma zm\u011Bn\xED?"), /*#__PURE__*/React.createElement("p", null, "Vyberte sc\xE9n\xE1\u0159 nebo se zeptejte vlastn\xEDmi slovy. Agent vytvo\u0159\xED kopii pl\xE1nu, zm\u011Bn\xED jeden parametr a uk\xE1\u017Ee rozd\xEDl. Nic se neulo\u017E\xED, dokud nepotvrd\xEDte.")), /*#__PURE__*/React.createElement("div", {
      className: "yo-wi__cards"
    }, scenarios.map(s => /*#__PURE__*/React.createElement(Card, {
      key: s.id,
      selectable: true,
      selected: picked === s.id,
      interactive: true,
      className: "yo-wi__scn",
      padding: "none",
      onClick: () => run(s.id)
    }, /*#__PURE__*/React.createElement("span", {
      className: "yo-wi__scn-ic"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": s.icon
    })), /*#__PURE__*/React.createElement("span", {
      className: "yo-wi__scn-lbl"
    }, s.label)))), /*#__PURE__*/React.createElement("div", {
      className: "yo-wi__ask"
    }, /*#__PURE__*/React.createElement(Textarea, {
      label: "Nebo se zeptejte voln\u011B",
      rows: 1,
      placeholder: "Co kdy\u017E za 3 m\u011Bs\xEDce p\u0159ijmu brig\xE1dn\xEDka v Brn\u011B?"
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      iconLeft: /*#__PURE__*/React.createElement("i", {
        "data-lucide": "git-branch"
      }),
      onClick: () => run('vat')
    }, "Simulovat")), state === 'thinking' && /*#__PURE__*/React.createElement("div", {
      className: "yo-wi__empty"
    }, /*#__PURE__*/React.createElement(AgentThinking, {
      size: "lg",
      label: "P\u0159epo\u010D\xEDt\xE1v\xE1m povinnosti pro sc\xE9n\xE1\u0159\u2026"
    })), state === 'result' && /*#__PURE__*/React.createElement(Card, {
      padding: "md",
      className: "yo-diff",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-diff__head"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 8,
        background: 'var(--accent-tint)',
        color: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "git-branch"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("h3", null, diff.title), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        fontSize: 13,
        marginTop: 1
      }
    }, "Simulace \u2014 porovn\xE1n\xED s aktu\xE1ln\xEDm pl\xE1nem")), /*#__PURE__*/React.createElement(Badge, {
      tone: "warning",
      icon: /*#__PURE__*/React.createElement("i", {
        "data-lucide": "trending-up"
      })
    }, "Slo\u017Eitost ", diff.complexity)), /*#__PURE__*/React.createElement("div", {
      style: {
        margin: '18px 0'
      },
      className: "yo-diff__cols"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "yo-diff__col-h"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "plus-circle"
    }), "Nov\xE9 povinnosti"), diff.added.map(a => /*#__PURE__*/React.createElement("div", {
      className: "yo-diff__item yo-diff__item--add",
      key: a.code
    }, /*#__PURE__*/React.createElement("span", {
      className: "yo-diff__item-ic"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "circle-plus"
    })), /*#__PURE__*/React.createElement("div", {
      className: "yo-diff__item-body"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-diff__item-t"
    }, a.title, /*#__PURE__*/React.createElement(Tag, {
      variant: "code"
    }, a.code)), /*#__PURE__*/React.createElement("div", {
      className: "yo-diff__item-d"
    }, a.due))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "yo-diff__col-h"
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "help-circle"
    }), "Nov\xE9 ot\xE1zky pro v\xE1s"), diff.questions.map((q, i) => /*#__PURE__*/React.createElement("div", {
      className: "yo-diff__q",
      key: i
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "message-circle-question"
    }), q)), /*#__PURE__*/React.createElement("div", {
      className: "yo-diff__col-h",
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("i", {
      "data-lucide": "activity"
    }), "Dopad"), /*#__PURE__*/React.createElement("div", {
      className: "yo-diff__impact"
    }, /*#__PURE__*/React.createElement("div", {
      className: "yo-diff__metric"
    }, /*#__PURE__*/React.createElement("span", {
      className: "yo-diff__metric-l"
    }, "Povinnosti"), /*#__PURE__*/React.createElement("span", {
      className: "yo-diff__metric-v",
      style: {
        color: 'var(--status-success)'
      }
    }, "+", diff.added.length)), /*#__PURE__*/React.createElement("div", {
      className: "yo-diff__metric"
    }, /*#__PURE__*/React.createElement("span", {
      className: "yo-diff__metric-l"
    }, "Timeline"), /*#__PURE__*/React.createElement("span", {
      className: "yo-diff__metric-v"
    }, "3 nov\xE9 term\xEDny")), /*#__PURE__*/React.createElement("div", {
      className: "yo-diff__metric"
    }, /*#__PURE__*/React.createElement("span", {
      className: "yo-diff__metric-l"
    }, "Slo\u017Eitost"), /*#__PURE__*/React.createElement("span", {
      className: "yo-diff__metric-v"
    }, diff.complexity))))), /*#__PURE__*/React.createElement("div", {
      className: "yo-diff__actions"
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      iconLeft: /*#__PURE__*/React.createElement("i", {
        "data-lucide": "check"
      })
    }, "P\u0159idat do pl\xE1nu"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => {
        setState('idle');
        setPicked(null);
      }
    }, "Zahodit sc\xE9n\xE1\u0159"))));
  }
  window.WhatIf = WhatIf;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/WhatIf.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
// YearOne — UI kit demo data (fake, for the click-through recreation)
window.YO_DATA = {
  company: {
    name: 'Novák Studio s.r.o.',
    ico: '21 488 302',
    form: 's.r.o.',
    field: 'Grafické a webové služby',
    seat: 'Praha 7',
    turnover: '1 800 000 Kč',
    employees: true,
    premises: false
  },
  pipeline: [{
    id: 'intent',
    label: 'Načítám záměr firmy',
    icon: 'file-text'
  }, {
    id: 'ares',
    label: 'Dohledávám údaje v ARES',
    icon: 'search'
  }, {
    id: 'zivnost',
    label: 'Klasifikuji živnost',
    icon: 'scale'
  }, {
    id: 'obligations',
    label: 'Odvozuji povinnosti',
    icon: 'list-checks'
  }, {
    id: 'timeline',
    label: 'Sestavuji timeline',
    icon: 'calendar-clock'
  }, {
    id: 'triggers',
    label: 'Plánuji budoucí triggery',
    icon: 'git-branch'
  }],
  obligations: [{
    code: 'SIDLO_OZNACENI',
    title: 'Označení sídla firmy',
    cat: 'Při založení',
    due: 'do 14. 4. 2025',
    status: 'done',
    hidden: false,
    why: 'Každá s.r.o. musí viditelně označit své sídlo názvem a IČO.',
    source: 'ares'
  }, {
    code: 'SKUTECNI_MAJITELE',
    title: 'Zápis skutečných majitelů',
    cat: 'Při založení',
    due: 'do 30. 4. 2025',
    status: 'todo',
    hidden: true,
    why: 'Evidence skutečných majitelů je povinná pro všechny s.r.o. Na tohle se často zapomíná.',
    source: 'agent'
  }, {
    code: 'DATOVA_SCHRANKA',
    title: 'Aktivace datové schránky',
    cat: 'Při založení',
    due: 'splněno',
    status: 'done',
    hidden: false,
    why: 'Zřizuje se automaticky, je třeba ji aktivovat a sledovat.',
    source: 'ares'
  }, {
    code: 'DPPO',
    title: 'Registrace k dani z příjmů PO',
    cat: 'Při založení',
    due: 'do 15. 5. 2025',
    status: 'confirm',
    hidden: false,
    why: 'Daň z příjmů právnických osob — registrace u finančního úřadu.',
    source: 'agent'
  }, {
    code: 'ZAM_CSSZ',
    title: 'Přihlášení na ČSSZ',
    cat: 'Po přijetí zaměstnance',
    due: 'do 8 dnů od nástupu',
    status: 'todo',
    hidden: false,
    why: 'Plánujete zaměstnance — vzniká povinnost registrace u správy sociálního zabezpečení.',
    source: 'agent'
  }, {
    code: 'ZAM_ZP',
    title: 'Přihlášení u zdravotní pojišťovny',
    cat: 'Po přijetí zaměstnance',
    due: 'do 8 dnů od nástupu',
    status: 'todo',
    hidden: false,
    why: 'Souběžná povinnost při zaměstnávání — zdravotní pojištění zaměstnance.',
    source: 'agent'
  }, {
    code: 'DPH',
    title: 'Sledování limitu pro DPH',
    cat: 'Budoucí trigger',
    due: 'při obratu nad limit',
    status: 'watch',
    hidden: true,
    why: 'Obrat se blíží limitu. Při překročení vzniká povinná registrace k DPH do 15 dnů.',
    source: 'agent'
  }],
  scenarios: [{
    id: 'emp',
    label: 'Přijmu prvního zaměstnance',
    icon: 'user-plus'
  }, {
    id: 'vat',
    label: 'Překročím DPH limit',
    icon: 'trending-up'
  }, {
    id: 'premises',
    label: 'Otevřu provozovnu',
    icon: 'store'
  }, {
    id: 'field',
    label: 'Změním obor podnikání',
    icon: 'shuffle'
  }, {
    id: 'partner',
    label: 'Přidám společníka',
    icon: 'users'
  }, {
    id: 'regulated',
    label: 'Přidám regulovanou živnost',
    icon: 'shield-alert'
  }],
  whatifDiff: {
    vat: {
      title: 'Co když překročím limit pro DPH?',
      complexity: '+1 stupeň',
      added: [{
        code: 'DPH',
        title: 'Registrace k DPH',
        due: 'do 15 dnů od překročení'
      }, {
        code: 'DPH_PRIZNANI',
        title: 'Měsíční přiznání k DPH',
        due: 'opakovaně do 25. dne'
      }, {
        code: 'KONTROLNI_HLASENI',
        title: 'Kontrolní hlášení',
        due: 'opakovaně měsíčně'
      }],
      removed: [],
      questions: ['Budete fakturovat i do EU?', 'Vedete účetnictví sami, nebo přes účetní?']
    }
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.AgentThinking = __ds_scope.AgentThinking;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

})();
