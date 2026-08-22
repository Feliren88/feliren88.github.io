---
layout: page
title: Knowing when you don't know is the core safety property
subtitle: Why safe deployment depends on models knowing when to abstain
description: An essay on why AI systems must recognise the limits of their ability, and how calibrated abstention can make that limit measurable.
permalink: /essays/knowing-when-you-dont-know/
---

<style>
  /* Essay page — keep the subtitle on one line and constrain reading width */
  .page-header .subtitle { max-width: none; }
  .page-content { max-width: 44rem; }
  .page-content p { line-height: 1.8; }
  @media (max-width: 760px) { .page-content { max-width: 100%; } }
</style>

We often measure intelligence by what a system can do. I care more about whether it knows when it cannot. A model that answers every question is easy to build trust in and hard to trust well. A model that recognises the edge of its ability can stop before confidence becomes harm.

The idea is old. Socrates claimed one advantage: he knew that he knew nothing. People have long treated an honest view of one's limits as a virtue. We now build systems that make important decisions at a scale no person can fully supervise. That old virtue has become an engineering requirement. Current models do not meet it reliably.

## Capability is not safety

Safety training is often described as a tax on capability. Refusals and guardrails constrain a model that would otherwise answer. That view misses the central risk: a model can be confidently wrong when it had enough evidence to hold back.

Consider a model shown an image and a caption that contradict each other. Its internal representation contains the correct visual answer. Yet the model repeats the false caption without hesitation. The knowledge exists, but the system does not use it. I care about this gap between what a model represents and what it says. The failure is one of honesty, and honesty is a safety property.

Knowing when you do not know has a precise meaning here. The model should use its best-supported internal belief and abstain when that support is weak. It must do so reliably enough for people to build decisions around it.

## Why this is the property that matters most

The stakes rise when a model acts in the world. An overconfident assistant gives one wrong answer. An overconfident agent takes one wrong action, then another. Each error changes what happens next. Loss of control becomes likely when a system continues at the exact point where it should stop and ask a person.

Abstention is therefore a basic control. Oversight, escalation, and human review all depend on a model recognising its own limit. When it cannot recognise that moment, the other controls start too late.

This safety property can also be made rigorous. Many behaviours are hard to specify fully. Calibrated abstention can be defined, measured, and increasingly guaranteed.

## The hard part

The available confidence signals are weak. Softmax probabilities and a model's own confidence statements are often poorly calibrated. A value near one may say little about whether the answer is correct. The engineering task is to give abstention a guarantee instead of a guess.

Conformal prediction offers distribution-free coverage guarantees. It can bound errors without requiring full knowledge of the data distribution. The method replaces “the model seems sure” with a chosen level of coverage for the true answer. That shift from a heuristic to a contract is the technical core of my work.

The limits matter. These guarantees rely on exchangeability. That assumption often fails for agents acting over time, multimodal inputs, and free-form generation with vast output spaces. Extending coverage to those settings remains an open problem. I treat that limit as the work itself.

## And we have only checked any of this in English

One more limit receives too little attention. Most evidence on reading and steering model states comes from English. This includes deception probes, honesty directions, and interventions that move models toward their better judgement. These tools are treated as language-independent without enough testing.

Internal monitoring may work in English and fail silently elsewhere. That would leave the weakest safety coverage with people who already have the least recourse. Knowing when you do not know must hold in Telugu as well as English. Otherwise, it protects only some users.

## The thread

The philosophy and engineering point to the same requirement. Wisdom begins with an honest account of one's limits. Systems we cannot fully supervise need that quality most. We can now measure it and, in some settings, prove it. We can recover knowledge a model already holds, calibrate the edge of its ability, guarantee when it stays silent, and test whether those properties survive across languages and settings.

A capable model without a sound view of its limits is a liability. I would trust an agent only when its “I don't know” has a reliable meaning. That is the property I am working to build.
