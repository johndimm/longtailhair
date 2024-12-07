import numpy as np

def simulate_lognormal(mean, std_dev, num_samples):

    return np.mod(np.abs(np.random.normal([mean], [std_dev], [num_samples])), 7000)

    # Generate random numbers from standard normal distribution
    z = np.random.randn(num_samples)

    
    # Transform to log-normal distribution
    x = np.exp(np.log(mean) + std_dev * z)

  
    return x


# Simulate 1000 samples with mean 100 and standard deviation 20
data = simulate_lognormal(2770, 31019, 1000)

for s in data:
    print (int(s))

