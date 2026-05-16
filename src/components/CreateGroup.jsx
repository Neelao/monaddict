// ─── GroupsPage.jsx ────────────────────────────────────────────────────────────
// Prize-pool group feature: lobby → active → finalized flow.
// Wire createGroup / setMemberStake / startSession / finalizeGroup to contract
// calls when ready.

import { useState } from "react";
import { initial, Modal, DeadlineChip } from "../Constants.jsx";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(val) {
  const n = parseFloat(val || "0");
  if (isNaN(n) || n === 0) return "0";
  return n.toFixed(4).replace(/\.?0+$/, "");
}

function statusMeta(status) {
  if (status === "active")    return { label: "Active",    color: "var(--amber)", bg: "rgba(255,149,0,.1)",  border: "rgba(255,149,0,.3)"  };
  if (status === "finalized") return { label: "Finalized", color: "var(--sage)",  bg: "rgba(61,122,94,.1)",  border: "rgba(61,122,94,.3)"   };
  return                             { label: "Lobby",     color: "var(--muted)", bg: "rgba(0,0,0,.04)",    border: "var(--border)"         };
}

// ─── Create Group Modal (2-step) ──────────────────────────────────────────────
function CreateGroupModal({ onClose, onCreate, friends }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [priv, setPriv] = useState(true);
  const [invited, setInvited] = useState([]);
  const [customAddr, setCustomAddr] = useState("");

  const toggle = (addr) =>
    setInvited((p) => (p.includes(addr) ? p.filter((a) => a !== addr) : [...p, addr]));

  const addCustom = () => {
    const addr = customAddr.trim();
    if (addr && !invited.includes(addr)) {
      setInvited((p) => [...p, addr]);
      setCustomAddr("");
    }
  };

  return (
    <Modal
      title={step === 1 ? "Create Group" : "Invite Members"}
      onClose={onClose}
      footer={
        step === 1 ? (
          <>
            <button className="btn btn-ink" disabled={!name.trim()} onClick={() => setStep(2)}>
              Next →
            </button>
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          </>
        ) : (
          <>
            <button
              className="btn btn-ink"
              onClick={() => { onCreate(name.trim(), desc.trim(), priv, invited); onClose(); }}
            >
              Create Group
            </button>
            <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
          </>
        )
      }
    >
      {step === 1 ? (
        <>
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
              <label htmlFor="priv" className="checkbox-label">🔒 Private group (invite only)</label>
            </div>
          </div>
        </>
      ) : (
        <>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16, fontStyle: "italic" }}>
            Each member sets their own goal and stake in the lobby before the session starts.
          </p>

          {friends.length > 0 && (
            <div className="field">
              <label className="label">From Friends</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {friends.map((f) => (
                  <div
                    key={f.address}
                    onClick={() => toggle(f.address)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "10px 12px", cursor: "pointer",
                      background: invited.includes(f.address) ? "rgba(255,149,0,.06)" : "#fff",
                      border: `2px solid ${invited.includes(f.address) ? "var(--amber)" : "var(--border)"}`,
                      borderRadius: "var(--r)",
                    }}
                  >
                    <div className="avatar avatar-sm">{initial(f.address)}</div>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, flex: 1 }}>{f.ens}</span>
                    <input
                      type="checkbox"
                      checked={invited.includes(f.address)}
                      onChange={() => {}}
                      style={{ pointerEvents: "none" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="field">
            <label className="label">Add by Address</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="input"
                placeholder="0x..."
                value={customAddr}
                onChange={(e) => setCustomAddr(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustom()}
              />
              <button className="btn btn-ghost btn-sm" onClick={addCustom}>Add</button>
            </div>
          </div>

          {invited.length > 0 && (
            <div style={{ padding: 12, background: "var(--cream)", borderRadius: "var(--r)" }}>
              <div style={{
                fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)",
                textTransform: "uppercase", letterSpacing: 1, marginBottom: 8,
              }}>
                Invited ({invited.length})
              </div>
              {invited.map((addr) => (
                <div key={addr} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                    {friends.find((f) => f.address === addr)?.ens || `${addr.slice(0, 10)}…`}
                  </span>
                  <button
                    onClick={() => setInvited((p) => p.filter((a) => a !== addr))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--rose)", fontSize: 16 }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

// ─── Set Stake Modal ──────────────────────────────────────────────────────────
function SetStakeModal({ onClose, onSet, currentStake }) {
  const [stake, setStake] = useState(currentStake || "");
  const valid = stake && !isNaN(parseFloat(stake)) && parseFloat(stake) > 0;

  return (
    <Modal
      title="Set Your Stake"
      onClose={onClose}
      footer={
        <>
          <button
            className="btn btn-amber"
            disabled={!valid}
            onClick={() => { onSet(stake); onClose(); }}
          >
            Confirm Stake
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </>
      }
    >
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16, fontStyle: "italic" }}>
        If you fail to complete your goal, this amount is split equally among the winners.
      </p>
      <div className="field">
        <label className="label">Stake Amount (MON)</label>
        <input
          className="input"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.5"
          value={stake}
          onChange={(e) => setStake(e.target.value)}
          autoFocus
        />
      </div>
    </Modal>
  );
}

// ─── Quick Goal Modal ─────────────────────────────────────────────────────────
function QuickGoalModal({ onClose, onAdd, groupId }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc]   = useState("");
  const [dl, setDl]       = useState("");
  const canSubmit = title.trim() && dl;

  return (
    <Modal
      title="Set Your Goal"
      onClose={onClose}
      footer={
        <>
          <button
            className="btn btn-amber"
            disabled={!canSubmit}
            onClick={() => { onAdd(title.trim(), desc.trim(), new Date(dl).getTime(), groupId); onClose(); }}
          >
            Set Goal
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </>
      }
    >
      <div className="field">
        <label className="label">Goal Title</label>
        <input
          className="input"
          placeholder="Ship the feature by deadline"
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
      <div className="field">
        <label className="label">Deadline</label>
        <input className="input" type="date" value={dl} onChange={(e) => setDl(e.target.value)} />
      </div>
    </Modal>
  );
}

// ─── Member Row ───────────────────────────────────────────────────────────────
function MemberRow({ member, goal, friends, groupStatus, isMe }) {
  const label =
    friends.find((f) => f.address === member.address)?.ens ||
    `${member.address.slice(0, 6)}…${member.address.slice(-4)}`;
  const completed  = goal?.completedAt != null;
  const hasStake   = member.stake != null && parseFloat(member.stake) > 0;

  const pill = (() => {
    if (groupStatus === "lobby") {
      return member.ready
        ? { text: "Ready ✓", bg: "rgba(61,122,94,.1)", color: "var(--sage)", border: "rgba(61,122,94,.25)" }
        : { text: "Not ready", bg: "rgba(0,0,0,.04)", color: "var(--muted)", border: "var(--border)" };
    }
    if (groupStatus === "active") {
      return completed
        ? { text: "Done ✓", bg: "rgba(61,122,94,.1)", color: "var(--sage)", border: "rgba(61,122,94,.25)" }
        : { text: "In progress", bg: "rgba(0,0,0,.04)", color: "var(--muted)", border: "var(--border)" };
    }
    // finalized
    return completed
      ? { text: "Won ✓", bg: "rgba(61,122,94,.1)", color: "var(--sage)", border: "rgba(61,122,94,.25)" }
      : { text: "Lost",  bg: "rgba(217,79,61,.1)", color: "var(--rose)", border: "rgba(217,79,61,.25)" };
  })();

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0", borderBottom: "1px solid var(--border)",
    }}>
      <div className="avatar avatar-sm">{initial(member.address)}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600 }}>
          {label}{" "}
          {isMe && <span style={{ color: "var(--muted)", fontWeight: 400 }}>(you)</span>}
        </div>
        {goal ? (
          <div style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {goal.title}
          </div>
        ) : groupStatus === "lobby" ? (
          <div style={{ fontSize: 12, color: "var(--rose)", marginTop: 2 }}>No goal set</div>
        ) : null}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {hasStake && (
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
            background: "rgba(255,149,0,.1)", color: "#8B5000",
            padding: "3px 8px", borderRadius: 2,
          }}>
            {fmt(member.stake)} MON
          </span>
        )}
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600,
          textTransform: "uppercase", letterSpacing: 1,
          padding: "3px 8px", borderRadius: 2,
          background: pill.bg, color: pill.color,
          border: `1px solid ${pill.border}`,
        }}>
          {pill.text}
        </span>
      </div>
    </div>
  );
}

