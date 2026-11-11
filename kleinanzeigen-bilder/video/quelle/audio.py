import json, numpy as np, os
from scipy.signal import butter, sosfilt, fftconvolve
from scipy.io import wavfile

D = os.path.dirname(os.path.abspath(__file__))
SR = 48000
ev = json.load(open(f"{D}/events.json"))
TOTAL = ev["total"]
N = int(TOTAL * SR) + SR
rng = np.random.default_rng(7)

music = np.zeros((N, 2)); sfx = np.zeros((N, 2)); send = np.zeros((N, 2))

def t_(d): return np.arange(int(d * SR)) / SR
def lp(x, f, o=2): return sosfilt(butter(o, f, "low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, "high", fs=SR, output="sos"), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], "band", fs=SR, output="sos"), x)
def hz(n): return 440 * 2 ** ((n - 69) / 12)
def put(buf, t, x, pan=0.0, gain=1.0):
    i = int(t * SR)
    if i >= N: return
    x = x[: N - i] * gain
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:i + len(x), 0] += x * l * 1.414
    buf[i:i + len(x), 1] += x * r * 1.414
def env(n, a, r):
    e = np.ones(n); a = max(1, int(a * SR)); r = max(1, int(r * SR))
    e[:a] = np.linspace(0, 1, a); e[-r:] *= np.linspace(1, 0, r); return e
def saw(f, d):
    ph = (t_(d) * f) % 1.0; return 2 * ph - 1

# ---------------- music @120 BPM ----------------
BEAT = 0.5; BAR = 2.0
CH = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]   # Am F C G
def chord_at(t): return CH[int(t // BAR) % 4]
def in_break(t): return 33.0 <= t < 36.0
full_from = 4.0

# pad
for b in range(int(TOTAL // BAR) + 1):
    t0 = b * BAR; d = BAR + 0.6
    x = np.zeros(int(d * SR))
    for n in chord_at(t0):
        for det in (-0.08, 0.0, 0.07):
            x += saw(hz(n) * 2 ** (det / 12), d) + 0.5 * saw(hz(n - 12) * 2 ** (det / 12), d)
    x = lp(x, 900 if t0 < 4 else 1400) * env(len(x), 0.35, 0.6) * 0.035
    g = min(1.0, t0 / 2.0 + 0.25)
    put(music, t0, x, pan=-0.15, gain=g); put(send, t0, x, gain=0.4 * g)

# drums, bass, arp
def kick():
    tt = t_(0.35); f = 45 + 110 * np.exp(-tt * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * 0.9
def hat():
    x = hp(rng.standard_normal(int(0.06 * SR)), 7000); return lp(x, 12000) * np.exp(-t_(0.06) * 70) * 0.08
def clap():
    x = bp(rng.standard_normal(int(0.2 * SR)), 900, 3000); e = np.exp(-t_(0.2) * 22)
    return x * e * 0.22
K, H, C = kick(), hat(), clap()
t = full_from
while t < TOTAL - 0.4:
    beat = int(round(t / BEAT)); outro = t >= 43.0
    if not in_break(t):
        if beat % 1 == 0 and not (outro and t > 45.5): put(music, t, K, gain=0.75 if not outro else 0.5)
        if t >= 8.5 and beat % 2 == 1 and not outro: put(music, t, C, pan=0.05)
        for off in (0.25,):
            if t >= 8.5 and not outro: put(music, t + off, H, pan=0.3)
        # bass: eighths on root
        root = chord_at(t)[0] - 24
        for off in (0.0, 0.25):
            if outro and t > 45.5: break
            x = np.sin(2 * np.pi * hz(root) * t_(0.22)) + 0.25 * np.sin(4 * np.pi * hz(root) * t_(0.22))
            x = np.tanh(1.6 * x) * env(len(x), 0.004, 0.08) * 0.16
            put(music, t + off, x)
    t += BEAT
# arpeggio plucks (16ths -> 8ths)
t = full_from
pat = [0, 1, 2, 1, 2, 0, 1, 2]
step = 0
while t < TOTAL - 1.0:
    if not in_break(t) or t >= 34.0:
        ch = chord_at(t); n = ch[pat[step % 8]] + 12 + (12 if step % 8 == 4 else 0)
        d = 0.4; tt = t_(d)
        x = (np.sin(2 * np.pi * hz(n) * tt) + 0.3 * np.sin(2 * np.pi * 2 * hz(n) * tt)) * np.exp(-tt * 9) * 0.05
        g = 0.55 if in_break(t) else 1.0
        put(music, t, x, pan=0.35 if step % 2 else -0.35, gain=g); put(send, t, x, gain=0.6 * g)
        put(send, t + 0.375, x, pan=-0.5, gain=0.35 * g)  # delay echo
    t += 0.25; step += 1

# ---------------- SFX ----------------
def whoosh(d=0.5, lo=300, hi=3500, g=0.35):
    n = int(d * SR); x = rng.standard_normal(n); out = np.zeros(n); seg = 256
    for i in range(0, n, seg):
        p = i / n; fc = lo * (hi / lo) ** (np.sin(np.pi * p) ** 0.8)
        out[i:i + seg] = bp(x[max(0, i - 2048):i + seg], fc * 0.7, min(fc * 1.4, 20000))[-len(out[i:i + seg]):]
    return out * np.sin(np.pi * np.linspace(0, 1, n)) ** 1.5 * g
def mallet(note, g=0.3, d=0.5):
    tt = t_(d); f = hz(note)
    x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 7) + 0.35 * np.sin(2 * np.pi * 3.99 * f * tt) * np.exp(-tt * 25)
    x[: int(0.002 * SR)] *= np.linspace(0, 1, int(0.002 * SR))
    return x * g
def tick(f=2600, g=0.12):
    tt = t_(0.03); return np.sin(2 * np.pi * f * tt) * np.exp(-tt * 180) * g
def bell(notes, g=0.25, d=3.0):
    tt = t_(d); x = np.zeros(len(tt))
    for n in notes:
        f = hz(n)
        for k, (m, a, dec) in enumerate([(1, 1, 1.4), (2.76, .4, 3), (5.4, .2, 5), (8.93, .1, 8)]):
            x += a * np.sin(2 * np.pi * f * m * tt) * np.exp(-tt * dec)
    return x / len(notes) * g
def impact(g=0.7):
    tt = t_(1.6); f = 38 + 60 * np.exp(-tt * 12)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.6)
    nz = lp(rng.standard_normal(len(tt)), 2500) * np.exp(-tt * 10) * 0.5
    return np.tanh((sub + nz) * 1.4) * g
def riser(d=1.7, g=0.3):
    tt = t_(d); f = 200 * (12 ** (tt / d))
    x = 0.5 * np.sin(2 * np.pi * np.cumsum(f) / SR) + bp(rng.standard_normal(len(tt)), 1500, 7000) * 0.3
    return x * (tt / d) ** 2.2 * g
def strike(g=0.25):
    n = int(0.35 * SR); x = bp(rng.standard_normal(n), 1200, 6000) * np.exp(-t_(0.35) * 9)
    return x * g

PENTA = [69, 72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96, 98]
pop_i = 0; coin_i = 0; whoosh_i = 0
for t, k in ev["events"]:
    if k in ("whoosh", "whoosh_soft", "whoosh_long"):
        d, g = {"whoosh": (0.55, .30), "whoosh_soft": (0.45, .14), "whoosh_long": (1.3, .18)}[k]
        x = whoosh(d, g=g); pan = -0.6 if whoosh_i % 2 else 0.6; whoosh_i += 1
        put(sfx, t - d * 0.45, x, pan=pan); put(send, t - d * 0.45, x, gain=0.3)
    elif k == "pop":
        x = mallet(PENTA[pop_i % len(PENTA)], g=.20); pop_i += 1
        put(sfx, t + .05, x, pan=-0.5 + (pop_i % 7) / 6); put(send, t + .05, x, gain=0.5)
    elif k == "pop_soft":
        x = mallet(81 + (pop_i % 3) * 3, g=.13); pop_i += 1; put(sfx, t + .05, x); put(send, t + .05, x, gain=0.4)
    elif k == "tick":
        put(sfx, t + .1, tick(3000, .07), pan=0.2)
    elif k == "ping":
        x = lp(bell([88], g=.10, d=1.5), 6000); put(sfx, t + .12, x, pan=0.4); put(send, t + .12, x, gain=.5)
    elif k == "slide_swish":
        put(sfx, t, whoosh(0.9, 500, 2500, .08), pan=0.3)
    elif k == "coin_tick":
        x = tick(2200 + coin_i * 40, .09) + tick(3300 + coin_i * 60, .05); coin_i += 1
        put(sfx, t + .03, x, pan=-0.4 + (coin_i % 12) / 15)
    elif k == "riser":
        x = riser(1.7, g=.22); put(sfx, t, x); put(send, t, x, gain=.4)
    elif k == "strike":
        put(sfx, t, strike(), pan=-0.2)
    elif k in ("impact", "drop"):
        x = impact(0.55 if k == "impact" else 0.38); put(sfx, t, x); put(send, t, x, gain=.25)
    elif k == "impact_soft":
        x = impact(0.3); put(sfx, t, x); put(send, t, x, gain=.25)
    elif k == "chime":
        x = bell([81, 85, 88], g=.22, d=3.5); put(sfx, t, x); put(send, t, x, gain=.7)
    elif k == "break":
        x = lp(rng.standard_normal(int(.8 * SR)), 600) * np.exp(-t_(.8) * 5) * .25; put(sfx, t, x)
    elif k == "click":
        put(sfx, t, tick(1800, .12) + tick(900, .08))

# ---------------- reverb + master ----------------
ir_t = t_(2.2)
ir = np.stack([rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 3.2) for _ in range(2)], 1)
ir[:, 0] = lp(ir[:, 0], 5000); ir[:, 1] = lp(ir[:, 1], 5000)
wet = np.stack([fftconvolve(send[:, c], ir[:, c])[:N] for c in range(2)], 1) * 0.06

# duck music slightly under sfx impacts
mix = music * 0.9 + sfx + wet
mix[:, 0] = hp(mix[:, 0], 28); mix[:, 1] = hp(mix[:, 1], 28)
# fades
fi = int(0.3 * SR); mix[:fi] *= np.linspace(0, 1, fi)[:, None]
end = int(TOTAL * SR); fo = int(1.6 * SR)
mix[end - fo:end] *= np.linspace(1, 0, fo)[:, None]; mix[end:] = 0
mix = mix[:end]
mix = np.tanh(mix * 1.2) / np.tanh(1.2)
mix *= 0.89 / np.max(np.abs(mix))
wavfile.write(f"{D}/audio.wav", SR, (mix * 32767).astype(np.int16))
print("ok", mix.shape, "rms", float(np.sqrt(np.mean(mix ** 2))))
