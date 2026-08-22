window.__ModuleLoader__.load({ id: "dsh-auto-chat-titles", factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/index.tsx
		const PLUGIN_ID = "dsh-auto-chat-titles";
		const NS = "auto-chat-titles";
		const STYLE_ID = "dsh-auto-chat-titles/styles";
		const inject = [
			"slots",
			"sessions",
			"connection",
			"settingsScope"
		];
		function decodeSettings(value) {
			if (typeof value !== "object" || value === null) return void 0;
			const item = value;
			if (item.routeMode !== "conversation" && item.routeMode !== "fixed") return void 0;
			if ([
				item.targetWords,
				item.targetCjkCharacters,
				item.maxInputBytes,
				item.maxOutputTokens,
				item.timeoutMs,
				item.maxMessages
			].some((number) => typeof number !== "number" || !Number.isFinite(number))) return void 0;
			return item;
		}
		function installStyles() {
			document.querySelector(`style[data-plugin-css="${STYLE_ID}"]`)?.remove();
			const tag = document.createElement("style");
			tag.dataset.plugin = PLUGIN_ID;
			tag.dataset.pluginCss = STYLE_ID;
			tag.textContent = `
    .dact-action{border:1px solid var(--dsw-alias-border-l2);height:32px;color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer;background:transparent;border-radius:18px;display:inline-flex;align-items:center;gap:6px;padding:5px 12px;font-size:13px;line-height:20px}
    .dact-action:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
    .dact-action:disabled{color:var(--dsw-alias-label-dimmed);cursor:wait}
    .dact-spin{width:12px;height:12px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:dact-spin .7s linear infinite}
    @keyframes dact-spin{to{transform:rotate(360deg)}}
    .dact-card{max-width:720px;color:var(--dsw-alias-label-primary);display:flex;flex-direction:column;gap:14px;padding:4px 0}
    .dact-card h3{font-size:16px;line-height:24px;margin:0;font-weight:600}
    .dact-card p{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:20px;margin:0}
    .dact-grid{display:grid;grid-template-columns:minmax(150px,220px) minmax(220px,1fr);gap:12px 18px;align-items:center}
    .dact-label{display:flex;flex-direction:column;gap:2px;font-size:14px}
    .dact-label small{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
    .dact-input{box-sizing:border-box;width:100%;min-height:36px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);padding:6px 10px;font:inherit}
    .dact-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .dact-button{border:1px solid var(--dsw-alias-border-l2);border-radius:18px;background:transparent;color:var(--dsw-alias-label-primary);padding:7px 14px;font:inherit;cursor:pointer}
    .dact-button:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
    .dact-status{font-size:12px;line-height:18px;color:var(--dsw-alias-label-tertiary)}
    .dact-status[data-kind="error"]{color:var(--dsw-alias-state-error-primary)}
    .dact-status[data-kind="success"]{color:var(--dsw-alias-state-success-primary)}
    .dact-card details{border-top:1px solid var(--dsw-alias-border-l3);padding-top:12px}
    .dact-card summary{cursor:pointer;font-size:13px;color:var(--dsw-alias-label-secondary);margin-bottom:12px}
    @media(max-width:640px){.dact-grid{grid-template-columns:1fr;gap:6px}.dact-grid>.dact-input{margin-bottom:8px}}
  `;
			document.head.appendChild(tag);
			return () => tag.remove();
		}
		function RegenerateAction({ sessionId, regenerate }) {
			const [busy, setBusy] = (0, react.useState)(false);
			const [label, setLabel] = (0, react.useState)("Regenerate title");
			async function run() {
				if (busy) return;
				setBusy(true);
				setLabel("Regenerating…");
				try {
					await regenerate(sessionId);
					setLabel("Request submitted — check activity");
					window.setTimeout(() => setLabel("Regenerate title"), 1800);
				} catch (error) {
					setLabel(error instanceof Error ? error.message : "Regeneration failed");
					window.setTimeout(() => setLabel("Regenerate title"), 3500);
				} finally {
					setBusy(false);
				}
			}
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "dact-action",
				disabled: busy,
				"aria-busy": busy,
				title: label,
				onClick: run,
				children: [busy ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: "dact-spin",
					"aria-hidden": "true"
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					"aria-hidden": "true",
					children: "↻"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: label })]
			});
		}
		function SettingsCard({ settings, loadModels }) {
			const snapshot = (0, react.useSyncExternalStore)(settings.subscribe, settings.getSnapshot, settings.getSnapshot);
			const current = snapshot.value;
			const [groups, setGroups] = (0, react.useState)([]);
			const [catalogFailures, setCatalogFailures] = (0, react.useState)([]);
			const [status, setStatus] = (0, react.useState)({
				kind: "idle",
				text: ""
			});
			(0, react.useEffect)(() => {
				let active = true;
				loadModels().then((result) => {
					if (!active) return;
					setGroups(result.groups);
					setCatalogFailures(result.failures);
				}).catch((error) => {
					if (!active) return;
					setCatalogFailures([error instanceof Error ? error.message : String(error)]);
				});
				return () => {
					active = false;
				};
			}, [loadModels]);
			const routeValue = current?.routeMode === "fixed" && current.provider && current.model ? `${current.provider}\u0000${current.model}` : "conversation";
			const knownRoutes = (0, react.useMemo)(() => new Set(groups.flatMap((group) => group.models.map((model) => `${group.id}\u0000${model.id}`))), [groups]);
			async function save(task) {
				setStatus({
					kind: "saving",
					text: "Saving…"
				});
				try {
					await task();
					setStatus({
						kind: "success",
						text: "Saved"
					});
					window.setTimeout(() => setStatus((value) => value.kind === "success" ? {
						kind: "idle",
						text: ""
					} : value), 1800);
				} catch (error) {
					setStatus({
						kind: "error",
						text: error instanceof Error ? error.message : String(error)
					});
				}
			}
			async function chooseRoute(value) {
				await save(async () => {
					if (value === "conversation") {
						await settings.set("routeMode", "conversation");
						return;
					}
					const [provider, model] = value.split("\0");
					await settings.set("routeMode", "conversation");
					await settings.set("provider", provider);
					await settings.set("model", model);
					await settings.set("routeMode", "fixed");
				});
			}
			function numberField(field, fallback, min, max, id) {
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
					id,
					className: "dact-input",
					type: "number",
					min,
					max,
					defaultValue: String(current?.[field] ?? fallback),
					disabled: !snapshot.writable,
					onBlur: (event) => {
						const input = event.currentTarget;
						const accepted = current?.[field] ?? fallback;
						const value = Number(input.value);
						if (!Number.isSafeInteger(value) || value < min || value > max) {
							input.value = String(accepted);
							setStatus({
								kind: "error",
								text: `Enter a whole number from ${min} to ${max}.`
							});
							return;
						}
						if (value === current?.[field]) {
							input.value = String(accepted);
							return;
						}
						save(() => settings.set(field, value));
					}
				}, `${field}:${current?.[field] ?? fallback}`);
			}
			if (snapshot.status === "loading") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: "dact-card",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "Loading title settings…" })
			});
			if (snapshot.status === "unavailable" || current === void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dact-card",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "Automatic chat titles" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "The host title-settings namespace is unavailable. Confirm that the host plugin is enabled." })]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "dact-card",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: "Automatic chat titles" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "Generate semantic titles automatically from the first prompt, then regenerate from recent conversation context whenever needed." })] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dact-grid",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: "dact-label",
								htmlFor: "dact-route",
								children: ["Title model", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Follow the chat model or choose a dedicated inexpensive model." })]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
								id: "dact-route",
								className: "dact-input",
								value: routeValue,
								disabled: !snapshot.writable,
								onChange: (event) => void chooseRoute(event.currentTarget.value),
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "conversation",
										children: "Same as conversation"
									}),
									routeValue !== "conversation" && !knownRoutes.has(routeValue) ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
										value: routeValue,
										children: [
											current.provider,
											" / ",
											current.model,
											" (unlisted)"
										]
									}) : null,
									groups.map((group) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("optgroup", {
										label: group.name,
										children: group.models.map((model) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
											value: `${group.id}\u0000${model.id}`,
											children: model.name
										}, model.id))
									}, group.id))
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: "dact-label",
								htmlFor: "dact-words",
								children: ["Title length", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Target words for non-CJK languages." })]
							}),
							numberField("targetWords", 5, 1, 20, "dact-words"),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: "dact-label",
								htmlFor: "dact-messages",
								children: ["Regeneration context", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Recent human messages used by Regenerate title." })]
							}),
							numberField("maxMessages", 12, 1, 100, "dact-messages")
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "Advanced generation limits" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dact-grid",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dact-label",
								children: "CJK title characters"
							}),
							numberField("targetCjkCharacters", 10, 1, 40),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dact-label",
								children: "Maximum input bytes"
							}),
							numberField("maxInputBytes", 8192, 256, 65536),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dact-label",
								children: "Maximum output tokens"
							}),
							numberField("maxOutputTokens", 64, 8, 256),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dact-label",
								children: "Timeout (milliseconds)"
							}),
							numberField("timeoutMs", 6e4, 1e3, 3e5)
						]
					})] }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "dact-row",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: "dact-button",
								type: "button",
								disabled: !snapshot.writable,
								onClick: () => void save(async () => {
									for (const field of [
										"routeMode",
										"provider",
										"model",
										"targetWords",
										"targetCjkCharacters",
										"maxInputBytes",
										"maxOutputTokens",
										"timeoutMs",
										"maxMessages"
									]) await settings.unset(field);
								}),
								children: "Reset defaults"
							}),
							status.text ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dact-status",
								"data-kind": status.kind,
								children: status.text
							}) : null,
							!snapshot.writable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: "dact-status",
								children: "Settings are read-only in this runtime."
							}) : null
						]
					}),
					catalogFailures.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
						className: "dact-status",
						"data-kind": "error",
						children: ["Some model catalogs could not load: ", catalogFailures.join("; ")]
					}) : null
				]
			});
		}
		function apply(ctx) {
			ctx.effect(installStyles, "auto-chat-titles: styles");
			ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register({
				name: "conversation.session.header.actions",
				id: "auto-chat-titles-regenerate",
				order: 100,
				label: () => "Regenerate title",
				inject: () => ({ regenerate: async (sessionId) => {
					const scoped = ctx.sessions.scope(sessionId);
					const session = scoped === void 0 ? void 0 : ctx.sessions.sessionOf(scoped);
					if (session === void 0) throw new Error("Session is not available");
					const result = await session.command("/regenerate-title");
					if (!result.ok) throw new Error(result.error.message);
					if (!result.value.matched) throw new Error("Regenerate-title command is unavailable");
				} })
			}, RegenerateAction));
			const api = ctx.get("connection").api;
			const loadModels = async () => {
				const response = await api.llm.models({});
				if (!response.result.ok) throw new Error(response.result.error.message);
				return {
					groups: response.result.value.groups,
					failures: response.result.value.failures.map((failure) => `${failure.name}: ${failure.message}`)
				};
			};
			ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
				name: "settings.plugin.item",
				key: NS,
				inject: () => ({
					settings: ctx.settingsScope.bind({
						namespace: NS,
						decode: decodeSettings
					}),
					loadModels
				})
			}, SettingsCard));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map