// ─── Group Detail ─────────────────────────────────────────────────────────────
function GroupDetail({ group, state, account, setMemberStake, startSession, finalizeGroup, addGoal, markComplete, onBack }) {
  const [showStake, setShowStake] = useState(false);
  const [showGoal,  setShowGoal]  = useState(false);
  const [startDl,   setStartDl]   = useState("");

  const myMember   = group.members.find((m) => m.address === account);
  const myGoal     = state.goals.find((gl) => gl.owner === account && gl.groupId === group.id);
  const isCreator  = group.creator === account;
  const totalPool  = group.members.reduce((sum, m) => sum + parseFloat(m.stake || "0"), 0);
  const readyCount = group.members.filter((m) => m.ready).length;
  const allReady   = readyCount === group.members.length && group.members.length > 1;
  const isPastDeadline = group.deadline && Date.now() > group.deadline;
  const sm = statusMeta(group.status);

  return (
    <div style={{ animation: "fadeUp .3s ease" }}>
      {/* Back */}
      <button className="btn btn-ghost btn-sm" onClick={onBack} style={{ marginBottom: 24 }}>
        ← Back to Groups
      </button>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
        <div>
          <div className="page-eyebrow">Group</div>
          <div className="page-title" style={{ fontSize: 42, lineHeight: 1 }}>{group.name}</div>
          {group.description && (
            <div className="page-sub" style={{ marginBottom: 0 }}>{group.description}</div>
          )}
        </div>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600,
          textTransform: "uppercase", letterSpacing: 1, whiteSpace: "nowrap",
          padding: "6px 12px", borderRadius: 2, marginTop: 8,
          background: sm.bg, color: sm.color, border: `1px solid ${sm.border}`,
        }}>
          {sm.label}
        </span>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ marginBottom: 24 }}>
        <div className="stat-box">
          <div className="stat-num amber">{fmt(totalPool)}</div>
          <div className="stat-lbl">Prize Pool (MON)</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">{group.members.length}</div>
          <div className="stat-lbl">Members</div>
        </div>
        {group.status === "lobby" && (
          <div className="stat-box">
            <div className={`stat-num ${allReady ? "sage" : ""}`}>{readyCount}/{group.members.length}</div>
            <div className="stat-lbl">Ready</div>
          </div>
        )}
        {group.status === "finalized" && group.finalResult && (
          <div className="stat-box">
            <div className="stat-num sage">{fmt(group.finalResult.perWinner)}</div>
            <div className="stat-lbl">Won Per Member</div>
          </div>
        )}
      </div>

      {/* ── LOBBY ACTIONS ── */}
      {group.status === "lobby" && myMember && (
        <div style={{
          background: "#fff", border: "2px solid var(--border)",
          borderRadius: "var(--r)", padding: 20, marginBottom: 20,
        }}>
          <div className="section-label" style={{ fontSize: 18, marginBottom: 14 }}>My Setup</div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {/* Goal */}
            {!myGoal ? (
              <button className="btn btn-amber" onClick={() => setShowGoal(true)}>
                + Set My Goal
              </button>
            ) : (
              <div style={{
                padding: "10px 14px",
                background: "rgba(61,122,94,.06)", border: "1px solid rgba(61,122,94,.25)",
                borderRadius: "var(--r)",
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--sage)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                  Goal Set ✓
                </div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{myGoal.title}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--muted)", marginTop: 3 }}>
                  Due <DeadlineChip deadline={myGoal.deadline} />
                </div>
              </div>
            )}

            {/* Stake */}
            {!myMember.stake ? (
              <button className="btn btn-ink" disabled={!myGoal} onClick={() => setShowStake(true)}
                title={!myGoal ? "Set your goal first" : ""}
              >
                Set Stake
              </button>
            ) : (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px",
                background: "rgba(255,149,0,.06)", border: "1px solid rgba(255,149,0,.3)",
                borderRadius: "var(--r)",
              }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#8B5000", textTransform: "uppercase", letterSpacing: 1, marginBottom: 2 }}>
                    Stake Set ✓
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22 }}>
                    {fmt(myMember.stake)} MON
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowStake(true)}>Edit</button>
              </div>
            )}
          </div>

          {myMember.ready && (
            <div style={{ marginTop: 14, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--sage)" }}>
              ✓ You're ready — waiting for others to join.
            </div>
          )}
        </div>
      )}

      {/* ── CREATOR START SESSION ── */}
      {group.status === "lobby" && isCreator && (
        <div style={{
          background: "rgba(255,149,0,.04)", border: "2px solid rgba(255,149,0,.3)",
          borderRadius: "var(--r)", padding: 20, marginBottom: 20,
        }}>
          <div className="section-label" style={{ fontSize: 18, marginBottom: 8 }}>Start Session</div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14, fontStyle: "italic" }}>
            {allReady
              ? "All members are ready! Set a deadline and launch."
              : `${readyCount}/${group.members.length} members ready. You can start early or wait for everyone.`}
          </p>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div className="field" style={{ marginBottom: 0, flex: 1, minWidth: 180 }}>
              <label className="label">Session Deadline</label>
              <input
                className="input"
                type="date"
                value={startDl}
                onChange={(e) => setStartDl(e.target.value)}
              />
            </div>
            <button
              className="btn btn-amber"
              disabled={!startDl}
              onClick={() => startSession(group.id, new Date(startDl).getTime())}
            >
              🚀 Start Session
            </button>
          </div>
        </div>
      )}

      {/* ── ACTIVE PHASE ── */}
      {group.status === "active" && (
        <div style={{
          background: "rgba(255,149,0,.04)", border: "2px solid rgba(255,149,0,.3)",
          borderRadius: "var(--r)", padding: 20, marginBottom: 20,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div className="section-label" style={{ fontSize: 18 }}>Deadline</div>
            {group.deadline && <DeadlineChip deadline={group.deadline} />}
          </div>
          {group.deadline && (
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
              {new Date(group.deadline).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {myGoal && !myGoal.completedAt && (
              <button className="btn btn-sage" onClick={() => markComplete(myGoal.id)}>
                ✓ Mark My Goal Complete
              </button>
            )}
            {myGoal?.completedAt && (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--sage)", padding: "9px 0" }}>
                ✓ You completed your goal!
              </div>
            )}
            {isPastDeadline && isCreator && (
              <button className="btn btn-rose" onClick={() => finalizeGroup(group.id)}>
                ⚡ Finalize &amp; Distribute
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── FINALIZED ── */}
      {group.status === "finalized" && group.finalResult && (
        <div style={{
          background: "rgba(61,122,94,.06)", border: "2px solid rgba(61,122,94,.3)",
          borderRadius: "var(--r)", padding: 24, marginBottom: 20, textAlign: "center",
        }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--sage)", marginBottom: 4 }}>
            Session Complete
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", fontStyle: "italic", marginBottom: 20 }}>
            Losers' stakes split equally among all winners.
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--amber)" }}>
                {fmt(group.finalResult.perWinner)} MON
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>
                Earned per winner
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--sage)" }}>
                {group.finalResult.winnerCount}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>
                {group.finalResult.winnerCount === 1 ? "Winner" : "Winners"}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--rose)" }}>
                {group.finalResult.loserCount}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>
                {group.finalResult.loserCount === 1 ? "Loser" : "Losers"}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--rose)" }}>
                {fmt(group.finalResult.totalForfeited)} MON
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>
                Total Forfeited
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MEMBERS ── */}
      <div className="section-head">
        <div className="section-label">Members</div>
        <span className="section-count">{group.members.length} total · {fmt(totalPool)} MON pool</span>
      </div>
      <div style={{ background: "#fff", border: "2px solid var(--border)", borderRadius: "var(--r)", padding: "4px 20px" }}>
        {group.members.map((m) => {
          const memberGoal = state.goals.find((gl) => gl.owner === m.address && gl.groupId === group.id);
          return (
            <MemberRow
              key={m.address}
              member={m}
              goal={memberGoal}
              friends={state.friends}
              groupStatus={group.status}
              isMe={m.address === account}
            />
          );
        })}
      </div>

      {/* ── MODALS ── */}
      {showStake && (
        <SetStakeModal
          onClose={() => setShowStake(false)}
          onSet={(stake) => setMemberStake(group.id, stake)}
          currentStake={myMember?.stake}
        />
      )}
      {showGoal && (
        <QuickGoalModal
          onClose={() => setShowGoal(false)}
          onAdd={addGoal}
          groupId={group.id}
        />
      )}
    </div>
  );
}

// ─── Groups Page ──────────────────────────────────────────────────────────────
export default function GroupsPage({
  state, createGroup, setMemberStake, startSession, finalizeGroup, addGoal, markComplete,
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const selectedGroup = state.groups.find((g) => g.id === selectedId);

  const totalPool = state.groups.reduce(
    (sum, g) => sum + g.members.reduce((s, m) => s + parseFloat(m.stake || "0"), 0),
    0
  );

  if (selectedGroup) {
    return (
      <div className="page">
        <GroupDetail
          group={selectedGroup}
          state={state}
          account={state.account}
          setMemberStake={setMemberStake}
          startSession={startSession}
          finalizeGroup={finalizeGroup}
          addGoal={addGoal}
          markComplete={markComplete}
          onBack={() => setSelectedId(null)}
        />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-eyebrow">Community</div>
      <div className="page-title">Groups</div>
      <div className="page-sub">Compete with friends. Winners split the prize pool.</div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-num amber">{state.groups.length}</div>
          <div className="stat-lbl">Groups</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">{fmt(totalPool)}</div>
          <div className="stat-lbl">Total Pool (MON)</div>
        </div>
        <div className="stat-box">
          <div className="stat-num sage">
            {state.groups.filter((g) => g.status === "active").length}
          </div>
          <div className="stat-lbl">Active Sessions</div>
        </div>
      </div>

      {/* List header */}
      <div className="section-head">
        <div className="section-label">My Groups</div>
        <button className="btn btn-ink btn-sm" onClick={() => setShowModal(true)}>+ Create</button>
      </div>

      {state.groups.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">◉</div>
          <div className="empty-text">No groups yet — create one to get started</div>
        </div>
      ) : (
        <div className="card-list">
          {state.groups.map((g) => {
            const pool        = g.members.reduce((s, m) => s + parseFloat(m.stake || "0"), 0);
            const readyCount  = g.members.filter((m) => m.ready).length;
            const sm          = statusMeta(g.status);

            return (
              <div
                className="card"
                key={g.id}
                onClick={() => setSelectedId(g.id)}
                style={{ cursor: "pointer" }}
              >
                <div className={`card-accent ${g.status === "active" ? "amber" : g.status === "finalized" ? "sage" : "muted"}`} />
                <div style={{ paddingLeft: 8 }}>
                  <div className="card-row">
                    <div className="card-body">
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
                        <div className="card-title">{g.name}</div>
                        <span style={{
                          fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 600,
                          textTransform: "uppercase", letterSpacing: 1,
                          padding: "2px 7px", borderRadius: 2,
                          background: sm.bg, color: sm.color, border: `1px solid ${sm.border}`,
                        }}>
                          {sm.label}
                        </span>
                        {g.isPrivate && <span className="tag tag-muted">🔒</span>}
                      </div>
                      {g.description && <div className="card-desc">{g.description}</div>}
                    </div>

                    {/* Member avatars */}
                    <div className="card-actions" style={{ flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      <div className="avatar-group">
                        {g.members.slice(0, 4).map((m) => (
                          <div key={m.address} className="avatar avatar-sm">{initial(m.address)}</div>
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

                  {/* Footer meta */}
                  <div style={{ marginTop: 12, display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                      Pool: <strong>{fmt(pool)} MON</strong>
                    </span>
                    {g.status === "lobby" && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>
                        {readyCount}/{g.members.length} ready
                      </span>
                    )}
                    {g.status === "active" && g.deadline && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>
                        <DeadlineChip deadline={g.deadline} />
                      </span>
                    )}
                    {g.status === "finalized" && g.finalResult && (
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--sage)" }}>
                        {g.finalResult.winnerCount} won · {g.finalResult.loserCount} lost
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create modal */}
      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onCreate={(name, desc, priv, invited) => {
            createGroup(name, desc, priv, invited);
            setShowModal(false);
          }}
          friends={state.friends}
        />
      )}
    </div>
  );
}
