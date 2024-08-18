from setuptools import setup, find_packages

setup(
    name="my-python-app",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "Flask==2.1.1",
    ],
)

