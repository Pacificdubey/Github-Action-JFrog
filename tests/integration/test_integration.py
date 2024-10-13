import pytest
from src.module1.example import add
from src.module2.test_integration import multiply

def test_add_integration():
    result = add(3, 4)
    assert result == 7

def test_multiply_integration():
    result = multiply(4, 5)
    assert result == 20
