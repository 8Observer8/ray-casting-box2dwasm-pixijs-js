import { box2d } from "./init-box2d.js";
import * as PIXI from "pixi.js";

const sizeOfB2Vec2 = Float32Array.BYTES_PER_ELEMENT * 2;

export default class DebugDrawer {
    constructor(stage, pixelsPerMeter) {
        this.lines = new PIXI.Graphics();
        stage.addChild(this.lines);
        this.pixelsPerMeter = pixelsPerMeter;

        const {
            b2Color,
            b2Draw: { e_shapeBit },
            b2Vec2,
            JSDraw,
            wrapPointer
        } = box2d;

        const reifyArray = (array_p, numElements, sizeOfElement, ctor) =>
            Array(numElements)
            .fill(undefined)
            .map((_, index) =>
                wrapPointer(array_p + index * sizeOfElement, ctor)
            );

        self = this;
        const debugDrawer = Object.assign(new JSDraw(), {
            DrawSegment(vert1_p, vert2_p, color_p) {},
            DrawPolygon(vertices_p, vertexCount, color_p) {},
            DrawSolidPolygon(vertices_p, vertexCount, color_p) {
                const color = wrapPointer(color_p, b2Color);
                const vertices = reifyArray(vertices_p, vertexCount,
                    sizeOfB2Vec2, b2Vec2);
                self.drawLines(vertices, color);
            },
            DrawCircle(center_p, radius, color_p) {},
            DrawSolidCircle(center_p, radius, axis_p, color_p) {},
            DrawTransform(transform_p) {},
            DrawPoint(vertex_p, sizeMetres, color_p) {}
        });
        debugDrawer.SetFlags(e_shapeBit);
        this.instance = debugDrawer;
    }

    drawLines(vertices, color) {
        const c = new PIXI.Color([color.r, color.g, color.b]).toHex();
        this.lines.lineStyle(1, c, 1, 0.5, true);
        this.lines.moveTo(vertices[0].x * this.pixelsPerMeter, vertices[0].y * this.pixelsPerMeter);
        this.lines.lineTo(vertices[1].x * this.pixelsPerMeter, vertices[1].y * this.pixelsPerMeter);
        this.lines.lineTo(vertices[2].x * this.pixelsPerMeter, vertices[2].y * this.pixelsPerMeter);
        this.lines.lineTo(vertices[3].x * this.pixelsPerMeter, vertices[3].y * this.pixelsPerMeter);
        this.lines.lineTo(vertices[0].x * this.pixelsPerMeter, vertices[0].y * this.pixelsPerMeter);
    }

    clear() {
        this.lines.clear();
    }
}
