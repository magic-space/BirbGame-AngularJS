# The Birbgame

To run the application in stand-alone mode, please use the `dist` folder's `index.html`. Compiling the TypeScript using Angular 2 should be possible with the source code present in `src`. Unfortunately, the `node_modules` foler was too large to be included in a GitHub repository. Please let me know if you need the contents of that folder.

## How to play ##

You will begin with a single egg, which will hatch as time passes. This Peep is your go-to for collecting natural resources, including food, nesting materials, ore, and the skills to survive in this cruel world. Each resource comes with multiple tasks that can be done, growing in complexity.

Clicking on a resource or task's icon will allow it to be upgraded, either increasing that resource capacity, or increasing the yield of that task.

However, your Peeps will need to be fed, and regular maintainence on housing, storage facilities, and tools will need to be performed. As such, you will find your food, nest, and ore supplies dwindling over time, requiring constant production to stay afloat! Make sure to balance your assignments accordingly. 

As you continue exploring and building your village, you will discover new resources for use. Often these can be powerful, but have an inherent drawback either in time to acquire or in quantity.

There currently is no "win" condition, just keep growing your peep-ulation and amass resources.

If you'd like to start over, click the gear in the top right corner to wipe your save file.

## Changelog
How to read the version numbers:

[Release].[Major feature/content updates].[Minor feature/content updates].[Bug fixes/Balancing]

April 9th, 2021 - Included the original changelogs from the strictly JavaScript version, as well as rolled back version numbers.


### 0.2.1.0: (03/30/21)
Feature Additions:
+ New stage of peep development, the Chick. They can't be assigned to anything, but receive a huge boost to Instinct. They are also *exceedingly* adorable.
+ New resources. Now every resource has at least 4 "standard" tiers. Additionally, fifth tier resources are in place, but are planned to have additional function beyond simple collection.
+ A new resource tree. Currently does not do anything important, but is a late-game unlockable.
+ Fixed saving games. Did away with cookies entirely in favor of localStorage
+ A warning prompt when wiping your save.

Balance Changes:
- Added and changed a few resource unlocks. For example, Food unlocks are no longer strictly time-based, by popular request.
- Minor balance updates. *The whole system needs to get this treatment soon.*

Visual Updates:
- Decided to re-insert the easter egg anyways, but made it exceedingly rare.
- Resource details now show more details. This may be hidden behind a verbosity setting later on.
- Supply displays now display the total value rather than the units of a resource (e.g. Bugs: 10 --> Bugs: 60). The number of units has been moved to the tooltip.

Quality of Life Improvements:
- Code refactoring and restructuring into a more component-service model.

Issues:
- A few assets need fixing up, I'll get on that as soon as possible. (FIXED - 0.2.2.0)
- The new resource tree cannot be unlocked (FIXED - 0.2.2.0)
- The last two tasks in the Nest tree cannot be unlocked yet (FIXED - 0.2.2.0)

### 0.2.0.1:
*A small update to fix some bugs*

Balance Changes:
- Buffed Bugs to be more valuable and less useless.

### 0.2.0.0: (03/26/21)
*In favor of getting something new out, and for learning the AngularJS framework, we've taken the time to re-do the Birbgame! Some features have been dropped, and fine-tuning needs to be done. But I am thoroughly impressed at the capabilities of this framework, and I'll be using it for web releases in the future. Nonetheless, some changes are present.*

Feature Additions:
+ New peep types!
+ Peeps now have stats based on their species

Balance Changes:
- Production mechanisms got a total revamp for a object-oriented approach
- Several mechanics reconfigured to use the peep stats

Visual Updates:
- Sparrow smugness increased exponentially
- So many birds on screen now. So many.
- Peeps now change angle when they move
- Some renaming of resources (e.g. "Material" -> "Nest")
- Peeps have lost the ability to rotate
- The easter egg is not availble anymore because the assets are more easily visible, making it less fun to find

Issues:
- Saving in chrome is still not working with cookies (FIXED - 0.2.1.0) 
- Peep data may get corrupt if you try to save too many (FIXED - 0.2.2.0)
- Nest upkeep is broken (FIXED - 0.2.0.1)

## Hiatus
*So, with a vision to expand the game further, I figured bootstrap and JavaScript wouldn't be able to cut it anymore. So I tried re-making the game in many different engines, including Flutter, Unity, Unreal and Godot before settling on C++ with SDL2. This was also my attempt to re-learn C++, as I hadn't used it since highschool (a full 8 years prior to this message.) Progress was made during this time, but largely on reconstructing the basic elements of the game in a totally new environment. The github for this attempt is currently private, but it does exist.*

