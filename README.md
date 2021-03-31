# The Birbgame

To run the application in stand-alone mode, please use the `dist` folder's `index.html`. Compiling the TypeScript using Angular 2 should be possible with the source code present in `src`. Unfortunately, the `node_modules` foler was too large to be included in a GitHub repository. Please let me know if you need the contents of that folder.

## How to play ##

You will begin with a single egg, which will hatch as time passes. This Peep is your go-to for collecting natural resources, including food, nesting materials, ore, and the skills to survive in this cruel world. Each resource comes with multiple tasks that can be done, growing in complexity.

Clicking on a resource or task's icon will allow it to be upgraded, either increasing that resource capacity, or increasing the yield of that task.

However, your Peeps will need to be fed, and regular maintainence on housing, storage facilities, and tools will need to be performed. As such, you will find your food, nest, and ore supplies dwindling over time, requiring constant production to stay afloat! Make sure to balance your assignments accordingly. 

There currently is no "win" condition, just keep growing your peep-ulation and amass resources.

If you'd like to start over, click the gear in the top right corner to wipe your save file.

## Changelog
### 0.9.1:
Feature Additions:
+ New stage of peep development, the Chick. They can't be assigned to anything, but receive a huge boost to Instinct. They are also *exceedingly* adorable.
+ New resources. Now every resource has at least 4 "standard" tiers. Additionally, fifth tier resources are in place, but are planned to have additional function beyond simple collection.
+ A new resource tree. Currently does not do anything important, but is a late-game unlockable.
+ Fixed saving games. Did away with cookies entirely in favor of localStorage
+ A warning prompt when wiping your save.
+ Decided to re-insert the easter egg anyways, but made it exceedingly rare.

Balance Changes:
- Added and changed a few resource unlocks. For example, Food unlocks are no longer strictly time-based.
- Minor balance updates. The whole system needs to get this treatment soon.
- Resource details now show more details. This may be hidden behind a verbosity setting later on.
- Supply displays now display the total value rather than the units of a resource (e.g. Bugs : 10 --> Bugs : 60). The number of units has been moved to the tooltip
- Several bugfixes
- Code refactoring

Feature Removals or Bugs:
- A few assets need fixing up, I'll get on that as soon as possible.
- Saving peep data is still large, and needs to get compressed.

### 0.9.0.1:
Balance Changes:
- Fixed an upkeep bug in Chrome (Nest wasn't working - now it's not working in Firefox?)
- Buffed Bugs to be more valuable and less useless

### 0.9.0:
Preliminary release as an Angular application. Fine-tuning needs to be done.



This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.4.
