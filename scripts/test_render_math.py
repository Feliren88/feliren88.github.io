"""Check that equation-level live metadata preserves the rendered live line."""
import unittest
from render_math import build


class LiveEquationTests(unittest.TestCase):
    def test_equation_live_matches_legacy_playground_slots(self):
        equation = {'name': 'A numeric example', 'tex': '1=1', 'read': 'Both sides equal 1.'}
        def render(extra):
            errors = []
            data = {'topics': [{'id': 'example', 'modules': [{'name': 'Example', 'math': [dict(equation, **extra)]}]}]}
            output = build(data, errors)
            self.assertEqual(errors, [])
            return output['eq'].get('example/0/0/live')
        tex = '9001+9002=9003'
        legacy = render({'play': {'livetex': tex, 'liveslots': ['w', 'b', 'loss']}})
        current = render({'live': {'tex': tex, 'slots': ['w', 'b', 'loss']}})
        self.assertEqual(current, legacy)
        self.assertIn('data-live="loss"', current)
