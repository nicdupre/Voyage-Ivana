const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion

export function generateInviteCode(length = 6): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
}

const MEMBER_COLORS = ["#0f766e", "#f59e0b", "#dc2626", "#2563eb", "#7c3aed", "#db2777", "#059669", "#ea580c"];

export function colorForIndex(index: number): string {
  return MEMBER_COLORS[index % MEMBER_COLORS.length];
}
