// ─── App.jsx ──────────────────────────────────────────────────────────────────
// Root shell: sidebar nav, global state, toast system, page routing.
// Each page is a separate file — see FriendsPage, GroupsPage, GoalsPage, BetsPage.

import { useState, useCallback } from "react";
import { CSS }          from "./styles.js";
import { INITIAL_STATE, short, ensName, DeadlineChip } from "./Constants.jsx";
import FriendsPage from "./components/FriendsPage.jsx";
import GroupsPage  from "./components/CreateGroup.jsx";
import GoalsPage   from "./components/GoalsPage.jsx";
import BetsPage    from "./components/BetsPage.jsx";

// ─── Toast hook ───────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return { toasts, push };
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, state }) {
  const pendingCount = state.pendingRequests.length;
  const activeBets   = state.bets.filter((b) => b.status !== "settled").length;

  const NAV = [
    { id: "home",    icon: "⌂",  label: "Dashboard" },
    { id: "friends", icon: "◈",  label: "Friends",  badge: pendingCount || null },
    { id: "groups",  icon: "◉",  label: "Groups" },
    { id: "goals",   icon: "◎",  label: "Goals" },
    { id: "bets",    icon: "⬡",  label: "Bets",     badge: activeBets || null },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-word">GOALPOOL</span>
        <span className="logo-sub">on Monad</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">Menu</div>
        {NAV.map((n) => (
          <div
            key={n.id}
            className={`nav-item ${page === n.id ? "active" : ""}`}
            onClick={() => setPage(n.id)}
          >
            <span>{n.icon}</span>
            <span>{n.label}</span>
            {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
          </div>
        ))}
      </nav>

      <div className="sidebar-wallet">
        <span className="wallet-dot" />
        {short(state.account)}
      </div>
    </aside>
  );
}

// ─── Home / Dashboard ─────────────────────────────────────────────────────────
function HomePage({ state, setPage, onBet, markComplete }) {
  const myGoals   = state.goals.filter((g) => g.owner === state.account);
  const doneGoals = myGoals.filter((g) => g.completedAt);
  const activeBets = state.bets.filter((b) => b.status !== "settled");
  const pct = myGoals.length
    ? Math.round((doneGoals.length / myGoals.length) * 100)
    : 0;

  const upcoming = myGoals
    .filter((g) => !g.completedAt)
    .sort((a, b) => a.deadline - b.deadline)
    .slice(0, 3);

  const recentBets = [...state.bets].reverse().slice(0, 2);

  return (
    <div className="page">
      <div className="page-eyebrow">Overview</div>
      <div className="page-title">
        Your <span>Sprint</span>
      </div>
      <div className="page-sub">
        Stay accountable. Win your bets. Ship your goals.
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-num amber">{myGoals.length}</div>
          <div className="stat-lbl">Active Goals</div>
        </div>
        <div className="stat-box">
          <div className="stat-num sage">{doneGoals.length}</div>
          <div className="stat-lbl">Completed</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">{state.groups.length}</div>
          <div className="stat-lbl">Groups</div>
        </div>
        <div className="stat-box">
          <div className="stat-num rose">{activeBets.length}</div>
          <div className="stat-lbl">Active Bets</div>
        </div>
      </div>

      {/* Completion bar */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Goal completion rate
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 20 }}>
            {pct}%
          </span>
        </div>
        <div className="progress-wrap">
          <div
            className={`progress-fill ${pct === 100 ? "done" : ""}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <hr className="divider" />

      {/* Upcoming goals */}
      <div className="section-head">
        <div className="section-label">Upcoming Deadlines</div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setPage("goals")}
        >
          See all
        </button>
      </div>
      {upcoming.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🎯</div>
          <div className="empty-text">No active goals — set one now</div>
        </div>
      ) : (
        <div className="card-list">
          {upcoming.map((g) => (
            <div className="card" key={g.id}>
              <div className="card-accent amber" />
              <div className="card-row" style={{ paddingLeft: 8 }}>
                <div className="card-body">
                  <div className="card-title">{g.title}</div>
                  <div className="card-meta">
                    <DeadlineChip deadline={g.deadline} />
                  </div>
                </div>
                <div className="card-actions">
                  <button
                    className="btn btn-sage btn-sm"
                    onClick={() => markComplete(g.id)}
                  >
                    ✓ Done
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <hr className="divider" />

      {/* Recent bets */}
      <div className="section-head">
        <div className="section-label">Recent Bets</div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setPage("bets")}
        >
          See all
        </button>
      </div>
      {recentBets.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🤝</div>
          <div className="empty-text">No bets yet</div>
        </div>
      ) : (
        <div className="card-list">
          {recentBets.map((b) => (
            <div className="card" key={b.id}>
              <div className="card-accent rose" />
              <div style={{ paddingLeft: 8 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div className="bet-amount">
                      {b.amount} {b.token}
                    </div>
                    <div className="bet-condition">{b.condition}</div>
                  </div>
                  <span
                    className={`tag ${
                      b.status === "settled"
                        ? "tag-sage"
                        : b.status === "active"
                        ? "tag-amber"
                        : "tag-muted"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <hr className="divider" />
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className="btn btn-ink" onClick={() => setPage("goals")}>
          + Set Goal
        </button>
        <button className="btn btn-amber" onClick={() => setPage("bets")}>
          + New Bet
        </button>
        <button className="btn btn-ghost" onClick={() => setPage("groups")}>
          + Group
        </button>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [state, setState] = useState(INITIAL_STATE);
  const [page,  setPage]  = useState("home");
  const [betGoalId, setBetGoalId] = useState(null); // pre-link goal → bets page
  const { toasts, push } = useToast();

  const update = (fn) => setState((s) => fn({ ...s }));

  // ── Actions (wire to contract here) ────────────────────────────────────────
  function addFriend(address, name) {
    update((s) => {
      s.friends = [
        ...s.friends,
        { address, ens: name || address, since: Date.now() },
      ];
      return s;
    });
    push(`${name || short(address)} added`, "success");
  }

  function acceptFriendRequest(addr, name) {
    update((s) => {
      s.friends = [
        ...s.friends,
        { address: addr, ens: name || addr, since: Date.now() },
      ];
      s.pendingRequests = s.pendingRequests.filter((r) => r.address !== addr);
      return s;
    });
    push(`${name || short(addr)} added as friend`, "success");
  }

  function declineRequest(addr) {
    update((s) => {
      s.pendingRequests = s.pendingRequests.filter((r) => r.address !== addr);
      return s;
    });
    push("Request declined");
  }

  function createGroup(name, description, isPrivate) {
    const id = "g" + Date.now();
    update((s) => {
      s.groups = [
        ...s.groups,
        {
          id, name, description,
          creator: s.account,
          members: [s.account],
          isPrivate,
          createdAt: Date.now(),
        },
      ];
      return s;
    });
    push("Group created!", "success");
  }

  function addGoal(title, description, deadline, groupId) {
    const id = "goal" + Date.now();
    update((s) => {
      s.goals = [
        ...s.goals,
        {
          id, title, description, deadline, groupId,
          owner: s.account,
          completedAt: null,
          verified: false,
          verifiedBy: [],
        },
      ];
      return s;
    });
    push("Goal set!", "success");
  }

  function markComplete(goalId) {
    update((s) => {
      s.goals = s.goals.map((g) =>
        g.id === goalId ? { ...g, completedAt: Date.now() } : g
      );
      return s;
    });
    push("Marked complete — awaiting group verification", "success");
  }

  function verifyGoal(goalId) {
    update((s) => {
      s.goals = s.goals.map((g) => {
        if (g.id !== goalId) return g;
        const newVerifiers = [...g.verifiedBy, s.account];
        return {
          ...g,
          verifiedBy: newVerifiers,
          verified: newVerifiers.length >= 1,
        };
      });
      return s;
    });
    push("Goal verified!", "success");
  }

  function createBet(data) {
    const id = "bet" + Date.now();
    update((s) => {
      s.bets = [
        ...s.bets,
        { id, ...data, status: "pending_accept", winner: null, createdAt: Date.now() },
      ];
      return s;
    });
    push("Bet proposed!", "success");
  }

  function acceptBet(betId) {
    update((s) => {
      s.bets = s.bets.map((b) =>
        b.id === betId ? { ...b, status: "active" } : b
      );
      return s;
    });
    push("Bet accepted — stakes locked 🔒", "success");
  }

  function settleBet(betId, winner) {
    update((s) => {
      s.bets = s.bets.map((b) =>
        b.id === betId ? { ...b, status: "settled", winner } : b
      );
      return s;
    });
    push("Bet settled!", "success");
  }

  // Open bets page pre-linked to a goal
  function openBetForGoal(goalId) {
    setBetGoalId(goalId);
    setPage("bets");
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="shell">
        <Sidebar page={page} setPage={setPage} state={state} />

        <main className="content">
          {page === "home" && (
            <HomePage
              state={state}
              setPage={setPage}
              onBet={openBetForGoal}
              markComplete={markComplete}
            />
          )}
          {page === "friends" && (
            <FriendsPage
              state={state}
              addFriend={addFriend}
              acceptFriendRequest={acceptFriendRequest}
              declineRequest={declineRequest}
            />
          )}
          {page === "groups" && (
            <GroupsPage
              state={state}
              createGroup={createGroup}
            />
          )}
          {page === "goals" && (
            <GoalsPage
              state={state}
              addGoal={addGoal}
              markComplete={markComplete}
              verifyGoal={verifyGoal}
              onBet={openBetForGoal}
            />
          )}
          {page === "bets" && (
            <BetsPage
              state={state}
              createBet={createBet}
              acceptBet={acceptBet}
              settleBet={settleBet}
              preGoalId={betGoalId}
            />
          )}
        </main>
      </div>

      {/* Global toasts */}
      <div className="toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.msg}
          </div>
        ))}
      </div>
    </>
  );
}