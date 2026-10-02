"""Check structural notation rather than simulated Unicode script placement."""
import unittest
from render_math import render_display_math


class DisplayMathTests(unittest.TestCase):
    def test_limits_fractions_and_scripts_have_mathml_structure(self):
        formulas = {'math': {
            'sum': r'\sum\limits_{i=1}^{3} x_i = x_1+x_2+x_3',
            'integral': r'F(x)=\int_0^x t^2\,\mathrm{d}t=\frac{x^3}{3}',
        }}
        result = render_display_math(formulas)
        self.assertIn('<munderover>', result['math']['sum'])
        self.assertIn('<msub>', result['math']['sum'])
        self.assertIn('<mfrac>', result['math']['integral'])
        self.assertIn('<msup>', result['math']['integral'])
        self.assertIn('display="block"', result['math']['integral'])

    def test_runtime_slots_remain_plain_text_until_substituted(self):
        result = render_display_math({'calculus': {'live': r'\frac{\text{SLOT_a}}{\text{SLOT_b}}'}})
        self.assertIn('SLOT_a', result['calculus']['live'])
        self.assertIn('<mfrac>', result['calculus']['live'])

    def test_malformed_converter_output_is_rejected(self):
        with self.assertRaises(ValueError):
            render_display_math({'math': {'bad': r'\begin{aligned}x&=1\end{aligned}'}})

    def test_derivative_prime_is_a_superscript(self):
        result = render_display_math({'calculus': {'prime': r'f^{\prime}(x)'}})
        self.assertIn('<msup>', result['calculus']['prime'])
