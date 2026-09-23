#!/usr/bin/env ruby

# Apply conservative digit formatting while preserving equations and expressions.
# Pronoun uses of "one" still need editorial review. Run without arguments for a preview.

PATH = File.expand_path("../_data/interview.yml", __dir__)
SKIP_KEYS = %w[tex readout height cell grad loss fn url sym id kind type links].freeze
WORDS = {
  "zero" => "0", "one" => "1", "two" => "2", "three" => "3",
  "four" => "4", "five" => "5", "six" => "6", "seven" => "7",
  "eight" => "8", "nine" => "9", "ten" => "10", "eleven" => "11",
  "twelve" => "12", "thirteen" => "13", "fourteen" => "14",
  "fifteen" => "15", "sixteen" => "16", "seventeen" => "17",
  "eighteen" => "18", "nineteen" => "19", "twenty" => "20",
  "thirty" => "30", "forty" => "40", "fifty" => "50",
  "sixty" => "60", "seventy" => "70", "eighty" => "80",
  "ninety" => "90"
}.freeze
PRONOUN_BEFORE = %w[the this that another other same better worse final previous next each last which].freeze
PRONOUN_AFTER = %w[is are was were has had will would can could may might must should does did do and another that which who where when why it you we they he she makes for].freeze

def normalise(line)
  return line if line.lstrip.start_with?("#")

  key = line[/\A\s*-?\s*([\w-]+):/, 1]
  return line if SKIP_KEYS.include?(key)

  result = line.dup
  result.gsub!(/\b(ninety|eighty|seventy|sixty|fifty|forty|thirty|twenty)[ -](nine|eight|seven|six|five|four|three|two|one)\b/i) do
    (WORDS[Regexp.last_match(1).downcase].to_i + WORDS[Regexp.last_match(2).downcase].to_i).to_s
  end
  result.gsub!(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\s+(hundred|thousand)\b/i) do
    (WORDS[Regexp.last_match(1).downcase].to_i * { "hundred" => 100, "thousand" => 1000 }[Regexp.last_match(2).downcase]).to_s
  end
  result.gsub!(/\b(ninety|eighty|seventy|sixty|fifty|forty|thirty|twenty|nineteen|eighteen|seventeen|sixteen|fifteen|fourteen|thirteen|twelve|eleven|ten)\s+thousand\b/i) do
    (WORDS[Regexp.last_match(1).downcase].to_i * 1000).to_s
  end
  result.gsub!(/\bone\s+in\s+(ninety|eighty|seventy|sixty|fifty|forty|thirty|twenty|nineteen|eighteen|seventeen|sixteen|fifteen|fourteen|thirteen|twelve|eleven|ten|nine|eight|seven|six|five|four|three|two)\b/i) do
    "1 in #{WORDS.fetch(Regexp.last_match(1).downcase)}"
  end
  result.gsub!(/\b(?:a|one)\s+hundred\b/i, "100")
  result.gsub!(/\b(?:a|one)\s+thousand\b/i, "1,000")
  result.gsub!(/\bone\s+half\b/i, "1/2")
  result.gsub!(/\btwo\s+thirds\b/i, "2/3")
  result.gsub!(/\bnon-zero\b/i, "nonzero")
  result.gsub!(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\b/i) do
    match = Regexp.last_match
    word = match[0]
    before_text = match.pre_match
    after_text = match.post_match
    next word if word.match?(/[A-Z]/) && word.match?(/[a-z]/) && word != word.capitalize
    next WORDS.fetch(word.downcase) unless word.casecmp?("one")
    if before_text.match?(/(?:\A\s*(?:-\s*|[\w-]+:\s*['"]?)|[.!?]\s*)\z/)
      next word
    end
    before = before_text[/([A-Za-z]+)\W*\z/, 1]&.downcase
    after = after_text[/\A[\s-]*([A-Za-z]+)/, 1]&.downcase
    if after.nil? && !%w[equals equal plus minus is are be than from to over].include?(before)
      next word
    end
    next word if PRONOUN_AFTER.include?(after)
    if word.casecmp?("one")
      next word if PRONOUN_BEFORE.include?(before) || after == "of"
      next word if after_text.start_with?("-hot", "-out", "-vs-")
    end
    WORDS.fetch(word.downcase)
  end
  result.gsub!(/\b([0-9]+)\s+per cent\b/i, '\\1%')
  result.gsub!(/\b10000\b/, "10,000")
  result
end

original = File.read(PATH)
updated = original.lines.map { |line| normalise(line) }.join
changes = original.lines.zip(updated.lines).filter_map do |before, after|
  "- #{before.strip}\n+ #{after.strip}" if before != after
end

if ARGV.include?("--write")
  File.write(PATH, updated)
  puts "Updated #{changes.size} lines."
else
  puts changes.first(100)
  puts "#{changes.size} lines would change."
end