## Changelog (JavaScript Version)
### 0.1.0.0: (JS - 11/30/20)
*Sorry for the long hiatus, was wrapping up work on my master's thesis during this time. It's a big enough update to warrant a major revision.*
Feature Additions:
+ New resources!
+ More resource upgrades!
+ Increased Peep caps
+ New ways to get resources, in particular, Knowledge
+ Introduced carry mechanic, which fundamentally multiplies production across a resource type
+ Little information tidbits for each resource
+ Introduced assignment multipliers (1x, 5x, 20x)
+ Peeps have a mind of their own now, and will move
+ Resource conversions now exist and happen on their own if there are idle Peeps
+ New Peeps (Currently they all behave the same)
+ Rare easter egg (inspired by a bug in v0.0.4.0)

Balance Changes:
- When out of focus, the game compensates for the down time
- Fundamentally altered resource production mechanics
- Rebalanced resource production, upgrades, and capacities (and their costs)
- Resource capacity is now based on total *units* rather than total value
- Consuming resources uses least valuable first, but will also consume whole units of more valuable resources.
- Knowledge has temporary and permanent forms now. Permanent resources are obviously slow to acquire.

Quality of Life Improvements:
- Tooltips
- Restructured a lot of code

Visual Updates:
- Peeps are now rounder
- Town buildings now appear once certain conditions are met
- Lots of smaller UI changes
- Added a verbosity toggle for more information

Issues:
- Some resources do not have assets
- Housing/Capacity upgrades not being green when available for purchase (FIXED - 0.1.0.1)
- When loading, if you have a resource at the maximum capacity, the game does not attribute that resource to you. (FIXED - 0.1.0.1)
- Books were not permanent (FIXED - 0.1.0.1)
- Peeps moonwalk (but they still walk in the sky) (FIXED - 0.1.0.1)
- Chrome doesn't save cookies properly, making save data useless.

### 0.0.4.1: (JS - 09/02/20)
*HOTFIX!*

Balance Changes:
- Disabling the creation of new peeps once the peep capacity is reached
- Slowed the tick speed 14 -> 10 days per minute
- Increased the hatch rate of new chicks so it doesn't take as long

### 0.0.4.0: (JS - 09/02/20)
*Thesis successfully defended!*

Feature Additions:
+ Added more resources!
+ Unlock system in place, but not finished
+ Lots of cute birbs now appear on your screen
+ Each peep can obtain knowledge on their own

Balance Changes:
- Restructured resource management and allocation to fit the new resources
- Production & upgrade cost changes
- Knowledge cap nerfed

Visual Updates:
- A much needed UI overhaul, including a background, Peep icons, and more

Issues:
- Peeps can spawn outside of the background space, provided the window size is appropriately wide (FIXED - 0.0.4.1)
- Peep upkeep is broken (FIXED - 0.0.4.1)

### 0.0.3.1: (JS - 08/01/20)
*HOTFIX!*

Quality of Life Improvements:
+ Text and images are now bigger and brighter
+ Costs now come with their own resource icons

Balance Changes:
- Production speed slowed down
- Upgrade strengths reduced
- Peep upkeep now increases linearly with the number of Peeps. Chicks eat more though.

### 0.0.3.0: (JS - 08/01/20)
Feature Additions:
+ Upgrades for production!
+ Saving and loading using web cookies is now present
+ Ability to have idle Peeps work manually at the cost of many seeds.
+ Ability to wipe save by clicking the Peep icon (be careful!)

Balance Changes:
- Production rates altered
- Peep upkeep costs are now lessened by popular demand

Issues:
- Chicks count double to the Peep cap (FIXED - 0.0.3.1)
- Wood upgrades don't have names (oops) (FIXED - 0.0.3.1)
- Finishing an upgrade tree crashes the game (FIXED - 0.0.3.1)

### 0.0.2.0: (JS - 07/26/20)
Feature Additions:
+ Assets! We now have pictures for Peeps, seeds, wood, and books!
+ Visualization of time passing through a "day/night" cycle.
+ Capacities for Peeps and resources
+ Chicks now hatch and take some time to grow into adults!

Balance Changes:
- Upkeep and production values are now displayed
- Hunger mechanics got updated
- Peep creation is now more difficult

Visual Updates:
- Colorful buttons!

### 0.0.1.0: (JS - 07/21/20)
*The very first release of the game. This is just some text on the screen and a few buttons to add and remove Peeps from the three jobs available. Food upkeep is present and Peeps did not like not being fed.*


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.4.
