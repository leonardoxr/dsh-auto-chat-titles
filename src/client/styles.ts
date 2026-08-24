export const STYLE_ID = 'dsh-auto-chat-titles/styles'

export const styles = `.dact-action{border:1px solid var(--dsw-alias-border-l2);height:32px;color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer;background:transparent;border-radius:18px;display:inline-flex;align-items:center;gap:6px;padding:5px 12px;font-size:13px;line-height:20px}
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
.dact-field{display:flex;flex-direction:column;gap:6px;padding:12px 0}
.dact-field+.dact-field{border-top:1px solid var(--dsw-alias-border-l2)}
.dact-label{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500;line-height:1.5}
.dact-hint{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;line-height:1.5}
.dact-input{box-sizing:border-box;width:100%;height:34px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);padding:0 12px;font:inherit;font-size:13px;line-height:1.5}
.dact-input:focus{border-color:var(--dsw-alias-brand-primary)}
.dact-input:disabled{color:var(--dsw-alias-label-tertiary);cursor:default}
.dact-card details{border-top:1px solid var(--dsw-alias-border-l2)}
.dact-card summary{border-radius:6px;cursor:pointer;color:var(--dsw-alias-label-secondary);padding:12px 0;font-size:13px;font-weight:500;line-height:1.5}
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
`
