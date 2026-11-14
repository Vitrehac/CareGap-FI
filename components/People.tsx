// Friendly flat illustration for the hero: the people the pathway serves and the people who run it.
// Hand-drawn SVG, no external assets. Kept simple on purpose — a calm, human first impression.

type P = {
  x: number;
  y: number;
  s?: number;
  skin: string;
  shirt: string;
  hair?: string;
  look: "short" | "curly" | "long" | "bangs" | "hijab" | "bob" | "bald";
  glasses?: boolean;
  coat?: boolean;
};

function Person({ x, y, s = 1, skin, shirt, hair = "#2b2320", look, glasses, coat }: P) {
  const covered = look === "hijab";
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* hijab drapes behind the head and over the shoulders */}
      {covered && <path d="M-44 6 C-46 -48 46 -48 44 6 C44 34 38 58 0 66 C-38 58 -44 34 -44 6 Z" fill={hair} />}
      {/* back hair */}
      {(look === "long" || look === "bangs") && <path d="M-36 -4 C-38 -44 38 -44 36 -4 L38 50 C20 56 -20 56 -38 50 Z" fill={hair} />}
      {look === "bob" && <path d="M-37 0 C-38 -42 38 -42 37 0 L36 30 C20 36 -20 36 -36 30 Z" fill={hair} />}
      {/* torso: shoulders rise to meet a short, sturdy neck */}
      <path d="M-66 128 C-66 84 -44 60 -18 56 L18 56 C44 60 66 84 66 128 Z" fill={coat ? "#ffffff" : shirt} stroke={coat ? "#dde9e2" : "none"} strokeWidth="2" />
      {!covered && (
        <>
          <path d="M-13 22 L-13 50 C-13 60 13 60 13 50 L13 22 Z" fill={skin} />
          <path d="M-13 30 C-6 38 6 38 13 30 L13 36 C6 44 -6 44 -13 36 Z" fill="rgb(0 0 0 / 0.12)" />
        </>
      )}
      {/* collar */}
      {coat ? (
        <>
          <path d="M-16 56 L0 96 L16 56 Z" fill={shirt} />
          <path d="M-24 62 C-32 90 -8 104 0 104 C8 104 32 90 24 62" fill="none" stroke="#46574f" strokeWidth="3" strokeLinecap="round" />
          <circle cx="0" cy="104" r="5" fill="#46574f" />
        </>
      ) : (
        !covered && <path d="M-18 56 C-10 66 10 66 18 56" fill="none" stroke="rgb(255 255 255 / 0.55)" strokeWidth="4" strokeLinecap="round" />
      )}
      {/* ears + head */}
      {!covered && <circle cx="-31" cy="4" r="7" fill={skin} />}
      {!covered && <circle cx="31" cy="4" r="7" fill={skin} />}
      <ellipse cx="0" cy="0" rx="31" ry="33" fill={skin} />
      {/* front hair */}
      {look === "short" && <path d="M-31 -2 C-33 -40 31 -44 31 -6 C20 -18 -6 -22 -31 -2 Z" fill={hair} />}
      {look === "curly" && (
        <g fill={hair}>
          {[-27, -14, 0, 14, 27].map((cx, i) => (
            <circle key={i} cx={cx} cy={-24 + Math.abs(cx) * 0.3} r="13" />
          ))}
          <circle cx="0" cy="-38" r="14" />
        </g>
      )}
      {look === "long" && <path d="M-31 -4 C-31 -38 31 -38 31 -4 C14 -18 -10 -18 -31 -4 Z" fill={hair} />}
      {look === "bob" && <path d="M-32 0 C-33 -38 33 -38 32 0 C18 -16 -14 -16 -32 0 Z" fill={hair} />}
      {/* straight hair with a blunt fringe */}
      {look === "bangs" && <path d="M-32 2 C-34 -40 34 -40 32 2 L32 -8 L-32 -8 Z" fill={hair} />}
      {look === "bald" && (
        <g fill={hair}>
          <path d="M-31 2 C-32 -8 -28 -14 -24 -14 L-26 6 Z" />
          <path d="M31 2 C32 -8 28 -14 24 -14 L26 6 Z" />
        </g>
      )}
      {covered && <path d="M-33 -6 C-30 -40 30 -40 33 -6 C24 -24 -24 -24 -33 -6 Z" fill={hair} />}
      {/* face */}
      <circle cx="-15" cy="12" r="5" fill="rgb(232 120 100 / 0.22)" />
      <circle cx="15" cy="12" r="5" fill="rgb(232 120 100 / 0.22)" />
      {/* almond-shaped eyes, the same gentle shape for everyone (dir mirrors the outer corner) */}
      {[
        [-10, -1],
        [10, 1],
      ].map(([ex, dir]) => (
        <path
          key={ex}
          d={`M${ex - 5 * dir} 3.2 Q${ex} -1.6 ${ex + 5 * dir} 1.6 Q${ex} 5.6 ${ex - 5 * dir} 3.2 Z`}
          fill="#1d2b25"
        />
      ))}
      <path d="M-9 14 Q0 21 9 14" stroke="#1d2b25" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {glasses && (
        <g fill="none" stroke="#1d2b25" strokeWidth="2">
          <circle cx="-10" cy="2" r="8" />
          <circle cx="10" cy="2" r="8" />
          <path d="M-2 2 H2 M-18 0 L-30 -2 M18 0 L30 -2" />
        </g>
      )}
    </g>
  );
}

export function People({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 420" className={className} role="img" aria-label="Illustration of patients and healthcare workers of different ages and backgrounds">
      <circle cx="290" cy="210" r="190" fill="#f1e4d2" />
      <circle cx="430" cy="90" r="46" fill="#e3f3ea" />
      <circle cx="120" cy="330" r="30" fill="#faf6f0" stroke="#e6d8c4" strokeWidth="2" />
      {/* back row */}
      <Person x={180} y={132} s={0.9} skin="#f1cdb1" shirt="#9cc9b0" hair="#b9b4ad" look="bald" glasses />
      <Person x={300} y={112} s={0.93} skin="#7a4a2c" shirt="#1f8a5c" hair="#1d1612" look="curly" coat />
      <Person x={420} y={140} s={0.88} skin="#d7a57e" shirt="#f4c7a1" hair="#2f6f5b" look="hijab" />
      {/* front row */}
      <Person x={128} y={272} s={0.95} skin="#9b6340" shirt="#c9b6e4" hair="#cfcac4" look="bob" />
      <Person x={260} y={286} s={1} skin="#b47b52" shirt="#e9785f" hair="#1d1612" look="short" />
      <Person x={392} y={280} s={0.97} skin="#e8c39a" shirt="#f2d36b" hair="#1a1514" look="bangs" />
      {/* a small plus — care */}
      <g transform="translate(470 300)" fill="#1f8a5c">
        <rect x="-6" y="-18" width="12" height="36" rx="5" />
        <rect x="-18" y="-6" width="36" height="12" rx="5" />
      </g>
    </svg>
  );
}
