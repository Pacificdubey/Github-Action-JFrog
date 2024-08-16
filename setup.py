from setuptools import setup,find_packages

setup(
  name = "JFrog Integration Testing",
  version='0.1.0',
  package=find_packages(),
  install_requires=[
    'requests',
  ],
  tests_require=[
    'pytest',
  ],
  python_requires='>=3.6',
  author='Prashant Dubey',
  author_email='pacific.prashantdubey@gmail.com',
  url='https://github.com/Pacificdubey/Github-Action-JFrog',
)
