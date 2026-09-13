# XYZ / STAR / ATS Resume Standard

## Sources

This reference adapts:

- Harvard Career Services resume and bullet-writing guidance.
- Google XYZ formula.
- r/EngineeringResumes bullet and formatting practices.
- `dabydat/resume-builder-skill`, especially its bullet-writing, ATS, formatting, and common-mistakes references.

Source URLs:

- https://github.com/dabydat/resume-builder-skill
- https://github.com/dabydat/resume-builder-skill/blob/master/skill/references/bullet-writing-guide.md
- https://github.com/dabydat/resume-builder-skill/blob/master/skill/references/ats-and-keywords.md
- https://github.com/dabydat/resume-builder-skill/blob/master/skill/references/common-mistakes.md
- https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/
- https://www.reddit.com/r/EngineeringResumes/

## XYZ Formula

Use XYZ as the default quality target for each substantive experience bullet:

> Accomplished X, as measured by Y, by doing Z.

- **X — accomplishment:** what changed, shipped, improved, or became possible.
- **Y — evidence:** metric, percentage, volume, scale, frequency, coverage, or another verified indicator.
- **Z — method:** analysis, technology, model, workflow, decision, or specific action used.

The order is flexible in Chinese:

- `通过 Z 完成 X，带来 Y`
- `主导 Z，实现 X，Y 提升 ...`
- `针对任务/问题，执行 Z，最终 X/Y`

Do not make every bullet sound identical. Preserve natural Chinese while ensuring the three elements are easy to identify.

## Strictness Without Fabrication

- X and Z are required for a strong bullet.
- Use a hard metric for Y when the user provides one.
- If no outcome metric exists, use verified scale evidence: `100+ event`, `4 类场景`, `覆盖完整漏斗`, `两周内`, `数十名成员`.
- Technologies and domain details support Z; they do not automatically prove Y.
- Never invent a metric, result, user count, ranking, or business impact to complete XYZ.
- If Y is genuinely missing, keep an accurate action/output bullet and list the missing evidence in the final suggestions.

## STAR As An Exception

Use condensed STAR only when context is necessary to understand the decision:

- **S/T:** one short clause describing the problem or task.
- **A:** the candidate's specific action and ownership.
- **R:** verified result or reusable output.

Keep condensed STAR in one logical sentence and usually 1–2 visual lines. Do not create four labeled STAR paragraphs.

## Bullet Construction

Each bullet should:

1. Cover one coherent theme.
2. Start with or quickly surface a concrete action.
3. Explain domain context where it changes the meaning of the work.
4. Attach evidence to the action that produced it.
5. Use digits for numbers.
6. Target 1–2 visual lines; 3 is the maximum for complex, high-value work.
7. Order bullets from most relevant or impressive to least.

Useful Chinese action verbs:

- 主导、搭建、设计、开发、分析、识别、验证、优化、修正
- 自动化、标准化、沉淀、推动、上线、定位、诊断、复盘、协同

Avoid vague ownership:

- `负责`、`参与`、`协助`、`处理`、`跟进`

If those words are factually necessary, immediately specify the concrete contribution:

- Weak: `参与 NLP2SQL 建设`
- Better when evidence is available: `参与 NLP2SQL 建设，负责 [模块/数据/评测]，实现 [结果]`

Do not upgrade `参与` to `主导` without user evidence.

## Quantification

Strong evidence includes:

- Business impact: GMV, conversion, orders, retention, latency, cost.
- Statistical evidence: effect size, confidence, significance, error rate.
- Scale: users, events, tables, dashboards, scenarios, data volume.
- Frequency/time: daily, weekly, two weeks, release cadence.
- Coverage: end-to-end funnel, multiple product types, cross-team rollout.
- Reusability: standard metric group, shared framework, automated workflow.

## Anti-Patterns

Remove or rewrite:

- Passive responsibility lists without outcomes.
- Subjective claims such as `学习很多`, `沟通能力强`, `优秀`.
- Repeated background paragraphs.
- Buzzwords without a concrete action.
- Unverified superlatives.
- Technologies listed without describing how they were applied.
- Keyword stuffing or hidden ATS text.
- Unexplained internal acronyms when an external reader cannot infer their meaning.

## Five-Second Scan

On the first scan, a recruiter should see:

- Candidate name and reliable contact information.
- Current/recent role and strongest relevant experience.
- Core methods, tools, and verified impact.
- Clear section hierarchy and reverse chronology.

Put the strongest bullet first within each role.

## ATS And Delivery

- Prefer a single-column reading order for substantive content.
- Use standard section names and consistent dates.
- Keep contact information in the document body.
- Use natural JD terminology only when supported by real experience.
- Deliver a text-based PDF and verify with `pdftotext`.
- Verify page count with `pdfinfo`.
- Visually inspect the final PDF for clipping, overlaps, tiny type, and poor whitespace.

## Local Skill Precedence

This repository's user requirements override generic international conventions:

- Preserve the requested A4 HTML/CSS workflow and official Chromium exporter.
- Preserve user-requested local photos, company Logo banners, and Chinese section structure.
- Preserve one-page requirements and named version variants.
- Never remove verified content solely because an external guide prefers a different regional convention.
