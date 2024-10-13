import pytest
from src.module1.example import add
from src.module2.test_integration import multiply

def test_add_e2e():
    result = add(5, 6)
    assert result == 11

def test_multiply_e2e():
    result = multiply(6, 7)
    assert result == 42
