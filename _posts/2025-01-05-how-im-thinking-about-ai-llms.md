---
title: "How I'm thinking about AI (LLMs)"
date: 2025-01-05 14:49 PST
published: true
tags: [ai, opinions]
---

With AI, in my context we’re talking about LLMs (Large Language Models), which I simplify down to “text generator”: they take text as input, and they output text.

I wrote this to share with some folks I’m collaborating with on building AI-augmented workflows. I’ve struggled to find something that is both condensed and whose opinionations match my own. So I wrote it myself.

The following explanation is intended to be accurate, but not particularly precise.  For example, there is ChatGPT the product, there is an LLM at the bottom, and then in the middle there are other functions and capabilities. Or Claude or AWS Nova or Llama. These things are more than _*just*_ LLMs, but they are also *not much* more than an LLM. Some of these tools can also interpret images and documents and audio and video. To do so, they’re passing those documents through specialized functions like OCR (optical character recognition), voice-recognition and image-recognition tools and then those results are turned into more text input. And some of them can take “Actions” with “Agents” which is still based on text output, just being structured and fed into something else. It’s text text text.


(also, if something is particularly wrong, let me know please)

### A little about LLMs

The language around LLMs and “AI” is fucked up with hype and inappropriate metaphors. But the general idea is there is two key phases to keep track of:

1. Training: Baking the model. At which point it’s done. I don’t know anyone who is actually building models Everyone is using something like OpenAI or Claude or Llama. And even while these things can be “fine tuned” I don’t know anyone doing it; operating at the model level requires input data on the order of tens of thousands of inputs/examples.
2. Prompting: Using the model, giving input and getting output. This is everything the vast majority of developers are doing.

That’s it. Those are the only two buckets you need to think about.

#### 1. Training

