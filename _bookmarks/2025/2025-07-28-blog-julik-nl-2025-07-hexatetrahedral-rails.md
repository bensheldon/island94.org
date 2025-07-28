---
link: https://blog.julik.nl/2025/07/hexatetrahedral-rails
date: 2025-07-28 15:16 UTC
published: true
title: Hexatetrahedral Rails
tags: []
---

My humble suggestion is: don’t do it. As I have outlined above, I believe there to be one - and only one - reason to use that architecture, and that is reducing the API surface of ActiveRecord. Such reduction can be useful if you have a large and growing number of teams which are going to collaborate on the codebase, and you know that those teams will prefer to work in separate, completely isolated modules.
