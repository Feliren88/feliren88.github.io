---
layout: page
title: Knowing when you don't know is the core safety property
subtitle: Why calibrated abstention, more than raw capability, is what makes a model safe to deploy
description: An essay arguing that the central safety property of an AI system is not how much it knows but whether it knows the boundary of its own competence — and why that is a measurable, guaranteeable target.
permalink: /essays/knowing-when-you-dont-know/
---

We keep measuring intelligence by what a system can do. I think the more important question is whether it knows when it cannot. A model that answers everything does not impress me. A model that knows where its competence ends, and stops there, does.

This is not a new idea. It is one of the oldest. What Socrates claimed as his only advantage was knowing that he knew nothing. Epistemic humility, an accurate sense of the limits of your own knowledge, has been treated as a virtue for as long as people have written about virtue. What is new is that we now build systems that make consequential decisions, at scale, in domains their makers cannot fully supervise. The old virtue has become an engineering requirement, and it is one we are mostly failing.

## Capability is not safety

The instinct in the field is to treat safety as a tax on capability, a set of refusals and guardrails bolted onto an otherwise eager model. I think that framing is backwards. The most dangerous model is the one that is confidently wrong in a situation where it could have known to hold back. An over-cautious model is rarely the real risk.

Consider the concrete shape of the failure. A model is shown an image that clearly depicts one thing, and a caption that asserts another. Its own internal representation encodes the correct answer. And yet it reports the false one, fluently and without hesitation. The knowledge was there. The system simply did not act on it. The gap between what a model internally represents and what it actually says is the quantity I care about most in deployed AI. A model that states a falsehood it could have flagged does not have a knowledge problem. It has an honesty problem, and honesty is a safety property.

So when I say knowing when you don't know, I mean something precise, and it is not modesty or a tuned-up refusal rate. I mean the system surfacing its own better-supported internal belief, and abstaining when that belief is weak, reliably enough that you can build on it.

## Why this is the property that matters most

Push the failure into an agent that acts in the world, and the stakes change. A question-answering model that is overconfident gives you a wrong answer. An agent that is overconfident takes a wrong action, then another, compounding. The straightest path I can see to loss of control is a system that proceeds confidently at exactly the moments it should have stopped and deferred to a human.

That is why I see abstention as a control lever, and arguably the most fundamental one. Every other safety mechanism assumes the system can recognise the situations in which it should not be trusted. Oversight, escalation, and human in the loop are all downstream of the model knowing it has hit its limit. If it cannot tell, none of the rest fires in time.

This is also the rare safety property I think we can make rigorous. Most safety work has to reason about behaviours we cannot fully specify. Calibrated abstention is different. We can define it, measure it, and, increasingly, guarantee it.

## The hard part

The catch is that the signals we have are not trustworthy. Softmax probabilities and a model's own verbalised confidence are poorly calibrated, so a number near one tells you very little about whether the answer is right. The engineering question is whether we can give abstention a guarantee instead of a guess.

This is where conformal prediction comes in. It offers distribution-free coverage guarantees, bounds that hold without assuming you know the data distribution, and that turn "the model seems sure" into "the true answer is in this set with a coverage level I chose." That is the difference between a heuristic and a contract. It is the technical core of what I work on, and the reason I keep returning to it.

I want to be precise about the limits, because pretending they do not exist is its own kind of overconfidence. These guarantees rest on exchangeability, and the settings I care about most are exactly the ones where exchangeability quietly fails, including agents acting over time, multimodal inputs, and free-form generation where the output space is enormous. Extending coverage guarantees into those regimes is largely open. I do not treat that as a flaw in the approach. I treat it as the work.

## And we have only checked any of this in English

There is one more limit, and it is the one I think the field is most blind to. Almost everything we know about reading and steering a model's internal state has been validated in English. That includes the probes for deception, the directions for honesty, and the interventions that pull a model back toward its own better judgment. We deploy these tools as if they were language-agnostic. We have not checked.

If internal monitoring holds for English and fails silently for the languages most of the world actually speaks, then our safety stack has a hole shaped exactly like the populations with the least recourse, and we have shipped a false sense of security alongside it. Knowing when you don't know has to hold in Telugu, not only in English, or it is not really a safety property. It is a safety property for some people.

## The thread

So this is where the philosophy and the engineering meet, and why I do not experience them as separate. The ancient instinct, that wisdom begins with an honest accounting of the limits of your own knowledge, turns out to be the requirement we lean on most for systems we cannot fully supervise. The modern contribution is that we can now make that instinct measurable, and in places provable. We can elicit the knowledge a model actually has, calibrate the boundary of its competence, put guarantees on its silence, and check that all of this survives the move to the languages and contexts the system was never built for.

A capable model that does not know its own limits is a liability waiting for the right input. A model that knows when to say "I don't know," and means it, is the only kind I would trust to act. That is the property I am trying to build, and the reason I think it is the one that matters most.
