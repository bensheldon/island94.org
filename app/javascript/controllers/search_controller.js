import { Controller } from "@hotwired/stimulus"

// Global variable to store the search index promise
let searchPromise = null;

export default class extends Controller {
  static targets = ["results", "input"]
  static values = {
    maxSummaryLength: { type: Number, default: 250 }
  }

  // Constants
  #SENTENCE_BOUNDARY_REGEX = /\b\.\s/gm
  #WORD_REGEX = /\b(\w*)[\W|\s|\b]?/gm

  resultsTargetConnected(_element) {
    const searchQuery = new URLSearchParams(window.location.search).get("q")
    if (!searchQuery) {
      this.resultsTarget.innerHTML = '<p>No search term</p>'
      return
    }

    // Set the value of all input targets to the search query
    this.inputTargets.forEach(input => {
      input.value = searchQuery;
    });

    this.#performSearch(searchQuery)
  }

  syncInputs(event) {
    const newValue = event.target.value;
    this.inputTargets.forEach(input => {
      if (input !== event.target) {
        input.value = newValue;
      }
    });
  }

  fetchSearchData() {
    if (!searchPromise) {
      searchPromise = new Promise(async (resolve, reject) => {
        const [{ default: lunr }, searchData] = await Promise.all([
          import('lunr'),
          fetch('/search.json').then(response => response.json())
        ])

        const searchIndex = lunr(function() {
          this.field('id')
          this.field('title', { boost: 10 })
          this.field('tags', { boost: 10 })
          this.field('content')

          Object.keys(searchData).forEach((key, i) => {
            const item = searchData[key]
            this.add({
              'id': key,
              'title': item.title,
              'published': item.published,
              'tags': item.tags,
              'content': item.content
            })
          })
        })

        resolve([searchData, searchIndex]);
      })
    }

    return searchPromise;
  }

  async #performSearch(searchQuery) {
    const [searchData, searchIndex] = await this.fetchSearchData();

    searchQuery = searchQuery.trim();
    const searchResults = searchIndex.search(searchQuery)
    this.resultsTarget.innerHTML = this.#formatSearchResults(searchQuery, searchResults, searchData)
  }

  #createSearchResultBlurb(query, pageContent) {
    const searchQueryRegex = new RegExp(this.#createQueryStringRegex(query), "gmi")
    const searchQueryHits = Array.from(
      pageContent.matchAll(searchQueryRegex),
      (m) => m.index
    )
    const sentenceBoundaries = Array.from(
      pageContent.matchAll(this.#SENTENCE_BOUNDARY_REGEX),
      (m) => m.index
    )

    let searchResultText = ""
    let lastEndOfSentence = 0
    for (const hitLocation of searchQueryHits) {
      if (hitLocation > lastEndOfSentence) {
        for (let i = 0; i < sentenceBoundaries.length; i++) {
          if (sentenceBoundaries[i] > hitLocation) {
            const startOfSentence = i > 0 ? sentenceBoundaries[i - 1] + 1 : 0
            const endOfSentence = sentenceBoundaries[i]
            lastEndOfSentence = endOfSentence
            const parsedSentence = pageContent.slice(startOfSentence, endOfSentence).trim()
            searchResultText += `${parsedSentence} ... `
            break
          }
        }
      }
      const searchResultWords = this.#tokenize(searchResultText)
      const pageBreakers = searchResultWords.filter((word) => word.length > 50)
      if (pageBreakers.length > 0) {
        searchResultText = this.#fixPageBreakers(searchResultText, pageBreakers)
      }
      if (searchResultWords.length >= this.maxSummaryLengthValue) break
    }
    return this.#ellipsize(searchResultText, this.maxSummaryLengthValue).replace(
      searchQueryRegex,
      "<mark>$&</mark>"
    )
  }

  #createQueryStringRegex(query) {
    const searchTerms = query.split(" ")
    if (searchTerms.length === 1) {
      return query
    }
    query = ""
    for (const term of searchTerms) {
      query += `${term}|`
    }
    query = query.slice(0, -1)
    return `(${query})`
  }

  #tokenize(input) {
    const wordMatches = Array.from(input.matchAll(this.#WORD_REGEX), (m) => m)
    return wordMatches.map((m) => ({
      word: m[0],
      start: m.index,
      end: m.index + m[0].length,
      length: m[0].length,
    }))
  }

  #fixPageBreakers(input, largeWords) {
    largeWords.forEach((word) => {
      const chunked = this.#chunkify(word.word, 20)
      input = input.replace(word.word, chunked)
    })
    return input
  }

  #chunkify(input, chunkSize) {
    let output = ""
    let totalChunks = (input.length / chunkSize) | 0
    let lastChunkIsUneven = input.length % chunkSize > 0
    if (lastChunkIsUneven) {
      totalChunks += 1
    }
    for (let i = 0; i < totalChunks; i++) {
      let start = i * chunkSize
      let end = start + chunkSize
      if (lastChunkIsUneven && i === totalChunks - 1) {
        end = input.length
      }
      output += input.slice(start, end) + " "
    }
    return output
  }

  #ellipsize(input, maxLength) {
    const words = this.#tokenize(input)
    if (words.length <= maxLength) {
      return input
    }
    return input.slice(0, words[maxLength].end) + "..."
  }

  #formatSearchResults(searchQuery, searchResults, searchData) {
    if (searchResults.length) {
      let output = ""

      for (const result of searchResults) {
        const item = searchData[result.ref]
        output += '<a href="' + item.url + '"><h2>' + item.title + '</h2></a>'
        output += '<p class="post-meta text-muted">' + item.published + '</p>'

        let blurb = this.#createSearchResultBlurb(searchQuery, item.content)
        if (blurb.trim().length == 0) {
          blurb = item.content.substring(0, this.maxSummaryLengthValue) + '...'
        }
        output += '<p>' + blurb + '</p>'
      }

      return output
    } else {
      return '<p>No results found</p>'
    }
  }
}
