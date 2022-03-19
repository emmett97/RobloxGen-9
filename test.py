import os

with open('.env.sample', 'r') as fh:
    vars_dict = dict(
        tuple(line.replace('\n', '').split('='))
        for line in fh.readlines() if not line.startswith('#')
    )

print(vars_dict)
os.environ.update(vars_dict)