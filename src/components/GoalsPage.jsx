// ─── GoalsPage.jsx ────────────────────────────────────────────────────────────
// Personal goals with filter tabs, mark-complete, and peer verification.
// Wire addGoal / markComplete / verifyGoal to contract calls when ready.

import { useState } from "react";
import { ensName, DeadlineChip, Modal } from "../Constants.jsx";

// ─── Add Goal Modal ───────────────────────────────────────────────────────────
function AddGoalModal({ onClose, onAdd, groups }) {
  const [title, setTitle] = useState("");
  const [desc,  setDesc]  = useState("");
  const [dl,    setDl]    = useState("");
  const [gid,   setGid]   = useState(groups[0]?.id || "");

  const canSubmit = title.trim() && dl;

  return (
    <Modal
      title="Set a Goal"
      onClose={onClose}
      footer={
        <>
          <button
            className="btn btn-amber"
            disabled={!canSubmit}
            onClick={() =>
              onAdd(title.trim(), desc.trim(), new Date(dl).getTime(), gid)
            }
          >
            Set Goal
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </>
      }
    >
      <div className="field">
        <label className="label">Goal Title</label>
        <input
          className="input"
          placeholder="Deploy v2 by Friday"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="field">
        <label className="label">Description</label>
        <textarea
          className="textarea"
          placeholder="What does success look like?"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>
      <div className="input-row">
        <div className="field">
          <label className="label">Deadline</label>
          <input
            className="input"
            type="date"
            value={dl}
            onChange={(e) => setDl(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="label">Group</label>
          <select
            className="select"
            value={gid}
            onChange={(e) => setGid(e.target.value)}
          >
            {groups.length === 0 && (
              <option value="">No groups yet</option>
            )}
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}

// ─── Goal Card ────────────────────────────────────────────────────────────────
function GoalCard({ goal, account, friends, onMarkComplete, onVerify, onBet }) {
  const isOwner    = goal.owner === account;
  const canVerify  =
    !isOwner &&
    goal.completedAt &&
    !goal.verified &&
    !goal.verifiedBy.includes(account);

  const accentColor =
    goal.completedAt && goal.verified
      ? "sage"
      : goal.completedAt
      ? "amber"
      : "muted";

  return (
    <div className="card">
      <div className={`card-accent ${accentColor}`} />
      <div style={{ paddingLeft: 8 }}>
        <div className="card-row">
          <div className="card-body">
            {/* Title + tags */}
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 4,
              }}
            >
              <div className="card-title">{goal.title}</div>
              {goal.verified && (
                <span className="tag tag-sage">✓ Verified</span>
              )}
              {goal.completedAt && !goal.verified && (
                <span className="tag tag-amber">Pending verification</span>
              )}
            </div>

            {/* Meta */}
            <div className="card-meta">
              {isOwner ? "You" : ensName(goal.owner, friends)} ·{" "}
              <DeadlineChip deadline={goal.deadline} />
            </div>

            {goal.description && (
              <div className="card-desc">{goal.description}</div>
            )}
          </div>

          {/* Actions */}
          <div className="card-actions">
            {isOwner && !goal.completedAt && (
              <button
                className="btn btn-sage btn-sm"
                onClick={() => onMarkComplete(goal.id)}
              >
                ✓ Done
              </button>
            )}
            {canVerify && (
              <button
                className="btn btn-amber btn-sm"
                onClick={() => onVerify(goal.id)}
              >
                Verify
              </button>
            )}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onBet(goal.id)}
            >
              Bet
            </button>
          </div>
        </div>

        {/* Verified-by count */}
        {goal.verifiedBy.length > 0 && (
          <div
            style={{
              marginTop: 8,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--muted)",
            }}
          >
            Verified by {goal.verifiedBy.length} member
            {goal.verifiedBy.length > 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Goals Page ───────────────────────────────────────────────────────────────
export default function GoalsPage({
  state,
  addGoal,
  markComplete,
  verifyGoal,
  onBet,        // (goalId) => open bet modal pre-linked to this goal
}) {
  const [filter,    setFilter]    = useState("all"); // all | mine | verify
  const [showModal, setShowModal] = useState(false);

  const myGoals   = state.goals.filter((g) => g.owner === state.account);
  const toVerify  = state.goals.filter(
    (g) =>
      g.owner !== state.account &&
      g.completedAt &&
      !g.verified &&
      !g.verifiedBy.includes(state.account)
  );

  const displayed =
    filter === "mine"   ? myGoals   :
    filter === "verify" ? toVerify  :
    state.goals;

  const doneCount = myGoals.filter((g) => g.completedAt).length;
  const pct = myGoals.length
    ? Math.round((doneCount / myGoals.length) * 100)
    : 0;

  return (
    <div className="page">
      <div className="page-eyebrow">Objectives</div>
      <div className="page-title">Goals</div>
      <div className="page-sub">Set them. Ship them. Get verified.</div>

      {/* ── Stats ── */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-num amber">{myGoals.length}</div>
          <div className="stat-lbl">My Goals</div>
        </div>
        <div className="stat-box">
          <div className="stat-num sage">{doneCount}</div>
          <div className="stat-lbl">Completed</div>
        </div>
        <div className="stat-box">
          <div className="stat-num rose">{toVerify.length}</div>
          <div className="stat-lbl">Need Verify</div>
        </div>
      </div>

      {/* Completion bar (personal) */}
      {myGoals.length > 0 && (
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
              My completion rate
            </span>
            <span
              style={{ fontFamily: "var(--font-display)", fontSize: 20 }}
            >
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
      )}

      {/* ── Filter tabs + CTA ── */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {[
          ["all",    "All",    null],
          ["mine",   "Mine",   null],
          ["verify", "Verify", toVerify.length || null],
        ].map(([v, l, badge]) => (
          <button
            key={v}
            className={`btn btn-sm ${filter === v ? "btn-ink" : "btn-ghost"}`}
            onClick={() => setFilter(v)}
          >
            {l}
            {badge ? ` (${badge})` : ""}
          </button>
        ))}
        <button
          className="btn btn-amber btn-sm"
          style={{ marginLeft: "auto" }}
          onClick={() => setShowModal(true)}
        >
          + Set Goal
        </button>
      </div>

      {/* ── Goal cards ── */}
      {displayed.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">◎</div>
          <div className="empty-text">
            {filter === "verify"
              ? "No goals awaiting your verification"
              : filter === "mine"
              ? "No personal goals yet — set one!"
              : "No goals on-chain yet"}
          </div>
        </div>
      ) : (
        <div className="card-list">
          {displayed.map((g) => (
            <GoalCard
              key={g.id}
              goal={g}
              account={state.account}
              friends={state.friends}
              onMarkComplete={markComplete}
              onVerify={verifyGoal}
              onBet={onBet}
            />
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <AddGoalModal
          groups={state.groups}
          onClose={() => setShowModal(false)}
          onAdd={(title, desc, deadline, groupId) => {
            addGoal(title, desc, deadline, groupId);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}