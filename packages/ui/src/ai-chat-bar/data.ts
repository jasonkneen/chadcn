// Showcase catalog labels for the picker UI. Not a connected model or app API.
export const models = [
    { id: "kimi-k3", name: "Kimi K3", effort: "High", efforts: ["Low", "Medium", "High", "Max"], mark: "K" },
    { id: "gpt-56-terra", name: "GPT-5.6 Terra", effort: "Medium", efforts: ["Low", "Medium", "High", "Max"], mark: "✳" },
    { id: "gpt-56-sol", name: "GPT-5.6 Sol", effort: "Medium", efforts: ["Low", "Medium", "High", "Max"], mark: "✳" },
    { id: "sonnet-5", name: "Sonnet 5", effort: "High", efforts: ["Medium", "High", "Max"], mark: "✴" },
    { id: "opus-48", name: "Opus 4.8", effort: "High", efforts: ["Medium", "High", "Max"], mark: "✴" },
    { id: "fable-5", name: "Fable 5", effort: "High", efforts: ["Medium", "High", "Max"], mark: "✴" },
];
export const apps = ["Anthropic", "Spacelift", "GitHub", "ClickUp", "Cloudflare", "Slack"];
export const flows = ["Incident escalation", "Drift auto-remediation", "Prod deploy approvals", "Nightly cost report", "Stale stack cleanup", "Jira ticket from failed run", "Secrets rotation", "Onboard new engineer", "Weekly compliance export", "Ephemeral env self-service"];
export const blocks = ["HTTP Endpoint", "Transform", "Condition", "Explode", "Collect", "Schedule", "Sleep", "Memory", "MCP Tool", "Error"];
export const appActions: Record<string, string[]> = {
    Slack: ["Create channel", "Invite users to channel", "Get channel info", "Send message blocks", "Send text message"],
    GitHub: ["Create issue", "Open pull request", "Review pull request", "Merge pull request", "Get repository info"],
    Spacelift: ["Trigger stack run", "Confirm pending run", "Get stack status", "Create new stack", "Discard failed run"],
    Anthropic: ["Draft a prompt", "Summarize thread", "Generate code snippet", "Classify feedback", "Extract action items"],
    ClickUp: ["Create task", "Assign task to member", "Add comment to task", "Set task due date", "Get task status"],
    Cloudflare: ["Purge zone cache", "Create DNS record", "Get zone analytics", "Toggle maintenance mode", "Block IP address"]
};
