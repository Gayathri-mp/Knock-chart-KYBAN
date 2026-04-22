import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Swords } from 'lucide-react-native';
import { Match, MatchMap, Team, getMatchesByRound } from '../lib/tournament';

interface BracketViewProps {
  matches: MatchMap;
  onOpenSelection: (matchId: string, slot: 'teamA' | 'teamB') => void;
  onOpenWinnerSelection: (match: Match) => void;
}

const NODE_W   = 150;
const NODE_H   = 40;
const NODE_GAP = 10;
const COL_GAP  = 100;
const ROW_GAP  = 50;
const BTN_R    = 16;
const PAD_X    = 80;
const PAD_Y    = 80;
const PAIR_H   = NODE_H * 2 + NODE_GAP;

function pitch(r: number) { return Math.pow(2, r) * (PAIR_H + ROW_GAP); }
function pairCentreY(r: number, idx: number) { return idx * pitch(r) + pitch(r) / 2; }
function pairTopY(r: number, idx: number) { return pairCentreY(r, idx) - PAIR_H / 2; }
function colLeft(r: number) { return r * (NODE_W + COL_GAP); }

export const BracketView = ({ matches, onOpenSelection, onOpenWinnerSelection }: BracketViewProps) => {
  const leftRounds  = getMatchesByRound(matches, 'left');
  const rightRounds = getMatchesByRound(matches, 'right');
  const finalMatch      = matches['final'];
  const thirdPlaceMatch = matches['third-place'];

  const numRounds  = leftRounds.length;
  const leafCount  = leftRounds[0]?.length ?? 1;
  const sideH      = leafCount * (PAIR_H + ROW_GAP);
  const sideW      = numRounds * NODE_W + (numRounds - 1) * COL_GAP;
  const centerX    = PAD_X + sideW + COL_GAP;
  const bracketMidY = PAD_Y + sideH / 2;
  const rightBlockX = centerX + NODE_W + COL_GAP;
  const canvasW    = PAD_X + sideW + COL_GAP + NODE_W + COL_GAP + sideW + PAD_X;
  const canvasH    = PAD_Y + sideH + PAD_Y + PAIR_H + ROW_GAP * 4;

  const svgLines: React.ReactElement[] = [];
  const uiNodes:  React.ReactElement[] = [];
  const uiBtns:   React.ReactElement[] = [];

  /* ── Team box ─────────────────────────────────────────────────────────────── */
  function addBox(key: string, ax: number, ay: number, team: Team | null,
    isWinner: boolean, isLoser: boolean, selectable: boolean,
    matchId: string, slot: 'teamA' | 'teamB', badge?: string) {
    uiNodes.push(
      <TouchableOpacity key={key}
        style={[styles.teamBox, { left: ax, top: ay },
          isWinner && styles.winnerBox, isLoser && styles.loserBox]}
        onPress={() => selectable && onOpenSelection(matchId, slot)}
        disabled={!selectable}>
        <View style={[styles.icon, { backgroundColor: team ? team.color + '33' : '#1C2333' }]}>
          <Text style={{ fontSize: 13, color: team?.color ?? '#3A4A5C' }}>
            {team ? team.logo : '?'}
          </Text>
        </View>
        <Text style={[styles.name, !team && styles.empty, isWinner && styles.winnerName]}
          numberOfLines={1}>
          {team?.name ?? (selectable ? 'Select team' : '—')}
        </Text>
        {badge ? (
          <Text style={styles.badge}>{badge}</Text>
        ) : isWinner ? (
          <Text style={styles.badge}>🏆</Text>
        ) : null}
      </TouchableOpacity>
    );
  }

  /* ── Match button ─────────────────────────────────────────────────────────── */
  function addBtn(key: string, cx: number, cy: number, match: Match) {
    const ready = !!(match.teamA && match.teamB);
    uiBtns.push(
      <TouchableOpacity key={key}
        style={[styles.matchBtn,
          { left: cx - BTN_R, top: cy - BTN_R, width: BTN_R * 2, height: BTN_R * 2, borderRadius: BTN_R },
          match.winner && styles.btnWon, !ready && styles.btnLocked]}
        onPress={() => ready && onOpenWinnerSelection(match)}
        disabled={!ready}>
        <Swords size={14} color={match.winner ? '#0A0D10' : ready ? '#00E676' : '#3A4A5C'} />
      </TouchableOpacity>
    );
  }

  /* ── Line helpers ─────────────────────────────────────────────────────────── */
  function hLine(key: string, x1: number, y1: number, x2: number, color: string) {
    svgLines.push(<Line key={key} x1={x1} y1={y1} x2={x2} y2={y1} stroke={color} strokeWidth={2} />);
  }
  function vLine(key: string, x: number, y1: number, y2: number, color: string) {
    svgLines.push(<Line key={key} x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth={2} />);
  }

  const GRAY = '#1E2A38';
  const GREEN = '#00E676';
  const RED   = '#FF4D4D';

  function teamColor(team: Team | null, winner: Team | null) {
    if (!winner || !team) return GRAY;
    return team.id === winner.id ? GREEN : RED;
  }

  /* ── Build one side ───────────────────────────────────────────────────────── */
  function buildSide(rounds: Match[][], isRight: boolean) {
    rounds.forEach((round, r) => {
      round.forEach((match, idx) => {
        const isFirst = r === 0;
        // Absolute x of the team boxes in this round
        const ax = isRight
          ? rightBlockX + (numRounds - 1 - r) * (NODE_W + COL_GAP)
          : PAD_X + colLeft(r);

        const topA = PAD_Y + pairTopY(r, idx);
        const topB = topA + NODE_H + NODE_GAP;
        const cyCentre = PAD_Y + pairCentreY(r, idx);
        const cyA = topA + NODE_H / 2;
        const cyB = topB + NODE_H / 2;

        // Team boxes
        addBox(`${isRight ? 'r' : 'l'}a-${match.matchId}`, ax, topA, match.teamA,
          !!(match.winner && match.teamA?.id === match.winner.id),
          !!(match.winner && match.teamA?.id !== match.winner.id),
          isFirst, match.matchId, 'teamA');
        addBox(`${isRight ? 'r' : 'l'}b-${match.matchId}`, ax, topB, match.teamB,
          !!(match.winner && match.teamB?.id === match.winner.id),
          !!(match.winner && match.teamB?.id !== match.winner.id),
          isFirst, match.matchId, 'teamB');

        if (!match.nextMatchId) return;
        const nextMatch = matches[match.nextMatchId];
        if (!nextMatch) return;

        const isTop = idx % 2 === 0;
        const colA  = teamColor(match.teamA, match.winner);
        const colB  = teamColor(match.teamB, match.winner);
        const winnerCol = match.winner ? GREEN : GRAY;

        if (!isRight) {
          // LEFT side: lines go RIGHT
          const elbowX = ax + NODE_W + COL_GAP / 2;
          // Team lines in
          hLine(`ll-a-${match.matchId}`, ax + NODE_W, cyA, elbowX, colA);
          hLine(`ll-b-${match.matchId}`, ax + NODE_W, cyB, elbowX, colB);
          // Vertical bracket at elbow
          vLine(`ll-v-${match.matchId}`, elbowX, cyA, cyB, GRAY);
          // Match button
          addBtn(`lb-${match.matchId}`, elbowX, cyCentre, match);

          // Winner line to next round
          const nextAx = match.nextMatchId === 'final' ? centerX : PAD_X + colLeft(r + 1);
          const nextIdx = Math.floor(idx / 2);
          const targetY = match.nextMatchId === 'final'
            ? (match.side === 'left' ? bracketMidY - NODE_H / 2 - NODE_GAP / 2 : bracketMidY + NODE_GAP / 2)
            : isTop
              ? PAD_Y + pairTopY(r + 1, nextIdx) + NODE_H / 2
              : PAD_Y + pairTopY(r + 1, nextIdx) + NODE_H + NODE_GAP + NODE_H / 2;

          hLine(`ll-out-${match.matchId}`, elbowX, cyCentre, nextAx, winnerCol);
          if (Math.abs(cyCentre - targetY) > 1) {
            vLine(`ll-vout-${match.matchId}`, nextAx, cyCentre, targetY, winnerCol);
          }
        } else {
          // RIGHT side: lines go LEFT
          const elbowX = ax - COL_GAP / 2;
          hLine(`rl-a-${match.matchId}`, elbowX, cyA, ax, colA);
          hLine(`rl-b-${match.matchId}`, elbowX, cyB, ax, colB);
          vLine(`rl-v-${match.matchId}`, elbowX, cyA, cyB, GRAY);
          addBtn(`rb-${match.matchId}`, elbowX, cyCentre, match);

          const nextAx = match.nextMatchId === 'final'
            ? centerX + NODE_W
            : rightBlockX + (numRounds - 1 - (r + 1)) * (NODE_W + COL_GAP) + NODE_W;
          const nextIdx = Math.floor(idx / 2);
          const targetY = match.nextMatchId === 'final'
            ? bracketMidY + NODE_GAP / 2 + NODE_H / 2
            : isTop
              ? PAD_Y + pairTopY(r + 1, nextIdx) + NODE_H / 2
              : PAD_Y + pairTopY(r + 1, nextIdx) + NODE_H + NODE_GAP + NODE_H / 2;

          hLine(`rl-out-${match.matchId}`, nextAx, cyCentre, elbowX, winnerCol);
          if (Math.abs(cyCentre - targetY) > 1) {
            vLine(`rl-vout-${match.matchId}`, nextAx, cyCentre, targetY, winnerCol);
          }
        }
      });
    });
  }

  buildSide(leftRounds, false);
  buildSide(rightRounds, true);

  /* ── FINAL ────────────────────────────────────────────────────────────────── */
  if (finalMatch) {
    const topA = bracketMidY - NODE_H - NODE_GAP / 2;
    const topB = bracketMidY + NODE_GAP / 2;

    // Determine placement badges
    const champA = !!(finalMatch.winner && finalMatch.teamA?.id === finalMatch.winner.id);
    const champB = !!(finalMatch.winner && finalMatch.teamB?.id === finalMatch.winner.id);

    addBox('fin-a', centerX, topA, finalMatch.teamA, champA,
      !!(finalMatch.winner && !champA && finalMatch.teamA),
      false, 'final', 'teamA', champA ? '🥇' : finalMatch.winner && finalMatch.teamA ? '🥈' : undefined);
    addBox('fin-b', centerX, topB, finalMatch.teamB, champB,
      !!(finalMatch.winner && !champB && finalMatch.teamB),
      false, 'final', 'teamB', champB ? '🥇' : finalMatch.winner && finalMatch.teamB ? '🥈' : undefined);

    if (finalMatch.teamA && finalMatch.teamB) {
      addBtn('fin-btn', centerX + NODE_W / 2, bracketMidY, finalMatch);
    }

    uiNodes.push(<Text key="fin-lbl" style={[styles.sectionLabel, { left: centerX, top: topA - 22 }]}>🏆 GRAND FINAL</Text>);
  }

  /* ── 3RD PLACE ────────────────────────────────────────────────────────────── */
  if (thirdPlaceMatch) {
    const t3Top = bracketMidY + PAIR_H + ROW_GAP * 2;
    const t3TopA = t3Top;
    const t3TopB = t3Top + NODE_H + NODE_GAP;
    const t3CY   = t3Top + PAIR_H / 2;

    const win3A = !!(thirdPlaceMatch.winner && thirdPlaceMatch.teamA?.id === thirdPlaceMatch.winner.id);
    const win3B = !!(thirdPlaceMatch.winner && thirdPlaceMatch.teamB?.id === thirdPlaceMatch.winner.id);

    addBox('3p-a', centerX, t3TopA, thirdPlaceMatch.teamA, win3A,
      !!(thirdPlaceMatch.winner && !win3A && thirdPlaceMatch.teamA),
      false, 'third-place', 'teamA', win3A ? '🥉' : undefined);
    addBox('3p-b', centerX, t3TopB, thirdPlaceMatch.teamB, win3B,
      !!(thirdPlaceMatch.winner && !win3B && thirdPlaceMatch.teamB),
      false, 'third-place', 'teamB', win3B ? '🥉' : undefined);

    if (thirdPlaceMatch.teamA && thirdPlaceMatch.teamB) {
      addBtn('3p-btn', centerX + NODE_W / 2, t3CY, thirdPlaceMatch);
    }
    uiNodes.push(<Text key="3p-lbl" style={[styles.sectionLabel, { left: centerX, top: t3TopA - 22 }]}>🥉 3RD PLACE</Text>);
  }

  return (
    <ScrollView horizontal contentContainerStyle={styles.outerScroll}>
      <ScrollView contentContainerStyle={styles.innerScroll}>
        <View style={{ width: canvasW, height: canvasH }}>
          <Svg width={canvasW} height={canvasH} style={StyleSheet.absoluteFill} pointerEvents="none">
            {svgLines}
          </Svg>
          {uiNodes}
          {uiBtns}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outerScroll: { backgroundColor: '#0A0D10' },
  innerScroll: { padding: 0, paddingBottom: 60 },
  sectionLabel: { position: 'absolute', fontSize: 9, fontWeight: 'bold', color: '#F5A623', letterSpacing: 1, zIndex: 5 },
  teamBox: { position: 'absolute', width: NODE_W, height: NODE_H, backgroundColor: '#0F1520', borderRadius: 8, borderWidth: 1, borderColor: '#1E2738', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 8 },
  winnerBox: { borderColor: '#00E676', backgroundColor: '#091A12' },
  loserBox: { borderColor: '#FF4D4D44', opacity: 0.45 },
  icon: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  name: { flex: 1, fontSize: 12, fontWeight: '700', color: '#C8D6E5' },
  empty: { color: '#3A4A5C', fontWeight: '400', fontStyle: 'italic' },
  winnerName: { color: '#FFFFFF' },
  badge: { fontSize: 14 },
  matchBtn: { position: 'absolute', backgroundColor: '#0F1520', borderWidth: 2, borderColor: '#2A3A50', alignItems: 'center', justifyContent: 'center', zIndex: 10, elevation: 8 },
  btnWon: { backgroundColor: '#00E676', borderColor: '#00E676' },
  btnLocked: { opacity: 0.35 },
});
