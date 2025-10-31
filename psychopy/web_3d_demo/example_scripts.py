"""
PsychoPy Web Demo - Example Python Scripts

This file contains example Python scripts that can be run in the Pyodide environment
to demonstrate various capabilities.
"""

# Example 1: Basic PsychoPy-style experiment simulation
EXPERIMENT_SIMULATION = """
import json
from datetime import datetime
import random

print("=" * 60)
print("PsychoPy-Style Experiment Simulation")
print("=" * 60)

# Experiment configuration
config = {
    "experiment_name": "Visual Detection Task",
    "participant_id": f"P{random.randint(100, 999)}",
    "session": 1,
    "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "conditions": ["low_contrast", "medium_contrast", "high_contrast"]
}

print(f"\\nExperiment: {config['experiment_name']}")
print(f"Participant: {config['participant_id']}")
print(f"Date: {config['date']}")

# Simulate trial data
print("\\nSimulating experiment trials...")
trials = []
for trial_num in range(1, 11):
    condition = random.choice(config['conditions'])
    response_time = random.uniform(0.3, 1.5)  # seconds
    accuracy = random.choice([True, False, True, True, True])  # 80% accuracy
    
    trial_data = {
        "trial": trial_num,
        "condition": condition,
        "response_time_s": round(response_time, 3),
        "correct": accuracy,
        "timestamp": datetime.now().isoformat()
    }
    trials.append(trial_data)
    
    status = "✓" if accuracy else "✗"
    print(f"  Trial {trial_num:2d}: {condition:20s} RT={response_time:.3f}s {status}")

# Calculate statistics
correct_trials = sum(1 for t in trials if t['correct'])
mean_rt = sum(t['response_time_s'] for t in trials) / len(trials)

print("\\n" + "=" * 60)
print("Results Summary:")
print(f"  Accuracy: {correct_trials}/{len(trials)} ({correct_trials/len(trials)*100:.1f}%)")
print(f"  Mean RT: {mean_rt:.3f}s")
print("=" * 60)

# Export data (in real scenario, this would save to file)
experiment_results = {
    "config": config,
    "trials": trials,
    "summary": {
        "accuracy": correct_trials / len(trials),
        "mean_rt": mean_rt,
        "total_trials": len(trials)
    }
}

print("\\n✅ Experiment simulation complete!")
print("\\nData structure ready for export:")
print(json.dumps(experiment_results, indent=2)[:500] + "...")
"""

# Example 2: Color space conversions (relevant for psychophysics)
COLOR_SPACE_DEMO = """
import math

print("=" * 60)
print("Color Space Conversions for Psychophysics")
print("=" * 60)

def rgb_to_hsv(r, g, b):
    '''Convert RGB (0-1) to HSV (0-1)'''
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    delta = max_c - min_c
    
    # Hue calculation
    if delta == 0:
        h = 0
    elif max_c == r:
        h = 60 * (((g - b) / delta) % 6)
    elif max_c == g:
        h = 60 * (((b - r) / delta) + 2)
    else:
        h = 60 * (((r - g) / delta) + 4)
    
    # Saturation calculation
    s = 0 if max_c == 0 else delta / max_c
    
    # Value calculation
    v = max_c
    
    return h / 360, s, v

def dkl_color_angles():
    '''Demonstrate DKL color space angles used in vision research'''
    angles = [0, 45, 90, 135, 180, 225, 270, 315]
    print("\\nDKL Color Space Angles (used in color perception studies):")
    for angle in angles:
        rad = math.radians(angle)
        # Simplified DKL-like transformation
        lum_mod = math.cos(rad)
        chrom_mod = math.sin(rad)
        print(f"  {angle:3d}°: Lum={lum_mod:+.3f}, Chrom={chrom_mod:+.3f}")

# Test RGB to HSV conversion
test_colors = [
    ("Red", 1.0, 0.0, 0.0),
    ("Green", 0.0, 1.0, 0.0),
    ("Blue", 0.0, 0.0, 1.0),
    ("Yellow", 1.0, 1.0, 0.0),
    ("Cyan", 0.0, 1.0, 1.0),
    ("Magenta", 1.0, 0.0, 1.0),
    ("Gray", 0.5, 0.5, 0.5),
]

print("\\nRGB to HSV Conversions:")
for name, r, g, b in test_colors:
    h, s, v = rgb_to_hsv(r, g, b)
    print(f"  {name:8s}: RGB({r:.1f},{g:.1f},{b:.1f}) -> HSV({h:.3f},{s:.3f},{v:.3f})")

dkl_color_angles()

print("\\n✅ Color space conversions complete!")
"""

# Example 3: Psychometric function fitting
PSYCHOMETRIC_DEMO = """
import math

print("=" * 60)
print("Psychometric Function Analysis")
print("=" * 60)

def logistic(x, threshold, slope):
    '''Logistic psychometric function'''
    return 1.0 / (1.0 + math.exp(-slope * (x - threshold)))

def weibull(x, threshold, slope):
    '''Weibull psychometric function'''
    if x <= 0:
        return 0
    return 1.0 - math.exp(-(x / threshold) ** slope)

# Simulate threshold detection data
print("\\nSimulating threshold detection experiment...")
stimulus_levels = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
threshold = 0.5
slope = 5.0

print(f"True parameters: threshold={threshold}, slope={slope}")
print("\\nStimulus Level | P(Detection) Logistic | P(Detection) Weibull")
print("-" * 60)

for level in stimulus_levels:
    p_logistic = logistic(level, threshold, slope)
    p_weibull = weibull(level, threshold, slope)
    print(f"     {level:.1f}       |        {p_logistic:.3f}         |       {p_weibull:.3f}")

# Calculate psychometric threshold (50% point)
print(f"\\nPsychometric threshold (50% detection): {threshold:.3f}")

# Calculate JND (Just Noticeable Difference)
p_75 = None
for level in stimulus_levels:
    if logistic(level, threshold, slope) >= 0.75:
        p_75 = level
        break

if p_75:
    jnd = p_75 - threshold
    print(f"JND (75% - 50% point): {jnd:.3f}")
    print(f"Weber fraction: {jnd/threshold:.3f}")

print("\\n✅ Psychometric analysis complete!")
"""

