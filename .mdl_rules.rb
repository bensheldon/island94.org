# frozen_string_literal: true
# Custom mdl rules for weird whitespace characters that sneak in when pasting
# from apps like Apple Notes or Pages.
# Run via: bin/lint (loaded via --rulesets, enabled in .mdl_style.rb)

rule "CUSTOM001", "No object replacement characters" do
  tags :whitespace
  check do |doc|
    doc.matching_lines(/\u{FFFC}/)
  end
  fix do |doc, lines|
    lines.each do |linenum|
      doc.lines[linenum - 1] = doc.lines[linenum - 1].delete("\u{FFFC}")
    end
  end
end

rule "CUSTOM002", "No no-break spaces" do
  tags :whitespace
  check do |doc|
    doc.matching_lines(/\u{00A0}/)
  end
  fix do |doc, lines|
    lines.each do |linenum|
      doc.lines[linenum - 1] = doc.lines[linenum - 1].tr("\u{00A0}", " ")
    end
  end
end

rule "CUSTOM003", "No doubled spaces mid-line" do
  tags :whitespace
  check do |doc|
    codeblock_lines = doc.find_type_elements(:codeblock).flat_map do |e|
      linenum = doc.element_linenumber(e)
      (linenum..(linenum + e.value.lines.count)).to_a
    end

    doc.matching_lines(/\S {2,}\S/) - codeblock_lines
  end
  fix do |doc, lines|
    lines.each do |linenum|
      doc.lines[linenum - 1] = doc.lines[linenum - 1].gsub(/(?<=\S) {2,}(?=\S)/, " ")
    end
  end
end
