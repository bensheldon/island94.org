---
title: "Ruby Thread Facts"
date: 2025-09-23 16:18 UTC
published: true
tags: []
---


### Queues and Mutexes

[Comment](https://github.com/puma/puma/discussions/3768#discussioncomment-14483580) from Jean Boussier: 

> One of the main advantage of `Thead::Queue` and `Thread::SizedQueue` in term of performance, is that in some cases it can bypass the thread scheduler:
> 
> https://github.com/ruby/ruby/blob/cdb9c2543415588c485282e460cdaba09452ab6a/thread_sync.c#L942-L951
> 
> TL;DR; when a thread push into a Queue if another thread was blocked on that queue, the execution is immediately transferred to that other thread. From the scheduler point of view, it's like nothing happened, and AFAIK the quantum isn't reset.
>
> Whereas with a thread is blocked trying to lock a Mutex, it yields to the general scheduler, so the execution might be transferred to any thread, not necessarily the one owning the mutex, and the quantum is reset. This is also a slightly more expensive operation.
