# Mob Programming Experience 

Demo:
https://mob-experience.felipeflor.com

This application demonstrates the effects of bottle necking over production lines. 

The production line proceeds from top-to-bottom, starting at the top-left and ending at the 
bottom-left. Each step of the line depends on production outputs of the previous step.

![Stations running with 1 worker per station](https://res.cloudinary.com/felipeflor/image/upload/c_scale,w_450/v1555991275/Mob%20Programming%20Experience%20-%201.png)

You can drag and drop programmers into each each mobbing station to have them work on the ticket together. 

![Group of 4 mobbing on the ticket](https://res.cloudinary.com/felipeflor/image/upload/c_scale,w_250/v1555991584/Mob%20Programming%20Experience%20-%202.png)

After you're done, you may compare your results with the statistics for individually operated stations.

![Comparing your results with individual programming](https://res.cloudinary.com/felipeflor/image/upload/c_scale,w_450/v1555992011/Mob%20Programming%20Experience%20-%203.jpg)

### Code Structure

The project follows Uncle Bob's suggestion of keeping the logic decoupled from the UI framework.
All operational logic is contained in regular Typescript Classes, while the Views are handled by Typescript Vue components.

![Comparing your results with individual programming](https://res.cloudinary.com/felipeflor/image/upload/c_scale,w_250/v1555992380/Mob%20Programming%20Experience%20-%204.png)

The great thing about this is that even though the UI is handled by VueJs, this project can be easily converted to any other framework.

### Credits and Inspiration

The inspiration for this project came from a conversation with my friend and mentor, [Grant Lovell](https://twitter.com/grant_lovell?lang=en).

Furthermore, this application is heavily inspired by Alex Knight's Dice Game 2.
See his application at this link: http://www.alex-knight.com/game2 

### Key points
- Drag-and-drop
- Typescript Vue

### Screenshots

#### Setup
```
npm i && npm run serve
```

#### Tests
```
npm run test:unit
```
