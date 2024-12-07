import random as rand

mean = 2770
stdd = 31019
samples = 10000000
data = [rand.normalvariate(mean, stdd) for i in range(samples)]

for s in data:
    print (s)

