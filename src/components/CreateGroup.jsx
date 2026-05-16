// ─── GroupsPage.jsx ───────────────────────────────────────────────────────────
// Displays private groups with member avatars and per-group goal progress.
// Wire createGroup to contract.createGroup(...) when ready.

import { useState } from "react";
import { initial, Modal } from "../Constants.jsx";

// ─── Create Group Modal ───────────────────────────────────────────────────────
function CreateGroupModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [priv, setPriv] = useState(true);

  return (
    <Modal
      title="Create Group"
      onClose={onClose}
      footer={
        <>
          <button
            className="btn btn-ink"
            onClick={() => name && onCreate(name, desc, priv)}
          >
            Create Group
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </>
      }
    >
      <div className="field">
        <label className="label">Group Name</label>
        <input
          className="input"
          placeholder="Builders Sprint"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="field">
        <label className="label">Description</label>
        <textarea
          className="textarea"
          placeholder="What's this group about?"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>
      <div className="field">
        <div className="checkbox-row">
          <input
            type="checkbox"
            id="priv"
            checked={priv}
            onChange={(e) => setPriv(e.target.checked)}
          />
          <label htmlFor="priv" className="checkbox-label">
            🔒 Private group (invite only)
          </label>
        </div>
      </div>
    </Modal>
  );
}

// ─── Groups Page ──────────────────────────────────────────────────────────────
export default function GroupsPage({ state, createGroup }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="page">
      <div className="page-eyebrow">Community</div>
      <div className="page-title">Groups</div>
      <div className="page-sub">Private circles for shared accountability.</div>

      {/* ── Stats ── */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-num amber">{state.groups.length}</div>
          <div className="stat-lbl">Groups</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">
            {state.groups.reduce((s, g) => s + g.members.length, 0)}
          </div>
          <div className="stat-lbl">Total Members</div>
        </div>
        <div className="stat-box">
          <div className="stat-num sage">
            {state.groups.filter((g) => g.isPrivate).length}
          </div>
          <div className="stat-lbl">Private</div>
        </div>
      </div>

      {/* ── Groups list ── */}
      <div className="section-head">
        <div className="section-label">My Groups</div>
        <button
          className="btn btn-ink btn-sm"
          onClick={() => setShowModal(true)}
        >
          + Create
        </button>
      </div>

      {state.groups.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">◉</div>
          <div className="empty-text">No groups yet — create one to get started</div>
        </div>
      ) : (
        <div className="card-list">
          {state.groups.map((g) => {
            const groupGoals = state.goals.filter((gl) => gl.groupId === g.id);
            const done = groupGoals.filter((gl) => gl.completedAt).length;
            const pct = groupGoals.length
              ? Math.round((done / groupGoals.length) * 100)
              : 0;

            return (
              <div className="card" key={g.id}>
                <div className="card-accent amber" />
                <div style={{ paddingLeft: 8 }}>
                  {/* Header row */}
                  <div className="card-row">
                    <div className="card-body">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 4,
                        }}
                      >
                        <div className="card-title">{g.name}</div>
                        {g.isPrivate && (
                          <span className="tag tag-muted">🔒 Private</span>
                        )}
                      </div>
                      {g.description && (
                        <div className="card-desc">{g.description}</div>
                      )}
                    </div>

                    {/* Member avatars */}
                    <div className="card-actions" style={{ flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <div className="avatar-group">
                        {g.members.slice(0, 4).map((m) => (
                          <div key={m} className="avatar avatar-sm">
                            {initial(m)}
                          </div>
                        ))}
                        {g.members.length > 4 && (
                          <div className="avatar avatar-sm" style={{ background: "var(--muted)" }}>
                            +{g.members.length - 4}
                          </div>
                        )}
                      </div>
                      <span className="section-count">
                        {g.members.length} member{g.members.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginTop: 14 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          color: "var(--muted)",
                        }}
                      >
                        Group goals
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {done}/{groupGoals.length} · {pct}%
                      </span>
                    </div>
                    <div className="progress-wrap">
                      <div
                        className={`progress-fill ${
                          done === groupGoals.length && groupGoals.length > 0
                            ? "done"
                            : ""
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer meta */}
                  <div
                    style={{
                      marginTop: 10,
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--muted)",
                    }}
                  >
                    Created {new Date(g.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onCreate={(name, desc, priv) => {
            createGroup(name, desc, priv);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}