---
id: math-13
title: Ratio, proportion, and percentages
goal: set up direct and inverse proportions and solve percentage, discount, and mixture word problems
week: 14
minutes: 20
---

**Ratio and proportion** (oran–orantı) and **percentages** appear on almost every Turkish university math exam and in real-world programming (discounts, tax, progress bars, mixing data).

## Ratio and proportion

If $\frac{a}{b} = \frac{c}{d} = k$:
- Cross-multiply: $a \cdot d = b \cdot c$.
- **Direct proportion** (doğru orantı): $y$ increases as $x$ increases $\implies \frac{y}{x} = k$ (so $y = kx$).
- **Inverse proportion** (ters orantı): $y$ decreases as $x$ increases $\implies x \cdot y = k$.

**Example (Inverse proportion)**: 4 workers finish a job in 12 days. How many days do 6 workers take?
$$4 \times 12 = 6 \times d \implies 48 = 6d \implies d = \mathbf{8\text{ days}}$$

## Percentages

- $p\%$ of $A$ is $A \cdot \frac{p}{100}$.
- **Increase by $p\%$**: multiply by $\left(1 + \frac{p}{100}\right)$.
- **Decrease by $p\%$**: multiply by $\left(1 - \frac{p}{100}\right)$.

**Classic trap**: A jacket price rises 20%, then drops 20%. Does it return to the original price?
Start at `100 TL`: $+20\% \to 120\text{ TL}$; $-20\%$ of `120` $= 120 \times 0.80 = \mathbf{96\text{ TL}}$ (a **4% net loss**, not 0%!).

## Profit and loss

- **Profit** = selling price − cost. **Loss** = cost − selling price.
- **Profit % (or loss %) is calculated on the cost**: $\text{profit \%} = \frac{\text{profit}}{\text{cost}} \cdot 100$.
- Selling with $p\%$ profit: selling price $= \text{cost} \cdot \frac{100 + p}{100}$. With $p\%$ loss: $\text{cost} \cdot \frac{100 - p}{100}$.

*Example:* A phone costs 4,000 TL and is sold with 25% profit: $4000 \cdot 1.25 = 5000$ TL. If it is later sold with a 10% discount on 5,000 TL, the price is $5000 \cdot 0.9 = 4500$ TL — still a profit of 500 TL, which is $\frac{500}{4000} = 12.5\%$ of the cost.

**Trap:** a 20% increase followed by a 20% decrease does **not** return to the start: $100 \cdot 1.2 \cdot 0.8 = 96$.

## Try it

Practice ratio, proportion, and percentage problems:

@widget mathdrill topic=ratio

## Common mistakes

- Using **direct** proportion ($4/12 = 6/d$) on worker/speed problems where more workers take **fewer** days (**inverse** proportion: $4 \times 12 = 6 \times d$).
- Thinking $+20\%$ followed by $-20\%$ cancels out to $0\%$. The second percentage applies to the **new** total!
- Dividing by the wrong base in percentage change: $\frac{\text{new} - \text{old}}{\text{old}} \times 100\%$.

## Key terms

- ratio | a comparison of two quantities by division ($a:b$ or $a/b$) | oran
- proportion | an equation stating two ratios are equal | orantı
- direct proportion | two quantities whose ratio $y/x$ is constant | doğru orantı
- inverse proportion | two quantities whose product $x \cdot y$ is constant | ters orantı

## Quick check

? If $\frac{x}{3} = \frac{y}{5} = \frac{z}{2}$ and $x + y - z = 24$, find $y$:
- 12 ~~ $y = 5k = 20$
- 15 ~~ $k = 24 / (3+5-2) = 4$, so $y = 5(4) = 20$
* 20 ~~ $x=3k, y=5k, z=2k \implies 3k+5k-2k = 6k = 24 \implies k = 4 \implies y = 20$
- 24 ~~ that is $x+y-z$
! Set $x=3k, y=5k, z=2k$, giving $6k = 24 \implies k = 4 \implies y = 20$.

? 6 identical printers finish a batch in 10 hours. How long will 4 printers take?
- 6.67 hours ~~ used direct proportion instead of inverse
- 12 hours ~~ $6 \times 10 = 60 \ne 4 \times 12$
* 15 hours ~~ inverse proportion: $6 \times 10 = 4 \times t \implies t = 60/4 = 15$ hours
- 20 hours ~~ $4 \times 20 = 80 \ne 60$
! Fewer printers take more hours (inverse proportion): $6 \times 10 = 4 \times t \implies t = 15$.

? After a **25% discount**, a keyboard costs **600 TL**. What was its original price?
- 750 TL ~~ $600 \times 1.25 = 750$, which adds 25% of 600 instead of reversing a 25% cut
* 800 TL ~~ $0.75 P = 600 \implies P = 600 / 0.75 = 800$ TL
- 850 TL ~~ $0.75 \times 850 = 637.5$
- 720 TL ~~ $0.75 \times 720 = 540$
! If 25% was removed, 75% remains: $0.75 P = 600 \implies P = 800$.