# Example 4: Timing and synchronization
TIMING_DEMO = """
from datetime import datetime, timedelta
import random

print("=" * 60)
print("Timing and Synchronization Analysis")
print("=" * 60)

# Simulate frame timing
print("\\nSimulating display frame timing (60 Hz)...")
target_frame_time = 1000.0 / 60.0  # 16.67 ms
frame_times = []

for frame in range(120):  # 2 seconds worth
    # Simulate realistic frame timing with small jitter
    actual_time = target_frame_time + random.uniform(-0.5, 0.5)
    frame_times.append(actual_time)

# Analyze timing
mean_frame_time = sum(frame_times) / len(frame_times)
dropped_frames = sum(1 for ft in frame_times if ft > target_frame_time * 1.5)
jitter = max(frame_times) - min(frame_times)

print(f"Target frame time: {target_frame_time:.2f} ms")
print(f"Mean frame time: {mean_frame_time:.2f} ms")
print(f"Frame jitter: {jitter:.2f} ms")
print(f"Dropped frames: {dropped_frames}/{len(frame_times)}")
print(f"Actual refresh rate: {1000.0/mean_frame_time:.2f} Hz")

# Response time analysis
print("\\nSimulating response time data...")

# Constants for response time simulation
TRIALS_PER_CONDITION = 20
SIMPLE_RT_MEAN = 250  # ms
SIMPLE_RT_SD = 30     # ms
CHOICE_RT_MEAN = 400  # ms
CHOICE_RT_SD = 50     # ms
COMPLEX_RT_MEAN = 650 # ms
COMPLEX_RT_SD = 80    # ms

conditions = {
    "simple": [random.gauss(SIMPLE_RT_MEAN, SIMPLE_RT_SD) for _ in range(TRIALS_PER_CONDITION)],
    "choice": [random.gauss(CHOICE_RT_MEAN, CHOICE_RT_SD) for _ in range(TRIALS_PER_CONDITION)],
    "complex": [random.gauss(COMPLEX_RT_MEAN, COMPLEX_RT_SD) for _ in range(TRIALS_PER_CONDITION)]
}

for condition, times in conditions.items():
    mean_rt = sum(times) / len(times)
    min_rt = min(times)
    max_rt = max(times)
    print(f"  {condition.capitalize():8s}: Mean={mean_rt:.1f}ms, Range=[{min_rt:.1f}, {max_rt:.1f}]ms")

print("\\n✅ Timing analysis complete!")
"""

# Example 5: Statistical power analysis
POWER_ANALYSIS_DEMO = """
import math
import random

print("=" * 60)
print("Statistical Power Analysis for Experiment Design")
print("=" * 60)

def cohen_d(mean1, mean2, pooled_sd):
    '''Calculate Cohen's d effect size'''
    return abs(mean1 - mean2) / pooled_sd

def sample_size_ttest(effect_size, alpha=0.05, power=0.80):
    '''Estimate sample size for t-test (simplified)'''
    # Simplified approximation
    z_alpha = 1.96  # for alpha = 0.05, two-tailed
    z_beta = 0.84   # for power = 0.80
    
    n = 2 * ((z_alpha + z_beta) / effect_size) ** 2
    return math.ceil(n)

# Example experiment design
print("\\nExperiment: Testing attention effect on reaction time")
print("\\nExpected parameters:")
control_mean = 400  # ms
treatment_mean = 350  # ms
pooled_sd = 50  # ms

effect_size = cohen_d(control_mean, treatment_mean, pooled_sd)
print(f"  Control group mean: {control_mean} ms")
print(f"  Treatment group mean: {treatment_mean} ms")
print(f"  Pooled SD: {pooled_sd} ms")
print(f"  Effect size (Cohen's d): {effect_size:.3f}")

# Calculate required sample size
required_n = sample_size_ttest(effect_size)
print(f"\\nRequired sample size per group: {required_n}")
print(f"Total participants needed: {required_n * 2}")

# Simulate experiment
print("\\nSimulating experiment with calculated sample size...")
group_control = [random.gauss(control_mean, pooled_sd) for _ in range(required_n)]
group_treatment = [random.gauss(treatment_mean, pooled_sd) for _ in range(required_n)]

mean_control = sum(group_control) / len(group_control)
mean_treatment = sum(group_treatment) / len(group_treatment)

print(f"  Simulated control mean: {mean_control:.1f} ms")
print(f"  Simulated treatment mean: {mean_treatment:.1f} ms")
print(f"  Difference: {abs(mean_control - mean_treatment):.1f} ms")

print("\\n✅ Power analysis complete!")
"""

# Dictionary of all examples
EXAMPLES = {
    "experiment": EXPERIMENT_SIMULATION,
    "colors": COLOR_SPACE_DEMO,
    "psychometric": PSYCHOMETRIC_DEMO,
    "timing": TIMING_DEMO,
    "power": POWER_ANALYSIS_DEMO
}

if __name__ == "__main__":
    print("Available example scripts:")
    for key, script in EXAMPLES.items():
        print(f"  - {key}")
