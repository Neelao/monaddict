// ─── constants.js ─────────────────────────────────────────────────────────────
// Shared mock chain state + helper utilities.
// Swap INITIAL_STATE actions with contract calls when wiring to Monad.

export const MOCK_ACCOUNT = "0xdEaD...BeEF";

export const INITIAL_STATE = {
  account: MOCK_ACCOUNT,
  friends: [
    { address: "0xAlice111", ens: "alice.eth", since: Date.now() - 86400000 * 12 },
    { address: "0xBob2222",  ens: "bob.eth",   since: Date.now() - 86400000 * 3  },
  ],
  pendingRequests: [
    { address: "0xCarol333", ens: "carol.eth" },
  ],
  groups: [
    {
      id: "g1",
      name: "Builders Sprint",
      description: "Ship fast or pay up",
      creator: MOCK_ACCOUNT,
      members: [MOCK_ACCOUNT, "0xAlice111", "0xBob2222"],
      isPrivate: true,
      createdAt: Date.now() - 86400000 * 5,
    },
  ],
  goals: [
    {
      id: "goal1",
      owner: MOCK_ACCOUNT,
      groupId: "g1",
      title: "Deploy GoalPool to mainnet",
      description: "Full audit + deploy by EoM",
      deadline: Date.now() + 86400000 * 8,
      completedAt: null,
      verified: false,
      verifiedBy: [],
    },
    {
      id: "goal2",
      owner: "0xAlice111",
      groupId: "g1",
      title: "Write 3 blog posts",
      description: "Ship content for the launch",
      deadline: Date.now() + 86400000 * 14,
      completedAt: null,
      verified: false,
      verifiedBy: [],
    },
  ],
  bets: [
    {
      id: "bet1",
      groupId: "g1",
      goalId: "goal1",
      creator: "0xAlice111",
      against: MOCK_ACCOUNT,
      amount: "0.25",
      token: "MON",
      condition: "Deploy GoalPool by deadline",
      creatorWins: "goal achieved",
      againstWins: "goal missed",
      status: "active", // active | pending_accept | settled
      winner: null,
      createdAt: Date.now() - 86400000 * 2,
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const short    = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—");
export const initial  = (addr) => addr?.slice(2, 3)?.toUpperCase() || "?";
export const ensName  = (addr, friends) =>
  friends.find((f) => f.address === addr)?.ens || short(addr);

export function daysLeft(ts) {
  return Math.ceil((ts - Date.now()) / 86400000);
}

export function DeadlineChip({ deadline }) {
  const d = daysLeft(deadline);
  const cls   = d < 0 ? "past" : d <= 3 ? "urgent" : "ok";
  const label = d < 0 ? "Expired" : d === 0 ? "Today" : `${d}d left`;
  return <span className={`deadline ${cls}`}>{label}</span>;
}

// ─── Shared UI atoms ──────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, footer }) {
  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}