/* Symbolic calculations and proof steps are revealed in their logical order. */
(function () {
  'use strict';
  var page=document.querySelector('.syl-page'),topic=page && page.dataset.topic;
  if(topic!=='math' && topic!=='math-proof')return;
  var tracks={math:[
    {title:'Read a sum one term at a time',steps:[
      'Let x₁ = 2, x₂ = 4 and x₃ = 6. The subscript identifies an entry.',
      'The symbol Σ asks us to add terms. Here, the index i runs from 1 through 3.',
      'Substitute each indexed value. The sum becomes 2 + 4 + 6.',
      'The sum equals 12. Dividing by the 3 entries gives their arithmetic mean, 4.'],chain:['Inputs x₁ = 2, x₂ = 4, x₃ = 6','Σᵢ₌₁³ xᵢ means x₁ + x₂ + x₃','2 + 4 + 6 = 12','Mean = 12 / 3 = 4']},
    {title:'Extend the numbers when an equation needs it',steps:[
      'Counting numbers describe positive whole quantities, such as 1, 2 and 3.',
      'The equation x + 3 = 1 requires x = −2. Integers include negative whole numbers.',
      'The equation 2x = 1 requires x = 1/2. Rational numbers include ratios of integers.',
      'The equation x² = 2 has real solutions ±√2. Neither is rational; a separate proof establishes this.'],chain:['Positive counting numbers 1, 2, 3, …','x + 3 = 1 → x = −2 ∈ ℤ','2x = 1 → x = 1/2 ∈ ℚ','x² = 2 → x = ±√2 ∈ ℝ']},
    {title:'Check division by reversing multiplication',steps:[
      'For a nonzero divisor, a/b asks for the unique number x satisfying bx = a.',
      'For example, 6/2 = 3 because 2 × 3 = 6.',
      'For 6/0, the required equation is 0 × x = 6. No real number satisfies it.',
      'For 0/0, every real x satisfies 0 × x = 0. There is no unique quotient.'],chain:['a/b = x requires b × x = a, with b ≠ 0','6/2 = 3 because 2 × 3 = 6','6/0 would require 0 × x = 6 → No solution','0/0 would require 0 × x = 0 → No unique solution']},
    {title:'Pair an infinite set with a proper subset',steps:[
      'Consider positive integers 1, 2, 3 and so on. The sequence has no last member.',
      'Pair each positive integer n with the even integer 2n.',
      'Each positive even integer has exactly one partner, obtained by dividing it by 2.',
      'This pairing is a bijection, meaning a reversible one-to-one correspondence. Therefore, the two infinite sets have equal cardinality.'],chain:['Positive integers 1, 2, 3, 4, …','Pair n → 2n, giving 2, 4, 6, 8, …','Reverse every pair with 2n → n','A bijection shows equal cardinality']},
    {title:'Count pairs with and without order',steps:[
      'Choose 2 different items from 5 available items. First count selections where order matters.',
      'There are 5 choices for the first item and 4 for the second. Multiply to obtain 20.',
      'Each unordered pair appears twice, once in each order.',
      'Divide 20 by 2 to obtain 10 unordered pairs. This equals the binomial coefficient 5 choose 2.'],chain:['5 available items; choose 2 different items','Ordered pairs = 5 × 4 = 20','Each unordered pair has 2 possible orders','Unordered pairs = 20 / 2 = 10']},
    {title:'Count overlap before adding event probabilities',steps:[
      'Assume a fair six-sided die. Each of its 6 outcomes has probability 1/6.',
      'Let A contain outcomes {1,2,3} and B contain {2,4,6}. Each event has probability 3/6.',
      'Outcome 2 belongs to both events. Adding their counts would count it twice.',
      'The union contains {1,2,3,4,6}. Its probability is 3/6 + 3/6 − 1/6 = 5/6.'],chain:['Fair die outcomes {1,2,3,4,5,6}','A = {1,2,3}; B = {2,4,6}','Overlap A ∩ B = {2}','P(A ∪ B) = (3 + 3 − 1)/6 = 5/6']},
    {title:'Bound the chance of a large average error',steps:[
      'Assume 100 independent Bernoulli variables, each with success probability 0.5.',
      'Their average has expectation 0.5. Its variance is 0.5 × 0.5 / 100 = 0.0025.',
      'Ask whether the average differs from 0.5 by at least 0.1.',
      'Hoeffding’s inequality bounds this probability by 2 exp(−2 × 100 × 0.1²) ≈ 0.271. Independence and the bounds [0,1] support this calculation.'],chain:['100 independent observations Xᵢ ∈ {0,1}','E[average] = 0.5; Var(average) = 0.0025','Deviation event |average − 0.5| ≥ 0.1','Probability ≤ 2 exp(−2) ≈ 0.271']},
    {title:'Average surprise across a probability distribution',steps:[
      'Assume 4 equally likely symbols. Each has probability 1/4.',
      'An observed symbol gives surprise −log₂(1/4) = 2 bits. Their average surprise also equals 2.',
      'Now choose probabilities 1/2, 1/4, 1/8 and 1/8. Their surprises are 1, 2, 3 and 3 bits.',
      'Weight each surprise by its probability and add. The entropy equals 1.75 bits.'],chain:['Uniform probabilities [1/4, 1/4, 1/4, 1/4]','Uniform entropy = −log₂(1/4) = 2 bits','New probabilities [1/2, 1/4, 1/8, 1/8]','H = 1/2 × 1 + 1/4 × 2 + 2 × 1/8 × 3 = 1.75 bits']},
    {title:'Undo exponentiation with a logarithm',steps:[
      'Begin with powers of 2. The values 2, 4 and 8 have exponents 1, 2 and 3.',
      'A base-2 logarithm returns the exponent. Therefore, log₂(8) = 3.',
      'Multiplying 4 by 8 adds their exponents, giving 2² × 2³ = 2⁵.',
      'Therefore, log₂(4 × 8) = 2 + 3 = 5. The logarithm product identity requires positive inputs.'],chain:['2¹ = 2; 2² = 4; 2³ = 8','log₂(8) = 3 because 2³ = 8','4 × 8 = 2² × 2³ = 2⁵ = 32','log₂(32) = log₂(4) + log₂(8) = 5']},
    {title:'Trace a floating-point rounding error',steps:[
      'In exact rational arithmetic, 1/10 + 2/10 equals 3/10.',
      'Standard binary floating-point numbers store rounded approximations to 0.1 and 0.2.',
      'Adding these stored approximations in JavaScript produces 0.30000000000000004.',
      'Comparing that result with the stored value 0.3 returns false. Numerical comparisons need a tolerance suited to their scale and purpose.'],chain:['Exact arithmetic 1/10 + 2/10 = 3/10','Binary64 stores approximations to 0.1 and 0.2','JavaScript 0.1 + 0.2 → 0.30000000000000004','(0.1 + 0.2) === 0.3 → false']}
  ],'math-proof':[
    {title:'Keep the order of quantifiers visible',steps:[
      'The claim says that for every real x, some real y is larger than x.',
      'Given any chosen x, construct y = x + 1. This proves the claim for every real x.',
      'Reverse the order to ask for one real y larger than every real x. This is a different claim.',
      'For any proposed y, choose x = y + 1. Then y is smaller than x, so the reversed claim is false.'],chain:['Claim ∀x ∈ ℝ, ∃y ∈ ℝ such that y > x','Witness y = x + 1 gives y > x','Reversed claim ∃y ∈ ℝ, ∀x ∈ ℝ, y > x','Counterexample to any y is x = y + 1']},
    {title:'Prove an implication and read its contrapositive',steps:[
      'Assume the integer n is even. Then n = 2k for some integer k.',
      'Square both sides to obtain n² = 4k² = 2(2k²).',
      'Since 2k² is an integer, n² is even. This proves that even n implies even n².',
      'The contrapositive reverses the implication and negates both statements. Therefore, odd n² implies odd n.'],chain:['Assume n = 2k, where k ∈ ℤ','n² = (2k)² = 4k² = 2(2k²)','n even → n² even','Equivalent contrapositive n² odd → n odd']},
    {title:'Reach a contradiction from a reduced fraction',steps:[
      'Suppose √2 = a/b, where positive integers a and b share no common factor.',
      'Squaring gives a² = 2b². An odd integer has an odd square, since (2k+1)² = 4k(k+1)+1. Therefore, a is even.',
      'Write a = 2k and substitute. Then b² = 2k². By the same odd-square argument, b is also even.',
      'Both integers have a common factor 2. This contradicts the reduced-fraction assumption, proving √2 irrational.'],chain:['Assume √2 = a/b with gcd(a,b) = 1','a² = 2b² → a is even','a = 2k → b² = 2k² → b is even','Both share factor 2 → Contradiction']},
    {title:'Carry a sum formula through an induction step',steps:[
      'The claim is 1 + 2 + ⋯ + n = n(n+1)/2 for every positive integer n.',
      'Check n = 1. Both sides equal 1, establishing the first case.',
      'Assume the formula holds at an arbitrary positive integer k. Add k+1 to both sides.',
      'Factor k(k+1)/2 + (k+1) as (k+1)(k+2)/2. The first case and induction step prove all positive cases.'],chain:['Claim Sₙ = n(n+1)/2 for n ≥ 1','Base case S₁ = 1 = 1×2/2','Assume Sₖ = k(k+1)/2; add k+1','Sₖ₊₁ = (k+1)(k+2)/2 → Induction complete']},
    {title:'Disprove a universal claim with one input',steps:[
      'Consider the claim that x² ≥ x for every real x.',
      'At x = 2, the inequality holds. At x = 3, it also holds. These examples cannot prove every case.',
      'Try x = 1/2. Its square equals 1/4, which is smaller than 1/2.',
      'This single real input disproves the universal claim. The modified claim for integers would require a separate proof.'],chain:['Claim ∀x ∈ ℝ, x² ≥ x','Checks x = 2 and x = 3 both satisfy it','At x = 1/2, x² = 1/4 < 1/2','One counterexample disproves the claim']},
    {title:'Prove the triangle inequality for real numbers',steps:[
      'For real a and b, expand the square (a+b)² = a² + 2ab + b².',
      'Since ab ≤ |a||b|, replacing the middle term gives an upper bound.',
      'The resulting expression equals (|a|+|b|)².',
      'Both absolute-value expressions are nonnegative. Taking square roots preserves the inequality, giving |a+b| ≤ |a|+|b|.'],chain:['(a+b)² = a² + 2ab + b²','ab ≤ |a||b| gives an upper bound','(a+b)² ≤ (|a| + |b|)²','Nonnegative square roots give |a+b| ≤ |a|+|b|']},
    {title:'Prove a root exists without calculating it',steps:[
      'Define f(x) = x² − 2 on the interval [1,2]. This polynomial is continuous.',
      'At the left endpoint, f(1) = −1. At the right endpoint, f(2) = 2.',
      'A continuous function takes every intermediate value between its endpoint values. This is the intermediate value theorem.',
      'Zero lies between −1 and 2. Therefore, some c strictly between 1 and 2 satisfies f(c) = 0.'],chain:['Continuous f(x) = x² − 2 on [1,2]','f(1) = −1; f(2) = 2','The intermediate value theorem includes 0','∃c ∈ (1,2) such that c² − 2 = 0']}
  ]};
  function safe(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  page.querySelectorAll('.syl-module').forEach(function(module,index){
    var model=tracks[topic][index],section=document.createElement('section');
    section.className='ue-animation maths-animation';section.setAttribute('aria-label',model.title);
    section.innerHTML='<h3></h3><div class="ue-chart" tabindex="0" role="region" aria-label="Calculation or proof. Scroll sideways if needed."><svg viewBox="0 0 680 340" role="img"></svg></div><div class="maths-narrative"></div>';
    section.querySelector('h3').textContent=model.title;module.querySelector('.syl-viz').insertAdjacentElement('afterend',section);
    window.InterviewNarrative.mount(section.querySelector('.maths-narrative'),{steps:model.steps,draw:function(at){
      var svg=section.querySelector('svg'),s='';
      model.chain.slice(0,at+1).forEach(function(line,i){var y=25+i*78;
        if(i)s+='<path class="ue-axis" d="M340 '+(y-20)+'V'+(y-5)+'m-5-5 5 5 5-5"/>';
        s+='<rect class="maths-node '+(i===at?'is-current':'')+'" x="18" y="'+y+'" width="644" height="56" rx="7"/>'+ 
          '<text x="35" y="'+(y+33)+'">'+safe(line)+'</text>';});
      svg.innerHTML=s;svg.setAttribute('aria-label',model.title+'. '+model.steps[at]);
    }});
  });
}());
