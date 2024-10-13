import pytest

from src.module1.example import add

from src.module2.test_integration import multiply

def test_add():
    assert add(1, 2) == 3

def test_multiply():
    assert multiply(2, 3) == 6
