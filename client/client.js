window.__ModuleLoader__.load({ id: "dsh-auto-chat-titles", factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/styles.ts
		const STYLE_ID = "dsh-auto-chat-titles/styles";
		const styles = `.dact-action{border:1px solid var(--dsw-alias-border-l2);height:32px;color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer;background:transparent;border-radius:18px;display:inline-flex;align-items:center;gap:6px;padding:5px 12px;font-size:13px;line-height:20px}
.dact-action:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.dact-action:focus-visible,.dact-card-header:focus-visible,.dact-input:focus-visible,.dact-button:focus-visible,.dact-card summary:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
.dact-action:disabled{color:var(--dsw-alias-label-dimmed);cursor:wait}
.dact-spin{width:12px;height:12px;border:2px solid currentColor;border-right-color:transparent;border-radius:50%;animation:dact-spin .7s linear infinite}
@keyframes dact-spin{to{transform:rotate(360deg)}}
.dact-card{box-sizing:border-box;width:100%;color:var(--dsw-alias-label-primary);list-style:none;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-3);transition:border-color .16s,background .16s}
.dact-card:hover{border-color:var(--dsw-alias-label-dimmed)}
.dact-card[data-open=true]{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-label-dimmed)}
.dact-card-header{appearance:none;box-sizing:border-box;width:100%;border:0;border-radius:12px;background:transparent;color:inherit;display:flex;align-items:center;gap:12px;padding:14px 16px;text-align:left;font:inherit;cursor:pointer}
.dact-card-head{display:flex;min-width:0;flex:1;flex-direction:column;gap:4px}
.dact-card-name{color:var(--dsw-alias-label-primary);font-size:15px;line-height:1.4;font-weight:600}
.dact-card-description{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.5}
.dact-card-chevron{width:16px;height:16px;color:var(--dsw-alias-label-tertiary);flex:none;transition:transform .16s}
.dact-card[data-open=true] .dact-card-chevron{transform:rotate(180deg)}
.dact-card-body{border-top:1px solid var(--dsw-alias-border-l2);margin:0 16px;padding:4px 0 8px}
.dact-card p{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:1.5;margin:12px 0}
.dact-field{display:flex;flex-direction:column;gap:7px;padding:12px 0}
.dact-field+.dact-field{border-top:1px solid var(--dsw-alias-border-l2)}
.dact-label{display:flex;flex-direction:column;gap:2px;color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500;line-height:1.5}
.dact-label small{color:var(--dsw-alias-label-tertiary);font-size:12px;font-weight:400;line-height:1.5}
.dact-input{box-sizing:border-box;width:100%;height:34px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);padding:0 12px;font:inherit;font-size:13px;line-height:1.5}
.dact-input:focus{border-color:var(--dsw-alias-brand-primary)}
.dact-input:disabled{cursor:default;opacity:.45}
.dact-card details{border-top:1px solid var(--dsw-alias-border-l2)}
.dact-card summary{border-radius:6px;cursor:pointer;color:var(--dsw-alias-label-secondary);padding:12px 0;font-size:12px;font-weight:600;line-height:1.5;text-transform:uppercase;letter-spacing:.04em}
.dact-card details[open] summary{border-bottom:1px solid var(--dsw-alias-border-l2);margin-bottom:0}
.dact-message{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:1.5}
.dact-message[data-kind=error]{color:var(--dsw-alias-label-error)}
.dact-message[data-kind=success]{color:var(--dsw-alias-state-success-primary)}
.dact-footer{border-top:1px solid var(--dsw-alias-border-l2);display:flex;justify-content:flex-end;align-items:center;gap:8px;padding:12px 0 4px}
.dact-footer-copy{display:flex;min-width:0;flex:1;flex-direction:column;gap:2px}
.dact-status{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:1.5}
.dact-status[data-kind=error]{color:var(--dsw-alias-label-error)}
.dact-status[data-kind=success]{color:var(--dsw-alias-state-success-primary)}
.dact-button{appearance:none;font:inherit;cursor:pointer;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;color:var(--dsw-alias-label-secondary);padding:5px 14px;font-size:13px;line-height:1.5}
.dact-button:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}
.dact-button:disabled{opacity:.4;cursor:default}
`;
		//#endregion
		//#region src/client/index.tsx
		const PLUGIN_ID = "dsh-auto-chat-titles";
		const NS = "auto-chat-titles";
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
			tag.textContent = styles;
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
			const snapshot = (0, react.useSyncExternalStore)((listener) => settings.subscribe(listener), () => settings.getSnapshot(), () => settings.getSnapshot());
			const current = snapshot.value;
			const [groups, setGroups] = (0, react.useState)([]);
			const [catalogFailures, setCatalogFailures] = (0, react.useState)([]);
			const [status, setStatus] = (0, react.useState)({
				kind: "idle",
				text: ""
			});
			const [open, setOpen] = (0, react.useState)(false);
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
			if (snapshot.status === "unavailable") return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: "dact-card",
				"data-open": open,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "dact-card-header",
					"aria-expanded": open,
					"aria-label": `${open ? "Collapse" : "Expand"}: Automatic chat titles`,
					onClick: () => setOpen((value) => !value),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: "dact-card-head",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dact-card-name",
							children: "Automatic chat titles"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: "dact-card-description",
							children: "Generate semantic titles automatically, with configurable model and regeneration context."
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
						className: "dact-card-chevron",
						viewBox: "0 0 20 20",
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
							d: "m5 7.5 5 5 5-5",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "1.7",
							strokeLinecap: "round",
							strokeLinejoin: "round"
						})
					})]
				}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "dact-card-body",
					children: snapshot.status === "loading" || current === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "Loading title settings…" }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dact-fields",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dact-field",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: "dact-label",
										htmlFor: "dact-route",
										children: ["Title model", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Follow the chat model or choose a dedicated inexpensive model." })]
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
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
									})]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dact-field",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: "dact-label",
										htmlFor: "dact-words",
										children: ["Title length", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Target words for non-CJK languages." })]
									}), numberField("targetWords", 5, 1, 20, "dact-words")]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dact-field",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: "dact-label",
										htmlFor: "dact-messages",
										children: ["Regeneration context", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Recent human messages used by Regenerate title." })]
									}), numberField("maxMessages", 12, 1, 100, "dact-messages")]
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: "Advanced generation limits" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dact-fields",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dact-field",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: "dact-label",
										htmlFor: "dact-cjk",
										children: ["CJK title characters", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Target title length for CJK languages." })]
									}), numberField("targetCjkCharacters", 10, 1, 40, "dact-cjk")]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dact-field",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: "dact-label",
										htmlFor: "dact-input-bytes",
										children: ["Maximum input bytes", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Bound the conversation context sent for title generation." })]
									}), numberField("maxInputBytes", 8192, 256, 65536, "dact-input-bytes")]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dact-field",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: "dact-label",
										htmlFor: "dact-output-tokens",
										children: ["Maximum output tokens", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Bound the title model response." })]
									}), numberField("maxOutputTokens", 64, 8, 256, "dact-output-tokens")]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: "dact-field",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: "dact-label",
										htmlFor: "dact-timeout",
										children: ["Timeout", /* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: "Maximum generation time in milliseconds." })]
									}), numberField("timeoutMs", 6e4, 1e3, 3e5, "dact-timeout")]
								})
							]
						})] }),
						catalogFailures.length > 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("p", {
							className: "dact-message",
							"data-kind": "error",
							children: ["Some model catalogs could not load: ", catalogFailures.join("; ")]
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: "dact-footer",
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: "dact-footer-copy",
								children: [status.text ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dact-status",
									"data-kind": status.kind,
									children: status.text
								}) : null, !snapshot.writable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: "dact-status",
									children: "Settings are read-only in this runtime."
								}) : null]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
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
							})]
						})
					] })
				}) : null]
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