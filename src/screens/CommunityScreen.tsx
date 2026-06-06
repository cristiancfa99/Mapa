import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Trophy, Search } from 'lucide-react';
import { mockCommunityPosts, mockLeaderboard, formatVolume } from '../data/mockData';
import type { CommunityPost } from '../types';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3.6e6);
  if (h < 1) return 'Hace unos minutos';
  if (h < 24) return `Hace ${h}h`;
  return `Hace ${Math.floor(h / 24)}d`;
}

const PostCard: React.FC<{ post: CommunityPost }> = ({ post }) => {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = () => {
    setLiked(l => !l);
    setLikes(l => liked ? l - 1 : l + 1);
  };

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      {/* Header */}
      <div className="flex items-center gap-12" style={{ padding: '14px 16px 10px' }}>
        <div className="avatar avatar-md" style={{ flexShrink: 0 }}>
          {post.userName.slice(0, 2)}
        </div>
        <div style={{ flex: 1 }}>
          <div className="flex items-center gap-8">
            <p style={{ fontSize: 15, fontWeight: 600 }}>{post.userName}</p>
            <span style={{
              background: 'var(--primary-dim)', color: 'var(--primary)',
              fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 'var(--radius-full)',
            }}>
              Nv.{post.userLevel}
            </span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-3)' }}>{timeAgo(post.createdAt)}</p>
        </div>
        {post.type === 'pr' && <Trophy size={18} color="var(--warning)" />}
        {post.type === 'milestone' && <span style={{ fontSize: 18 }}>🏅</span>}
        {post.type === 'workout' && <span style={{ fontSize: 18 }}>💪</span>}
      </div>

      {/* Content */}
      <div style={{ padding: '0 16px 12px' }}>
        <p style={{ fontSize: 14, color: 'var(--text-1)', lineHeight: 1.6, marginBottom: 10 }}>
          {post.content}
        </p>

        {/* PR card */}
        {post.pr && (
          <div style={{
            background: 'var(--warning-dim)', borderRadius: 10,
            padding: '10px 14px',
            border: '1px solid rgba(245,158,11,0.2)',
          }}>
            <p style={{ fontSize: 12, color: 'var(--warning)', fontWeight: 600, marginBottom: 2 }}>
              🏆 NUEVO RÉCORD PERSONAL
            </p>
            <p style={{ fontSize: 16, fontWeight: 800 }}>
              {post.pr.exerciseName}: {post.pr.weight} kg × {post.pr.reps}
            </p>
            <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
              1RM estimado: ~{post.pr.oneRepMax} kg
            </p>
          </div>
        )}

        {/* Workout card */}
        {post.workout && (
          <div style={{
            background: 'var(--primary-dim)', borderRadius: 10, padding: '10px 14px',
            border: '1px solid rgba(99,102,241,0.2)',
          }}>
            <p style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, marginBottom: 4 }}>
              🏋️ {post.workout.name}
            </p>
            <div className="flex gap-20">
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Duración</p>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{post.workout.duration}min</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Volumen</p>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{formatVolume(post.workout.volume ?? 0)}</p>
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Series</p>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{post.workout.totalSets}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-20" style={{ padding: '8px 16px 14px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleLike}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: liked ? 'var(--error)' : 'var(--text-3)',
            fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
            padding: 0,
          }}
        >
          <Heart size={18} fill={liked ? 'var(--error)' : 'none'} /> {likes}
        </button>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-3)', fontSize: 13, fontFamily: 'inherit', padding: 0,
        }}>
          <MessageCircle size={18} /> {post.comments}
        </button>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-3)', fontSize: 13, fontFamily: 'inherit', padding: 0,
        }}>
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );
};

export const CommunityScreen: React.FC = () => {
  const [tab, setTab] = useState<'feed' | 'ranking'>('feed');

  return (
    <div className="screen anim-fade">
      <div style={{ padding: '20px 16px 12px' }}>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>Comunidad</h2>
        <div className="tab-bar">
          <div className={`tab-item ${tab === 'feed' ? 'active' : ''}`} onClick={() => setTab('feed')}>
            Feed
          </div>
          <div className={`tab-item ${tab === 'ranking' ? 'active' : ''}`} onClick={() => setTab('ranking')}>
            Ranking
          </div>
        </div>
      </div>

      {tab === 'feed' && (
        <div style={{ padding: '8px 16px 24px' }}>
          {mockCommunityPosts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      )}

      {tab === 'ranking' && (
        <div style={{ padding: '8px 16px 24px' }}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 4 }}>
              Semana del 27 Mayo – 2 Junio 2024
            </p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>Top usuarios por volumen semanal</p>
          </div>

          <div className="card">
            {mockLeaderboard.map((u, i) => {
              const isMe = u.name === 'Alex García';
              return (
                <div
                  key={i}
                  className="list-item"
                  style={{
                    borderBottom: i < mockLeaderboard.length - 1 ? '1px solid var(--border)' : 'none',
                    background: isMe ? 'var(--primary-dim)' : 'transparent',
                  }}
                >
                  {/* Rank */}
                  <div style={{
                    width: 28, textAlign: 'center', fontWeight: 800,
                    fontSize: i < 3 ? 18 : 14,
                    color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--text-3)',
                    flexShrink: 0,
                  }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                  </div>

                  {/* Avatar */}
                  <div className="avatar avatar-sm" style={{
                    flexShrink: 0,
                    background: isMe ? 'var(--primary)' : 'var(--primary-dim)',
                    color: isMe ? 'white' : 'var(--primary)',
                  }}>
                    {u.avatar}
                  </div>

                  {/* Name */}
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: 14, fontWeight: isMe ? 700 : 500,
                      color: isMe ? 'var(--primary)' : 'var(--text-1)',
                    }}>
                      {u.name} {isMe && '(Tú)'}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-3)' }}>Nivel {u.level}</p>
                  </div>

                  {/* Volume */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>
                      {formatVolume(u.weeklyVolume)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
