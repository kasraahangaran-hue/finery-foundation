I found the likely cause: the stepper is positioned under the title row, and the instructions title mixes a 20px title with a 16px inline “(optional)” span. Even on one line, mixed inline font metrics can change the rendered line box by a few pixels, which makes the stepper appear lower only on that step.

Plan:
1. Update the order header title rendering so the title row has a fixed, consistent height/alignment across all steps.
2. Keep “Order Instructions (optional)” on a single line, but render the optional text in a way that does not affect the parent title line box.
3. Verify the header/stepper positions at the mobile viewport across step 1, step 2, and step 3.

Technical details:
- Adjust `FineryPageTitle` and/or the step 2 title markup to use stable flex alignment and fixed line-height behavior.
- Avoid changing order flow logic, footer behavior, or body spacing.