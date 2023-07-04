import { box2d, initBox2D } from "./init-box2d.js";
import * as PIXI from "pixi.js";
import DebugDrawer from "./debug-drawer.js";

async function init() {
    const renderer = PIXI.autoDetectRenderer(300, 300, {
        backgroundColor: 0x000000,
        antialias: true,
        resolution: 1
    });
    renderer.view.width = 300;
    renderer.view.height = 300;
    document.body.appendChild(renderer.view);
    const stage = new PIXI.Container();

    await initBox2D();
    const {
        b2_dynamicBody,
        b2BodyDef,
        b2PolygonShape,
        b2Vec2,
        b2World
    } = box2d;

    const world = new b2World();
    const gravity = new b2Vec2(0, 9.8);
    world.SetGravity(gravity);
    const pixelsPerMeter = 30;

    const debugDrawer = new DebugDrawer(stage, pixelsPerMeter);
    world.SetDebugDraw(debugDrawer.instance);

    // Box
    const boxBodyDef = new b2BodyDef();
    boxBodyDef.set_position(new b2Vec2(100 / pixelsPerMeter, 30 / pixelsPerMeter));
    boxBodyDef.angle = 0 * Math.PI / 180;
    boxBodyDef.type = b2_dynamicBody;
    const boxBody = world.CreateBody(boxBodyDef);
    const boxShape = new b2PolygonShape();
    boxShape.SetAsBox(20 / pixelsPerMeter, 20 / pixelsPerMeter);
    const boxFixture = boxBody.CreateFixture(boxShape, 1);

    // Ground
    const groundBodyDef = new b2BodyDef();
    groundBodyDef.set_position(new b2Vec2(150 / pixelsPerMeter, 270 / pixelsPerMeter));
    const groundBody = world.CreateBody(groundBodyDef);
    const groundShape = new b2PolygonShape();
    groundShape.SetAsBox(130 / pixelsPerMeter, 20 / pixelsPerMeter);
    groundBody.CreateFixture(groundShape, 0);

    // Platform
    const platformBodyDef = new b2BodyDef();
    platformBodyDef.set_position(new b2Vec2(150 / pixelsPerMeter, 170 / pixelsPerMeter));
    const platformBody = world.CreateBody(platformBodyDef);
    const platformShape = new b2PolygonShape();
    platformShape.SetAsBox(20 / pixelsPerMeter, 20 / pixelsPerMeter);
    platformBody.CreateFixture(platformShape, 0);

    const lines = new PIXI.Graphics();
    stage.addChild(lines);
    const color = new PIXI.Color([1, 0.2, 0.2]).toHex();
    lines.lineStyle(1, color, 1, 0.5, true);
    lines.moveTo(150, 170);
    lines.lineTo(100, 170);

    let currentTime, lastTime, dt;

    function render() {
        requestAnimationFrame(render);

        currentTime = Date.now();
        dt = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        world.Step(dt, 3, 2);
        world.DebugDraw();

        const point1 = new b2Vec2(150 / pixelsPerMeter, 170 / pixelsPerMeter);
        const point2 = new b2Vec2(100 / pixelsPerMeter, 170 / pixelsPerMeter);

        const input = {
            p1: point1,
            p2: point2,
            maxFraction: 1
        };
        const output = {
            normal: new b2Vec2(0, 0),
            fraction: 1
        };

        const ok = boxFixture.RayCast(output, input);
        if (ok) {
            console.log("detected");
        }

        // Render the stage
        renderer.render(stage);
        debugDrawer.clear();
    }

    lastTime = Date.now();
    render();
}

init();