The way AI models get made is to first collect trillions of pages of written text (an example is [Common Crawl](https://commoncrawl.org/) which scrapes the Internet). Then use machine learning to identify probabilistic patterns that can be represented by only several billion variables (floating point numbers). This is called **“Pre Training”**. At this point, you can say “Based on the input data, it’s probabilistically likely that the word after “eeny meany miney” is “moe”.

Then there is the phase of **“Fine Tuning”** which makes sure that longer strings of text input are completed in ways that are intended (never right or wrong, just intended or expected). For example, if the text input is “Write me a Haiku about frogs” you expect a short haiku about frogs and not a treatise on the magic of the written word or amphibians. Fine tuning is largely accomplished by tens of thousands of workers in Africa and South Asia reading examples of inputs and outputs and clicking 👍 or 👎 on their screen. This is then fed back into machine learning models to say, of the billion variables, which variables should get a little more or less oomph when they’re calculating the output. Fine Tuning requires tens of thousands of these scored examples; again, this is probabilistic-scale stuff. This can also be called **RLHF (Reinforcement Learning from Human Feedback)**, though that sometimes also refers to few-shot prompting, which is Prompt-phase (“Learning” is a nonsense word in the AI domain; it has zero salience without clarifying which phase you’re talking about). A lot of the interesting fine-tuning, imo, comes from getting these text generators to:

- Read like a human chatting with you, rather than textual diarrhea
- Getting structured output, like valid JSON, rather than textual diarrhea

Note: You can mentally slot in words like “parameters”, “dimensions”, “weights” and “layers” into all this. Also whenever someone says “we don’t really know how they work” what they really mean is “there’s a lot of variables and I didn’t specifically look at them all”. But that’s no different than being given an Excel spreadsheet with several VLOOKUPS and functions and saying “sure, that looks ok” and copy-pasting the report on to your boss; I mean, you _could_ figure it all out, but it seems to work and you’re a busy person.

Ok, now we’re done with training. The model at this point is baked and no further modification takes place: no memory, no storage, no “learning” in the sense of a biological process. From this point further they operate as a function: input in, output out, no side effects.

Here’s how AWS Bedrock, which is how I imagine lots of companies are using AI in their product, [describes all this](https://docs.aws.amazon.com/bedrock/latest/userguide/data-protection.html):

> After delivery of a model from a model provider [Anthropic, OpenAI, Meta] to AWS, Amazon Bedrock will perform a deep copy of a model provider’s inference and training software into those accounts for deployment. Because the model providers don’t have access to those accounts, they don’t have access to Amazon Bedrock logs or to customer prompts and completions.

See! It’s all just dead artifacts uploaded into S3, that are then loaded onto EC2 on-demand. A fancy lambda! Nothing more.

#### 2. Prompting

Prompting is when we give the model input, and then it gives back some output. That’s it. Unless we are specifically collecting trillions of documents, or doing fine-tuning against thousands of examples (which we are NOT!), we are simply writing a prompt, and having the model generate some text based on it. It riffs. The output can be called “completions” because they’re just that: More words.

(Fun fact: how to get the LLM to _stop_ writing words is a hard problem to solve)

Note: You might sometimes see prompting called model “testing” (as opposed to model building or training). That’s because you’re powering up the artifact to put some words through it. Testing testing is called “Evaluations” (“Evals” for short) and like all test test regimes the lukewarm debate I hear from everybody is “we aren’t but should we?”

### Writing prompts

This is the work! Unfortunately the language used to describe all of this is truly and totally fucked. By which I mean that words like “learning” and “thought” and “memory” and even “training” is reused again.

It’s all about simply writing a prompt that boops the resulting text generator output into the shape you want. It’s all snoot-booping, all the time.

Going back to the Training data, let’s make some conceptual distinctions:

* Content: specific facts, statements and assertions that were (possibly) encoded into those billions of probabilities from the training data
* Structure: the overall probability that a string of words (really fragments of words) comes out again looking like something we expect, which has been adjusted via Fine Tuning

Remember, this is just a probabilistic text generator. So there is probabilistic facts, and probabilistic structure. And that probabilistic part is why we have words like “hallucination” and “slop” and “safety”. There’s no there there. It’s just probabilities. There’s no guarantee that a particular fact has been captured in those billions of variables. It’s just a text generator. And it’s been trained on a lot of dumb shit people write. It’s *just* a text generator. Don’t trust it.

So on to some prompting strategies:

* **Zero-Shot Prompting:** This just means to ask something open-ended and the AI returns something that probabilistical follows:
  > Classify the sentiment of the following review as positive, neutral, or negative: “The quality is amazing, and it exceeded my expectations”
* **Few-Shot (or one-shot/multi-shot) Prompting**: This just means to provide one or more examples of “expected” completions in the prompt (remember, this is all prompt, not fine-tuning) to try to narrow down what could probabilistically follow:
  > Task: Classify the sentiment of the following reviews as positive, neutral, or negative.
  > Examples:
  > 1. “I absolutely adore this product. It’s fantastic!” - positive
  > 2. “It’s okay, not the best I’ve used.” - neutral
  > 3. “This is terrible. I regret buying it.” - negative
  > Now classify this review:
  > 4. “The quality is amazing, and it exceed my expectations” - [it’s blank, for the model to finish]

*Note: Zero/One/Few/Multi-Shot is sometimes called “Learning” instead of “Prompting”. This is a terrible name, because there is no learning (the models are dead!) but is one of those things where the most assume-good-intent explanation is that over the course of the prompt and its incrementally generated completion that the output assumes the desired shape.*

- **Chain of Thought Prompting**: The idea here is that the prompt includes a description of how a human might explain what they were doing to complete the prompt. And that boops the completion into filling out those steps, and arriving at a more expected answer:
  > Classify the sentiment of the following review as positive, neutral, or negative.
  > “I absolutely adore this product. It’s fantastic!”
  > Analysis 1: How does it describe the product?
  > Analysis 2: How does it describe the functionality of the product?
  > Analysis 3: How does it describe their relationship with the product?
  > Analysis 4: How does it describe how friends, family, or others relate to the product?
  > Overall: Is it positive, neutral, or negative?

*Note: again, there is no “thought” happening. The point of the prompt is to boop the text completion into giving a more expected answer. There are some new models (as of late 2024) that are supposed to do Chain-of-Thought implicitly; afaik there is just a hidden/unshown prompt that says “break this down into steps” and an intermediate output that takes the output of that and feeds it into another hidden/unshown prompt and then the output of that is shown to you. That’s why they costs more, cause it’s invoking the the LLM twice on your behalf.*

* **Chain Prompting**: This simply means that you take the output of one prompt, and then feed that into a new prompt. This can be useful to isolate a specific prompt and output. It might also be necessary because of the length: LLMs can only operate on so many words, so if you need to summarize a long document in a prompt, you’d need to first break it down into smaller chunks, use the LLM to summarize each chunk, and then combine the summaries into a new prompt for the LLM summarize that.
* **RAG (Retrieval Augmented Generation) Prompting**: This means that you look up some info in a database, and then insert that into the prompt before handing it to the LLM. Everything is prompt, there is only prompt.

*Note: **“Embeddings”** are a way of search indexing your text. LLMs take all those trillions of documents and probabilistically boils them down to several billion variables. Embeddings boil down further to a couple thousand variables (floating point numbers). Creating an embedding means providing a piece of text, and you get back the values of those thousand floating point numbers that probabilistically describe that text (big brain idea: it is the document’s location in a thousand-dimensional space). That lets you compute across multiple documents “given this document within the n-dimensional space, what are its closest neighboring documents semantically/probabilistically?” Embeddings are useful when you want to do RAG Prompting to pull out relevant documents and insert their text into your prompt before it’s fed to the LLM to generate output.*

- **Cues and Nudges** There are [certain phrases](https://news.ycombinator.com/item?id=40474716), like “no yapping” or [“take a deep breath”](https://arstechnica.com/information-technology/2023/09/telling-ai-model-to-take-a-deep-breath-causes-math-scores-to-soar-in-study/) that change the output. I don’t think there is anything delightful about this; it’s simply trying to boop up the variables you want in your output and words are the only inputs you have. I’m sure there will someday be better ways to do it, but whatever works.

### A strong opinion about zero-shot prompting

Don’t do it! I think it’s totally fine if you just want to ask a question and try to intuit the extent that the model has been trained or tuned on the particular domain you’re curious about. But you should put ZERO stock in the answer as something factual.

If you need facts, you must provide the facts as part of your prompt. That means:

- Providing a giant pile of text as content, or breaking it down (like via embeddings) and injecting smaller chunks via RAG
- Providing any and all input you ever expect to get out of the output

It’s ok to summarize, extract, translate or sentiment. The only reason it’s ok to zero-shot code is because it’s machine verifiable (you run it). Otherwise, you must verify! Or don’t do it at all.
