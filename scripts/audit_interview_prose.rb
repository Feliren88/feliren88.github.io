#!/usr/bin/env ruby

require "yaml"

ROOT = File.expand_path("..", __dir__)
DATA_PATH = File.join(ROOT, "_data", "interview.yml")
LEARNING_PATH = File.join(ROOT, "_data", "interview_learning.yml")

BANNED_WORDS = %w[
  delve foster leverage utilize facilitate empower streamline cutting-edge
  paradigm-shift game-changer tapestry realm beacon multifaceted meticulous
  intricate paramount transformative elevate embark supercharge harness
  ever-evolving
].freeze

STOCK_PATTERNS = {
  "generic track framing" => /\A(?:whether you can|owns\b|hands\b)/i,
  "throat-clearing" => /\b(?:here(?:'s| is) the thing|let(?:'s| us) dive|it(?:'s| is) (?:important|worth) to note)\b/i,
  "faux insight" => /\b(?:what most people get wrong|the part (?:everyone|most people) (?:miss|skip)|here(?:'s| is) what nobody tells you)\b/i,
  "interpretive aside" => /\b(?:as you can see|the key point is|this distinction matters|that last part matters|in other words)\b/i,
  "importance puffery" => /\b(?:stands as a testament|marks a pivotal moment|plays a vital role|underscores (?:its|the) significance)\b/i,
  "summary ending" => /\A(?:in conclusion|ultimately|overall),?\b/i,
  "binary contrast" => /\b(?:is|are|was|were) not\b[^.!?]{0,100}\b(?:it|they) (?:is|are|was|were)\b/i,
  "negative listing" => /(?:\A|[.!?]\s+)not (?:a|an|the)\b[^.!?]*[.!?]\s+not (?:a|an|the)\b/i,
  "dramatic coaching" => /\b(?:you will be asked|expect (?:at least|a question)|interviewers? (?:ask|probe|use|like|want|expect|open|wait))\b/i,
  "vague reveal" => /\b(?:this is where the track|this is where uncertainty|this is what made|the whole (?:argument|trick|module|field)|the open frontier)\b/i,
  "reader flattery" => /\b(?:earns trust|signals seriousness|reads badly|stands out|makes the pitch credible)\b/i,
  "private author context" => /\b(?:your cv|your own research area|your own contribution|your agenda|where your own work sits)\b/i,
}.freeze

LONG_SENTENCE_WORDS = 38

def visible_strings(topic)
  rows = []
  topic_id = topic.fetch("id")
  %w[blurb scope].each { |field| rows << ["#{topic_id}.#{field}", topic[field]] }

  topic.fetch("modules").each_with_index do |mod, index|
    prefix = "#{topic_id}.modules[#{index + 1}]"
    %w[name why check].each { |field| rows << ["#{prefix}.#{field}", mod[field]] }
    %w[beats plain covers].each do |field|
      Array(mod[field]).each_with_index do |value, item_index|
        rows << ["#{prefix}.#{field}[#{item_index + 1}]", value]
      end
    end
    Array(mod["math"]).each_with_index do |equation, equation_index|
      %w[name read note].each do |field|
        rows << ["#{prefix}.math[#{equation_index + 1}].#{field}", equation[field]] if equation[field]
      end
      Array(equation["where"]).each_with_index do |term, term_index|
        rows << ["#{prefix}.math[#{equation_index + 1}].where[#{term_index + 1}]", term["is"]]
      end
      play = equation["play"]
      next unless play

      %w[title alt].each do |field|
        rows << ["#{prefix}.math[#{equation_index + 1}].play.#{field}", play[field]] if play[field]
      end
    end
  end

  %w[traps drills].each do |field|
    Array(topic[field]).each_with_index do |value, index|
      rows << ["#{topic_id}.#{field}[#{index + 1}]", value]
    end
  end
  rows.select { |_, value| value.is_a?(String) }
end

def sentences(text)
  text.split(/(?<=[.!?])\s+/)
end

data = YAML.load_file(DATA_PATH, aliases: true)
learning_data = YAML.load_file(LEARNING_PATH, aliases: true)
learning_tracks = Array(learning_data["tracks"])
learning_by_id = learning_tracks.to_h { |track| [track["id"], track] }
findings = []

mission = learning_data.fetch("mission", {})
%w[outcome method evidence].each do |field|
  findings << ["interview_learning.mission.#{field}", "missing learning contract copy", ""] if mission[field].to_s.strip.empty?
end

topic_ids = data.fetch("topics").map { |topic| topic.fetch("id") }
extra_learning_ids = learning_by_id.keys - topic_ids
extra_learning_ids.each do |id|
  findings << ["interview_learning.#{id}", "learning entry has no interview track", id]
end

data.fetch("topics").each do |topic|
  topic_id = topic.fetch("id")
  learning = learning_by_id[topic_id]
  if !learning
    findings << [topic_id, "missing learning entry", ""]
  else
    findings << [topic_id, "needs at least one prerequisite", ""] if Array(learning["prerequisites"]).empty?
    source = learning.fetch("source", {})
    %w[title author url use].each do |field|
      findings << ["#{topic_id}.source.#{field}", "missing source field", ""] if source[field].to_s.strip.empty?
    end
    if source["url"] && !source["url"].start_with?("https://")
      findings << ["#{topic_id}.source.url", "source must use HTTPS", source["url"]]
    end
  end
  page_path = File.join(ROOT, "_pages", "interview", "#{topic_id}.md")
  if !File.exist?(page_path)
    findings << [topic_id, "missing topic page", page_path]
  else
    description = File.foreach(page_path).find { |line| line.start_with?("description:") }
    description = description&.sub(/\Adescription:\s*/, "")&.strip
    if description != topic.fetch("blurb")
      findings << [topic_id, "page description does not match card blurb", description.to_s]
    end
  end

  topic.fetch("modules").each_with_index do |mod, index|
    prefix = "#{topic_id}.modules[#{index + 1}]"
    %w[name why check].each do |field|
      findings << ["#{prefix}.#{field}", "missing required copy", ""] if mod[field].to_s.strip.empty?
    end
    findings << ["#{prefix}.plain", "needs at least two plain-English paragraphs", ""] if Array(mod["plain"]).size < 2
    findings << ["#{prefix}.math", "needs at least one explained equation", ""] if Array(mod["math"]).empty?
    findings << ["#{prefix}.beats", "needs at least two grounded beats", ""] if Array(mod["beats"]).size < 2
  end

  visible_strings(topic).each do |path, text|
    normalised = text.downcase.tr("_", "-")
    BANNED_WORDS.each do |word|
      findings << [path, "banned word '#{word}'", text] if normalised.match?(/\b#{Regexp.escape(word)}\b/)
    end
    STOCK_PATTERNS.each do |label, pattern|
      findings << [path, label, text] if text.match?(pattern)
    end
    sentences(text).each do |sentence|
      count = sentence.scan(/[[:alnum:]][[:alnum:]'’-]*/).size
      next unless count > LONG_SENTENCE_WORDS

      findings << [path, "long sentence (#{count} words; limit #{LONG_SENTENCE_WORDS})", sentence.strip]
    end
  end
end

if findings.empty?
  puts "Interview prose audit passed."
  exit 0
end

findings.each do |path, label, text|
  excerpt = text.gsub(/\s+/, " ").strip
  excerpt = "#{excerpt[0, 157]}..." if excerpt.length > 160
  puts "#{path}: #{label}\n  #{excerpt}"
end
puts "\n#{findings.size} finding#{findings.size == 1 ? '' : 's'}"
exit 1
