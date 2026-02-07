export interface LearningArticle {
  slug: string;
  title: string;
  summary: string;
  icon: string;
  readTimeMinutes: number;
  content: string;
}

export const articles: LearningArticle[] = [
  {
    slug: "budgeting-basics",
    title: "Budgeting Basics",
    summary: "Learn how to create and stick to a monthly budget that works for you.",
    icon: "📊",
    readTimeMinutes: 3,
    content: `## What is a Budget?

A budget is a plan for how you will spend your money each month. It helps you ensure you have enough for the things you need while saving for the future.

## Why Budget?

- **Control**: Know exactly where your money goes
- **Goals**: Save for things that matter to you
- **Peace of mind**: Reduce financial stress
- **Avoid debt**: Spend within your means

## How to Start

1. **Track your income**: List all money you receive each month
2. **List your expenses**: Write down every expense, big or small
3. **Categorize**: Divide expenses into Needs, Wants, and Savings
4. **Set limits**: Decide how much to spend in each category
5. **Review weekly**: Check if you're staying on track

## Tips for Success

- Start simple - don't try to track every rupee on day one
- Use the 50/30/20 rule as a starting point
- Review your budget at the end of each month
- Adjust as your income or needs change
- Celebrate small wins!`,
  },
  {
    slug: "50-30-20-rule",
    title: "The 50/30/20 Rule",
    summary: "A simple framework to divide your income into needs, wants, and savings.",
    icon: "📐",
    readTimeMinutes: 3,
    content: `## The 50/30/20 Rule Explained

This popular budgeting framework divides your after-tax income into three categories:

### 50% - Needs
Essential expenses you cannot avoid:
- Rent or home loan EMI
- Groceries and food
- Utilities (electricity, water, gas)
- Transportation
- Insurance premiums
- Minimum debt payments

### 30% - Wants
Non-essential spending that improves quality of life:
- Dining out and entertainment
- Shopping for non-essentials
- Subscriptions (streaming, gym)
- Hobbies and recreation
- Gadgets and upgrades

### 20% - Savings & Investments
Building your financial future:
- Emergency fund
- Fixed deposits
- Mutual funds or SIPs
- PPF or NPS contributions
- Extra debt payments

## Example

If your monthly income is ₹50,000:
- **Needs**: ₹25,000
- **Wants**: ₹15,000
- **Savings**: ₹10,000

## Adjusting the Rule

The 50/30/20 split is a guideline, not a rigid rule. If you live in an expensive city, your needs might be 60%. If you want to save aggressively, bump savings to 30%. The key is having a conscious plan.`,
  },
  {
    slug: "emergency-fund",
    title: "Building an Emergency Fund",
    summary: "Why you need an emergency fund and how to build one step by step.",
    icon: "🛡️",
    readTimeMinutes: 4,
    content: `## What is an Emergency Fund?

An emergency fund is money set aside specifically for unexpected expenses or financial emergencies - job loss, medical bills, urgent repairs.

## How Much Do You Need?

- **Starter goal**: ₹10,000 - ₹20,000 (for minor emergencies)
- **Basic goal**: 3 months of expenses
- **Ideal goal**: 6 months of expenses
- **Conservative goal**: 12 months of expenses

## Where to Keep It

Your emergency fund should be:
- **Easily accessible** (not locked in long-term investments)
- **Separate from daily spending** (different account)
- **Safe** (savings account or liquid fund)

Good options in India:
- High-interest savings account
- Liquid mutual funds
- Fixed deposit with premature withdrawal facility

## How to Build It

1. **Start small**: Even ₹500/month is a great start
2. **Automate**: Set up auto-transfer on salary day
3. **Use windfalls**: Put bonus money, tax refunds, or gifts into the fund
4. **Cut one want**: Redirect one discretionary expense to savings
5. **Increase gradually**: As income grows, increase your contribution

## When to Use It

Use your emergency fund ONLY for true emergencies:
- Job loss or income reduction
- Medical emergencies
- Essential home or vehicle repairs
- NOT for sales, vacations, or planned purchases`,
  },
  {
    slug: "debt-management",
    title: "Managing Debt & EMIs",
    summary: "Strategies to handle loans, EMIs, and become debt-free faster.",
    icon: "💳",
    readTimeMinutes: 4,
    content: `## Understanding Debt

Not all debt is bad. Here's how to think about it:

### Good Debt
- Education loans (investment in earning potential)
- Home loans (building an asset)
- Business loans (generating income)

### Bad Debt
- Credit card debt (high interest)
- Personal loans for lifestyle spending
- Payday loans

## Managing Your EMIs

### The 40% Rule
Your total EMI payments should not exceed 40% of your monthly income. If they do, you're over-leveraged.

### Track Every EMI
- List all your active loans
- Note the interest rate, EMI amount, and remaining tenure
- Mark due dates to avoid late fees

### Prioritize High-Interest Debt
Pay minimum on all debts, then put extra money toward the highest interest rate loan first. This is called the "avalanche method."

## Tips to Become Debt-Free

1. **Stop adding new debt**: Cut up credit cards if needed
2. **Pay more than minimum**: Even ₹500 extra per month makes a difference
3. **Consolidate if possible**: Combine high-interest debts into a lower-interest loan
4. **Use bonuses wisely**: Put windfalls toward debt repayment
5. **Celebrate milestones**: Each EMI paid off is a victory!`,
  },
  {
    slug: "saving-habits",
    title: "Building Saving Habits",
    summary: "Practical techniques to make saving money automatic and enjoyable.",
    icon: "🏦",
    readTimeMinutes: 3,
    content: `## Why Saving is Hard

Our brains prefer instant gratification over future rewards. That's normal! The trick is making saving automatic so it doesn't require willpower.

## The Pay-Yourself-First Method

Before paying any bills or buying anything, transfer your savings amount to a separate account. Treat savings like a non-negotiable bill.

## Practical Saving Techniques

### 1. The ₹1 Challenge
- Save ₹1 on day 1, ₹2 on day 2, ₹3 on day 3...
- By day 30, you've saved ₹465!
- Scale it up: ₹10 challenge saves ₹4,650/month

### 2. Round-Up Savings
- If you spend ₹340, round to ₹400 and save ₹60
- Do this for every purchase

### 3. No-Spend Days
- Pick 2-3 days per week where you spend zero
- Transfer what you would have spent to savings

### 4. The 24-Hour Rule
- For any non-essential purchase over ₹500, wait 24 hours
- If you still want it after 24 hours, buy it
- Often, the urge passes

### 5. Automate It
- Set up auto-debit on salary day
- You can't spend what you don't see

## Making It Fun

- Use our saving challenges
- Track your progress visually
- Set specific goals (vacation, gadget, emergency fund)
- Celebrate milestones`,
  },
  {
    slug: "needs-vs-wants",
    title: "Needs vs Wants",
    summary: "Learn to distinguish between essential and discretionary spending.",
    icon: "⚖️",
    readTimeMinutes: 3,
    content: `## The Difference

### Needs
Things required for survival and basic functioning:
- Food and water
- Shelter (rent, home loan)
- Basic clothing
- Healthcare
- Transportation to work
- Utilities
- Minimum debt payments

### Wants
Things that improve quality of life but aren't essential:
- Dining at restaurants
- Latest smartphone
- Streaming subscriptions
- Designer clothing
- Vacations
- Premium coffee

## The Gray Area

Some expenses fall between needs and wants:
- **Internet**: Need for work, want for streaming
- **Phone**: Basic phone is a need, flagship is a want
- **Gym**: Exercise is important, but a premium gym is a want

## How to Decide

Ask yourself:
1. **Can I survive without this?** If yes, it's a want
2. **Is there a cheaper alternative?** If yes, the difference is a want
3. **Am I buying this out of emotion?** If yes, it might be a want
4. **Will this matter in 30 days?** If not, probably a want

## Finding Balance

The goal isn't to eliminate all wants - that's unsustainable. The goal is to be conscious about your spending and ensure needs are covered before wants.

A good rule: Fulfill all needs first, save second, then enjoy wants with what's left.`,
  },
];
