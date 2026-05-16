// ─── FriendsPage.jsx ──────────────────────────────────────────────────────────
// Displays friends list, pending friend requests, and the Add Friend modal.
// Wire addFriend / declineRequest to contract calls when ready.

import { useState } from "react";
import { short, initial, Modal } from "../Constants.jsx";

// ─── Add Friend Modal ─────────────────────────────────────────────────────────
function AddFriendModal({ onClose, onAdd }) {
  const [addr, setAddr] = useState("");
  const [name, setName] = useState("");

  return (
    <Modal
      title="Add Friend"
      onClose={onClose}
      footer={
        <>
          <button
            className="btn btn-ink"
            onClick={() => addr && onAdd(addr, name)}
          >
            Add Friend
          </button>
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
        </>
      }
    >
      <div className="field">
        <label className="label">Wallet Address or ENS</label>
        <input
          className="input"
          placeholder="0x… or vitalik.eth"
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
        />
      </div>
      <div className="field">
        <label className="label">Display Name (optional)</label>
        <input
          className="input"
          placeholder="alice.eth"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </Modal>
  );
}

// ─── Friends Page ─────────────────────────────────────────────────────────────
export default function FriendsPage({
  state,
  acceptFriendRequest,
  declineRequest,
  addFriend,
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="page">
      <div className="page-eyebrow">Social</div>
      <div className="page-title">Friends</div>
      <div className="page-sub">Accountability partners on-chain.</div>

      {/* ── Stats ── */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-num amber">{state.friends.length}</div>
          <div className="stat-lbl">Friends</div>
        </div>
        <div className="stat-box">
          <div className="stat-num rose">{state.pendingRequests.length}</div>
          <div className="stat-lbl">Pending</div>
        </div>
      </div>

      {/* ── Pending requests ── */}
      {state.pendingRequests.length > 0 && (
        <>
          <div className="section-head">
            <div className="section-label" style={{ color: "var(--rose)" }}>
              Requests
            </div>
            <span className="tag tag-rose">
              {state.pendingRequests.length} pending
            </span>
          </div>

          <div className="card-list" style={{ marginBottom: 32 }}>
            {state.pendingRequests.map((r) => (
              <div className="card" key={r.address}>
                <div className="card-accent rose" />
                <div className="card-row" style={{ paddingLeft: 8 }}>
                  <div className="card-body">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="avatar">{initial(r.address)}</div>
                      <div>
                        <div className="card-title">{r.ens}</div>
                        <div className="card-meta">{r.address}</div>
                      </div>
                    </div>
                  </div>
                  <div className="card-actions">
                    <button
                      className="btn btn-sage btn-sm"
                      onClick={() => acceptFriendRequest(r.address, r.ens)}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => declineRequest(r.address)}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Friends list ── */}
      <div className="section-head">
        <div className="section-label">My Friends</div>
        <button
          className="btn btn-ink btn-sm"
          onClick={() => setShowModal(true)}
        >
          + Add
        </button>
      </div>

      {state.friends.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">◈</div>
          <div className="empty-text">No friends added yet</div>
        </div>
      ) : (
        <div className="card-list">
          {state.friends.map((f) => (
            <div className="card" key={f.address}>
              <div className="card-accent muted" />
              <div className="card-row" style={{ paddingLeft: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div className="avatar">{initial(f.address)}</div>
                  <div>
                    <div className="card-title">{f.ens}</div>
                    <div className="card-meta">{f.address}</div>
                  </div>
                </div>
                <div className="card-actions">
                  <span className="tag tag-muted">
                    Since {new Date(f.since).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <AddFriendModal
          onClose={() => setShowModal(false)}
          onAdd={(addr, name) => {
            addFriend(addr, name);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}