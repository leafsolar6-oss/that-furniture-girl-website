#!/usr/bin/env python3
"""
Builds figma/tokens.json from the real :root block in assets/css/style.css.

Output is W3C Design Tokens (DTCG) format, which imports into Figma through
Tokens Studio ("Import" -> JSON) and can be read by the Figma MCP server.
Re-run after editing style.css so the design file never drifts from the code.
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
CSS = os.path.join(HERE, "..", "public", "assets", "css", "style.css")
ARRANGEMENT = os.path.join(HERE, "..", "public", "assets", "css", "arrangement.css")

raw = open(CSS, encoding="utf-8").read()
# the reference-arrangement skin adds the warm palette on top
raw_extra = open(ARRANGEMENT, encoding="utf-8").read()
root = re.search(r":root\s*\{(.*?)\}", raw, re.S).group(1)
vars_ = dict(re.findall(r"--([\w-]+)\s*:\s*([^;]+);", root))

COLOUR_DESC = {
    "green": "Buttons, footer, dark bands",
    "green-dark": "Hover on green, hero wash",
    "green-mid": "Day tone",
    "green-soft": "Icon tiles on light",
    "amber": "Accents, badges, icon tiles",
    "amber-dark": "Amber hover",
    "amber-soft": "Soft amber fills",
    "ink": "Headings, body",
    "ink-soft": "Secondary body",
    "muted": "Paragraphs, captions",
    "muted-2": "Fine print, kickers",
    "bg": "Page background",
    "surface": "Cards, sheets",
    "surface-3": "Pressed / hover fills",
    "line": "Borders, dividers",
    "line-soft": "Card borders",
}


def dim(v):
    return {"$type": "dimension", "$value": v.strip()}


colour, radius, shadow, spacing, sizing, motion = {}, {}, {}, {}, {}, {}
WARM = {
    "gold": ("#CE9A43", "Primary CTA, active filter tab"),
    "gold-dark": ("#B3832F", "Gold hover"),
    "gold-soft": ("#F7EEDD", "Focus ring, soft chips"),
    "wa": ("#1FA34A", "WhatsApp order buttons"),
    "wa-dark": ("#17863C", "WhatsApp hover"),
    "sand": ("#F1ECE2", "Photo panels behind products"),
}

for name, value in vars_.items():
    v = " ".join(value.split())
    if (v.startswith("#") and len(v) in (4, 7)) or (v.startswith("rgba(") and name.startswith("line")):
        colour[name] = {"$type": "color", "$value": v.upper() if v.startswith("#") else v,
                        "$description": COLOUR_DESC.get(name, "Hairline on dark bands")}
    elif name.startswith("shadow-"):
        shadow[name.replace("shadow-", "")] = {
            "$type": "boxShadow", "$value": v,
            "$description": {"sm": "Resting cards", "md": "Hover, dropdowns",
                             "lg": "Modal, drawer", "green": "Green buttons and chips"}.get(
                                 name.replace("shadow-", ""), "")}
    elif name == "radius":
        radius["default"] = dim(v)
    elif name.startswith("radius-"):
        radius[name.replace("radius-", "")] = dim(v)
    elif name == "pill":
        radius["pill"] = dim(v)
    elif name in ("container", "gutter", "section-y"):
        spacing[name] = dim(v)
    elif v.startswith("clamp(") or v.endswith("px"):
        sizing[name] = dim(v)
    elif name == "ease":
        motion[name] = {"$type": "cubicBezier", "$value": [0.22, 0.61, 0.36, 1],
                        "$description": "Default easing"}
    elif name.startswith("font-"):
        continue
    else:
        motion[name] = {"$type": "other", "$value": v}


typography = {
    "family": {"$type": "fontFamily", "$value": ["Plus Jakarta Sans", "Inter", "Helvetica Neue", "Arial", "sans-serif"]},
    "weights": {
        "regular": {"$type": "fontWeight", "$value": 400},
        "semibold": {"$type": "fontWeight", "$value": 600},
        "bold": {"$type": "fontWeight", "$value": 700},
        "extrabold": {"$type": "fontWeight", "$value": 800},
    },
    "display": {"$type": "typography", "$value": {"fontFamily": "{typography.family}", "fontWeight": "{typography.weights.extrabold}",
                "fontSize": "clamp(34px, 5.4vw, 62px)", "lineHeight": 1.03, "letterSpacing": "-0.028em"}},
    "h2": {"$type": "typography", "$value": {"fontFamily": "{typography.family}", "fontWeight": "{typography.weights.extrabold}",
           "fontSize": "clamp(28px, 4vw, 44px)", "lineHeight": 1.08, "letterSpacing": "-0.024em"}},
    "h3": {"$type": "typography", "$value": {"fontFamily": "{typography.family}", "fontWeight": "{typography.weights.bold}",
           "fontSize": "clamp(21px, 2.6vw, 28px)", "lineHeight": 1.2, "letterSpacing": "-0.02em"}},
    "body": {"$type": "typography", "$value": {"fontFamily": "{typography.family}", "fontWeight": "{typography.weights.regular}",
             "fontSize": "16.5px", "lineHeight": 1.68, "letterSpacing": "0"}},
    "small": {"$type": "typography", "$value": {"fontFamily": "{typography.family}", "fontWeight": "{typography.weights.regular}",
              "fontSize": "14px", "lineHeight": 1.6, "letterSpacing": "0"}},
    "eyebrow": {"$type": "typography", "$value": {"fontFamily": "{typography.family}", "fontWeight": "{typography.weights.extrabold}",
                "fontSize": "12.5px", "lineHeight": 1.2, "letterSpacing": "0.16em"}},
}

grid = {
    "columns-mobile": {"$type": "number", "$value": 1, "$description": "below 560px"},
    "columns-small": {"$type": "number", "$value": 2, "$description": "560px and up"},
    "columns-medium": {"$type": "number", "$value": 3, "$description": "900px and up"},
    "columns-large": {"$type": "number", "$value": 4, "$description": "1200px and up"},
    "breakpoints": {
        "sm": {"$type": "dimension", "$value": "560px"},
        "md": {"$type": "dimension", "$value": "760px"},
        "lg": {"$type": "dimension", "$value": "900px"},
        "xl": {"$type": "dimension", "$value": "1200px"},
    },
    "gap": {"$type": "dimension", "$value": "24px", "$description": "between cards"},
}

tokens = {
    "$description": "That Furniture Girl design tokens - generated from public/assets/css/style.css :root by figma/make_tokens.py. Import into Figma with Tokens Studio, or read via the Figma MCP server.",
    "$themes": [],
    "motion": motion,
    "colour": colour,
    "radius": radius,
    "shadow": shadow,
    "typography": typography,
    "spacing": spacing,
    "sizing": sizing,
    "grid": grid,
}

for name, (hexv, use) in WARM.items():
    if name not in colour:
        colour[name] = {"$type": "color", "$value": hexv, "$description": use}

out = os.path.join(HERE, "tokens.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump(tokens, f, indent=2)
print("wrote", out, len(colour), "colours,", len(radius), "radii,", len(shadow), "shadows,", len(spacing) + len(sizing), "dimensions")
